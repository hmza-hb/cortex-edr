import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';
import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import { AGENT_PROMPTS } from './prompts';
import { AILogger } from './ai-logger';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

let groqClient: Groq | null = null;
function getGroqClient() {
    if (!groqClient) {
        groqClient = new Groq({
            apiKey: process.env.GROQ_API_KEY || 'MISSING_KEY'
        });
    }
    return groqClient;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CORE EVENT EMITTER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function emit(scanId: string, agentId: number, agentName: string, eventType: string, message: string, data: any = {}) {
    try {
        console.log(`[EMIT] Agent ${agentId} - ${eventType}: ${message}`);
        await supabase.from('agent_events').insert({
            scan_id: scanId,
            agent_id: agentId,
            agent_name: agentName,
            event_type: eventType,
            message,
            data,
            created_at: new Date().toISOString()
        });

        if (eventType === 'started') {
            await supabase.from('scans').update({
                current_agent: agentId,
                status: 'processing'
            }).eq('id', scanId);
        }
    } catch (error) {
        console.error(`[EMIT ERROR] Agent ${agentId}:`, error);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI HELPER: Call Groq with structured prompt
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function callAI(
    systemPrompt: string,
    userPrompt: string,
    agentId: number,
    agentName: string,
    logger: AILogger
): Promise<string> {
    const start = Date.now();
    try {
        const groq = getGroqClient();
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            response_format: { type: 'json_object' }
        });

        const response = completion.choices[0]?.message?.content || '[]';
        const durationMs = Date.now() - start;

        // Note: Groq tokens usage is in completion.usage
        const promptTokens = completion.usage?.prompt_tokens || 0;
        const completionTokens = completion.usage?.completion_tokens || 0;

        await logger.logInteraction(agentId, agentName, userPrompt, response, durationMs);
        return response;
    } catch (error: any) {
        const durationMs = Date.now() - start;
        await logger.logInteraction(agentId, agentName, userPrompt, `ERROR: ${error.message}`, durationMs);
        console.error(`[AI ERROR] ${agentName}:`, error.message);
        return '[]';
    }
}

// Parse AI JSON response safely — handles bare arrays AND wrapped objects
function parseAIResponse(raw: string, fallback: any = []): any {
    try {
        const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        // If it's already an array, return it directly
        if (Array.isArray(parsed)) return parsed;
        // If it's an object, find the first key that holds an array
        if (typeof parsed === 'object' && parsed !== null) {
            // Keep specialized objects intact (don't unwrap arrays from Recon or Orchestrator)
            if (parsed.executiveSummary || parsed.techStack || parsed.topPriorities) return parsed;

            for (const key of Object.keys(parsed)) {
                if (Array.isArray(parsed[key])) {
                    console.log(`[PARSE] Unwrapped array from key: "${key}" (${parsed[key].length} items)`);
                    return parsed[key];
                }
            }
            return parsed;
        }
        return fallback;
    } catch {
        console.error('[PARSE] Failed to parse AI response, using fallback');
        console.error('[PARSE] Raw (first 300 chars):', raw.substring(0, 300));
        return fallback;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 0: GIT CONNECT (Optimized)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runGitConnect(scanId: string, repoUrl: string): Promise<string> {
    const repoPath = `/tmp/cortexedr-${scanId}`;
    let lastEmitTime = 0;
    let lastProgress = -1;

    try {
        await emit(scanId, 0, 'Git Connect', 'started', 'Initializing ultra-fast git connection...');

        // 1. Verify Git Environment
        try {
            await simpleGit().version();
        } catch (e: any) {
            throw new Error(`Git binary not found or inaccessible: ${e.message}`);
        }

        await emit(scanId, 0, 'Git Connect', 'processing', 'Sanitizing temporary telemetry workspace...');
        // Ensure path is clean
        if (fs.existsSync(repoPath)) {
            fs.rmSync(repoPath, { recursive: true, force: true });
        }

        const git = simpleGit({
            progress({ method, stage, progress }) {
                const now = Date.now();
                // Throttle: Max once per 1.5 seconds OR if progress jumped significantly (>= 5%)
                // This prevents DB backpressure from stalling the clone in production
                if (now - lastEmitTime > 1500 || Math.abs(progress - lastProgress) >= 5 || progress === 100) {
                    lastEmitTime = now;
                    lastProgress = progress;
                    emit(scanId, 0, 'Git Connect', 'processing',
                        `Cloning: ${stage} (${progress}%)`,
                        { stage, progress, method }
                    );
                }
            }
        });

        await emit(scanId, 0, 'Git Connect', 'processing', 'establishing handshake with remote peer...');

        // Speed optimization: treeless clone (+ depth 1 already there)
        await Promise.race([
            git.clone(repoUrl, repoPath, [
                '--depth', '1',
                '--single-branch',
                '--no-tags',
                '--filter=blob:none',
                '--progress'
            ]),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Clone operation timed out after 5 minutes')), 300000)
            )
        ]);

        const files = getAllFiles(repoPath);
        await emit(scanId, 0, 'Git Connect', 'completed', `Repository synchronized successfully. ${files.length} unique assets indexed.`, {
            fileCount: files.length,
            instantMatch: true
        });

        return repoPath;
    } catch (error: any) {
        await emit(scanId, 0, 'Git Connect', 'error', `Git connection failed: ${error.message}`);
        throw error;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 1: RECONNAISSANCE - The Architect
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runReconnaissance(scanId: string, repoPath: string, logger: AILogger) {
    try {
        await emit(scanId, 1, 'Reconnaissance', 'started', 'Beginning deep codebase reconnaissance...');

        const allFiles = getAllFiles(repoPath);
        const importantFiles = allFiles.filter(f =>
            !f.includes('node_modules') &&
            !f.includes('.git') &&
            !f.includes('dist') &&
            !f.includes('.next')
        );

        await emit(scanId, 1, 'Reconnaissance', 'processing', `Mapping ${importantFiles.length} files...`);

        // Read package.json
        let pkg: any = {};
        const pkgPath = path.join(repoPath, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
            } catch { /* skip */ }
        }

        // Collect sample code from key files
        let sampleCode = '';
        const keyFilePatterns = ['layout', 'main', 'app', 'config', 'index', 'server', 'route'];
        const keyFiles = importantFiles.filter(f =>
            keyFilePatterns.some(p => f.toLowerCase().includes(p))
        ).slice(0, 6);

        for (const file of keyFiles) {
            try {
                const relativePath = file.replace(repoPath, '');
                await emit(scanId, 1, 'Reconnaissance', 'processing', `Reading: ${relativePath}`);
                sampleCode += `\n// FILE: ${relativePath}\n`;
                sampleCode += fs.readFileSync(file, 'utf-8').substring(0, 2000);
            } catch { /* skip unreadable */ }
        }

        await emit(scanId, 1, 'Reconnaissance', 'processing', 'Sending codebase to AI for architectural analysis...');

        // Call Gemini with reconnaissance prompt
        const aiResponse = await callAI(
            AGENT_PROMPTS.reconnaissance.systemPrompt,
            AGENT_PROMPTS.reconnaissance.analysisPrompt(
                importantFiles.map(f => f.replace(repoPath, '')),
                pkg,
                sampleCode
            ),
            1, 'Reconnaissance', logger
        );

        const analysis = parseAIResponse(aiResponse, {
            summary: 'Analysis completed',
            techStack: { framework: 'Unknown', language: 'Unknown' },
            architecture: {},
            insights: {}
        });

        // Emit key findings
        if (analysis.techStack) {
            await emit(scanId, 1, 'Reconnaissance', 'processing',
                `Detected: ${analysis.techStack.framework || 'Unknown'}, ${analysis.techStack.language || 'Unknown'}`,
                { techStack: analysis.techStack }
            );
        }

        if (analysis.insights) {
            await emit(scanId, 1, 'Reconnaissance', 'processing',
                `Complexity: ${analysis.insights.complexity || 'N/A'}, Quality: ${analysis.insights.codeQualityEstimate || 'N/A'}`,
                { insights: analysis.insights }
            );
        }

        // Store in shared memory
        await supabase.from('scans').update({
            recon_data: {
                fileTree: importantFiles.map(f => f.replace(repoPath, '')),
                analysis,
                totalFiles: allFiles.length
            }
        }).eq('id', scanId);

        await emit(scanId, 1, 'Reconnaissance', 'completed',
            `Reconnaissance complete. ${analysis.summary || `${importantFiles.length} files mapped.`}`
        );

        return { fileTree: importantFiles, analysis, pkg };
    } catch (error: any) {
        await emit(scanId, 1, 'Reconnaissance', 'error', `Reconnaissance failed: ${error.message}`);
        throw error;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 2: SECURITY SCANNER - The Defender
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runSecurityScanner(
    scanId: string,
    repoPath: string,
    fileTree: string[],
    techStack: any,
    logger: AILogger
) {
    try {
        await emit(scanId, 2, 'Security Scanner', 'started', 'Initializing deep security audit...');

        // Focus on security-critical files
        const criticalFiles = fileTree.filter(f =>
            f.includes('api') || f.includes('auth') ||
            f.includes('login') || f.includes('route') ||
            f.includes('middleware') || f.includes('config') ||
            f.includes('server') || f.includes('handler')
        ).slice(0, 12);

        await emit(scanId, 2, 'Security Scanner', 'processing',
            `Deep scanning ${criticalFiles.length} security-critical files...`
        );

        let allVulnerabilities: any[] = [];

        for (let i = 0; i < criticalFiles.length; i++) {
            const filePath = criticalFiles[i];
            const fileName = filePath.replace(repoPath, '');

            await emit(scanId, 2, 'Security Scanner', 'processing',
                `Auditing: ${fileName} (${i + 1}/${criticalFiles.length})`
            );

            try {
                const code = fs.readFileSync(filePath, 'utf-8');
                if (code.length > 50000 || code.length < 20) continue;

                const aiResponse = await callAI(
                    AGENT_PROMPTS.security.systemPrompt,
                    AGENT_PROMPTS.security.analysisPrompt(fileName, code, techStack),
                    2, 'Security Scanner', logger
                );

                const vulnerabilities = parseAIResponse(aiResponse, []);
                if (!Array.isArray(vulnerabilities)) continue;

                for (const vuln of vulnerabilities) {
                    allVulnerabilities.push(vuln);

                    await supabase.from('issues').insert({
                        scan_id: scanId,
                        agent_id: 2,
                        category: 'security',
                        severity: vuln.severity || 'medium',
                        title: vuln.title,
                        description: `${vuln.vulnerability}\n\nEXPLOIT: ${vuln.exploitScenario || 'N/A'}\n\nIMPACT: ${vuln.impact || 'N/A'}`,
                        file_path: fileName,
                        line_number: vuln.line || 0,
                        code_snippet: vuln.codeSnippet,
                        fix_suggestion: `${vuln.fixExplanation || ''}\n\nFIX CODE:\n${vuln.fixCode || ''}`,
                        ai_prompt: vuln.aiPrompt,
                        metadata: { cwe: vuln.cwe, owasp: vuln.owasp }
                    });

                    await emit(scanId, 2, 'Security Scanner', 'found_issue',
                        `${(vuln.severity || 'medium').toUpperCase()}: ${vuln.title} (${fileName}:${vuln.line || '?'})`
                    );
                }
            } catch (e) {
                console.error(`[Security] Error on ${fileName}:`, e);
            }

            await sleep(500); // Rate limiting
        }

        await emit(scanId, 2, 'Security Scanner', 'completed',
            `Security audit complete. ${allVulnerabilities.length} vulnerabilities identified.`
        );

        return allVulnerabilities;
    } catch (error: any) {
        await emit(scanId, 2, 'Security Scanner', 'error', `Security scan failed: ${error.message}`);
        return [];
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 3: ARCHITECTURE REVIEWER - The Designer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runArchitecture(scanId: string, repoPath: string, fileTree: string[], logger: AILogger) {
    try {
        await emit(scanId, 3, 'Architecture', 'started', 'Analyzing system architecture...');

        // Build folder structure view
        const structure = fileTree
            .map(f => f.replace(repoPath, ''))
            .slice(0, 80)
            .join('\n');

        // Collect key implementation files
        const archFiles = fileTree.filter(f =>
            f.includes('layout') || f.includes('app.') ||
            f.includes('middleware') || f.includes('server') ||
            f.includes('config') || f.includes('index.')
        ).slice(0, 8);

        let keyFilesContent = '';
        for (const file of archFiles) {
            try {
                const relativePath = file.replace(repoPath, '');
                await emit(scanId, 3, 'Architecture', 'processing', `Analyzing: ${relativePath}`);
                keyFilesContent += `\n// FILE: ${relativePath}\n`;
                keyFilesContent += fs.readFileSync(file, 'utf-8').substring(0, 1500);
            } catch { /* skip */ }
        }

        await emit(scanId, 3, 'Architecture', 'processing', 'AI analyzing architectural patterns...');

        const aiResponse = await callAI(
            AGENT_PROMPTS.architecture.systemPrompt,
            AGENT_PROMPTS.architecture.analysisPrompt(structure, keyFilesContent),
            3, 'Architecture', logger
        );

        console.log('[Architecture] Raw response (first 400):', aiResponse.substring(0, 400));
        const issues = parseAIResponse(aiResponse, []);
        console.log(`[Architecture] Extracted ${Array.isArray(issues) ? issues.length : 0} issues`);

        if (Array.isArray(issues)) {
            for (const issue of issues) {
                try {
                    const { error } = await supabase.from('issues').insert({
                        scan_id: scanId,
                        agent_id: 3,
                        category: 'architecture',
                        severity: issue.severity || 'medium',
                        title: issue.title || 'Architecture Issue',
                        description: `${issue.problem || issue.description || ''}\n\nCONSEQUENCES: ${issue.consequences || 'N/A'}`,
                        file_path: issue.location || issue.file || '',
                        fix_suggestion: issue.solution || issue.fix || '',
                        metadata: {
                            category: issue.category,
                            refactoringEffort: issue.refactoringEffort,
                            priority: issue.priority
                        }
                    });
                    if (error) console.error('[Architecture] DB insert error:', error.message);
                    else await emit(scanId, 3, 'Architecture', 'found_issue',
                        `${(issue.severity || 'medium').toUpperCase()}: ${issue.title}`
                    );
                } catch (e: any) { console.error('[Architecture] Insert failed:', e.message); }
            }
        }

        await emit(scanId, 3, 'Architecture', 'completed',
            `Architecture review complete. ${Array.isArray(issues) ? issues.length : 0} design issues found.`
        );
    } catch (error: any) {
        await emit(scanId, 3, 'Architecture', 'error', `Architecture review failed: ${error.message}`);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 4: CODE QUALITY ANALYST - The Critic
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runCodeQuality(scanId: string, repoPath: string, fileTree: string[], logger: AILogger) {
    try {
        await emit(scanId, 4, 'Code Quality', 'started', 'Analyzing code quality...');

        const codeFiles = fileTree.filter(f =>
            (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')) &&
            !f.includes('node_modules') && !f.includes('.next')
        ).slice(0, 15);

        let filesContent = '';
        for (const file of codeFiles) {
            try {
                const relativePath = file.replace(repoPath, '');
                await emit(scanId, 4, 'Code Quality', 'processing', `Checking: ${relativePath}`);
                filesContent += `\n// FILE: ${relativePath}\n`;
                filesContent += fs.readFileSync(file, 'utf-8').substring(0, 800);
            } catch { /* skip */ }
        }

        await emit(scanId, 4, 'Code Quality', 'processing', 'AI analyzing code patterns...');

        const aiResponse = await callAI(
            AGENT_PROMPTS.codeQuality.systemPrompt,
            AGENT_PROMPTS.codeQuality.analysisPrompt(filesContent),
            4, 'Code Quality', logger
        );

        console.log('[Code Quality] Raw response (first 400):', aiResponse.substring(0, 400));
        const issues = parseAIResponse(aiResponse, []);
        console.log(`[Code Quality] Extracted ${Array.isArray(issues) ? issues.length : 0} issues`);

        if (Array.isArray(issues)) {
            for (const issue of issues) {
                try {
                    const { error } = await supabase.from('issues').insert({
                        scan_id: scanId,
                        agent_id: 4,
                        category: 'quality',
                        severity: issue.severity || 'low',
                        title: issue.title || 'Code Quality Issue',
                        description: issue.problem || issue.description || '',
                        file_path: issue.file || '',
                        line_number: issue.line || 0,
                        fix_suggestion: issue.suggestion || issue.fix || issue.exampleFix || '',
                        metadata: { type: issue.type }
                    });
                    if (error) console.error('[Code Quality] DB insert error:', error.message);
                    else if (issue.severity === 'high' || issue.severity === 'critical') {
                        await emit(scanId, 4, 'Code Quality', 'found_issue',
                            `${(issue.severity || 'low').toUpperCase()}: ${issue.title}`
                        );
                    }
                } catch (e: any) { console.error('[Code Quality] Insert failed:', e.message); }
            }
        }

        await emit(scanId, 4, 'Code Quality', 'completed',
            `Quality analysis complete. ${Array.isArray(issues) ? issues.length : 0} issues found.`
        );
    } catch (error: any) {
        await emit(scanId, 4, 'Code Quality', 'error', `Quality analysis failed: ${error.message}`);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 5: TECHNICAL DEBT HUNTER - The Auditor
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runTechnicalDebt(scanId: string, repoPath: string, fileTree: string[], pkg: any, logger: AILogger) {
    try {
        await emit(scanId, 5, 'Technical Debt', 'started', 'Scanning for technical debt...');

        const allCodeFiles = fileTree.filter(f =>
            (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx') ||
                f.endsWith('.json') || f.endsWith('.env')) &&
            !f.includes('node_modules') && !f.includes('.next')
        ).slice(0, 20);

        let codebase = '';
        for (const file of allCodeFiles) {
            try {
                const relativePath = file.replace(repoPath, '');
                await emit(scanId, 5, 'Technical Debt', 'processing', `Checking: ${relativePath}`);
                codebase += `\n// FILE: ${relativePath}\n`;
                codebase += fs.readFileSync(file, 'utf-8').substring(0, 600);
            } catch { /* skip */ }
        }

        await emit(scanId, 5, 'Technical Debt', 'processing', 'AI hunting for technical debt...');

        const aiResponse = await callAI(
            AGENT_PROMPTS.technicalDebt.systemPrompt,
            AGENT_PROMPTS.technicalDebt.analysisPrompt(codebase, pkg),
            5, 'Technical Debt', logger
        );

        console.log('[Technical Debt] Raw response (first 400):', aiResponse.substring(0, 400));
        const debts = parseAIResponse(aiResponse, []);
        console.log(`[Technical Debt] Extracted ${Array.isArray(debts) ? debts.length : 0} items`);

        if (Array.isArray(debts)) {
            for (const debt of debts) {
                try {
                    const { error } = await supabase.from('issues').insert({
                        scan_id: scanId,
                        agent_id: 5,
                        category: 'tech_debt',
                        severity: debt.severity || 'low',
                        title: debt.title || 'Technical Debt',
                        description: `${debt.debt || debt.description || ''}\n\nRISK: ${debt.risk || 'N/A'}`,
                        file_path: debt.file || '',
                        line_number: debt.line || 0,
                        fix_suggestion: debt.fix || '',
                        metadata: { type: debt.type, effort: debt.effort }
                    });
                    if (error) console.error('[Technical Debt] DB insert error:', error.message);
                    else if (debt.severity === 'high') {
                        await emit(scanId, 5, 'Technical Debt', 'found_issue',
                            `${(debt.severity || 'low').toUpperCase()}: ${debt.title}`
                        );
                    }
                } catch (e: any) { console.error('[Technical Debt] Insert failed:', e.message); }
            }
        }

        await emit(scanId, 5, 'Technical Debt', 'completed',
            `Debt scan complete. ${Array.isArray(debts) ? debts.length : 0} debt items found.`
        );
    } catch (error: any) {
        await emit(scanId, 5, 'Technical Debt', 'error', `Debt scan failed: ${error.message}`);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 6: AI CODE DETECTOR - The Investigator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runAIEngineReview(scanId: string, repoPath: string, fileTree: string[], logger: AILogger) {
    try {
        await emit(scanId, 6, 'AI-Engine Review', 'started', 'Analyzing AI code patterns...');

        const codeFiles = fileTree.filter(f =>
            (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js')) &&
            !f.includes('node_modules') && !f.includes('.next')
        ).slice(0, 12);

        let code = '';
        for (const file of codeFiles) {
            try {
                const relativePath = file.replace(repoPath, '');
                await emit(scanId, 6, 'AI-Engine Review', 'processing', `Analyzing: ${relativePath}`);
                code += `\n// FILE: ${relativePath}\n`;
                code += fs.readFileSync(file, 'utf-8').substring(0, 1000);
            } catch { /* skip */ }
        }

        await emit(scanId, 6, 'AI-Engine Review', 'processing', 'AI detecting generated code patterns...');

        const aiResponse = await callAI(
            AGENT_PROMPTS.aiSpecific.systemPrompt,
            AGENT_PROMPTS.aiSpecific.analysisPrompt(code),
            6, 'AI-Engine Review', logger
        );

        console.log('[AI-Engine] Raw response (first 400):', aiResponse.substring(0, 400));
        const patterns = parseAIResponse(aiResponse, []);
        console.log(`[AI-Engine] Extracted ${Array.isArray(patterns) ? patterns.length : 0} patterns`);

        if (Array.isArray(patterns)) {
            for (const pattern of patterns) {
                try {
                    const { error } = await supabase.from('issues').insert({
                        scan_id: scanId,
                        agent_id: 6,
                        category: 'ai_specific',
                        severity: pattern.severity || 'low',
                        title: pattern.title || 'AI Code Pattern',
                        description: `${pattern.evidence || pattern.description || ''}\n\nPROBLEM: ${pattern.problem || 'N/A'}`,
                        file_path: pattern.file || '',
                        line_number: pattern.line || 0,
                        fix_suggestion: pattern.fix || '',
                        metadata: { pattern: pattern.pattern, evidence: pattern.evidence }
                    });
                    if (error) console.error('[AI-Engine] DB insert error:', error.message);
                    else await emit(scanId, 6, 'AI-Engine Review', 'found_issue',
                        `AI Pattern: ${pattern.title}`
                    );
                } catch (e: any) { console.error('[AI-Engine] Insert failed:', e.message); }
            }
        }

        await emit(scanId, 6, 'AI-Engine Review', 'completed',
            `AI review complete. ${Array.isArray(patterns) ? patterns.length : 0} AI patterns detected.`
        );
    } catch (error: any) {
        await emit(scanId, 6, 'AI-Engine Review', 'error', `AI review failed: ${error.message}`);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 7: ORCHESTRATOR - The Synthesizer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runOrchestrator(scanId: string, logger: AILogger) {
    try {
        await emit(scanId, 7, 'Synthesis & Report', 'started', 'Initializing executive synthesis...');

        // 1. Fetch all findings from DB
        const { data: allIssues } = await supabase
            .from('issues')
            .select('*')
            .eq('scan_id', scanId)
            .order('severity');

        const { data: scan } = await supabase
            .from('scans')
            .select('*')
            .eq('id', scanId)
            .single();

        await emit(scanId, 7, 'Synthesis & Report', 'processing',
            `Analyzing ${allIssues?.length || 0} findings from all agents...`
        );

        // 2. Organize findings by category
        const findings = {
            security: (allIssues || []).filter((i: any) => i.category === 'security'),
            architecture: (allIssues || []).filter((i: any) => i.category === 'architecture'),
            quality: (allIssues || []).filter((i: any) => i.category === 'quality'),
            debt: (allIssues || []).filter((i: any) => i.category === 'tech_debt'),
            aiSpecific: (allIssues || []).filter((i: any) => i.category === 'ai_specific')
        };

        const metadata = {
            repoUrl: scan?.repo_url,
            totalFiles: scan?.recon_data?.totalFiles || 0,
            techStack: scan?.recon_data?.analysis?.techStack || {}
        };

        await emit(scanId, 7, 'Synthesis & Report', 'processing',
            'Sending all findings to CTO AI for deep executive synthesis...'
        );

        // 3. Call AI for strategic synthesis
        const aiResponse = await callAI(
            AGENT_PROMPTS.orchestrator.systemPrompt,
            AGENT_PROMPTS.orchestrator.synthesisPrompt(findings, metadata),
            7, 'Orchestrator', logger
        );

        const enterpriseReport = parseAIResponse(aiResponse, {
            executiveSummary: { overview: 'Synthesis completed. Manual review recommended.' },
            overallScore: 50,
            riskLevel: 'Medium'
        });

        await emit(scanId, 7, 'Synthesis & Report', 'processing',
            `Executive analysis complete. AI Score: ${enterpriseReport.overallScore}/100`
        );

        // 4. Calculate final score (blend AI + calculated)
        let calculatedScore = 100;
        for (const issue of allIssues || []) {
            if (issue.severity === 'critical') calculatedScore -= 10;
            else if (issue.severity === 'high') calculatedScore -= 5;
            else if (issue.severity === 'medium') calculatedScore -= 2;
            else if (issue.severity === 'low') calculatedScore -= 0.5;
        }
        calculatedScore = Math.max(0, Math.round(calculatedScore));

        const finalScore = Math.round(
            ((enterpriseReport.overallScore || 50) * 0.6) + (calculatedScore * 0.4)
        );

        // 5. Update scan with final results
        await supabase.from('scans').update({
            status: 'completed',
            score: finalScore,
            total_issues: allIssues?.length || 0,
            issue_counts: {
                security: findings.security.length,
                architecture: findings.architecture.length,
                quality: findings.quality.length,
                debt: findings.debt.length,
                aiSpecific: findings.aiSpecific.length
            },
            severity_counts: {
                critical: (allIssues || []).filter((i: any) => i.severity === 'critical').length,
                high: (allIssues || []).filter((i: any) => i.severity === 'high').length,
                medium: (allIssues || []).filter((i: any) => i.severity === 'medium').length,
                low: (allIssues || []).filter((i: any) => i.severity === 'low').length
            },
            enterprise_report: enterpriseReport,
            summary: enterpriseReport.executiveSummary?.overview || '',
            completed_at: new Date().toISOString()
        }).eq('id', scanId);

        await emit(scanId, 7, 'Synthesis & Report', 'completed',
            `Audit complete! Final score: ${finalScore}/100. ${allIssues?.length || 0} total findings.`
        );

        return enterpriseReport;
    } catch (error: any) {
        console.error('[Orchestrator Error]', error);
        await emit(scanId, 7, 'Synthesis & Report', 'error', `Synthesis failed: ${error.message}`);

        // Simple fallback update
        await supabase.from('scans').update({
            status: 'completed',
            completed_at: new Date().toISOString()
        }).eq('id', scanId);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MASTER PIPELINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function runPipeline(scanId: string, repoUrl: string) {
    console.log(`[PIPELINE START] Scan: ${scanId}, Repo: ${repoUrl}`);
    const logger = new AILogger(scanId);

    try {
        // Agent 0: Git Connect (no AI needed)
        const repoPath = await runGitConnect(scanId, repoUrl);
        console.log(`[PIPELINE] Agent 0 complete`);

        // Agent 1: Reconnaissance (AI: architectural blueprint)
        const { fileTree, analysis, pkg } = await runReconnaissance(scanId, repoPath, logger);
        console.log(`[PIPELINE] Agent 1 complete (${fileTree.length} files)`);

        const techStack = analysis?.techStack || {};

        // Agent 2: Security Scanner (AI: per-file vulnerability hunting)
        await runSecurityScanner(scanId, repoPath, fileTree, techStack, logger);
        console.log(`[PIPELINE] Agent 2 complete`);

        // Agent 3: Architecture Reviewer (AI: design pattern analysis)
        await runArchitecture(scanId, repoPath, fileTree, logger);
        console.log(`[PIPELINE] Agent 3 complete`);

        // Agent 4: Code Quality (AI: clean code analysis)
        await runCodeQuality(scanId, repoPath, fileTree, logger);
        console.log(`[PIPELINE] Agent 4 complete`);

        // Agent 5: Technical Debt (AI: debt hunting)
        await runTechnicalDebt(scanId, repoPath, fileTree, pkg, logger);
        console.log(`[PIPELINE] Agent 5 complete`);

        // Agent 6: AI-Engine Review (AI: generated code detection)
        await runAIEngineReview(scanId, repoPath, fileTree, logger);
        console.log(`[PIPELINE] Agent 6 complete`);

        // Agent 7: Orchestrator (AI: executive synthesis)
        await runOrchestrator(scanId, logger);
        console.log(`[PIPELINE] Agent 7 complete`);

        // Save AI interaction log
        await logger.saveToSupabase(supabase);

        // Cleanup
        try {
            fs.rmSync(repoPath, { recursive: true, force: true });
        } catch { /* ignore */ }

        console.log(`[PIPELINE END] Scan ${scanId} completed successfully`);

    } catch (error: any) {
        console.error(`[PIPELINE ERROR]`, error);
        await supabase.from('scans').update({
            status: 'failed',
            error: error.message
        }).eq('id', scanId);

        // Still save AI logs on failure
        await logger.saveToSupabase(supabase);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getAllFiles(dirPath: string, files: string[] = []): string[] {
    try {
        const items = fs.readdirSync(dirPath);
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            if (item.startsWith('.') || item === 'node_modules' || item === 'dist' || item === '.next') continue;
            try {
                if (fs.statSync(fullPath).isDirectory()) {
                    getAllFiles(fullPath, files);
                } else {
                    files.push(fullPath);
                }
            } catch { /* skip */ }
        }
    } catch { /* skip */ }
    return files;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

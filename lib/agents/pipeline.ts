import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
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
        groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY || 'MISSING_KEY' });
    }
    return groqClient;
}

let geminiClient: GoogleGenerativeAI | null = null;
function getGeminiClient() {
    if (!geminiClient) {
        geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');
    }
    return geminiClient;
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
// STRATEGIC AI ROUTER (Quality + Scale)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AGENT_ROUTING: Record<number, { primary: string; fallback: string }> = {
    1: { primary: 'gemini-2.0-flash', fallback: 'groq-llama-3.3-70b-versatile' }, // Recon
    2: { primary: 'gemini-2.0-flash', fallback: 'groq-llama-3.3-70b-versatile' }, // Security
    3: { primary: 'gemini-2.0-flash', fallback: 'groq-llama-3.3-70b-versatile' }, // Arch
    4: { primary: 'gemini-2.0-flash', fallback: 'groq-llama-3.3-70b-versatile' }, // Quality
    5: { primary: 'gemini-2.0-flash', fallback: 'groq-llama-3.3-70b-versatile' }, // Tech Debt
    6: { primary: 'gemini-2.0-flash', fallback: 'groq-llama-3.3-70b-versatile' }, // AI Specific
    7: { primary: 'gemini-2.0-flash', fallback: 'groq-llama-3.3-70b-versatile' }, // Orchestrator
};

async function callAI(
    systemPrompt: string,
    userPrompt: string,
    agentId: number,
    agentName: string,
    logger: AILogger
): Promise<string> {
    const routing = AGENT_ROUTING[agentId] || { primary: 'gemini-2.0-flash', fallback: 'groq-llama-3.3-70b' };

    // Attempt Primary
    try {
        return await executeAICall(routing.primary, systemPrompt, userPrompt, agentId, agentName, logger);
    } catch (error: any) {
        console.warn(`[AI ROUTER] Primary (${routing.primary}) failed for ${agentName}: ${error.message}. Trying fallback ${routing.fallback}...`);

        // Attempt Fallback
        try {
            return await executeAICall(routing.fallback, systemPrompt, userPrompt, agentId, agentName, logger);
        } catch (finalError: any) {
            console.error(`[AI ROUTER] Critical Failure: All providers failed for ${agentName}.`);
            throw new Error(`AI_PIPELINE_STALL: ${agentName} failed after fallback. Error: ${finalError.message}`);
        }
    }
}

async function executeAICall(
    modelId: string,
    systemPrompt: string,
    userPrompt: string,
    agentId: number,
    agentName: string,
    logger: AILogger
): Promise<string> {
    const start = Date.now();
    const MAX_RETRIES = 2; // Fail fast so Vercel doesn't hit 60s timeout before fallback connects
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            let response = '';

            if (modelId.startsWith('groq-')) {
                const groq = getGroqClient();
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    model: modelId.replace('groq-', ''),
                    temperature: 0.1,
                    response_format: { type: 'json_object' }
                });
                response = completion.choices[0]?.message?.content || '[]';
            }
            else if (modelId.startsWith('gemini-')) {
                const gemini = getGeminiClient();
                const model = gemini.getGenerativeModel({
                    model: modelId,
                    systemInstruction: systemPrompt,
                    generationConfig: { responseMimeType: "application/json" }
                });
                const result = await model.generateContent(userPrompt);
                response = result.response.text();
            }
            else if (modelId === 'deepseek-r1') {
                // Priority: DeepSeek via OpenRouter. Fallback to Groq Llama if no key.
                const openRouterKey = process.env.OPENROUTER_API_KEY;
                if (!openRouterKey) {
                    console.warn('[AI ROUTER] OPENROUTER_API_KEY missing. Diverting DeepSeek request to Groq Llama.');
                    return await executeAICall('groq-llama-3.3-70b-versatile', systemPrompt, userPrompt, agentId, agentName, logger);
                }

                const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${openRouterKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://cortex-edr.com',
                        'X-Title': 'Cortex EDR'
                    },
                    body: JSON.stringify({
                        model: 'deepseek/deepseek-r1',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ],
                        response_format: { type: 'json_object' }
                    })
                });

                if (!res.ok) throw new Error(`OpenRouter error: ${res.statusText}`);
                const data = await res.json();
                response = data.choices[0]?.message?.content || '[]';
            }

            const durationMs = Date.now() - start;
            console.log(`[AI SUCCESS] ${agentName} used ${modelId} (${durationMs}ms)`);
            await logger.logInteraction(agentId, agentName, userPrompt, response, durationMs);
            return response;

        } catch (error: any) {
            const isRateLimit = error.message.includes('429') || error.message.includes('quota') || error.message.includes('Too Many Requests');

            if (isRateLimit && attempt < MAX_RETRIES - 1) {
                attempt++;
                const backoffMs = Math.pow(2, attempt) * 1500; // max wait 3s
                console.warn(`[AI RETRY] ${agentName} hit rate limit on ${modelId}. Waiting ${backoffMs}ms (Attempt ${attempt}/${MAX_RETRIES})...`);
                await new Promise(r => setTimeout(r, backoffMs));
                continue;
            }

            const durationMs = Date.now() - start;
            await logger.logInteraction(agentId, agentName, userPrompt, `ERROR (${modelId}): ${error.message}`, durationMs);
            throw error;
        }
    }
    throw new Error('Max retries exceeded');
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
// HELPER: Parse GitHub URL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function parseGitHubUrl(url: string): { owner: string; repo: string } {
    const match = url.match(/github\.com[/:]+([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/.*)?$/);
    if (!match) throw new Error(`Invalid GitHub URL: "${url}". Must be a github.com repository URL.`);
    return { owner: match[1], repo: match[2] };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPER: Setup /tmp for a pipeline step
// Downloads only the files this step needs from GitHub — no /tmp sharing required.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const STEP_PATTERNS: Record<number, RegExp[]> = {
    1: [/package\.json$/, /tsconfig/, /next\.config/, /layout\./, /app\./, /main\./, /index\./, /server\./, /README/i],
    2: [/api/, /auth/, /login/, /route\./, /middleware\./, /config\./, /server\./, /handler\./],
    3: [/layout/, /app\./, /middleware/, /server/, /config/, /index\./],
    4: [/\.(ts|tsx|js|jsx)$/],
    5: [/\.(ts|tsx|js|jsx|json)$/],
    6: [/\.(tsx|ts|jsx|js)$/],
};

export async function setupForStep(
    scanId: string,
    owner: string,
    repo: string,
    fileTree: string[],
    step: number
): Promise<string> {
    const repoPath = `/tmp/cortexedr-${scanId}`;
    if (fs.existsSync(repoPath)) fs.rmSync(repoPath, { recursive: true, force: true });
    fs.mkdirSync(repoPath, { recursive: true });

    // Normalize paths (step 1 output has leading slash, step 0 output does not)
    const normalized = fileTree.map(f => f.startsWith('/') ? f.slice(1) : f);
    fs.writeFileSync(path.join(repoPath, '.cortex-tree'), normalized.join('\n'));

    const patterns = STEP_PATTERNS[step] || [];
    const filesToDownload = normalized
        .filter(f => !f.includes('node_modules') && !f.includes('.next') && patterns.some(p => p.test(f)))
        .slice(0, 25);

    // Get default branch
    let branch = 'main';
    try {
        const headers: Record<string, string> = { 'User-Agent': 'CortexEDR/1.0' };
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        const r = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers
        });
        if (r.ok) branch = (await r.json()).default_branch || 'main';
    } catch { /* use main */ }

    const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;
    await Promise.all(filesToDownload.map(async (filePath) => {
        try {
            const resp = await fetch(`${rawBase}/${filePath}`);
            if (!resp.ok) return;
            const content = await resp.text();
            const fullPath = path.join(repoPath, filePath);
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.writeFileSync(fullPath, content);
        } catch { /* skip */ }
    }));

    return repoPath;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 0: GIT CONNECT (GitHub API — no git binary, works on Vercel Hobby)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function runGitConnect(scanId: string, repoUrl: string): Promise<string> {
    const repoPath = `/tmp/cortexedr-${scanId}`;

    try {
        await emit(scanId, 0, 'Git Connect', 'started', 'Initializing repository connection via GitHub API...');

        // Clean workspace
        if (fs.existsSync(repoPath)) fs.rmSync(repoPath, { recursive: true, force: true });
        fs.mkdirSync(repoPath, { recursive: true });

        const { owner, repo } = parseGitHubUrl(repoUrl);
        await emit(scanId, 0, 'Git Connect', 'processing', `Connecting to ${owner}/${repo}...`);

        // Build GitHub API headers (use token if available to avoid rate limits)
        const token = process.env.GITHUB_TOKEN;
        const headers: Record<string, string> = {
            'User-Agent': 'CortexEDR/1.0',
            'Accept': 'application/vnd.github.v3+json'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // 1. Fetch default branch
        const repoResp = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (!repoResp.ok) throw new Error(`GitHub API error ${repoResp.status}: ${repoResp.statusText}. Is the repository public?`);
        const repoMeta = await repoResp.json();
        const branch = repoMeta.default_branch || 'main';

        // 2. Fetch recursive file tree (single API call)
        await emit(scanId, 0, 'Git Connect', 'processing', 'Fetching repository file tree...');
        const treeResp = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
            { headers }
        );
        if (!treeResp.ok) throw new Error(`Could not fetch tree: ${treeResp.status}`);
        const treeData = await treeResp.json();

        const allFiles: string[] = (treeData.tree || [])
            .filter((item: any) => item.type === 'blob')
            .map((item: any) => item.path as string);

        const importantFiles = allFiles.filter(f =>
            !f.includes('node_modules') && !f.includes('.git') &&
            !f.includes('dist/') && !f.includes('.next/')
        );

        await emit(scanId, 0, 'Git Connect', 'processing',
            `Tree indexed. ${allFiles.length} files found. Fetching key files for analysis...`,
            { fileCount: allFiles.length }
        );

        // 3. Write virtual tree manifest (so getAllFiles returns the full list)
        fs.writeFileSync(path.join(repoPath, '.cortex-tree'), importantFiles.join('\n'));

        // 4. Identify key files agents will actually read
        const KEY_PATTERNS = [
            /package(?:-lock)?\.json$/, /tsconfig/, /next\.config/, /\.env\.example/,
            /layout\.(ts|tsx|js|jsx)$/, /app\.(ts|tsx|js|jsx)$/, /main\.(ts|tsx|js|jsx)$/,
            /index\.(ts|tsx|js|jsx)$/, /server\.(ts|js)$/, /middleware\.(ts|js)$/,
            /route\.(ts|tsx|js|jsx)$/, /handler\.(ts|js)$/, /config\.(ts|tsx|js|jsx|json)$/,
            /auth/, /login/, /README/i, /\.env\.example/
        ];

        const filesToDownload = importantFiles
            .filter(f => KEY_PATTERNS.some(p => p.test(f)))
            .slice(0, 60);

        // 5. Download key files in parallel batches to /tmp
        const BATCH_SIZE = 10;
        let downloaded = 0;
        const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;

        for (let i = 0; i < filesToDownload.length; i += BATCH_SIZE) {
            const batch = filesToDownload.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(async (filePath) => {
                try {
                    const resp = await fetch(`${rawBase}/${filePath}`);
                    if (!resp.ok) return;
                    const content = await resp.text();
                    const fullPath = path.join(repoPath, filePath);
                    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
                    fs.writeFileSync(fullPath, content);
                    downloaded++;
                } catch { /* skip unreadable files */ }
            }));
            await emit(scanId, 0, 'Git Connect', 'processing',
                `Fetched ${Math.min(i + BATCH_SIZE, filesToDownload.length)}/${filesToDownload.length} key files...`
            );
        }

        await emit(scanId, 0, 'Git Connect', 'completed',
            `Repository indexed. ${importantFiles.length} files mapped, ${downloaded} key files fetched for deep analysis.`,
            { fileCount: importantFiles.length, downloaded }
        );

        return repoPath;
    } catch (error: any) {
        await emit(scanId, 0, 'Git Connect', 'error', `Git connection failed: ${error.message}`);
        throw error;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 1: RECONNAISSANCE - The Architect
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function runReconnaissance(scanId: string, repoPath: string, logger: AILogger) {
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
export async function runSecurityScanner(
    scanId: string,
    repoPath: string,
    fileTree: string[],
    techStack: any,
    logger: AILogger
) {
    try {
        await emit(scanId, 2, 'Security Scanner', 'started', 'Initializing deep security audit...');

        const criticalFiles = fileTree.filter(f =>
            f.includes('api') || f.includes('auth') ||
            f.includes('login') || f.includes('route') ||
            f.includes('middleware') || f.includes('config') ||
            f.includes('server') || f.includes('handler')
        ).slice(0, 12);

        await emit(scanId, 2, 'Security Scanner', 'processing',
            `Deep auditing ${criticalFiles.length} critical files in batches...`
        );

        let allVulnerabilities: any[] = [];
        const BATCH_SIZE = 3;

        for (let i = 0; i < criticalFiles.length; i += BATCH_SIZE) {
            const batch = criticalFiles.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(batch.map(async (filePath) => {
                const fileName = filePath.replace(repoPath, '');
                try {
                    const code = fs.readFileSync(filePath, 'utf-8');
                    if (code.length > 50000 || code.length < 20) return [];
                    const aiResponse = await callAI(
                        AGENT_PROMPTS.security.systemPrompt,
                        AGENT_PROMPTS.security.analysisPrompt(fileName, code, techStack),
                        2, 'Security Scanner', logger
                    );
                    const vulns = parseAIResponse(aiResponse, []);
                    return Array.isArray(vulns) ? vulns.map(v => ({ ...v, fileName })) : [];
                } catch { return []; }
            }));
            allVulnerabilities.push(...batchResults.flat());

            // ANTI-RATE-LIMIT: Wait 1.5s between batches to cool down Groq/Gemini tokens
            if (i + BATCH_SIZE < criticalFiles.length) {
                await new Promise(r => setTimeout(r, 1500));
            }
        }

        for (const vuln of allVulnerabilities) {
            await supabase.from('issues').insert({
                scan_id: scanId,
                agent_id: 2,
                category: 'security',
                severity: vuln.severity || 'medium',
                title: vuln.title,
                description: `${vuln.vulnerability}\n\nEXPLOIT: ${vuln.exploitScenario || 'N/A'}\n\nIMPACT: ${vuln.impact || 'N/A'}`,
                file_path: vuln.fileName || '',
                line_number: vuln.line || 0,
                code_snippet: vuln.codeSnippet,
                fix_suggestion: `${vuln.fixExplanation || ''}\n\nFIX CODE:\n${vuln.fixCode || ''}`,
                ai_prompt: vuln.aiPrompt,
                metadata: { cwe: vuln.cwe, owasp: vuln.owasp }
            });
            await emit(scanId, 2, 'Security Scanner', 'found_issue',
                `${(vuln.severity || 'medium').toUpperCase()}: ${vuln.title} (${vuln.fileName}:${vuln.line || '?'})`
            );
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
export async function runArchitecture(scanId: string, repoPath: string, fileTree: string[], logger: AILogger) {
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
export async function runCodeQuality(scanId: string, repoPath: string, fileTree: string[], logger: AILogger) {
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
export async function runTechnicalDebt(scanId: string, repoPath: string, fileTree: string[], pkg: any, logger: AILogger) {
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
export async function runAIEngineReview(scanId: string, repoPath: string, fileTree: string[], logger: AILogger) {
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
export async function runOrchestrator(scanId: string, logger: AILogger) {
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
    // If a .cortex-tree manifest exists (written by GitHub API mode), use it.
    // This gives agents the full virtual file list even though only key files
    // were physically downloaded to /tmp.
    if (files.length === 0) {
        const manifest = path.join(dirPath, '.cortex-tree');
        if (fs.existsSync(manifest)) {
            const lines = fs.readFileSync(manifest, 'utf-8').split('\n').filter(Boolean);
            return lines.map(f => path.join(dirPath, f));
        }
    }
    // Fallback: walk the filesystem (local dev / non-API mode)
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

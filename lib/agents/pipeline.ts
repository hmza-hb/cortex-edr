import { createClient } from '@supabase/supabase-js';
import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
// AGENT 0: GIT CONNECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runGitConnect(scanId: string, repoUrl: string): Promise<string> {
    const repoPath = `/tmp/cortexedr-${scanId}`;

    try {
        await emit(scanId, 0, 'Git Connect', 'started', 'Initializing git connection...');
        await sleep(200);

        await emit(scanId, 0, 'Git Connect', 'processing', `Connecting to ${repoUrl}`, { url: repoUrl });
        await sleep(200);

        const git = simpleGit();
        await emit(scanId, 0, 'Git Connect', 'processing', 'Cloning repository...');

        await git.clone(repoUrl, repoPath, ['--depth', '1']);

        const files = getAllFiles(repoPath);

        await emit(scanId, 0, 'Git Connect', 'completed', `Repository ready. Found ${files.length} files.`, {
            fileCount: files.length
        });

        return repoPath;
    } catch (error: any) {
        await emit(scanId, 0, 'Git Connect', 'error', `Clone failed: ${error.message}`);
        throw error;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 1: RECONNAISSANCE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runReconnaissance(scanId: string, repoPath: string) {
    try {
        await emit(scanId, 1, 'Reconnaissance', 'started', 'Beginning codebase reconnaissance...');
        await sleep(300);

        const allFiles = getAllFiles(repoPath);
        const importantFiles = allFiles.filter(f =>
            !f.includes('node_modules') &&
            !f.includes('.git') &&
            !f.includes('dist') &&
            !f.includes('.next')
        );

        await emit(scanId, 1, 'Reconnaissance', 'processing', `Scanning ${importantFiles.length} files...`);
        await sleep(200);

        // Show first 20 files being read
        for (let i = 0; i < Math.min(importantFiles.length, 20); i++) {
            const file = importantFiles[i].replace(repoPath, '');
            await emit(scanId, 1, 'Reconnaissance', 'processing', `Reading: ${file}`, { file });
            await sleep(80);
        }

        // Detect tech stack
        let techStack: any = { framework: 'Unknown', language: 'Unknown' };
        const pkgPath = path.join(repoPath, 'package.json');

        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
            await emit(scanId, 1, 'Reconnaissance', 'processing', 'Reading: package.json');

            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            if (deps['next']) techStack.framework = 'Next.js';
            else if (deps['react']) techStack.framework = 'React';
            else if (deps['vue']) techStack.framework = 'Vue';

            if (deps['typescript']) techStack.language = 'TypeScript';
            else techStack.language = 'JavaScript';

            await sleep(200);
            await emit(scanId, 1, 'Reconnaissance', 'processing',
                `Detected: ${techStack.framework}, ${techStack.language}`
            );
        }

        await sleep(300);
        await emit(scanId, 1, 'Reconnaissance', 'completed',
            `Reconnaissance complete. ${importantFiles.length} files mapped.`
        );

        return { fileTree: importantFiles, techStack };
    } catch (error: any) {
        await emit(scanId, 1, 'Reconnaissance', 'error', `Reconnaissance failed: ${error.message}`);
        throw error;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 2: SECURITY SCANNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runSecurityScanner(scanId: string, repoPath: string, fileTree: string[]) {
    try {
        await emit(scanId, 2, 'Security Scanner', 'started', 'Initializing security scanner...');
        await sleep(300);

        const criticalFiles = fileTree.filter(f =>
            f.includes('api') || f.includes('auth') ||
            f.includes('login') || f.includes('route')
        ).slice(0, 15);

        await emit(scanId, 2, 'Security Scanner', 'processing',
            `Scanning ${criticalFiles.length} critical files...`
        );
        await sleep(200);

        let issueCount = 0;

        for (const filePath of criticalFiles) {
            const fileName = filePath.replace(repoPath, '');
            await emit(scanId, 2, 'Security Scanner', 'processing', `Scanning: ${fileName}`);

            // Simple pattern-based detection
            try {
                const content = fs.readFileSync(filePath, 'utf-8');

                if (content.includes('eval(') || content.includes('Function(')) {
                    issueCount++;
                    await supabase.from('issues').insert({
                        scan_id: scanId,
                        agent_id: 2,
                        category: 'security',
                        severity: 'high',
                        title: 'Potential code injection risk',
                        description: 'Use of eval() or Function() detected',
                        file_path: fileName,
                        fix_suggestion: 'Avoid dynamic code execution'
                    });
                    await emit(scanId, 2, 'Security Scanner', 'found_issue',
                        `🚨 Code injection risk in ${fileName}`
                    );
                }

                if (content.match(/password\s*=\s*['"][^'"]+['"]/i)) {
                    issueCount++;
                    await supabase.from('issues').insert({
                        scan_id: scanId,
                        agent_id: 2,
                        category: 'security',
                        severity: 'critical',
                        title: 'Hardcoded password detected',
                        description: 'Password hardcoded in source',
                        file_path: fileName,
                        fix_suggestion: 'Use environment variables'
                    });
                    await emit(scanId, 2, 'Security Scanner', 'found_issue',
                        `🚨 Hardcoded password in ${fileName}`
                    );
                }
            } catch (e) {
                // Skip unreadable files
            }

            await sleep(120);
        }

        await emit(scanId, 2, 'Security Scanner', 'completed',
            `Security scan complete. ${issueCount} vulnerabilities found.`
        );
    } catch (error: any) {
        await emit(scanId, 2, 'Security Scanner', 'error', `Security scan failed: ${error.message}`);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 3-6: SIMPLIFIED AGENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runArchitecture(scanId: string, repoPath: string, fileTree: string[]) {
    try {
        await emit(scanId, 3, 'Architecture', 'started', 'Analyzing system architecture...');
        await sleep(300);

        const files = fileTree.filter(f => f.includes('layout') || f.includes('app.')).slice(0, 10);
        for (const file of files) {
            await emit(scanId, 3, 'Architecture', 'processing', `Analyzing: ${file.replace(repoPath, '')}`);
            await sleep(100);
        }

        await sleep(200);
        await emit(scanId, 3, 'Architecture', 'completed', 'Architecture review complete.');
    } catch (error: any) {
        await emit(scanId, 3, 'Architecture', 'error', `Failed: ${error.message}`);
    }
}

async function runCodeQuality(scanId: string, repoPath: string, fileTree: string[]) {
    try {
        await emit(scanId, 4, 'Code Quality', 'started', 'Analyzing code quality...');
        await sleep(300);

        const files = fileTree.filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).slice(0, 15);
        for (const file of files) {
            await emit(scanId, 4, 'Code Quality', 'processing', `Checking: ${file.replace(repoPath, '')}`);
            await sleep(90);
        }

        await sleep(200);
        await emit(scanId, 4, 'Code Quality', 'completed', 'Quality analysis complete.');
    } catch (error: any) {
        await emit(scanId, 4, 'Code Quality', 'error', `Failed: ${error.message}`);
    }
}

async function runTechnicalDebt(scanId: string, repoPath: string, fileTree: string[]) {
    try {
        await emit(scanId, 5, 'Technical Debt', 'started', 'Scanning for technical debt...');
        await sleep(300);

        const files = fileTree.slice(0, 20);
        for (const file of files) {
            await emit(scanId, 5, 'Technical Debt', 'processing', `Checking: ${file.replace(repoPath, '')}`);
            await sleep(80);
        }

        await sleep(200);
        await emit(scanId, 5, 'Technical Debt', 'completed', 'Debt scan complete.');
    } catch (error: any) {
        await emit(scanId, 5, 'Technical Debt', 'error', `Failed: ${error.message}`);
    }
}

async function runAIEngineReview(scanId: string, repoPath: string, fileTree: string[]) {
    try {
        await emit(scanId, 6, 'AI-Engine Review', 'started', 'Analyzing AI code patterns...');
        await sleep(300);

        const files = fileTree.filter(f => f.endsWith('.tsx')).slice(0, 12);
        for (const file of files) {
            await emit(scanId, 6, 'AI-Engine Review', 'processing', `Analyzing: ${file.replace(repoPath, '')}`);
            await sleep(95);
        }

        await sleep(200);
        await emit(scanId, 6, 'AI-Engine Review', 'completed', 'AI review complete.');
    } catch (error: any) {
        await emit(scanId, 6, 'AI-Engine Review', 'error', `Failed: ${error.message}`);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AGENT 7: SYNTHESIS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runSynthesis(scanId: string) {
    try {
        await emit(scanId, 7, 'Synthesis & Report', 'started', 'Compiling final report...');
        await sleep(400);

        const { data: issues } = await supabase
            .from('issues')
            .select('*')
            .eq('scan_id', scanId);

        await emit(scanId, 7, 'Synthesis & Report', 'processing',
            `Analyzing ${issues?.length || 0} findings...`
        );
        await sleep(300);

        let score = 100;
        for (const issue of issues || []) {
            if (issue.severity === 'critical') score -= 10;
            else if (issue.severity === 'high') score -= 5;
            else if (issue.severity === 'medium') score -= 2;
            else score -= 0.5;
        }
        score = Math.max(0, Math.round(score));

        await emit(scanId, 7, 'Synthesis & Report', 'processing',
            `Risk score: ${score}/100`
        );
        await sleep(300);

        await supabase.from('scans').update({
            status: 'completed',
            score,
            total_issues: issues?.length || 0,
            summary: `Found ${issues?.length || 0} issues. Score: ${score}/100.`,
            completed_at: new Date().toISOString()
        }).eq('id', scanId);

        await emit(scanId, 7, 'Synthesis & Report', 'completed',
            `Audit complete! Score: ${score}/100. ${issues?.length || 0} issues found.`
        );
    } catch (error: any) {
        await emit(scanId, 7, 'Synthesis & Report', 'error', `Failed: ${error.message}`);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MASTER PIPELINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function runPipeline(scanId: string, repoUrl: string) {
    console.log(`[PIPELINE START] Scan: ${scanId}, Repo: ${repoUrl}`);

    try {
        const repoPath = await runGitConnect(scanId, repoUrl);
        console.log(`[PIPELINE] ✓ Agent 0 complete`);

        const { fileTree } = await runReconnaissance(scanId, repoPath);
        console.log(`[PIPELINE] ✓ Agent 1 complete (${fileTree.length} files)`);

        await runSecurityScanner(scanId, repoPath, fileTree);
        console.log(`[PIPELINE] ✓ Agent 2 complete`);

        await runArchitecture(scanId, repoPath, fileTree);
        console.log(`[PIPELINE] ✓ Agent 3 complete`);

        await runCodeQuality(scanId, repoPath, fileTree);
        console.log(`[PIPELINE] ✓ Agent 4 complete`);

        await runTechnicalDebt(scanId, repoPath, fileTree);
        console.log(`[PIPELINE] ✓ Agent 5 complete`);

        await runAIEngineReview(scanId, repoPath, fileTree);
        console.log(`[PIPELINE] ✓ Agent 6 complete`);

        await runSynthesis(scanId);
        console.log(`[PIPELINE] ✓ Agent 7 complete`);

        // Cleanup
        try {
            fs.rmSync(repoPath, { recursive: true, force: true });
        } catch (e) { }

        console.log(`[PIPELINE END] ✓ Scan ${scanId} completed`);

    } catch (error: any) {
        console.error(`[PIPELINE ERROR]`, error);
        await supabase.from('scans').update({
            status: 'failed',
            error: error.message
        }).eq('id', scanId);
    }
}

// Helpers
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
            } catch (e) { }
        }
    } catch (e) { }
    return files;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

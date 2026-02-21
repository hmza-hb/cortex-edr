import { inngest } from './client';
import {
    runGitConnect,
    runReconnaissance,
    runSecurityScanner,
    runArchitecture,
    runCodeQuality,
    runTechnicalDebt,
    runAIEngineReview,
    runOrchestrator,
    setupForStep,
    parseGitHubUrl,
} from '@/lib/agents/pipeline';
import { createClient } from '@supabase/supabase-js';
import { AILogger } from '@/lib/agents/ai-logger';
import path from 'path';
import fs from 'fs';

const supabaseService = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const pipelineFunction = inngest.createFunction(
    // Retries set to 0 initially, but because each step is isolated, if an API fails wildly 
    // we could retry just that step. For now, we trust the `executeAICall` inner retry loop.
    { id: 'scan-pipeline', retries: 0 },
    { event: 'scan/start' },
    async ({ event, step }) => {
        const { scanId } = event.data as { scanId: string };

        // 0. Fetch initial scan data
        const scan = await step.run('fetch-scan', async () => {
            const { data } = await supabaseService
                .from('scans')
                .select('repo_url, recon_data')
                .eq('id', scanId)
                .single();
            if (!data) throw new Error(`Scan ${scanId} not found`);
            return data;
        });

        const { owner, repo } = parseGitHubUrl(scan.repo_url);

        // Step 0: Git Connect
        const gitData = await step.run('git-connect', async () => {
            const repoPath = await runGitConnect(scanId, scan.repo_url);
            const manifestPath = path.join(repoPath, '.cortex-tree');
            const fileTree = fs.existsSync(manifestPath)
                ? fs.readFileSync(manifestPath, 'utf-8').split('\n').filter(Boolean)
                : [];

            await supabaseService.from('scans').update({
                recon_data: { ...(scan.recon_data || {}), github: { owner, repo, fileTree } }
            }).eq('id', scanId);

            return { repoPath, fileTree };
        });

        // Step 1: Reconnaissance
        const reconData = await step.run('reconnaissance', async () => {
            const rawFileTree = gitData.fileTree;
            const repoPath = await setupForStep(scanId, owner, repo, rawFileTree, 1);
            const logger = new AILogger(scanId);
            await runReconnaissance(scanId, repoPath, logger);
            await logger.saveToSupabase(supabaseService);

            // Fetch the freshly updated recon data internally from DB to pass to next steps
            const { data } = await supabaseService
                .from('scans')
                .select('recon_data')
                .eq('id', scanId)
                .single();
            return data?.recon_data || {};
        });

        // Helper to format absolute paths for agents
        const getAbsFileTree = (repoPath: string, rawTree: string[]) => {
            return rawTree.map(f => {
                const clean = f.startsWith('/') ? f.slice(1) : f;
                return path.join(repoPath, clean);
            });
        };

        // Step 2: Security Scanner
        await step.run('security-scanner', async () => {
            const rawFileTree = gitData.fileTree;
            const repoPath = await setupForStep(scanId, owner, repo, rawFileTree, 2);
            const absFileTree = getAbsFileTree(repoPath, rawFileTree);
            const techStack = reconData?.analysis?.techStack || {};
            const logger = new AILogger(scanId);

            await runSecurityScanner(scanId, repoPath, absFileTree, techStack, logger);
            await logger.saveToSupabase(supabaseService);
        });

        // Step 3: Architecture
        await step.run('architecture', async () => {
            const rawFileTree = gitData.fileTree;
            const repoPath = await setupForStep(scanId, owner, repo, rawFileTree, 3);
            const absFileTree = getAbsFileTree(repoPath, rawFileTree);
            const logger = new AILogger(scanId);

            await runArchitecture(scanId, repoPath, absFileTree, logger);
            await logger.saveToSupabase(supabaseService);
        });

        // Step 4: Code Quality
        await step.run('code-quality', async () => {
            const rawFileTree = gitData.fileTree;
            const repoPath = await setupForStep(scanId, owner, repo, rawFileTree, 4);
            const absFileTree = getAbsFileTree(repoPath, rawFileTree);
            const logger = new AILogger(scanId);

            await runCodeQuality(scanId, repoPath, absFileTree, logger);
            await logger.saveToSupabase(supabaseService);
        });

        // Step 5: Technical Debt
        await step.run('technical-debt', async () => {
            const rawFileTree = gitData.fileTree;
            const repoPath = await setupForStep(scanId, owner, repo, rawFileTree, 5);
            const absFileTree = getAbsFileTree(repoPath, rawFileTree);
            const pkg = reconData?.pkg || {};
            const logger = new AILogger(scanId);

            await runTechnicalDebt(scanId, repoPath, absFileTree, pkg, logger);
            await logger.saveToSupabase(supabaseService);
        });

        // Step 6: AI Engine Review
        await step.run('ai-engine-review', async () => {
            const rawFileTree = gitData.fileTree;
            const repoPath = await setupForStep(scanId, owner, repo, rawFileTree, 6);
            const absFileTree = getAbsFileTree(repoPath, rawFileTree);
            const logger = new AILogger(scanId);

            await runAIEngineReview(scanId, repoPath, absFileTree, logger);
            await logger.saveToSupabase(supabaseService);
        });

        // Step 7: Orchestrator
        await step.run('orchestrator', async () => {
            const logger = new AILogger(scanId);
            await runOrchestrator(scanId, logger);
            await logger.saveToSupabase(supabaseService);
        });

        // Cleanup
        await step.run('cleanup', async () => {
            try {
                fs.rmSync(`/tmp/cortexedr-${scanId}`, { recursive: true, force: true });
            } catch { /* ignore */ }
        });

        return { success: true, scanId };
    }
);

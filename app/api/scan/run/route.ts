import { NextRequest, NextResponse, after } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';
import { AILogger } from '@/lib/agents/ai-logger';
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
import path from 'path';
import fs from 'fs';

const TOTAL_STEPS = 8;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.cortex-edr.com';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    const { scanId, step } = await req.json();

    try {
        const { data: scan } = await supabaseService
            .from('scans')
            .select('repo_url, recon_data')
            .eq('id', scanId)
            .single();

        if (!scan) return NextResponse.json({ error: 'Scan not found' }, { status: 404 });

        const logger = new AILogger(scanId);
        const { owner, repo } = parseGitHubUrl(scan.repo_url);

        if (step === 0) {
            // Git Connect: fetch tree + key files via GitHub API
            const repoPath = await runGitConnect(scanId, scan.repo_url);
            const manifestPath = path.join(repoPath, '.cortex-tree');
            const fileTree = fs.existsSync(manifestPath)
                ? fs.readFileSync(manifestPath, 'utf-8').split('\n').filter(Boolean)
                : [];

            // Store github info so step 1 can use it (recon will overwrite recon_data, but
            // step 1 reads github info BEFORE running recon, which is fine)
            await supabaseService.from('scans').update({
                recon_data: { github: { owner, repo, fileTree } }
            }).eq('id', scanId);

        } else {
            const recon = scan.recon_data || {};
            // After step 1, recon_data.fileTree is set by runReconnaissance
            // Before step 1, use recon_data.github.fileTree (from step 0)
            const rawFileTree: string[] = recon.fileTree || recon.github?.fileTree || [];
            const techStack = recon.analysis?.techStack || {};
            const pkg = recon.pkg || {};

            // Set up /tmp with only the files this step needs
            const repoPath = await setupForStep(scanId, owner, repo, rawFileTree, step);
            // Build absolute paths for agents that accept fileTree parameter
            const absFileTree = rawFileTree.map(f => {
                const clean = f.startsWith('/') ? f.slice(1) : f;
                return path.join(repoPath, clean);
            });

            switch (step) {
                case 1: await runReconnaissance(scanId, repoPath, logger); break;
                case 2: await runSecurityScanner(scanId, repoPath, absFileTree, techStack, logger); break;
                case 3: await runArchitecture(scanId, repoPath, absFileTree, logger); break;
                case 4: await runCodeQuality(scanId, repoPath, absFileTree, logger); break;
                case 5: await runTechnicalDebt(scanId, repoPath, absFileTree, pkg, logger); break;
                case 6: await runAIEngineReview(scanId, repoPath, absFileTree, logger); break;
                case 7:
                    await runOrchestrator(scanId, logger);
                    await logger.saveToSupabase(supabaseService);
                    break;
            }
        }

        // 🔗 Chain: fire next step as a brand-new Vercel invocation via after()
        const nextStep = step + 1;
        if (nextStep < TOTAL_STEPS) {
            after(async () => {
                // Fire without awaiting — this keeps the fetch alive independent of this function
                fetch(`${APP_URL}/api/scan/run`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ scanId, step: nextStep }),
                }).catch(() => { }); // suppress unhandled rejection

                // Sleep 1s so Node.js event loop stays alive while the request is sent
                // (TCP handshake + HTTP send happens in <100ms; 1s is more than enough)
                await new Promise(r => setTimeout(r, 1000));
            });
        }

        return NextResponse.json({ ok: true, step });

    } catch (error: any) {
        console.error(`[RUN] Step ${step} failed:`, error);
        await supabaseService.from('scans').update({
            status: 'failed',
            error: error.message
        }).eq('id', scanId);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

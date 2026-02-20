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

    console.log(`[RUN] Received request for Scan ${scanId}, Step ${step}`);

    // 1. Immediately acknowledge the request to finish the previous Vercel invocation
    // This is the "Handshake Handover" that prevents chain breaks.
    after(async () => {
        console.log(`[RUN] Starting execution for Scan ${scanId}, Step ${step}`);
        try {
            const { data: scan } = await supabaseService
                .from('scans')
                .select('repo_url, recon_data')
                .eq('id', scanId)
                .single();

            if (!scan) {
                console.error(`[RUN] Scan ${scanId} not found`);
                return;
            }

            const logger = new AILogger(scanId);
            const { owner, repo } = parseGitHubUrl(scan.repo_url);

            if (step === 0) {
                // Git Connect: fetch tree + key files via GitHub API
                const repoPath = await runGitConnect(scanId, scan.repo_url);
                const manifestPath = path.join(repoPath, '.cortex-tree');
                const fileTree = fs.existsSync(manifestPath)
                    ? fs.readFileSync(manifestPath, 'utf-8').split('\n').filter(Boolean)
                    : [];

                await supabaseService.from('scans').update({
                    recon_data: { github: { owner, repo, fileTree } }
                }).eq('id', scanId);

            } else {
                const recon = scan.recon_data || {};
                const rawFileTree: string[] = recon.fileTree || recon.github?.fileTree || [];
                const techStack = recon.analysis?.techStack || {};
                const pkg = recon.pkg || {};

                // Set up /tmp with only the files this step needs
                const repoPath = await setupForStep(scanId, owner, repo, rawFileTree, step);
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
                    case 7: await runOrchestrator(scanId, logger); break;
                }
            }

            // Save AI logs to Supabase at the end of EVERY step for deep observability
            await logger.saveToSupabase(supabaseService);

            // 2. Chain to next step
            const nextStep = step + 1;
            if (nextStep < TOTAL_STEPS) {
                console.log(`[RUN] Triggering next step: ${nextStep}`);
                // Fire and forget, but with catch and 1s wait to ensure bytes are sent
                fetch(`${APP_URL}/api/scan/run`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ scanId, step: nextStep }),
                }).catch(err => console.error(`[RUN] Fetch to step ${nextStep} failed:`, err));

                await new Promise(r => setTimeout(r, 1000));
            }

        } catch (error: any) {
            console.error(`[RUN] Step ${step} failed:`, error);
            await supabaseService.from('scans').update({
                status: 'failed',
                error: error.message
            }).eq('id', scanId);
        }
    });

    return NextResponse.json({ ok: true, step, received: true });
}

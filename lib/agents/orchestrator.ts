import { SharedMemory, AgentEvent, Issue } from '@/types/agent';
import { supabaseService } from '@/lib/supabase/service';
import { runGitCloneAgent } from './agent0-git-clone';
import { runReconAgent } from './agent1-recon';
import { runSecurityAgent } from './agent2-security';
import { runArchitectureAgent } from './agent3-architecture';
import { runQualityAgent } from './agent4-quality';
import { runDebtAgent } from './agent5-debt';
import { runAISpecificAgent } from './agent6-ai-specific';
import { runSynthesisAgent } from './agent7-synthesis';
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function startScanPipeline(scanId: string, repoUrl: string) {
    const user = await currentUser();

    if (!user) {
        return redirect("/login");
    }

    const { data: profile } = await supabaseService
        .from('profiles')
        .select('plan_tier')
        .eq('email', user.primaryEmailAddress?.emailAddress)
        .maybeSingle();

    const sharedMemory: SharedMemory = {
        scanId,
        repoPath: '', // Will be set by Agent 0
        repoUrl,
        fileTree: [],
        techStack: { languages: [], frameworks: [], dependencies: {} },
        issues: [],
        planTier: profile?.plan_tier || 'vibe_coder',
    };

    const emitEvent = async (event: Partial<AgentEvent>) => {
        const fullEvent = {
            scan_id: scanId,
            agent_id: event.agent_id || 0,
            agent_name: event.agent_name || 'System',
            event_type: event.event_type || 'processing',
            message: event.message || '',
            data: event.data || {},
        };

        console.log(`[Scan ${scanId}] ${fullEvent.agent_name}: ${fullEvent.message}`);

        // Save event to Supabase for real-time visualization
        await supabaseService
            .from('agent_events')
            .insert(fullEvent);
    };

    try {
        // Agent 0: Git Clone
        const cloneResults = await runGitCloneAgent(scanId, repoUrl, emitEvent);
        sharedMemory.repoPath = cloneResults.repoPath;
        await updateScanStatus(scanId, 'processing', 0);

        // Agent 1: Recon
        const reconResults = await runReconAgent(sharedMemory, emitEvent);
        Object.assign(sharedMemory, reconResults);
        await updateScanStatus(scanId, 'processing', 1);

        // Agent 2: Security
        const securityResults = await runSecurityAgent(sharedMemory, emitEvent);
        Object.assign(sharedMemory, securityResults);
        await updateScanStatus(scanId, 'processing', 2);

        // Agent 3: Architecture
        const archResults = await runArchitectureAgent(sharedMemory, emitEvent);
        Object.assign(sharedMemory, archResults);
        await updateScanStatus(scanId, 'processing', 3);

        // Agent 4: Quality
        const qualityResults = await runQualityAgent(sharedMemory, emitEvent);
        Object.assign(sharedMemory, qualityResults);
        await updateScanStatus(scanId, 'processing', 4);

        // Agent 5: Tech Debt
        const debtResults = await runDebtAgent(sharedMemory, emitEvent);
        Object.assign(sharedMemory, debtResults);
        await updateScanStatus(scanId, 'processing', 5);

        // Agent 6: AI-Specific
        const aiResults = await runAISpecificAgent(sharedMemory, emitEvent);
        Object.assign(sharedMemory, aiResults);
        await updateScanStatus(scanId, 'processing', 6);

        // Agent 7: Synthesis
        const synthesisResults = await runSynthesisAgent(sharedMemory, emitEvent);
        Object.assign(sharedMemory, synthesisResults);

        // Final Status Update
        await updateScanStatus(scanId, 'completed', 7, sharedMemory.score, sharedMemory.summary);

        return sharedMemory;
    } catch (error) {
        console.error('Scan pipeline failed:', error);
        await emitEvent({
            agent_id: 0,
            agent_name: 'Orchestrator',
            event_type: 'error',
            message: `Critical Error: ${error instanceof Error ? error.message : String(error)}`,
        });
        await updateScanStatus(scanId, 'failed');
        throw error;
    }
}

async function updateScanStatus(
    scanId: string,
    status: string,
    currentAgent: number = 0,
    score?: number,
    summary?: string
) {
    const updates: any = {
        status,
        current_agent: currentAgent
    };

    if (score !== undefined) updates.score = score;
    if (summary !== undefined) updates.summary = JSON.stringify({ executiveSummary: summary });
    if (status === 'completed') updates.completed_at = new Date().toISOString();

    await supabaseService
        .from('scans')
        .update(updates)
        .eq('id', scanId);
}

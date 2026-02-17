import { SharedMemory, AgentEvent, Issue } from '@/types/agent';
import { supabaseService } from '@/lib/supabase/service';
import { runReconAgent } from './agent1-recon';
// Import other agents as they are built...

export async function startScanPipeline(scanId: string, repoUrl: string, repoPath: string) {
    const sharedMemory: SharedMemory = {
        scanId,
        repoPath,
        repoUrl,
        fileTree: [],
        techStack: { languages: [], frameworks: [], dependencies: {} },
        issues: [],
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

        await supabaseService
            .from('agent_events')
            .insert(fullEvent);
    };

    try {
        // Phase 1: Recon
        const reconResults = await runReconAgent(sharedMemory, emitEvent);
        Object.assign(sharedMemory, reconResults);

        await updateScanStatus(scanId, 'processing', 1);

        // TODO: Phase 2-6 (Security, Arch, Quality, Debt, AI)
        // For now, let's simulate others or wait for implementation
        // I will implement them one by one.

        // Update scan with results
        await updateScanStatus(scanId, 'completed', 7, 100); // Placeholder until Synthesis is ready

        return sharedMemory;
    } catch (error) {
        console.error('Scan pipeline failed:', error);
        await emitEvent({
            agent_id: 0,
            agent_name: 'Orchestrator',
            event_type: 'error',
            message: `Critial Error: ${error instanceof Error ? error.message : String(error)}`,
        });
        await updateScanStatus(scanId, 'failed');
        throw error;
    }
}

async function updateScanStatus(scanId: string, status: string, currentAgent: number = 0, score?: number) {
    const updates: any = { status, current_agent: currentAgent };
    if (score !== undefined) updates.score = score;
    if (status === 'completed') updates.completed_at = new Date().toISOString();

    await supabaseService
        .from('scans')
        .update(updates)
        .eq('id', scanId);
}

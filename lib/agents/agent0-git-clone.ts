import { SharedMemory, AgentEvent } from '@/types/agent';
import { cloneRepository } from '@/lib/repo/cloner';

export async function runGitCloneAgent(
    scanId: string,
    repoUrl: string,
    onEvent: (event: Partial<AgentEvent>) => Promise<void>
): Promise<{ repoPath: string }> {
    const agentId = 0;
    const agentName = 'Git Connect';

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'started',
        message: 'Initializing git connection...'
    });

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'processing',
        message: `Cloning repository: ${repoUrl}`,
        data: { url: repoUrl }
    });

    try {
        const repoPath = await cloneRepository(scanId, repoUrl);

        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'completed',
            message: `Repository cloned successfully`,
            data: { repoPath, url: repoUrl }
        });

        return { repoPath };
    } catch (error) {
        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'error',
            message: `Failed to clone repository: ${error instanceof Error ? error.message : String(error)}`,
        });
        throw error;
    }
}

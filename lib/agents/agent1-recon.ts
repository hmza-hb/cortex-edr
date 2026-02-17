import { SharedMemory, AgentEvent, TechStack } from '@/types/agent';
import { getTechStack, parseFileTree } from '@/lib/repo/parser';
import { askGemini } from '@/lib/ai/gemini';

export async function runReconAgent(
    sharedMemory: SharedMemory,
    onEvent: (event: Partial<AgentEvent>) => Promise<void>
): Promise<Partial<SharedMemory>> {
    const agentId = 1;
    const agentName = 'Reconnaissance';

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'started',
        message: 'Initializing reconnaissance agent...'
    });

    // 1. Parse file tree
    const fileTree = await parseFileTree(sharedMemory.repoPath);

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'processing',
        message: `Analyzed ${fileTree.length} files. Mapping structure...`,
        data: { fileCount: fileTree.length }
    });

    // 2. Detect tech stack
    const techStack = (await getTechStack(sharedMemory.repoPath)) as TechStack;

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'processing',
        message: `Detected ${techStack.languages.join(', ')} / ${techStack.frameworks.join(', ') || 'General Framework'}`,
        data: { techStack }
    });

    // 3. AI analysis for deeper insights
    const prompt = `
    Analyze this repository structure and tech stack.
    Languages: ${techStack.languages.join(', ')}
    Frameworks: ${techStack.frameworks.join(', ')}
    Files: ${fileTree.map(f => f.path).slice(0, 100).join(', ')}
    ${fileTree.length > 100 ? `...and ${fileTree.length - 100} more files.` : ''}

    Identify:
    1. Main entry points
    2. Primary architectural pattern (MVC, Layered, etc.)
    3. Type of application (Web, API, CLI, etc.)
    4. Complexity estimate (low, medium, high)

    Return ONLY JSON in this format:
    {
      "entryPoints": ["path/to/main"],
      "architecture": "MVC",
      "appType": "Web Application",
      "complexity": "medium",
      "summary": "Brief summary of the repo"
    }
  `;

    try {
        const aiInsight = await askGemini(prompt);

        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'completed',
            message: 'Reconnaissance complete. Project architecture mapped.',
            data: aiInsight
        });

        return {
            fileTree,
            techStack,
            summary: aiInsight.summary,
            // We could store more in sharedMemory if needed
        };
    } catch (error) {
        console.error('Agent 1 AI error:', error);
        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'completed',
            message: 'Reconnaissance complete with some analysis limitations.',
        });
        return { fileTree, techStack };
    }
}

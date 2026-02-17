import { SharedMemory, AgentEvent, Issue } from '@/types/agent';
import { askGemini } from '@/lib/ai/gemini';

export async function runSynthesisAgent(
    sharedMemory: SharedMemory,
    onEvent: (event: Partial<AgentEvent>) => Promise<void>
): Promise<Partial<SharedMemory>> {
    const agentId = 7;
    const agentName = 'Synthesis & Report';

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'started',
        message: 'Synthesizing all agent findings and generating final report...'
    });

    const totalIssues = sharedMemory.issues.length;

    // 1. Scoring Logic
    let score = 100;
    sharedMemory.issues.forEach(issue => {
        if (issue.severity === 'critical') score -= 10;
        else if (issue.severity === 'high') score -= 5;
        else if (issue.severity === 'medium') score -= 2;
        else if (issue.severity === 'low') score -= 0.5;
    });
    score = Math.max(0, Math.min(100, Math.round(score)));

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'processing',
        message: `Aggregated ${totalIssues} issues. Final Score: ${score}/100.`,
    });

    // 2. AI Synthesis for Executive Summary
    const issueSummaries = sharedMemory.issues.map(i => `[${i.category.toUpperCase()} - ${i.severity.toUpperCase()}] ${i.title}`).join('\n');
    const prompt = `
    You are an expert code auditor. Given these findings from 6 different AI agents, create an executive summary for the repository: ${sharedMemory.repoUrl}
    
    Found Issues:
    ${issueSummaries}

    Final Score: ${score}/100

    Create:
    1. A concise executive summary (2 sentences)
    2. A list of top 3 priority areas to address

    Return ONLY JSON:
    {
      "summary": "...",
      "priorityAreas": ["...", "...", "..."]
    }
  `;

    try {
        const synthesis = await askGemini(prompt);

        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'completed',
            message: 'Synthesis complete. Report generated.',
            data: { score, totalIssues, ...synthesis }
        });

        return {
            score,
            summary: synthesis.summary
        };
    } catch (error) {
        console.error('Agent 7 AI error:', error);
        return { score };
    }
}

import { SharedMemory, AgentEvent, Issue } from '@/types/agent';
import { readFileContent } from '@/lib/repo/reader';
import { askGemini, formatFileContext } from '@/lib/ai/gemini';
import { supabaseService } from '@/lib/supabase/service';

export async function runQualityAgent(
    sharedMemory: SharedMemory,
    onEvent: (event: Partial<AgentEvent>) => Promise<void>
): Promise<Partial<SharedMemory>> {
    const agentId = 4;
    const agentName = 'Code Quality';

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'started',
        message: 'Evaluating code quality, complexity, and maintainability...'
    });

    // 1. Identify complex or large files
    const filesByComplexity = sharedMemory.fileTree
        .filter(f => !f.path.includes('.test.') && !f.path.includes('.spec.'))
        .sort((a, b) => b.size - a.size)
        .slice(0, 10);

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'processing',
        message: `Reviewing ${filesByComplexity.length} most complex files...`,
    });

    // 2. Read contents
    const fileContents: Record<string, string> = {};
    for (const file of filesByComplexity.map(f => f.path)) {
        const content = await readFileContent(sharedMemory.repoPath, file);
        if (content) fileContents[file] = content;
    }

    // 3. AI analysis
    const prompt = `
    Review this code for quality and maintainability issues.
    
    Context:
    ${formatFileContext(fileContents)}

    Look for:
    - High cyclomatic complexity
    - Deeply nested logic
    - Poor naming conventions
    - Inconsistent status handling
    - Missing error boundaries/guards
    - Large functions that should be split

    Return ONLY a JSON list of issues in this format:
    [{
      "severity": "low",
      "title": "Complex Loop Structure",
      "description": "The loop in handleTransaction contains 4 nested if-statements...",
      "file_path": "src/utils/payment.ts",
      "line_number": 150,
      "code_snippet": "...",
      "fix_suggestion": "Extract the inner logic into named helper functions.",
      "ai_prompt": "Simplify the handleTransaction function in src/utils/payment.ts by extracting nested logic"
    }]
  `;

    try {
        const findings: any[] = await askGemini(prompt);
        const newIssues: Issue[] = findings.map(f => ({
            scan_id: sharedMemory.scanId,
            agent_id: agentId,
            category: 'quality',
            ...f
        }));

        for (const issue of newIssues) {
            await onEvent({
                agent_id: agentId,
                agent_name: agentName,
                event_type: 'found_issue',
                message: `✨ QUALITY: ${issue.title}`,
                data: issue
            });
            await supabaseService.from('issues').insert(issue);
        }

        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'completed',
            message: 'Code quality evaluation finished.'
        });

        return { issues: [...sharedMemory.issues, ...newIssues] };
    } catch (error) {
        console.error('Agent 4 AI error:', error);
        return {};
    }
}

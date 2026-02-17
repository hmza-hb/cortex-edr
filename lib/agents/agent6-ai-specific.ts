import { SharedMemory, AgentEvent, Issue } from '@/types/agent';
import { readFileContent } from '@/lib/repo/reader';
import { askGemini, formatFileContext } from '@/lib/ai/gemini';
import { supabaseService } from '@/lib/supabase/service';

export async function runAISpecificAgent(
    sharedMemory: SharedMemory,
    onEvent: (event: Partial<AgentEvent>) => Promise<void>
): Promise<Partial<SharedMemory>> {
    const agentId = 6;
    const agentName = 'AI-Engine Review';

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'started',
        message: 'Analyzing for AI-generated code artifacts and structural inconsistencies...'
    });

    // 1. Identification: Look for files likely to have AI churn
    const targetFiles = sharedMemory.fileTree
        .filter(f => f.path.endsWith('.tsx') || f.path.endsWith('.ts') || f.path.endsWith('.py'))
        .slice(0, 10)
        .map(f => f.path);

    // 2. Read contents
    const fileContents: Record<string, string> = {};
    for (const file of targetFiles) {
        const content = await readFileContent(sharedMemory.repoPath, file);
        if (content) fileContents[file] = content;
    }

    // 3. AI analysis
    const prompt = `
    Analyze this code specifically for issues typical of AI-generated code.
    
    Context:
    ${formatFileContext(fileContents)}

    Look for:
    - Hallucinated imports (imports that likely don't exist)
    - Inconsistent coding styles in the same file (e.g. mixed async/await and .then())
    - Redundant logic (same function implemented multiple times slightly differently)
    - Over-engineered solutions for simple tasks
    - "Zombie" code or incomplete implementations
    - Missing error boundaries typical of copy-pastes

    Return ONLY a JSON list of issues in this format:
    [{
      "severity": "medium",
      "title": "Redundant AI Logic",
      "description": "Detected two slightly different implementations of 'formatDate' in the same module...",
      "file_path": "src/utils/helpers.ts",
      "line_number": 80,
      "code_snippet": "...",
      "fix_suggestion": "Unify the formatting logic into a single utility function.",
      "ai_prompt": "Consolidate redundant date formatting logic in src/utils/helpers.ts"
    }]
  `;

    try {
        const findings: any[] = await askGemini(prompt);
        const newIssues: Issue[] = findings.map(f => ({
            scan_id: sharedMemory.scanId,
            agent_id: agentId,
            category: 'ai_specific',
            ...f
        }));

        for (const issue of newIssues) {
            await onEvent({
                agent_id: agentId,
                agent_name: agentName,
                event_type: 'found_issue',
                message: `🤖 AI-ISSUE: ${issue.title}`,
                data: issue
            });
            await supabaseService.from('issues').insert(issue);
        }

        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'completed',
            message: 'AI-specific pattern review complete.'
        });

        return { issues: [...sharedMemory.issues, ...newIssues] };
    } catch (error) {
        console.error('Agent 6 AI error:', error);
        return {};
    }
}

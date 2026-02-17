import { SharedMemory, AgentEvent, Issue } from '@/types/agent';
import { readFileContent } from '@/lib/repo/reader';
import { askGemini, formatFileContext } from '@/lib/ai/gemini';
import { supabaseService } from '@/lib/supabase/service';

export async function runArchitectureAgent(
    sharedMemory: SharedMemory,
    onEvent: (event: Partial<AgentEvent>) => Promise<void>
): Promise<Partial<SharedMemory>> {
    const agentId = 3;
    const agentName = 'Architecture Reviewer';

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'started',
        message: 'Analyzing codebase architecture and structural patterns...'
    });

    // 1. Identify architecture-defining files
    const archPatterns = ['layout', 'provider', 'middleware', 'routes', 'container', 'service', 'repository', 'module'];
    const archFiles = sharedMemory.fileTree
        .filter(f => archPatterns.some(p => f.path.toLowerCase().includes(p)) || f.path.split('/').length <= 2)
        .map(f => f.path)
        .slice(0, 10);

    // 2. Read contents
    const fileContents: Record<string, string> = {};
    for (const file of archFiles) {
        const content = await readFileContent(sharedMemory.repoPath, file);
        if (content) fileContents[file] = content;
    }

    // 3. AI analysis
    const prompt = `
    You are a senior software architect. Review this codebase structure for architectural issues.
    
    Context:
    ${formatFileContext(fileContents)}

    Look for:
    - Design pattern violations
    - Files with too many responsibilities (God objects)
    - Poor separation of concerns
    - Circular dependencies
    - Scalability bottlenecks
    - Inconsistent folder organization

    Return ONLY a JSON list of issues in this format:
    [{
      "severity": "medium",
      "title": "Tight Coupling in Data Layer",
      "description": "Component X is directly calling the database instead of using a service...",
      "file_path": "src/components/List.tsx",
      "line_number": 12,
      "code_snippet": "...",
      "fix_suggestion": "Extract data logic into a separate service layer.",
      "ai_prompt": "Refactor src/components/List.tsx to use a service layer for data fetching"
    }]
  `;

    try {
        const findings: any[] = await askGemini(prompt);
        const newIssues: Issue[] = findings.map(f => ({
            scan_id: sharedMemory.scanId,
            agent_id: agentId,
            category: 'architecture',
            ...f
        }));

        for (const issue of newIssues) {
            await onEvent({
                agent_id: agentId,
                agent_name: agentName,
                event_type: 'found_issue',
                message: `📐 ARCH: ${issue.title}`,
                data: issue
            });
            await supabaseService.from('issues').insert(issue);
        }

        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'completed',
            message: 'Architecture review complete.'
        });

        return { issues: [...sharedMemory.issues, ...newIssues] };
    } catch (error) {
        console.error('Agent 3 AI error:', error);
        return {};
    }
}

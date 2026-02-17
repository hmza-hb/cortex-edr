import { SharedMemory, AgentEvent, Issue } from '@/types/agent';
import { readFileContent } from '@/lib/repo/reader';
import { askGemini, formatFileContext } from '@/lib/ai/gemini';
import { supabaseService } from '@/lib/supabase/service';

export async function runDebtAgent(
    sharedMemory: SharedMemory,
    onEvent: (event: Partial<AgentEvent>) => Promise<void>
): Promise<Partial<SharedMemory>> {
    const agentId = 5;
    const agentName = 'Technical Debt';

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'started',
        message: 'Analyzing technical debt and identifying "quick-fix" opportunities...'
    });

    // 1. Regex search for common debt markers (fast, no AI needed yet)
    const markerIssues: Issue[] = [];
    const filesToScan = sharedMemory.fileTree.slice(0, 50); // Scan more files for markers

    for (const file of filesToScan) {
        const content = await readFileContent(sharedMemory.repoPath, file.path);
        if (!content) continue;

        // Search for TODO/FIXME
        const todoMatches = content.match(/\/\/\s*(TODO|FIXME|HACK):?\s*(.*)/gi);
        if (todoMatches) {
            todoMatches.forEach(match => {
                markerIssues.push({
                    scan_id: sharedMemory.scanId,
                    agent_id: agentId,
                    category: 'tech_debt',
                    severity: 'low',
                    title: `Legacy Marker Found: ${match.split(':')[0]}`,
                    description: match,
                    file_path: file.path,
                });
            });
        }

        // Search for potential hardcoded secrets/IPs (simple patterns)
        if (content.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
            markerIssues.push({
                scan_id: sharedMemory.scanId,
                agent_id: agentId,
                category: 'tech_debt',
                severity: 'medium',
                title: 'Potential Hardcoded IP Address',
                description: 'Found an IP address pattern that might be hardcoded.',
                file_path: file.path,
            });
        }
    }

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'processing',
        message: `Identified ${markerIssues.length} indicators of technical debt via pattern matching.`,
    });

    // 2. Select focus files for AI depth
    const focusFiles = filesToScan.slice(0, 5).map(f => f.path);
    const fileContents: Record<string, string> = {};
    for (const file of focusFiles) {
        const content = await readFileContent(sharedMemory.repoPath, file);
        if (content) fileContents[file] = content;
    }

    // 3. AI analysis for complex debt
    const prompt = `
    Review this code for technical debt.
    
    Context:
    ${formatFileContext(fileContents)}

    Look for:
    - Hardcoded configuration values
    - Deprecated API patterns
    - Premature abstractions
    - Inefficient polyfills
    - Comments indicating known issues

    Return ONLY a JSON list of issues in this format:
    [{
      "severity": "medium",
      "title": "Hardcoded API Base URL",
      "description": "The API base URL is hardcoded in useApi.ts instead of using env variables.",
      "file_path": "src/hooks/useApi.ts",
      "line_number": 8,
      "code_snippet": "const BASE = 'https://api.example.com'",
      "fix_suggestion": "Use process.env.NEXT_PUBLIC_API_URL.",
      "ai_prompt": "Replace hardcoded API URL in src/hooks/useApi.ts with environment variable"
    }]
  `;

    try {
        const aiFindings: any[] = await askGemini(prompt);
        const aiIssues: Issue[] = aiFindings.map(f => ({
            scan_id: sharedMemory.scanId,
            agent_id: agentId,
            category: 'tech_debt',
            ...f
        }));

        const allIssues = [...markerIssues, ...aiIssues];

        for (const issue of allIssues) {
            await onEvent({
                agent_id: agentId,
                agent_name: agentName,
                event_type: 'found_issue',
                message: `🔨 DEBT: ${issue.title}`,
                data: issue
            });
            await supabaseService.from('issues').insert(issue);
        }

        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'completed',
            message: `Technical debt analysis complete. Logged ${allIssues.length} items.`
        });

        return { issues: [...sharedMemory.issues, ...allIssues] };
    } catch (error) {
        console.error('Agent 5 AI error:', error);
        return { issues: [...sharedMemory.issues, ...markerIssues] };
    }
}

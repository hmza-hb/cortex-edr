import { SharedMemory, AgentEvent, Issue, Severity } from '@/types/agent';
import { readFileContent } from '@/lib/repo/reader';
import { askGemini, formatFileContext } from '@/lib/ai/gemini';
import { supabaseService } from '@/lib/supabase/service';

export async function runSecurityAgent(
    sharedMemory: SharedMemory,
    onEvent: (event: Partial<AgentEvent>) => Promise<void>
): Promise<Partial<SharedMemory>> {
    const agentId = 2;
    const agentName = 'Security Scanner';

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'started',
        message: 'Initializing security scan. Identifying high-risk surfaces...'
    });

    // 1. Identify critical files (API routes, auth, DB queries)
    const criticalPatterns = ['api/', 'route.ts', 'auth', 'db', 'query', 'controller', 'handler', '.env', 'config'];
    const criticalFiles = sharedMemory.fileTree
        .filter(f => criticalPatterns.some(p => f.path.toLowerCase().includes(p)))
        .map(f => f.path)
        .slice(0, 15); // Limit to top 15 critical files for this agent

    await onEvent({
        agent_id: agentId,
        agent_name: agentName,
        event_type: 'processing',
        message: `Analyzing ${criticalFiles.length} critical files for vulnerabilities...`,
        data: { criticalFiles }
    });

    // 2. Read contents of critical files
    const fileContents: Record<string, string> = {};
    for (const file of criticalFiles) {
        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'processing',
            message: `Scanning: ${file}`
        });

        const content = await readFileContent(sharedMemory.repoPath, file);
        if (content) {
            fileContents[file] = content;
        }
    }

    // 3. AI analysis
    const prompt = `
    You are a senior security engineer. Analyze this code for security vulnerabilities.
    
    Context:
    ${formatFileContext(fileContents)}

    Look for:
    - SQL injection (string concatenation in queries)
    - XSS (unescaped user input)
    - CSRF (missing protection)
    - Exposed secrets (API keys, passwords, tokens)
    - Auth flaws (missing checks, broken JWT)
    - OWASP Top 10

    Return ONLY a JSON list of issues in this format:
    [{
      "severity": "critical",
      "title": "SQL Injection in User Query",
      "description": "User input is directly concatenated into a SQL string...",
      "file_path": "src/api/users.ts",
      "line_number": 45,
      "code_snippet": "db.query('SELECT * FROM users WHERE id = ' + userId)",
      "fix_suggestion": "Use parameterized queries...",
      "ai_prompt": "Fix this SQL injection in src/api/users.ts at line 45 by using parameterized queries"
    }]
    If no issues found, return [].
  `;

    try {
        const findings: any[] = await askGemini(prompt);
        const newIssues: Issue[] = findings.map(f => ({
            scan_id: sharedMemory.scanId,
            agent_id: agentId,
            category: 'security',
            ...f
        }));

        for (const issue of newIssues) {
            await onEvent({
                agent_id: agentId,
                agent_name: agentName,
                event_type: 'found_issue',
                message: `🚨 ${issue.severity.toUpperCase()}: ${issue.title}`,
                data: issue
            });

            // Save to DB
            await supabaseService.from('issues').insert(issue);
        }

        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'completed',
            message: `Security scan complete. Found ${newIssues.length} potentially critical issues.`
        });

        return { issues: [...sharedMemory.issues, ...newIssues] };
    } catch (error) {
        console.error('Agent 2 AI error:', error);
        await onEvent({
            agent_id: agentId,
            agent_name: agentName,
            event_type: 'error',
            message: 'Failed to complete full security analysis.',
        });
        return {};
    }
}

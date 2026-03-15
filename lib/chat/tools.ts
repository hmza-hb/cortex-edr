import { supabaseService } from '@/lib/supabase/service';
import { parseGitHubUrl } from '@/lib/agents/pipeline';

// ── Search Issues Tool ──────────────────────────────────────────

export async function executeSearchIssues(scanId: string, query: string): Promise<string> {
    const { data, error } = await supabaseService
        .from('issues')
        .select('id, severity, category, title, file_path, line_number')
        .eq('scan_id', scanId)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,file_path.ilike.%${query}%`)
        .order('severity', { ascending: true })
        .limit(5);

    if (error || !data || data.length === 0) {
        return "STALE_CONTEXT_OR_NO_MATCH: No matching issues found for the given query. Please try searching with broader keywords or direct file paths.";
    }

    return data.map(i => `[${i.severity.toUpperCase()}] ${i.title} (File: ${i.file_path || 'unknown'}:${i.line_number || '?'})`).join('\n');
}

// ── Get File Content Tool ───────────────────────────────────────

export async function executeGetFileContent(repoUrl: string, filePath: string): Promise<string> {
    try {
        const { owner, repo } = parseGitHubUrl(repoUrl);
        const branch = 'main';
        const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;

        const resp = await fetch(`${rawBase}/${filePath}`);
        if (!resp.ok) {
            if (resp.status === 404) {
                return `FILE_NOT_FOUND: The file at "${filePath}" does not exist in the current repository branch. This path may be stale. Please use 'search_issues' to find the correct current path or check architecture summary.`;
            }
            return `FETCH_FAILED: Failed to fetch file. Status: ${resp.status}`;
        }

        const text = await resp.text();
        return `<file path="${filePath}">\n${text}\n</file>`;
    } catch (error: any) {
        return `Error fetching file: ${error.message}`;
    }
}

// ── Get Architecture Summary Tool ───────────────────────────────

export async function executeGetArchitectureSummary(scanId: string): Promise<string> {
    const { data } = await supabaseService
        .from('scans')
        .select('enterprise_report, summary')
        .eq('id', scanId)
        .single();

    if (!data) return "No scan data available.";

    const report = data.enterprise_report || data.summary;
    if (!report) return "No architecture report available.";

    // Convert to string safely
    const stringify = (obj: any): string => {
        try {
            return JSON.stringify(obj, null, 2);
        } catch {
            return "Unable to serialize report.";
        }
    };

    if (typeof report === 'object' && report !== null) {
        const arch = (report as any).architecture || (report as any).design || report;
        return typeof arch === 'string' ? arch : stringify(arch);
    }

    return typeof report === 'string' ? report : "Unknown architecture format.";
}

// ── Tool Router ──────────────────────────────────────────────────

export const TOOLS_SYSTEM_PROMPT = `
You are an autonomous security agent. You can execute tools to gather more information before answering.
You have access to the following formatting tools:
1. \`search_issues\`: Search for specific vulnerabilities or files in the current scan. Argument: {"query": "string"}
2. \`get_file_content\`: Fetch the full source code of a specific file from the repository. Argument: {"filePath": "string"}
3. \`get_architecture_summary\`: Get a high-level summary of the repository's architecture and tech stack. Argument: {}

To use a tool, you MUST output an XML block like this:
<tool_call>
<name>search_issues</name>
<arguments>{"query": "authentication"}</arguments>
</tool_call>

You can only call ONE tool at a time. After calling a tool, STOP WRITING immediately. The system will append a <tool_result> block and allow you to continue.
`;

export async function executeToolCall(toolCallText: string, scanId: string, repoUrl: string): Promise<string> {
    try {
        const nameMatch = toolCallText.match(/<name>(.*?)<\/name>/);
        const argsMatch = toolCallText.match(/<arguments>([\s\S]*?)<\/arguments>/i);

        if (!nameMatch || !argsMatch) {
            return "<tool_result>Error: Invalid tool_call format. Must contain <name> and <arguments>.</tool_result>";
        }

        const name = nameMatch[1].trim();
        const argsStr = argsMatch[1].trim();
        let args: any = {};

        // Sometimes LLMs use newlines inside JSON args
        try {
            args = JSON.parse(argsStr.replace(/\\n/g, '\\n'));
        } catch (e) {
            // fallback, sometimes they write just a string
            if (argsStr.includes("filePath")) {
                const fpMatch = argsStr.match(/"filePath"\s*:\s*"([^"]+)"/);
                if (fpMatch) args = { filePath: fpMatch[1] };
            } else if (argsStr.includes("query")) {
                const qMatch = argsStr.match(/"query"\s*:\s*"([^"]+)"/);
                if (qMatch) args = { query: qMatch[1] };
            } else {
                return "<tool_result>Error: Arguments must be valid JSON.</tool_result>";
            }
        }

        let result = "";

        switch (name) {
            case 'search_issues':
                result = await executeSearchIssues(scanId, args.query || "");
                break;
            case 'get_file_content':
                result = await executeGetFileContent(repoUrl, args.filePath || "");
                break;
            case 'get_architecture_summary':
                result = await executeGetArchitectureSummary(scanId);
                break;
            default:
                return `<tool_result>Error: Tool ${name} not found.</tool_result>`;
        }

        return `<tool_result>\n${result}\n</tool_result>`;

    } catch (error: any) {
        return `<tool_result>Tool execution failed: ${error.message}</tool_result>`;
    }
}

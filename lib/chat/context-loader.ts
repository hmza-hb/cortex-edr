import { supabaseService } from '@/lib/supabase/service';

export interface ScanContext {
    id: string;
    repo_url: string;
    repo_name: string;
    score: number | null;
    total_issues: number;
    status: string;
    created_at: string;
    completed_at?: string;
    severity_counts?: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
}

export interface IssueContext {
    id: string;
    scan_id: string;
    title: string;
    description: string;
    severity: string;
    category: string;
    file_path: string;
    line_number: number;
    code_snippet?: string;
    fix_suggestion?: string;
    ai_prompt?: string;
}

export interface UserScanContext {
    hasScans: boolean;
    scanCount: number;
    scans: ScanContext[];
    activeScan?: {
        scan: ScanContext;
        issues: IssueContext[];
    };
}

/**
 * Load all scans for a user with optional active scan details
 */
export async function loadUserScans(
    userId: string,
    activeScanId?: string | null
): Promise<UserScanContext> {
    // Get user's profile to check both user_id and email-based scans
    const { data: profile } = await supabaseService
        .from('profiles')
        .select('id, email')
        .eq('id', userId)
        .maybeSingle();

    const possibleUserIds = [userId];
    if (profile?.id && profile.id !== userId) possibleUserIds.push(profile.id);

    // Fetch all completed scans for this user
    let scans: any[] = [];
    for (const uid of possibleUserIds) {
        const { data } = await supabaseService
            .from('scans')
            .select('*')
            .eq('user_id', uid)
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(20);

        if (data && data.length > 0) {
            scans = data;
            break;
        }
    }

    if (!scans || scans.length === 0) {
        return {
            hasScans: false,
            scanCount: 0,
            scans: []
        };
    }

    // Format scans
    const formattedScans: ScanContext[] = scans.map(scan => ({
        id: scan.id,
        repo_url: scan.repo_url,
        repo_name: scan.repo_url?.split('/').slice(-2).join('/') || 'Unknown',
        score: scan.score,
        total_issues: scan.total_issues || 0,
        status: scan.status,
        created_at: scan.created_at,
        completed_at: scan.completed_at,
        severity_counts: scan.severity_counts || { critical: 0, high: 0, medium: 0, low: 0 }
    }));

    // If there's an active scan, fetch its full details including issues
    let activeScan = undefined;
    if (activeScanId) {
        const targetScan = formattedScans.find(s => s.id === activeScanId);
        if (targetScan) {
            const { data: issues } = await supabaseService
                .from('issues')
                .select('*')
                .eq('scan_id', activeScanId)
                .order('severity', { ascending: false });

            activeScan = {
                scan: targetScan,
                issues: (issues || []).map(issue => ({
                    id: issue.id,
                    scan_id: issue.scan_id,
                    title: issue.title,
                    description: issue.description,
                    severity: issue.severity,
                    category: issue.category,
                    file_path: issue.file_path || '',
                    line_number: issue.line_number || 0,
                    code_snippet: issue.code_snippet,
                    fix_suggestion: issue.fix_suggestion,
                    ai_prompt: issue.ai_prompt
                }))
            };
        }
    }

    return {
        hasScans: true,
        scanCount: scans.length,
        scans: formattedScans,
        activeScan
    };
}

/**
 * Build a text context string for the AI based on scan data
 * This is what gets injected into the system prompt
 */
export function buildScanContextString(context: UserScanContext): string {
    if (!context.hasScans || context.scans.length === 0) {
        return `
# USER SCAN CONTEXT

The user has NOT scanned any repositories yet.

You MUST tell them honestly that you don't have any scan data to reference.

Example response:
"I don't see any scans in your history yet. Want to scan a repo so I can analyze it for you?"
`;
    }

    let result = `
# USER SCAN CONTEXT

The user has ${context.scanCount} completed scan(s):

`;

    // List all scans
    context.scans.forEach((scan, i) => {
        const critical = scan.severity_counts?.critical || 0;
        const high = scan.severity_counts?.high || 0;
        const medium = scan.severity_counts?.medium || 0;
        const low = scan.severity_counts?.low || 0;

        result += `${i + 1}. **${scan.repo_name}**
   - Scan ID: ${scan.id}
   - Score: ${scan.score ?? 'N/A'}/100
   - Total Issues: ${scan.total_issues}
   - Critical: ${critical} | High: ${high} | Medium: ${medium} | Low: ${low}
   - Scanned: ${new Date(scan.created_at).toLocaleDateString()}

`;
    });

    // If there's an active scan being discussed, add full details
    if (context.activeScan) {
        const { scan, issues } = context.activeScan;
        const critical = issues.filter(i => i.severity === 'critical').length;
        const high = issues.filter(i => i.severity === 'high').length;

        result += `
---

# ACTIVE SCAN: ${scan.repo_name}

You are currently discussing THIS specific scan. You have COMPLETE knowledge of this codebase.

**Scan Summary:**
- Repository: ${scan.repo_url}
- Score: ${scan.score ?? 'N/A'}/100
- Total Issues: ${issues.length}
- Critical: ${critical} | High: ${high}

## All Issues Found (${issues.length})

`;

        if (issues.length === 0) {
            result += "No issues were found in this scan. Great job!\n";
        } else {
            // Show top issues (first 10)
            issues.slice(0, 10).forEach((issue, i) => {
                result += `### Issue ${i + 1}: ${issue.title} [${issue.severity.toUpperCase()}]

**Category:** ${issue.category}
**File:** ${issue.file_path}${issue.line_number ? ':' + issue.line_number : ''}

**Description:**
${issue.description?.substring(0, 300)}${issue.description?.length > 300 ? '...' : ''}

`;

                if (issue.code_snippet) {
                    result += `**Vulnerable Code:**
\`\`\`
${issue.code_snippet.substring(0, 500)}${issue.code_snippet.length > 500 ? '...' : ''}
\`\`\`

`;
                }

                if (issue.fix_suggestion) {
                    result += `**How to Fix:**
${issue.fix_suggestion.substring(0, 400)}${issue.fix_suggestion.length > 400 ? '...' : ''}

`;
                }

                result += "---\n\n";
            });

            if (issues.length > 10) {
                result += `*... and ${issues.length - 10} more issues*\n\n`;
            }
        }

        result += "You have COMPLETE context for this scan. Reference specific files, issues, and code when answering.\n";
    }

    return result;
}

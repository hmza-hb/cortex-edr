// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTEXT COMPRESSOR — Token-efficient formatting
// Converts rich Supabase data into compressed text
// that preserves information density.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ChatIntent } from './intent-classifier';
import type { RetrievedContext, IssueContext, ScanStats } from './context-retriever';

// ── Token budget per context type ───────────────────

const TOKEN_BUDGETS: Record<string, number> = {
    scanMeta: 50,
    issues: 2500,       // Increased for Multi-Hop full file content RAG
    issuesFix: 3000,    // Elevated for fix guidance
    stats: 100,
    architecture: 800,
};

// ── Rough token estimator ───────────────────────────

function estimateTokens(text: string): number {
    // ~4 chars per token is a reasonable average for English + code
    return Math.ceil(text.length / 4);
}

// ── Compress scan metadata ──────────────────────────

function compressScanMeta(meta: RetrievedContext['scanMeta']): string {
    if (!meta) return '';
    const repoName = meta.repoUrl.split('/').slice(-2).join('/');
    const score = meta.score != null ? `${meta.score}/100` : 'not scored';
    const date = new Date(meta.scannedAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
    return `Repo: ${repoName} | Score: ${score} | Scanned: ${date} | Status: ${meta.status}`;
}

// ── Compress issues for vulnerability detail ────────

function compressIssuesForDetail(issues: IssueContext[], tokenBudget: number): string {
    if (issues.length === 0) return 'No matching issues found in scan data.';

    const lines: string[] = [];
    let currentTokens = 0;

    for (const issue of issues) {
        const severity = issue.severity.toUpperCase();
        const location = issue.filePath
            ? `${issue.filePath}${issue.lineNumber ? `:${issue.lineNumber}` : ''}`
            : 'unknown location';

        let line = `[${severity}] ${issue.title} in ${location}`;
        if (issue.description) {
            line += `\n  → ${truncate(issue.description, 150)}`;
        }
        if (issue.fullFileContent) {
            line += `\n\n--- 📄 FULL FILE CONTEXT (${issue.filePath}) ---\n\`\`\`\n${issue.fullFileContent}\n\`\`\`\n-----------------------------------------`;
        }

        const lineTokens = estimateTokens(line);
        if (currentTokens + lineTokens > tokenBudget && currentTokens > 0) break; // Ensure at least 1 issue is allowed

        lines.push(line);
        currentTokens += lineTokens;
    }

    return lines.join('\n\n');
}

// ── Compress issues for fix guidance ────────────────

function compressIssuesForFix(issues: IssueContext[], tokenBudget: number): string {
    if (issues.length === 0) return 'No matching issues found in scan data.';

    const lines: string[] = [];
    let currentTokens = 0;

    for (const issue of issues) {
        const severity = issue.severity.toUpperCase();
        const location = issue.filePath
            ? `${issue.filePath}${issue.lineNumber ? `:${issue.lineNumber}` : ''}`
            : 'unknown location';

        let line = `[${severity}] ${issue.title} in ${location}`;

        if (issue.description) {
            line += `\n  Problem: ${truncate(issue.description, 120)}`;
        }
        if (issue.codeSnippet) {
            line += `\n  Code: \`${truncate(issue.codeSnippet, 200)}\``;
        }
        if (issue.fixSuggestion) {
            line += `\n  Suggested Fix: ${truncate(issue.fixSuggestion, 200)}`;
        }
        if (issue.fullFileContent) {
            line += `\n\n--- 📄 FULL FILE CONTEXT (${issue.filePath}) ---\n\`\`\`\n${issue.fullFileContent}\n\`\`\`\n-----------------------------------------`;
        }

        const lineTokens = estimateTokens(line);
        if (currentTokens + lineTokens > tokenBudget && currentTokens > 0) break; // Ensure at least 1 issue is allowed

        lines.push(line);
        currentTokens += lineTokens;
    }

    return lines.join('\n\n');
}

// ── Compress issues for overview (titles only) ──────

function compressIssuesForOverview(issues: IssueContext[]): string {
    if (issues.length === 0) return '';

    return 'Top findings:\n' + issues
        .map(i => `• [${i.severity.toUpperCase()}] ${i.title}`)
        .join('\n');
}

// ── Compress scan stats ─────────────────────────────

function compressStats(stats: ScanStats): string {
    const sevParts = Object.entries(stats.severityBreakdown)
        .sort((a, b) => severityRank(a[0]) - severityRank(b[0]))
        .map(([sev, count]) => `${count} ${sev}`)
        .join(', ');

    const catParts = Object.entries(stats.categoryBreakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([cat, count]) => `${cat}: ${count}`)
        .join(', ');

    let result = `${stats.scanCount} scan(s) | Avg score: ${stats.avgScore}/100 | ${stats.totalIssues} total issues`;
    if (sevParts) result += `\nBy severity: ${sevParts}`;
    if (catParts) result += `\nTop categories: ${catParts}`;

    return result;
}

// ── Compress architecture report ────────────────────

function compressArchitecture(report: any, tokenBudget: number): string {
    if (!report) return 'No architecture analysis available.';

    const text = typeof report === 'string' ? report : JSON.stringify(report, null, 0);
    return truncate(text, tokenBudget * 4); // ~4 chars per token
}

// ── Helpers ─────────────────────────────────────────

function truncate(text: string, maxChars: number): string {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars - 3) + '...';
}

function severityRank(severity: string): number {
    const ranks: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return ranks[severity.toLowerCase()] ?? 4;
}

// ── Main compressor ─────────────────────────────────

export function compressContext(context: RetrievedContext, intent: ChatIntent): string {
    if (context.isEmpty && !context.scanMeta) {
        return '';
    }

    const parts: string[] = [];

    // Scan metadata (always included if available)
    if (context.scanMeta) {
        parts.push(compressScanMeta(context.scanMeta));
    }

    // Intent-specific compression
    switch (intent) {
        case 'vulnerability_detail':
            if (context.issues) {
                parts.push(compressIssuesForDetail(context.issues, TOKEN_BUDGETS.issues));
            }
            break;

        case 'fix_guidance':
            if (context.issues) {
                parts.push(compressIssuesForFix(context.issues, TOKEN_BUDGETS.issuesFix));
            }
            break;

        case 'repo_overview':
            if (context.scanStats) {
                parts.push(compressStats(context.scanStats));
            }
            if (context.issues) {
                parts.push(compressIssuesForOverview(context.issues));
            }
            break;

        case 'architecture_advice':
            if (context.scanStats) {
                parts.push(compressStats(context.scanStats));
            }
            if (context.architectureReport) {
                parts.push(compressArchitecture(context.architectureReport, TOKEN_BUDGETS.architecture));
            }
            break;

        case 'greeting':
            if (context.scanStats) {
                // Very minimal for greetings
                const s = context.scanStats;
                parts.push(`${s.totalIssues} issues found across ${s.scanCount} scan(s), avg score: ${s.avgScore}/100`);
            }
            break;

        case 'followup':
            if (context.issues) {
                parts.push(compressIssuesForDetail(context.issues, TOKEN_BUDGETS.issues));
            }
            break;
    }

    if (parts.length === 0) return '';

    return parts.join('\n');
}

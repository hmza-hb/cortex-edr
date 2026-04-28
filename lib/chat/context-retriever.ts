// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTEXT RETRIEVER — Intent-driven data fetching
// Fetches ONLY the Supabase data relevant to the
// classified intent, instead of dumping everything.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { supabaseService } from '@/lib/supabase/service';
import { parseGitHubUrl } from '@/lib/agents/pipeline';
import type { ChatIntent } from './intent-classifier';

// ── Types ───────────────────────────────────────────

export interface RetrievedContext {
    type: ChatIntent;
    scanMeta?: {
        repoUrl: string;
        score: number | null;
        status: string;
        scannedAt: string;
        scanId: string;
    };
    issues?: IssueContext[];
    scanStats?: ScanStats;
    architectureReport?: any;
    isEmpty: boolean;
}

export interface IssueContext {
    id: string;
    severity: string;
    category: string;
    title: string;
    description: string | null;
    filePath: string | null;
    lineNumber: number | null;
    codeSnippet: string | null;
    fixSuggestion: string | null;
    aiPrompt: string | null;
    fullFileContent?: string | null;
}

export interface ScanStats {
    scanCount: number;
    avgScore: number;
    totalIssues: number;
    severityBreakdown: Record<string, number>;
    categoryBreakdown: Record<string, number>;
}

// ── Resolve scan user IDs ───────────────────────────

async function resolveScanUserIds(userId: string, email?: string): Promise<string[]> {
    const ids = [userId];

    if (email) {
        const { data: profile } = await supabaseService
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (profile?.id && profile.id !== userId) {
            ids.push(profile.id);
        }
    }

    return ids;
}

// ── Find the active scan ────────────────────────────

async function findActiveScan(
    userIds: string[],
    scanId?: string | null
): Promise<{ id: string; repo_url: string; score: number | null; status: string; created_at: string } | null> {
    // If a specific scan was requested, try to find it
    if (scanId) {
        const { data } = await supabaseService
            .from('scans')
            .select('id, repo_url, score, status, created_at')
            .eq('id', scanId)
            .in('user_id', userIds) // FIXED: Enforce ownership check to prevent Chat IDOR
            .single();

        if (data) return data;
    }

    // Otherwise, find the most recent completed scan
    for (const uid of userIds) {
        const { data } = await supabaseService
            .from('scans')
            .select('id, repo_url, score, status, created_at')
            .eq('user_id', uid)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (data) return data;
    }

    return null;
}

// ── Retrieve issues by keyword search ───────────────

async function searchIssues(
    scanId: string,
    keywords: string[],
    limit: number = 5
): Promise<IssueContext[]> {
    // Build a text-search filter using keywords
    // We search across title, description, and file_path
    let query = supabaseService
        .from('issues')
        .select('id, severity, category, title, description, file_path, line_number, code_snippet, fix_suggestion, ai_prompt')
        .eq('scan_id', scanId)
        .order('severity', { ascending: true }); // critical first

    // If we have keywords, try to filter with ilike on title/description
    if (keywords.length > 0) {
        // Use OR filter across title and description for each keyword
        const filters = keywords
            .slice(0, 3) // limit to 3 keywords to avoid overly complex queries
            .map(kw => `title.ilike.%${kw}%,description.ilike.%${kw}%,file_path.ilike.%${kw}%`)
            .join(',');

        query = query.or(filters);
    }

    const { data } = await query.limit(limit);

    if (!data || data.length === 0) {
        // Fallback: get top issues by severity if keyword search found nothing
        const { data: fallback } = await supabaseService
            .from('issues')
            .select('id, severity, category, title, description, file_path, line_number, code_snippet, fix_suggestion, ai_prompt')
            .eq('scan_id', scanId)
            .order('severity', { ascending: true })
            .limit(limit);

        return (fallback || []).map(mapIssue);
    }

    return data.map(mapIssue);
}

// ── Retrieve top critical issues (titles only) ──────

async function getTopCriticalIssues(
    scanId: string,
    limit: number = 5
): Promise<IssueContext[]> {
    const { data } = await supabaseService
        .from('issues')
        .select('id, severity, category, title, description, file_path, line_number, code_snippet, fix_suggestion, ai_prompt')
        .eq('scan_id', scanId)
        .in('severity', ['critical', 'high'])
        .order('severity', { ascending: true })
        .limit(limit);

    return (data || []).map(mapIssue);
}

// ── Retrieve scan stats ─────────────────────────────

async function getScanStats(userIds: string[]): Promise<ScanStats> {
    let scans: any[] = [];

    for (const uid of userIds) {
        const { data } = await supabaseService
            .from('scans')
            .select('id, score')
            .eq('user_id', uid)
            .order('created_at', { ascending: false })
            .limit(10);

        if (data && data.length > 0) {
            scans = data;
            break;
        }
    }

    const scanCount = scans.length;
    const validScores = scans.filter(s => s.score != null).map(s => Number(s.score));
    const avgScore = validScores.length > 0
        ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
        : 0;

    // Get issue breakdown from all scans
    const scanIds = scans.map(s => s.id);
    const severityBreakdown: Record<string, number> = {};
    const categoryBreakdown: Record<string, number> = {};
    let totalIssues = 0;

    if (scanIds.length > 0) {
        const { data: issues } = await supabaseService
            .from('issues')
            .select('severity, category')
            .in('scan_id', scanIds);

        if (issues) {
            totalIssues = issues.length;
            for (const issue of issues) {
                const sev = (issue.severity || 'unknown').toLowerCase();
                const cat = (issue.category || 'unknown').toLowerCase();
                severityBreakdown[sev] = (severityBreakdown[sev] || 0) + 1;
                categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
            }
        }
    }

    return { scanCount, avgScore, totalIssues, severityBreakdown, categoryBreakdown };
}

// ── Retrieve architecture report ────────────────────

async function getArchitectureReport(scanId: string): Promise<any | null> {
    const { data } = await supabaseService
        .from('scans')
        .select('enterprise_report, summary')
        .eq('id', scanId)
        .single();

    if (!data) return null;

    // Try enterprise_report first (richer), then summary
    const report = data.enterprise_report || data.summary;
    if (!report) return null;

    // Extract architecture-related sections if the report is structured
    if (typeof report === 'object' && report !== null) {
        return report.architecture || report.design || report;
    }

    return report;
}

// ── Issue mapper ────────────────────────────────────

function mapIssue(raw: any): IssueContext {
    return {
        id: raw.id,
        severity: (raw.severity || 'unknown').toLowerCase(),
        category: (raw.category || 'unknown').toLowerCase(),
        title: raw.title || 'Untitled issue',
        description: raw.description || null,
        filePath: raw.file_path || null,
        lineNumber: raw.line_number || null,
        codeSnippet: raw.code_snippet || null,
        fixSuggestion: raw.fix_suggestion || null,
        aiPrompt: raw.ai_prompt || null,
    };
}

// ── File Content Fetcher (Multi-Hop RAG) ────────────

async function enrichIssuesWithFiles(issues: IssueContext[], repoUrl: string): Promise<IssueContext[]> {
    if (issues.length === 0) return issues;

    try {
        const { owner, repo } = parseGitHubUrl(repoUrl);
        // Defaulting to main branch for live file fetches. 
        // In a perfect world, we'd store the branch in 'scans', but 'main' catches 95% of cases.
        const branch = 'main';
        const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;

        // Only fetch files for the top 2 issues to avoid blowing up the context window
        const toEnrich = issues.slice(0, 2);

        await Promise.all(toEnrich.map(async (issue) => {
            if (!issue.filePath) return;
            try {
                const resp = await fetch(`${rawBase}/${issue.filePath}`);
                if (resp.ok) {
                    const text = await resp.text();
                    // Optional: Truncate to max 4000 chars to save tokens, centered around the line number if possible
                    if (text.length > 5000) {
                        issue.fullFileContent = "(File too large, omitting full content but snippet is available)";
                    } else {
                        issue.fullFileContent = text;
                    }
                }
            } catch (err) {
                console.error(`[ContextRetriever] Failed to fetch file ${issue.filePath}`, err);
            }
        }));
    } catch (err) {
        console.warn("[ContextRetriever] Could not parse repo URL for secondary fetch", err);
    }

    return issues;
}

// ── Main retriever ──────────────────────────────────

export async function retrieveContext(
    intent: ChatIntent,
    keywords: string[],
    params: {
        userId: string;
        scanId?: string | null;
        email?: string;
    }
): Promise<RetrievedContext> {
    const userIds = await resolveScanUserIds(params.userId, params.email);

    // For intents that don't need scan data, return early
    if (!needsScanData(intent)) {
        return { type: intent, isEmpty: false };
    }

    // Find the active scan
    const scan = await findActiveScan(userIds, params.scanId);

    if (!scan) {
        return { type: intent, isEmpty: true };
    }

    const scanMeta = {
        repoUrl: scan.repo_url,
        score: scan.score,
        status: scan.status,
        scannedAt: scan.created_at,
        scanId: scan.id,
    };

    switch (intent) {
        case 'vulnerability_detail': {
            const issues = await searchIssues(scan.id, keywords, 5);
            const enriched = await enrichIssuesWithFiles(issues, scan.repo_url);
            return { type: intent, scanMeta, issues: enriched, isEmpty: enriched.length === 0 };
        }

        case 'fix_guidance': {
            // For fix guidance, fetch issues with full detail including fix suggestions
            const issues = await searchIssues(scan.id, keywords, 3);
            const enriched = await enrichIssuesWithFiles(issues, scan.repo_url);
            return { type: intent, scanMeta, issues: enriched, isEmpty: enriched.length === 0 };
        }

        case 'repo_overview': {
            const [stats, topIssues] = await Promise.all([
                getScanStats(userIds),
                getTopCriticalIssues(scan.id, 5),
            ]);
            return { type: intent, scanMeta, scanStats: stats, issues: topIssues, isEmpty: false };
        }

        case 'architecture_advice': {
            const report = await getArchitectureReport(scan.id);
            const stats = await getScanStats(userIds);
            return {
                type: intent,
                scanMeta,
                architectureReport: report,
                scanStats: stats,
                isEmpty: !report && stats.totalIssues === 0,
            };
        }

        case 'greeting': {
            // Lightweight: just scan meta + basic stats
            const stats = await getScanStats(userIds);
            return { type: intent, scanMeta, scanStats: stats, isEmpty: false };
        }

        case 'followup': {
            // For follow-ups, fetch issues matching keywords if any
            const issues = keywords.length > 0
                ? await searchIssues(scan.id, keywords, 3)
                : await getTopCriticalIssues(scan.id, 3);
            const enriched = await enrichIssuesWithFiles(issues, scan.repo_url);
            return { type: intent, scanMeta, issues: enriched, isEmpty: enriched.length === 0 };
        }

        default:
            return { type: intent, isEmpty: true };
    }
}

function needsScanData(intent: ChatIntent): boolean {
    return ![
        'security_education',
        'founder_info',
        'product_question',
    ].includes(intent);
}

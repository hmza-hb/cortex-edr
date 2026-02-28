import { supabaseService } from '@/lib/supabase/service';

export interface CortexMegaContext {
    user: {
        userId: string;
        email?: string;
        name?: string;
    };
    profile?: any;
    stats: {
        scanCount: number;
        avgScore: number;
        totalIssues: number;
        highRiskIssues: number;
        lastScan?: {
            id: string;
            repo_url: string;
            score: number | null;
            created_at: string;
            status: string;
        };
    };
    recentScans: Array<{
        id: string;
        repo_url: string;
        score: number | null;
        created_at: string;
        status: string;
    }>;
    topIssueSignals: {
        severities: Record<string, number>;
        categories: Record<string, number>;
    };
    detailedScan?: {
        id: string;
        repo_url: string;
        score: number | null;
        status: string;
        issues: Array<{
            id: string;
            category: string;
            severity: string;
            title: string;
            description: string;
            file_path: string;
            line_number: number;
            code_snippet?: string;
            fix_suggestion?: string;
        }>;
        files: Array<{
            path: string;
            size: number;
            type: string;
            last_modified: string;
        }>;
        structure: {
            directories: string[];
            file_types: Record<string, number>;
            total_files: number;
            total_size: number;
        };
    };
}

function safeNumber(n: any): number {
    const v = Number(n);
    return Number.isFinite(v) ? v : 0;
}

export async function buildMegaContext(params: {
    userId: string;
    email?: string;
    name?: string;
    scanId?: string | null;
}): Promise<CortexMegaContext> {
    const { userId, email, name, scanId } = params;

    // Profile is sometimes keyed by email in the app (until full ID sync is stable)
    const { data: profileByEmail } = email
        ? await supabaseService
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle()
        : { data: null };

    const profile = profileByEmail || null;

    // Determine which identifier is stored in scans.user_id in this deployment.
    // In some environments it is the Clerk userId string; in others it may be a UUID.
    const possibleScanUserIds = [userId];
    if (profile?.id && profile.id !== userId) possibleScanUserIds.push(profile.id);

    // Fetch recent scans
    let scans: any[] = [];
    for (const scanUserId of possibleScanUserIds) {
        const { data } = await supabaseService
            .from('scans')
            .select('id, repo_url, score, created_at, status')
            .eq('user_id', scanUserId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (data && data.length > 0) {
            scans = data;
            break;
        }
    }

    const scanCount = scans.length;
    const avgScore = scanCount
        ? Math.round(scans.reduce((acc, s) => acc + safeNumber(s.score), 0) / scanCount)
        : 0;

    const recentScans = scans.slice(0, 5);
    const lastScan = recentScans[0];

    // Pull issues for recent scans only (keep it light)
    const scanIds = recentScans.map(s => s.id);
    const severities: Record<string, number> = {};
    const categories: Record<string, number> = {};

    let totalIssues = 0;
    let highRiskIssues = 0;

    if (scanIds.length > 0) {
        const { data: issues } = await supabaseService
            .from('issues')
            .select('severity, category')
            .in('scan_id', scanIds);

        if (issues) {
            totalIssues = issues.length;
            for (const i of issues) {
                const sev = (i.severity || 'unknown').toLowerCase();
                const cat = (i.category || 'unknown').toLowerCase();
                severities[sev] = (severities[sev] || 0) + 1;
                categories[cat] = (categories[cat] || 0) + 1;
                if (sev === 'critical' || sev === 'high') highRiskIssues++;
            }
        }
    }

    // If scanId was provided, prefer that as the “current focus”
    const focusScan = scanId
        ? recentScans.find(s => s.id === scanId) || lastScan
        : lastScan;

    let detailedScan: any = undefined;

    // Load detailed scan data if scanId is provided
    if (scanId && focusScan) {
        // Load detailed issues
        const { data: detailedIssues } = await supabaseService
            .from('issues')
            .select('id, category, severity, title, description, file_path, line_number, code_snippet, fix_suggestion')
            .eq('scan_id', scanId)
            .order('severity', { ascending: false })
            .order('category', { ascending: true })
            .limit(100); // Limit to prevent context bloat

        // Load file structure data (if available)
        const { data: files } = await supabaseService
            .from('scan_files')
            .select('path, size, type, last_modified')
            .eq('scan_id', scanId)
            .order('path', { ascending: true })
            .limit(200);

        // Calculate structure stats
        const fileTypes: Record<string, number> = {};
        let totalSize = 0;
        const directories = new Set<string>();

        if (files) {
            files.forEach(file => {
                // Extract file extension/type
                const ext = file.path.split('.').pop()?.toLowerCase() || 'unknown';
                fileTypes[ext] = (fileTypes[ext] || 0) + 1;
                totalSize += file.size || 0;

                // Extract directory path
                const dirPath = file.path.substring(0, file.path.lastIndexOf('/'));
                if (dirPath) directories.add(dirPath);
            });
        }

        detailedScan = {
            id: focusScan.id,
            repo_url: focusScan.repo_url,
            score: focusScan.score,
            status: focusScan.status,
            issues: (detailedIssues || []).map(issue => ({
                id: issue.id,
                category: issue.category || 'unknown',
                severity: issue.severity || 'unknown',
                title: issue.title || 'Issue found',
                description: issue.description || '',
                file_path: issue.file_path || '',
                line_number: issue.line_number || 0,
                code_snippet: issue.code_snippet,
                fix_suggestion: issue.fix_suggestion
            })),
            files: (files || []).map(file => ({
                path: file.path,
                size: file.size || 0,
                type: file.type || 'file',
                last_modified: file.last_modified || ''
            })),
            structure: {
                directories: Array.from(directories),
                file_types: fileTypes,
                total_files: files?.length || 0,
                total_size: totalSize
            }
        };
    }

    return {
        user: { userId, email, name },
        profile: profile || undefined,
        stats: {
            scanCount,
            avgScore,
            totalIssues,
            highRiskIssues,
            lastScan: focusScan
                ? {
                    id: focusScan.id,
                    repo_url: focusScan.repo_url,
                    score: focusScan.score ?? null,
                    created_at: focusScan.created_at,
                    status: focusScan.status
                }
                : undefined
        },
        recentScans,
        topIssueSignals: {
            severities,
            categories
        },
        detailedScan
    };
}

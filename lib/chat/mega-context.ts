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
        }
    };
}

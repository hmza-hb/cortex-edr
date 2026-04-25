import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAuditLog } from '@/lib/security/auditLog';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: scanId } = await params;

    if (!scanId) {
        return NextResponse.json({ error: 'Scan ID is required' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        await createAuditLog({ action: 'scan_results_blocked', actor_id: 'anonymous', resource_id: scanId, status: 'denied' });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    try {
        // 1. Fetch scan metadata
        const { data: scan, error: scanError } = await supabaseService
            .from('scans')
            .select('*')
            .eq('id', scanId)
            .single();

        if (scanError || !scan) {
            console.error(`[RESULTS API] Scan ${scanId} not found or error:`, scanError);
            return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
        }

        // Enforce access control
        if (scan.user_id !== userId) {
            await createAuditLog({ action: 'scan_results_blocked', actor_id: userId, actor_email: session.user.email || undefined, resource_id: scanId, status: 'denied' });
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Fetch user profile for tier info
        let userTier = 'SCOUT';
        if (scan.user_id) {
            const { data: profile } = await supabaseService
                .from('profiles')
                .select('plan_tier')
                .eq('id', scan.user_id)
                .single();

            if (profile) {
                const rawTier = (profile.plan_tier || 'SCOUT').toUpperCase();
                if (rawTier === 'SCOUT' || rawTier === 'VIBE_CODER' || rawTier === 'FREE') userTier = 'SCOUT';
                else if (rawTier === 'SENTINEL' || rawTier === 'DEVELOPER' || rawTier === 'STARTER') userTier = 'SENTINEL';
                else if (rawTier === 'GUARDIAN' || rawTier === 'TEAMS' || rawTier === 'PROFESSIONAL') userTier = 'GUARDIAN';
                else if (rawTier === 'FORTRESS' || rawTier === 'ENTERPRISE') userTier = 'FORTRESS';
            }
        }

        // 2. Fetch issues
        const { data: issues, error: issuesError } = await supabaseService
            .from('issues')
            .select('*')
            .eq('scan_id', scanId);

        if (issuesError) throw issuesError;

        // 3. Parse summary if exists
        let summary = {};
        // Summary is now a plain string, not JSON
        if (scan.summary) {
            summary = typeof scan.summary === 'string' ? scan.summary : JSON.stringify(scan.summary);
        }

        return NextResponse.json({
            scan: {
                ...scan,
                summary,
                tier: userTier
            },
            issues
        });
    } catch (error) {
        console.error('Failed to fetch scan results:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

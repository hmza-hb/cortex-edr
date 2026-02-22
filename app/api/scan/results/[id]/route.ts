import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: scanId } = await params;

    if (!scanId) {
        return NextResponse.json({ error: 'Scan ID is required' }, { status: 400 });
    }

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

        // 2. Fetch user profile for tier info
        let userTier = 'VIBE_CODER';
        if (scan.user_id) {
            const { data: profile } = await supabaseService
                .from('profiles')
                .select('tier, plan_tier')
                .eq('id', scan.user_id)
                .single();

            if (profile) {
                if (profile.tier) {
                    userTier = profile.tier;
                } else if (profile.plan_tier) {
                    if (profile.plan_tier === 'free') userTier = 'VIBE_CODER';
                    else if (profile.plan_tier === 'starter') userTier = 'DEVELOPER';
                    else if (profile.plan_tier === 'professional') userTier = 'TEAMS';
                    else userTier = 'ENTERPRISE';
                }
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

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseService } from '@/lib/supabase/service';

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Determine which identifier is stored in scans.user_id
        const { data: profile } = await supabaseService
            .from('profiles')
            .select('id')
            .eq('email', req.headers.get('email') || '')
            .maybeSingle();

        const possibleScanUserIds = [userId];
        if (profile?.id && profile.id !== userId) possibleScanUserIds.push(profile.id);

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

        return NextResponse.json({
            scans: scans.map(scan => ({
                id: scan.id,
                repo_url: scan.repo_url,
                score: scan.score,
                created_at: scan.created_at,
                status: scan.status
            }))
        });
    } catch (error) {
        console.error('[Recent Scans API Error]:', error);
        return NextResponse.json({ error: 'Failed to fetch recent scans' }, { status: 500 });
    }
}

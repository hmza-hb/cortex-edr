import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseService } from '@/lib/supabase/service';

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Get profile to determine user ID mapping
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
                .limit(20);

            if (data && data.length > 0) {
                scans = data.map(scan => ({
                    ...scan,
                    title: scan.repo_url.split('/').slice(-2).join('/'),
                }));
                break;
            }
        }

        return NextResponse.json({ scans });
    } catch (error) {
        console.error('[Scans API Error]:', error);
        return NextResponse.json({ error: 'Failed to load scans' }, { status: 500 });
    }
}

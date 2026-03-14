import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { supabaseService } from '@/lib/supabase/service';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;

    try {
        const { data: scans, error } = await supabaseService
            .from('scans')
            .select('id, repo_url, score, created_at, status')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        const formattedScans = (scans || []).map(scan => ({
            ...scan,
            title: scan.repo_url.split('/').slice(-2).join('/'),
        }));

        return NextResponse.json({ scans: formattedScans });
    } catch (error) {
        console.error('[Scans API Error]:', error);
        return NextResponse.json({ error: 'Failed to load scans' }, { status: 500 });
    }
}

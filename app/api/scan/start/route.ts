import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';
import { inngest } from '@/lib/inngest/client';

// maxDuration kept for when you upgrade to Vercel Pro (pipeline needs long runtime)
export const maxDuration = 300;

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repo_url } = await req.json();
    if (!repo_url) {
        return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
    }

    try {
        // 1. Check user plan and limits
        const { data: profile } = await supabase
            .from('profiles')
            .select('scans_remaining')
            .eq('id', user.id)
            .single();

        if (!profile || profile.scans_remaining <= 0) {
            return NextResponse.json({ error: 'Monthly scan limit reached. Please upgrade.' }, { status: 403 });
        }

        // 2. Create scan record
        const { data: scan, error: scanError } = await supabaseService
            .from('scans')
            .insert({
                user_id: user.id,
                repo_url,
                repo_name: repo_url.split('/').slice(-2).join('/'),
                status: 'pending',
                current_agent: 0
            })
            .select()
            .single();

        if (scanError) throw scanError;

        // 3. Decrement scans remaining
        await supabaseService
            .from('profiles')
            .update({ scans_remaining: profile.scans_remaining - 1 })
            .eq('id', user.id);

        // 4. Trigger pipeline via Inngest (not after() — Inngest bypasses Vercel's 10s limit)
        await inngest.send({
            name: 'scan/start',
            data: { scanId: scan.id, repoUrl: repo_url }
        });

        return NextResponse.json({ scan_id: scan.id });
    } catch (error) {
        console.error('Failed to start scan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

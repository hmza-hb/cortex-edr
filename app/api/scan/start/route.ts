import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.cortex-edr.com';

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
        const { data: profile } = await supabase
            .from('profiles')
            .select('scans_remaining')
            .eq('id', user.id)
            .single();

        if (!profile || profile.scans_remaining <= 0) {
            return NextResponse.json({ error: 'Monthly scan limit reached. Please upgrade.' }, { status: 403 });
        }

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

        await supabaseService
            .from('profiles')
            .update({ scans_remaining: profile.scans_remaining - 1 })
            .eq('id', user.id);

        const scanId = scan.id;

        // 🚀 Trigger the direct background pipeline 
        console.log(`[START] Triggering Direct Pipeline for Scan ${scanId}`);
        try {
            // Import dynamically so it doesn't block the initial route load
            const { runPipeline } = await import('@/lib/agents/pipeline');

            // Execute in background (do not await so we can return the response instantly)
            runPipeline(scanId, repo_url).catch(err => {
                console.error(`[BACKGROUND PIPELINE ERROR] scanId=${scanId}:`, err);
            });

            console.log(`[START] Pipeline triggered successfully in the background`);
        } catch (err) {
            console.error(`[START] Failed to import/trigger pipeline:`, err);
        }
        return NextResponse.json({ scan_id: scan.id });
    } catch (error) {
        console.error('Failed to start scan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

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

        // 🚀 Trigger the durable Inngest background job
        console.log(`[START] Triggering Inngest Pipeline for Scan ${scanId}`);
        try {
            const { inngest } = await import('@/lib/inngest/client');

            // Explicitly force the event to target the production environment.
            // This prevents Vercel preview deployments from routing events into non-existent branch environments.
            const env = process.env.INNGEST_ENV || 'production';

            await inngest.send({
                name: 'scan/start',
                data: { scanId, repoUrl: repo_url },
            }, { env });

            console.log(`[START] Inngest Event Fired successfully to env: ${env}`);
        } catch (err) {
            console.error(`[START] Failed to trigger Inngest pipeline:`, err);
            // We can still proceed, but the background job won't start
        }
        return NextResponse.json({ scan_id: scan.id });
    } catch (error) {
        console.error('Failed to start scan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

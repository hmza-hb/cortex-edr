import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';
import { cloneRepository, cleanupRepository } from '@/lib/repo/cloner';
import { startScanPipeline } from '@/lib/agents/orchestrator';

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
                status: 'pending',
            })
            .select()
            .single();

        if (scanError) throw scanError;

        // 3. Increment scans used / decrement remaining
        await supabaseService
            .from('profiles')
            .update({ scans_remaining: profile.scans_remaining - 1 })
            .eq('id', user.id);

        // 4. Start pipeline in background
        // We don't await the pipeline because we want to return the scan ID immediately
        (async () => {
            try {
                const repoPath = await cloneRepository(scan.id, repo_url);
                await startScanPipeline(scan.id, repo_url, repoPath);
                await cleanupRepository(scan.id);
            } catch (err) {
                console.error(`Background scan failed for ${scan.id}:`, err);
                // Error is handled inside startScanPipeline with 'failed' status
            }
        })();

        return NextResponse.json({ scan_id: scan.id });
    } catch (error) {
        console.error('Failed to start scan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

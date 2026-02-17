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
            return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
        }

        // 2. Fetch issues
        const { data: issues, error: issuesError } = await supabaseService
            .from('issues')
            .select('*')
            .eq('scan_id', scanId);

        if (issuesError) throw issuesError;

        // 3. Parse summary if exists
        let summary = {};
        if (scan.summary) {
            try {
                summary = typeof scan.summary === 'string' ? JSON.parse(scan.summary) : scan.summary;
            } catch (e) {
                console.error('Error parsing scan summary JSON:', e);
            }
        }

        return NextResponse.json({
            scan: {
                ...scan,
                summary
            },
            issues
        });
    } catch (error) {
        console.error('Failed to fetch scan results:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from "@/lib/auth/admin";

export async function POST(request: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        const userEmail = session.user!.email!;

        const body = await request.json();
        const { targetEmail, newTier } = body;

        if (!targetEmail || !newTier) {
            return NextResponse.json(
                { error: 'Missing required fields: targetEmail and newTier' },
                { status: 400 }
            );
        }

        // Validate tier
        const validTiers = ['SCOUT', 'SENTINEL', 'GUARDIAN', 'FORTRESS'];
        if (!validTiers.includes(newTier.toUpperCase())) {
            return NextResponse.json(
                { error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Call the database function
        const { data, error } = await supabase.rpc('update_user_tier_admin', {
            p_user_email: targetEmail,
            p_new_tier: newTier.toUpperCase()
        });

        if (error) {
            console.error('Database function error:', error);
            return NextResponse.json(
                { error: 'Failed to update user tier: ' + error.message },
                { status: 500 }
            );
        }

        // Parse the JSON response from the database function
        let result;
        try {
            result = typeof data === 'string' ? JSON.parse(data) : data;
        } catch (e) {
            result = data;
        }

        if (!result?.success) {
            return NextResponse.json(
                { error: result?.error || 'Unknown error occurred' },
                { status: 400 }
            );
        }

        console.log(`Admin ${userEmail} updated user ${targetEmail} to ${newTier} tier`);

        return NextResponse.json({
            success: true,
            message: result.message || `User ${targetEmail} updated to ${newTier} tier`,
            data: result
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + (error as Error).message },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch user tier management data
export async function GET() {
    try {
        const supabase = await createClient();

        // Get user tier management view
        const { data: users, error } = await supabase
            .from('user_tier_management')
            .select('*')
            .limit(100);

        if (error) {
            console.error('Error fetching user tiers:', error);
            return NextResponse.json(
                { error: 'Failed to fetch user tiers' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            users: users || []
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + (error as Error).message },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        // Authentication: Check if user is logged in
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Authorization: Check if user is admin
        const userEmail = user.primaryEmailAddress?.emailAddress;
        if (!userEmail || userEmail !== 'hmza.hb82@gmail.com') {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { targetEmail, newTier } = body;

        if (!targetEmail || !newTier) {
            return NextResponse.json(
                { error: 'Missing required fields: targetEmail and newTier' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Debug: First check if user exists
        const { data: existingUser, error: checkError } = await supabase
            .from('profiles')
            .select('email, plan_tier')
            .eq('email', targetEmail.toLowerCase())
            .maybeSingle();

        if (checkError) {
            console.error('Error checking user:', checkError);
        }

        console.log('Looking for user with email:', targetEmail);
        console.log('Found user:', existingUser);

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found in database' },
                { status: 404 }
            );
        }

        // Update user tier
        const { data, error } = await supabase
            .from('profiles')
            .update({
                plan_tier: newTier.toUpperCase(),
                updated_at: new Date().toISOString()
            })
            .eq('email', targetEmail.toLowerCase())
            .select();

        if (error) {
            console.error('Error updating user tier:', error);
            return NextResponse.json(
                { error: 'Failed to update user tier: ' + error.message },
                { status: 500 }
            );
        }

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: 'User not found after update' },
                { status: 404 }
            );
        }

        console.log(`Admin ${userEmail} updated user ${targetEmail} to ${newTier} tier`);

        return NextResponse.json({
            success: true,
            message: `User ${targetEmail} updated to ${newTier} tier`,
            user: data[0]
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
                { error: 'Internal server error: ' + (error as Error).message },
                { status: 500 }
            );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TierId } from '@/lib/config/system';
import { currentUser } from '@clerk/nextjs/server';

// Admin email whitelist - replace with your admin emails
const ADMIN_EMAILS = [
    'hmza.hb82@gmail.com', // Replace with your actual admin email
    // Add more admin emails as needed
];

function isAdmin(email: string): boolean {
    return ADMIN_EMAILS.includes(email.toLowerCase());
}

function sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
}

function validateTier(tier: string): boolean {
    const validTiers = Object.values(TierId).map(t => t.toLowerCase());
    return validTiers.includes(tier.toLowerCase());
}

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
        if (!userEmail || !isAdmin(userEmail)) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        // Input validation and sanitization
        const body = await request.json();
        const { userEmail: targetUserEmail, newTier } = body;

        if (!targetUserEmail || !newTier) {
            return NextResponse.json(
                { error: 'Missing required fields: userEmail and newTier' },
                { status: 400 }
            );
        }

        // Sanitize and validate email
        const sanitizedEmail = sanitizeEmail(targetUserEmail);
        if (!sanitizedEmail.includes('@') || sanitizedEmail.length > 254) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate tier
        if (!validateTier(newTier)) {
            const validTiers = Object.values(TierId).map(t => t.toLowerCase());
            return NextResponse.json(
                { error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Debug: First check if user exists
        const { data: existingUser, error: checkError } = await supabase
            .from('profiles')
            .select('email, plan_tier')
            .eq('email', sanitizedEmail)
            .maybeSingle();

        if (checkError) {
            console.error('Error checking user:', checkError);
        }

        console.log('Looking for user with email:', sanitizedEmail);
        console.log('Found user:', existingUser);

        // Update user tier with sanitized inputs
        const { data, error } = await supabase
            .from('profiles')
            .update({
                plan_tier: newTier.toLowerCase(),
                updated_at: new Date().toISOString()
            })
            .eq('email', sanitizedEmail)
            .select();

        if (error) {
            console.error('Error updating user tier:', error);
            return NextResponse.json(
                { error: 'Failed to update user tier' },
                { status: 500 }
            );
        }

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Log admin action for audit trail
        console.log(`Admin ${userEmail} upgraded user ${sanitizedEmail} to ${newTier} tier`);

        return NextResponse.json({
            success: true,
            message: `User ${sanitizedEmail} upgraded to ${newTier} tier`,
            user: data[0]
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
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
        if (!userEmail || !isAdmin(userEmail)) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        const supabase = await createClient();

        // Get all users with their tiers
        const { data: users, error } = await supabase
            .from('profiles')
            .select('email, plan_tier, scans_remaining, created_at, updated_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users:', error);
            return NextResponse.json(
                { error: 'Failed to fetch users' },
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
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

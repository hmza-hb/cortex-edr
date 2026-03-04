import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TierId, SYSTEM_CONFIG } from '@/lib/config/system';
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

export async function PUT(request: NextRequest) {
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

        const body = await request.json();
        const { action, userEmail: targetUserEmail, newTier } = body;

        const supabase = await createClient();

        switch (action) {
            case 'delete_user':
                if (!targetUserEmail) {
                    return NextResponse.json(
                        { error: 'Missing user email for deletion' },
                        { status: 400 }
                    );
                }

                const { error: deleteError } = await supabase
                    .from('profiles')
                    .delete()
                    .eq('email', sanitizeEmail(targetUserEmail));

                if (deleteError) {
                    return NextResponse.json(
                        { error: 'Failed to delete user' },
                        { status: 500 }
                    );
                }

                console.log(`Admin ${userEmail} deleted user ${targetUserEmail}`);
                return NextResponse.json({
                    success: true,
                    message: `User ${targetUserEmail} deleted successfully`
                });

            case 'reset_scans':
                if (!targetUserEmail) {
                    return NextResponse.json(
                        { error: 'Missing user email for scan reset' },
                        { status: 400 }
                    );
                }

                const tierConfig = SYSTEM_CONFIG.tiers[newTier.toUpperCase() as TierId] || SYSTEM_CONFIG.tiers[TierId.VIBE_CODER];
                const scanLimit = typeof tierConfig.limits.maxScansPerMonth === 'number'
                    ? tierConfig.limits.maxScansPerMonth
                    : 1000;

                const { error: resetError } = await supabase
                    .from('profiles')
                    .update({
                        scans_remaining: scanLimit,
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', sanitizeEmail(targetUserEmail));

                if (resetError) {
                    return NextResponse.json(
                        { error: 'Failed to reset scans' },
                        { status: 500 }
                    );
                }

                console.log(`Admin ${userEmail} reset scans for ${targetUserEmail} to ${scanLimit}`);
                return NextResponse.json({
                    success: true,
                    message: `Scans reset to ${scanLimit} for ${targetUserEmail}`
                });

            case 'verify_payment':
                if (!targetUserEmail || !body.paymentAmount || !body.paymentMethod) {
                    return NextResponse.json(
                        { error: 'Missing required fields: userEmail, paymentAmount, paymentMethod' },
                        { status: 400 }
                    );
                }

                const { error: verifyError } = await supabase
                    .from('profiles')
                    .update({
                        payment_status: 'paid',
                        payment_amount: body.paymentAmount,
                        payment_date: new Date().toISOString(),
                        payment_method: body.paymentMethod,
                        payment_verified_by: userEmail,
                        payment_notes: body.notes || '',
                        billing_cycle: body.billingCycle || 'monthly',
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', sanitizeEmail(targetUserEmail));

                if (verifyError) {
                    return NextResponse.json(
                        { error: 'Failed to verify payment' },
                        { status: 500 }
                    );
                }

                // Log payment verification
                await supabase.rpc('log_payment_change', {
                    p_user_email: sanitizeEmail(targetUserEmail),
                    p_action: 'payment_verified',
                    p_amount: body.paymentAmount,
                    p_payment_method: body.paymentMethod,
                    p_notes: body.notes || '',
                    p_verified_by: userEmail
                });

                console.log(`Admin ${userEmail} verified payment for ${targetUserEmail}: $${body.paymentAmount}`);
                return NextResponse.json({
                    success: true,
                    message: `Payment verified for ${targetUserEmail}: $${body.paymentAmount}`
                });

            case 'reject_payment':
                if (!targetUserEmail) {
                    return NextResponse.json(
                        { error: 'Missing user email for payment rejection' },
                        { status: 400 }
                    );
                }

                const { error: rejectError } = await supabase
                    .from('profiles')
                    .update({
                        payment_status: 'unpaid',
                        payment_amount: 0,
                        payment_date: null,
                        payment_verified_by: null,
                        payment_notes: body.notes || 'Payment rejected',
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', sanitizeEmail(targetUserEmail));

                if (rejectError) {
                    return NextResponse.json(
                        { error: 'Failed to reject payment' },
                        { status: 500 }
                    );
                }

                // Log payment rejection
                await supabase.rpc('log_payment_change', {
                    p_user_email: sanitizeEmail(targetUserEmail),
                    p_action: 'payment_rejected',
                    p_notes: body.notes || 'Payment rejected',
                    p_verified_by: userEmail
                });

                console.log(`Admin ${userEmail} rejected payment for ${targetUserEmail}`);
                return NextResponse.json({
                    success: true,
                    message: `Payment rejected for ${targetUserEmail}`
                });

            case 'mark_pending':
                if (!targetUserEmail || !body.paymentAmount) {
                    return NextResponse.json(
                        { error: 'Missing required fields: userEmail, paymentAmount' },
                        { status: 400 }
                    );
                }

                const { error: pendingError } = await supabase
                    .from('profiles')
                    .update({
                        payment_status: 'pending',
                        payment_amount: body.paymentAmount,
                        payment_method: body.paymentMethod || 'manual',
                        payment_notes: body.notes || 'Payment pending verification',
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', sanitizeEmail(targetUserEmail));

                if (pendingError) {
                    return NextResponse.json(
                        { error: 'Failed to mark payment as pending' },
                        { status: 500 }
                    );
                }

                console.log(`Admin ${userEmail} marked payment as pending for ${targetUserEmail}: $${body.paymentAmount}`);
                return NextResponse.json({
                    success: true,
                    message: `Payment marked as pending for ${targetUserEmail}: $${body.paymentAmount}`
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

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

        // Get all users with their tiers and payment info
        const { data: users, error } = await supabase
            .from('profiles')
            .select(`
                email, 
                plan_tier, 
                scans_remaining, 
                created_at, 
                updated_at,
                id,
                payment_status,
                payment_amount,
                payment_date,
                payment_method,
                payment_verified_by,
                payment_notes,
                billing_cycle
            `)
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

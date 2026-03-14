import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from "@/lib/auth/admin";
import { TierId, SYSTEM_CONFIG } from '@/lib/config/system';

function sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
}

function validateTier(tier: string): boolean {
    const validTiers = Object.values(TierId).map(t => t.toLowerCase());
    return validTiers.includes(tier.toLowerCase());
}

export async function POST(request: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        const userEmail = session.user!.email!;

        const body = await request.json();
        const { userEmail: targetUserEmail, newTier } = body;

        if (!targetUserEmail || !newTier) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const sanitizedEmail = sanitizeEmail(targetUserEmail);
        if (!validateTier(newTier)) {
            return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('profiles')
            .update({
                plan_tier: newTier.toUpperCase(),
                updated_at: new Date().toISOString()
            })
            .eq('email', sanitizedEmail)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `User ${sanitizedEmail} upgraded to ${newTier} tier`,
            user: data[0]
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        const userEmail = session.user!.email!;

        const body = await request.json();
        const { action, userEmail: targetUserEmail, newTier } = body;
        const supabase = await createClient();

        switch (action) {
            case 'delete_user':
                const { error: deleteError } = await supabase
                    .from('profiles')
                    .delete()
                    .eq('email', sanitizeEmail(targetUserEmail));
                if (deleteError) throw deleteError;
                return NextResponse.json({ success: true, message: 'User deleted' });

            case 'reset_scans':
                const tierConfig = SYSTEM_CONFIG.tiers[newTier.toUpperCase() as TierId] || SYSTEM_CONFIG.tiers[TierId.VIBE_CODER];
                const scanLimit = tierConfig.limits.maxScansPerMonth;
                const { error: resetError } = await supabase
                    .from('profiles')
                    .update({
                        scans_remaining: scanLimit,
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', sanitizeEmail(targetUserEmail));
                if (resetError) throw resetError;
                return NextResponse.json({ success: true, message: `Scans reset to ${scanLimit}` });

            case 'verify_payment':
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
                if (verifyError) throw verifyError;
                return NextResponse.json({ success: true, message: 'Payment verified' });

            case 'reject_payment':
                const { error: rejectError } = await supabase
                    .from('profiles')
                    .update({
                        payment_status: 'unpaid',
                        payment_notes: body.notes || 'Payment rejected',
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', sanitizeEmail(targetUserEmail));
                if (rejectError) throw rejectError;
                return NextResponse.json({ success: true, message: 'Payment rejected' });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const supabase = await createClient();
        const { data: users, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ success: true, users: users || [] });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

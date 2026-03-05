import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SYSTEM_CONFIG, TierId } from '@/lib/config/system';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Fetch fresh user profile data
        const { data: profile } = await supabase
            .from("profiles")
            .select("plan_tier, scans_remaining")
            .eq("email", email.toLowerCase())
            .maybeSingle();

        if (!profile) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Convert to lowercase format that sidebar expects
        const rawTier = profile.plan_tier || "VIBE_CODER";
        const tierId = rawTier.toUpperCase() as TierId;
        const tierConfig = SYSTEM_CONFIG.tiers[tierId] || SYSTEM_CONFIG.tiers[TierId.VIBE_CODER];

        const planTier = rawTier.toLowerCase();
        const scanLimit = typeof tierConfig.limits.maxScansPerMonth === 'number'
            ? tierConfig.limits.maxScansPerMonth
            : 1000;

        const scansRemaining = profile.scans_remaining ?? scanLimit;
        const scanCount = scanLimit - scansRemaining;

        return NextResponse.json({
            success: true,
            planTier: planTier,
            scanLimit: scanLimit,
            scanCount: scanCount,
            tierConfig: tierConfig
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + (error as Error).message },
            { status: 500 }
        );
    }
}

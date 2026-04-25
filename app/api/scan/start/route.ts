import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';
import { SYSTEM_CONFIG, TierId } from '@/lib/config/system';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        console.error('[API/Scan/Start] No session found');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email?.toLowerCase();

    if (!userId || !userEmail) {
        console.error('[API/Scan/Start] Missing user info in session');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repo_url } = await req.json();
    if (!repo_url) {
        return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
    }

    console.log(`[API/Scan/Start] Debug — userId: ${userId} (${typeof userId}), userEmail: ${userEmail}`);

    try {
        console.log(`[API/Scan/Start] Initiating scan for ${userEmail} - ${repo_url}`);

        // Lookup profile by email (same as dashboard)
        const { data: profile, error: profileError } = await supabaseService
            .from('profiles')
            .select('plan_tier, scans_remaining, email')
            .eq('email', userEmail)
            .maybeSingle();

        if (profileError) {
            console.error('[API/Scan/Start] Profile fetch error:', profileError);
            throw profileError;
        }

        if (!profile) {
            console.warn(`[API/Scan/Start] No profile found for ${userEmail}. Creating temporary record or failing...`);
            // Optionally auto-create profile if missing, but better to fail and log
            return NextResponse.json({ error: 'User profile not synchronized. Please log in again.' }, { status: 403 });
        }

        console.log(`[API/Scan/Start] Found profile for ${userEmail}:`, {
            plan_tier: profile.plan_tier,
            scans_remaining: profile.scans_remaining
        });

        // Determine user's tier (fallback to TierId.SCOUT if undefined)
        let userTierKey: TierId = TierId.SCOUT;
        if (profile?.plan_tier) {
            const pt = profile.plan_tier.toUpperCase();
            if (pt === 'SCOUT' || pt === 'VIBE_CODER' || pt === 'FREE') userTierKey = TierId.SCOUT;
            else if (pt === 'SENTINEL' || pt === 'DEVELOPER' || pt === 'STARTER') userTierKey = TierId.SENTINEL;
            else if (pt === 'GUARDIAN' || pt === 'TEAMS' || pt === 'PROFESSIONAL') userTierKey = TierId.GUARDIAN;
            else if (pt === 'FORTRESS' || pt === 'ENTERPRISE') userTierKey = TierId.FORTRESS;
        }

        const tierConfig = SYSTEM_CONFIG.tiers[userTierKey] || SYSTEM_CONFIG.tiers[TierId.SCOUT];
        const scanLimit = tierConfig.limits.maxScansPerMonth;

        // Note: Currently we decrement `scans_remaining`. To be fully dynamic, 
        // we should either reset `scans_remaining` monthly or check total scans in current month.
        // For now, we keep the existing logic but ensure we respect the tier boundaries.
        if (scanLimit !== "Unlimited" && (!profile || profile.scans_remaining <= 0)) {
            // Trigger Quota Alert Email
            try {
                const { resend, SYSTEM_EMAIL, templates } = await import('@/lib/email/resend');
                const fullName = session.user.name || 'Protocol User';
                const limitEmail = templates.quotaLimit(fullName, tierConfig.name);
                await resend.emails.send({
                    from: `Cortex EDR <${SYSTEM_EMAIL}>`,
                    to: userEmail,
                    subject: limitEmail.subject,
                    html: limitEmail.html
                });
            } catch (emailError) {
                console.error('[API/Scan/Start] Error sending quota alert email:', emailError);
            }

            return NextResponse.json({
                error: `Monthly scan limit (${scanLimit}) reached for ${tierConfig.name} tier. Please upgrade.`
            }, { status: 403 });
        }

        const { data: scan, error: scanError } = await supabaseService
            .from('scans')
            .insert({
                user_id: userId,
                repo_url,
                repo_name: repo_url.split('/').slice(-2).join('/'),
                status: 'pending',
                current_agent: 0
            })
            .select()
            .single();

        if (scanError) {
            console.error('[API/Scan/Start] Database insert failed:', {
                message: scanError.message,
                details: scanError.details,
                hint: scanError.hint,
                code: scanError.code
            });
            throw scanError;
        }

        if (scanLimit !== "Unlimited") {
            await supabaseService
                .from('profiles')
                .update({ scans_remaining: profile.scans_remaining - 1 })
                .eq('email', userEmail);
        }

        const scanId = scan.id;

        // 🚀 Trigger the direct background pipeline 
        console.log(`[START] Triggering Direct Pipeline for Scan ${scanId} at Tier: ${userTierKey}`);
        try {
            // Import dynamically so it doesn't block the initial route load
            const { runPipeline } = await import('@/lib/agents/pipeline');

            // Execute in background (do not await so we can return the response instantly)
            runPipeline(scanId, repo_url, userTierKey).catch(err => {
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

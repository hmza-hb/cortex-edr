import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { DashboardLayoutWrapper } from "@/components/dashboard/layout-wrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { SYSTEM_CONFIG, TierId } from "@/lib/config/system";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return redirect("/auth");
    }

    const supabase = await createClient();

    // Serialize session user for Client Components
    const plainUser = {
        id: (session.user as any).id,
        email: session.user.email || "",
        name: session.user.name || "",
    };

    const userEmail = session.user.email?.toLowerCase();
    console.log('Dashboard - Looking up user by email:', userEmail);

    const { data: profile } = await supabase
        .from("profiles")
        .select("plan_tier, scans_remaining, email")
        .eq("email", userEmail)
        .maybeSingle();

    // Debug logging
    console.log('Dashboard - User email:', userEmail);
    console.log('Dashboard - Raw profile from DB:', profile);
    console.log('Dashboard - Raw tier:', profile?.plan_tier);

    if (!profile) {
        console.error('Dashboard - No profile found for user:', userEmail);
        // Fallback to VIBE_CODER
        const fallbackTier = "VIBE_CODER";
        const tierConfig = SYSTEM_CONFIG.tiers[TierId.VIBE_CODER];
        const fallbackScanLimit = typeof tierConfig.limits.maxScansPerMonth === 'number'
            ? tierConfig.limits.maxScansPerMonth
            : 1000; // Fallback for Unlimited

        return (
            <DashboardLayoutWrapper
                user={plainUser}
                planTier={fallbackTier.toLowerCase()}
                scanCount={0}
                scanLimit={fallbackScanLimit}
            >
                {children}
            </DashboardLayoutWrapper>
        );
    }

    const rawTier = profile?.plan_tier || "VIBE_CODER";
    const tierId = rawTier.toUpperCase() as TierId;
    const tierConfig = SYSTEM_CONFIG.tiers[tierId] || SYSTEM_CONFIG.tiers[TierId.VIBE_CODER];

    // Convert to lowercase format that sidebar expects
    const planTier = rawTier.toLowerCase();
    const scanLimit = typeof tierConfig.limits.maxScansPerMonth === 'number'
        ? tierConfig.limits.maxScansPerMonth
        : 1000; // Fallback for Unlimited

    // Debug logging
    console.log('Dashboard - Plan tier passed to sidebar:', planTier);
    console.log('Dashboard - Tier config:', tierConfig);

    const scansRemaining = profile?.scans_remaining ?? scanLimit;
    const scanCount = scanLimit - scansRemaining;

    return (
        <DashboardLayoutWrapper
            user={plainUser}
            planTier={planTier}
            scanCount={scanCount}
            scanLimit={scanLimit}
        >
            {children}
        </DashboardLayoutWrapper>
    );
}

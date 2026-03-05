import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { DashboardLayoutWrapper } from "@/components/dashboard/layout-wrapper";
import { currentUser } from "@clerk/nextjs/server";
import { SYSTEM_CONFIG, TierId } from "@/lib/config/system";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        return redirect("/login");
    }

    const supabase = await createClient();

    // Serialize Clerk user for Client Components to prevent Next.js boundaries error
    const plainUser = {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        firstName: user.firstName,
        lastName: user.lastName,
    };

    // Fetch user profile to get plan tier and scan count
    // NOTE: Using case-insensitive email matching to ensure user lookup works
    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
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

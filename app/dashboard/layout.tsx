import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { DashboardLayoutWrapper } from "@/components/dashboard/layout-wrapper";
import { currentUser } from "@clerk/nextjs/server";
import { SYSTEM_CONFIG, TierId } from "@/lib/config/system";

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

    // Fetch user profile to get plan tier and scan count
    // NOTE: If using Clerk, we'll temporarilly bypass the strict ID match
    // until the webhook syncs Clerk users to Supabase profiles.
    const { data: profile } = await supabase
        .from("profiles")
        .select("plan_tier, scans_remaining")
        .eq("email", user.primaryEmailAddress?.emailAddress)
        .maybeSingle();

    const rawTier = profile?.plan_tier || "vibe_coder";
    const tierId = rawTier.toUpperCase() as TierId;
    const tierConfig = SYSTEM_CONFIG.tiers[tierId] || SYSTEM_CONFIG.tiers[TierId.VIBE_CODER];

    const planTier = rawTier.toLowerCase();
    const scanLimit = typeof tierConfig.limits.maxScansPerMonth === 'number'
        ? tierConfig.limits.maxScansPerMonth
        : 1000; // Fallback for Unlimited

    const scansRemaining = profile?.scans_remaining ?? scanLimit;
    const scanCount = scanLimit - scansRemaining;

    // Serialize Clerk user for Client Components to prevent Next.js boundaries error
    const plainUser = {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        firstName: user.firstName,
        lastName: user.lastName,
    };

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

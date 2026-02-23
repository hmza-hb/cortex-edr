import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { DashboardLayoutWrapper } from "@/components/dashboard/layout-wrapper";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch user profile to get plan tier and scan count
    const { data: profile } = await supabase
        .from("profiles")
        .select("plan_tier, scans_remaining")
        .eq("id", user.id)
        .single();

    const rawTier = profile?.plan_tier || "VIBE_CODER";
    const planTier = rawTier.toUpperCase() as "VIBE_CODER" | "DEVELOPER" | "TEAMS" | "ENTERPRISE";

    // Calculate scan limits based on plan
    const scanLimits = {
        VIBE_CODER: 5,
        DEVELOPER: 25,
        TEAMS: 100,
        ENTERPRISE: 500,
    };

    const scanLimit = scanLimits[planTier] || 5;
    const scansRemaining = profile?.scans_remaining || 0;
    const scanCount = scanLimit - scansRemaining;

    return (
        <DashboardLayoutWrapper
            user={user}
            planTier={planTier}
            scanCount={scanCount}
            scanLimit={scanLimit}
        >
            {children}
        </DashboardLayoutWrapper>
    );
}

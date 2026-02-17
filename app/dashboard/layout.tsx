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

    const planTier = (profile?.plan_tier || "free") as "free" | "starter" | "professional" | "enterprise";

    // Calculate scan limits based on plan
    const scanLimits = {
        free: 1,
        starter: 10,
        professional: 999999, // Unlimited
        enterprise: 999999, // Unlimited
    };

    const scanLimit = scanLimits[planTier];
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

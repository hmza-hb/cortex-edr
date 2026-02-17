"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { cn } from "@/lib/utils";

interface DashboardLayoutWrapperProps {
    children: React.ReactNode;
    user: any;
    planTier: "free" | "starter" | "professional" | "enterprise";
    scanCount: number;
    scanLimit: number;
}

export const DashboardLayoutWrapper = ({
    children,
    user,
    planTier,
    scanCount,
    scanLimit,
}: DashboardLayoutWrapperProps) => {
    const pathname = usePathname();
    const isImmersive = pathname?.includes("/dashboard/scan/");

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Sidebar - Hidden in immersive mode */}
            {!isImmersive && (
                <Sidebar
                    user={user}
                    planTier={planTier}
                    scanCount={scanCount}
                    scanLimit={scanLimit}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar - Hidden in immersive mode */}
                {!isImmersive && (
                    <TopBar
                        user={user}
                        scanCount={scanCount}
                        scanLimit={scanLimit}
                        planTier={planTier}
                    />
                )}

                {/* Page Content */}
                <main className={cn(
                    "flex-1 overflow-y-auto bg-black",
                    isImmersive ? "p-0" : "p-8"
                )}>
                    <div className={cn(
                        "h-full",
                        !isImmersive && "max-w-7xl mx-auto"
                    )}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

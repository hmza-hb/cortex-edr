"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { MobileHeader } from "@/components/dashboard/mobile-header";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DashboardLayoutWrapperProps {
    children: React.ReactNode;
    user: any;
    planTier: "SCOUT" | "SENTINEL" | "GUARDIAN" | "FORTRESS" | string;
    scanCount: number;
    scanLimit: number;
}

export const DashboardLayoutWrapper = ({
    children,
    user,
    planTier: initialPlanTier,
    scanCount: initialScanCount,
    scanLimit: initialScanLimit,
}: DashboardLayoutWrapperProps) => {
    const pathname = usePathname();
    const isImmersive = pathname?.includes("/dashboard/scan/");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State for dynamic updates
    const [planTier, setPlanTier] = useState(initialPlanTier);
    const [scanCount, setScanCount] = useState(initialScanCount);
    const [scanLimit, setScanLimit] = useState(initialScanLimit);

    // Auto-refresh tier data every 10 seconds
    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                const response = await fetch('/api/admin/tiers/check-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.planTier && data.planTier !== planTier) {
                        console.log('Tier updated:', data.planTier);
                        setPlanTier(data.planTier);
                        setScanLimit(data.scanLimit);
                        // Force page reload for complete update
                        window.location.reload();
                    }
                }
            } catch (error) {
                // Silently fail - don't spam console
            }
        };

        // Check immediately, then every 10 seconds
        checkForUpdates();
        const interval = setInterval(checkForUpdates, 10000);

        return () => clearInterval(interval);
    }, [user.email, planTier]);

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Global navigation progress bar */}
            <Suspense fallback={null}>
                <NavigationProgress />
            </Suspense>
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Mobile Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{
                                type: "spring",
                                damping: 30,
                                stiffness: 300,
                                duration: 0.3
                            }}
                            className="fixed left-0 top-0 h-full w-80 bg-zinc-950 border-r border-zinc-800 z-50 lg:hidden shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                        <img src="/assets/logo.png" alt="CortexEDR" className="h-5 w-5 object-contain" />
                                    </div>
                                    <span className="font-bold text-lg">CortexEDR</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-4">
                                <Sidebar
                                    user={user}
                                    planTier={planTier}
                                    scanCount={scanCount}
                                    scanLimit={scanLimit}
                                    isMobile={true}
                                    onNavigate={() => setIsMobileMenuOpen(false)}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar - Hidden on mobile */}
            {!isImmersive && (
                <div className="hidden lg:block">
                    <Sidebar
                        user={user}
                        planTier={planTier}
                        scanCount={scanCount}
                        scanLimit={scanLimit}
                    />
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden">
                    <MobileHeader
                        onMenuClick={() => setIsMobileMenuOpen(true)}
                        user={user}
                    />
                </div>

                {/* Desktop Top Bar - Hidden on mobile */}
                {!isImmersive && (
                    <div className="hidden lg:block">
                        <TopBar
                            user={user}
                            scanCount={scanCount}
                            scanLimit={scanLimit}
                            planTier={planTier}
                        />
                    </div>
                )}

                {/* Page Content */}
                <main className={cn(
                    "flex-1 overflow-y-auto bg-black",
                    isImmersive ? "p-0" : "p-4 lg:p-8"
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

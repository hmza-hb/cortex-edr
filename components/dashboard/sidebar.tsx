"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ScanLine,
    History,
    FolderGit2,
    BarChart3,
    Settings,
    CreditCard,
    Gift,
    BookOpen,
    HelpCircle,
    Sparkles,
    Zap,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Shield,
    Activity,
    HardDrive,
    Building,
    MessageCircle,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
    user: any;
    planTier?: "vibe_coder" | "developer" | "teams" | "enterprise" | string;
    scanCount?: number;
    scanLimit?: number;
    isMobile?: boolean;
    onNavigate?: () => void;
}

export const Sidebar = ({ user, planTier = "free", scanCount = 0, scanLimit = 1, isMobile = false, onNavigate }: SidebarProps) => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const mainNavItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: ScanLine, label: "New Scan", href: "/dashboard/new-scan", highlight: true },
        { icon: MessageCircle, label: "Chat with Cortex", href: "/chat" },
        { icon: History, label: "Scan History", href: "/dashboard/scans" },
        { icon: FolderGit2, label: "Repositories", href: "/dashboard/repositories" },
        {
            icon: BarChart3,
            label: "Analytics",
            href: "/dashboard/analytics",
            locked: planTier === "free" || planTier === "starter"
        },
    ];

    const accountItems = [
        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
        { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
        { icon: Gift, label: "Referrals", href: "/dashboard/referrals" },
    ];

    const resourceItems = [
        { icon: BookOpen, label: "Documentation", href: "/docs" },
        { icon: HelpCircle, label: "Support", href: "/support", isPriority: planTier === "professional" || planTier === "enterprise" },
        { icon: Sparkles, label: "What's New", href: "/whats-new", hasUpdate: true },
    ];

    interface PlanConfig {
        name: string;
        icon: string;
        description: string;
        showUpgrade: boolean;
        badge?: string;
        upgradeText?: string;
        upgradeHref?: string;
    }

    const planConfig: Record<string, PlanConfig> = {
        vibe_coder: {
            name: "Vibe Coder",
            icon: "Shield",
            description: `${scanCount}/${scanLimit} audit used`,
            showUpgrade: true,
            upgradeText: "Upgrade Plan",
            upgradeHref: "/pricing"
        },
        developer: {
            name: "Developer",
            icon: "Activity",
            description: `${scanCount}/${scanLimit} audits used`,
            badge: "FOUNDER TIER",
            showUpgrade: true,
            upgradeText: "Upgrade to Teams",
            upgradeHref: "/pricing"
        },
        teams: {
            name: "Teams",
            icon: "HardDrive",
            description: "Collaborative intelligence",
            badge: "FOUNDER TIER",
            showUpgrade: true,
            upgradeText: "Upgrade to Enterprise",
            upgradeHref: "/pricing"
        },
        enterprise: {
            name: "Enterprise",
            icon: "Building",
            description: "Unlimited infrastructure",
            showUpgrade: false
        }
    };

    const currentPlan = planConfig[planTier] || planConfig.vibe_coder;

    const NavLink = ({ item }: { item: any }) => {
        const isActive = pathname === item.href;
        const [isPending, setIsPending] = useState(false);

        // Reset pending state once the route actually changes
        useEffect(() => {
            setIsPending(false);
        }, [pathname]);

        const handleClick = (e: React.MouseEvent) => {
            if (item.locked) {
                e.preventDefault();
                return;
            }
            if (!isActive) {
                setIsPending(true);
            }
            if (isMobile && onNavigate) {
                onNavigate();
            }
        };

        return (
            <Link
                href={item.locked ? "#" : item.href}
                className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group relative",
                    isCollapsed && "justify-center px-2",
                    isActive && !item.locked
                        ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-sm cursor-pointer"
                        : item.locked
                            ? "text-zinc-600 cursor-not-allowed"
                            : isPending
                                ? "bg-white/[0.04] text-zinc-200 cursor-pointer"
                                : "text-zinc-400 hover:text-white hover:bg-white/[0.03] cursor-pointer",
                    item.highlight && !isActive && !isPending && "bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 text-indigo-100 hover:border-indigo-500/40 cursor-pointer"
                )}
                onClick={handleClick}
                title={isCollapsed ? item.label : undefined}
            >
                {isActive && !item.locked && (
                    <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-indigo-500 rounded-r-full" />
                )}

                {/* Icon — swapped for spinner while loading */}
                {isPending && !isActive ? (
                    <Loader2 className="h-[18px] w-[18px] shrink-0 text-indigo-400 animate-spin" />
                ) : (
                    <item.icon className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        isActive ? "text-indigo-400" : item.locked ? "text-zinc-700" : "text-zinc-500 group-hover:text-zinc-300"
                    )} />
                )}

                {!isCollapsed && (
                    <>
                        <span className={cn(
                            "text-sm font-medium truncate transition-colors",
                            isPending && !isActive && "text-white"
                        )}>{item.label}</span>
                        {item.locked && (
                            <span className="ml-auto text-[10px] font-semibold text-zinc-700 uppercase tracking-tight">Pro</span>
                        )}
                        {item.badge && !item.locked && (
                            <span className="ml-auto px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-full">
                                {item.badge}
                            </span>
                        )}
                        {item.hasUpdate && (
                            <span className="ml-auto h-1.5 w-1.5 bg-blue-500 rounded-full" />
                        )}
                        {item.isPriority && (
                            <span className="ml-auto text-[10px] text-green-500/80 font-bold tracking-tight">Priority</span>
                        )}
                    </>
                )}
            </Link>
        );
    };

    const getPlanIcon = (iconName: string) => {
        switch (iconName) {
            case "Shield": return <Shield className="h-5 w-5 text-purple-400" />;
            case "Activity": return <Activity className="h-5 w-5 text-purple-400" />;
            case "HardDrive": return <HardDrive className="h-5 w-5 text-purple-400" />;
            case "Building": return <Building className="h-5 w-5 text-purple-400" />;
            default: return <Shield className="h-5 w-5 text-purple-400" />;
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Topbar Placeholder / Collapse Toggle - Only for desktop */}
            {!isMobile && (
                <div className={cn(
                    "p-4 border-b border-zinc-800/50 flex items-center transition-all h-16",
                    isCollapsed ? "justify-center" : "justify-between"
                )}>
                    {!isCollapsed && (
                        <div className="text-xs font-medium text-zinc-500 tracking-tight">
                            Leave the TERROR behind
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="h-8 w-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center transition-all group cursor-pointer"
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
                        ) : (
                            <ChevronLeft className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
                        )}
                    </button>
                </div>
            )}

            {/* Mobile Header - Only for mobile */}
            {isMobile && (
                <div className="p-4 border-b border-zinc-800/50">
                    <div className="text-xs font-medium text-zinc-500 tracking-tight">
                        Navigation
                    </div>
                </div>
            )}

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
                {mainNavItems.map((item) => (
                    <NavLink key={item.href} item={item} />
                ))}

                {/* Account Section */}
                <div className="pt-8">
                    {!isCollapsed && !isMobile && (
                        <h3 className="px-4 text-xs font-medium text-zinc-500 tracking-tight mb-3">
                            Account and billing
                        </h3>
                    )}
                    {(isCollapsed || isMobile) && (
                        <div className="h-px bg-zinc-800/50 my-4 mx-2" />
                    )}
                    <div className="space-y-1">
                        {accountItems.map((item) => (
                            <NavLink key={item.href} item={item} />
                        ))}
                    </div>
                </div>

                {/* Resources Section */}
                <div className="pt-8">
                    {!isCollapsed && !isMobile && (
                        <h3 className="px-4 text-xs font-medium text-zinc-500 tracking-tight mb-3">
                            Resources and support
                        </h3>
                    )}
                    {(isCollapsed || isMobile) && (
                        <div className="h-px bg-zinc-800/50 my-4 mx-2" />
                    )}
                    <div className="space-y-1">
                        {resourceItems.map((item) => (
                            <NavLink key={item.href} item={item} />
                        ))}
                    </div>
                </div>
            </nav>

            {/* Plan Badge at Bottom */}
            <div className={cn(
                "p-4 border-t border-zinc-800/50 bg-zinc-900/30",
                isCollapsed && !isMobile && "flex justify-center"
            )}>
                {isCollapsed && !isMobile ? (
                    <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center" title={`${currentPlan.name} Tier`}>
                        {getPlanIcon(currentPlan.icon)}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                {getPlanIcon(currentPlan.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-semibold text-zinc-100">{currentPlan.name}</div>
                                    {currentPlan.badge && (
                                        <div className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium rounded">
                                            {currentPlan.badge}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-500 mt-0.5 font-medium">{currentPlan.description}</p>
                            </div>
                        </div>
                        {currentPlan.showUpgrade && currentPlan.upgradeHref && (
                            <Link href={currentPlan.upgradeHref} onClick={() => isMobile && onNavigate && onNavigate()}>
                                <Button
                                    size="sm"
                                    className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-300 font-semibold text-sm h-10 rounded-xl transition-all active:scale-[0.98]"
                                >
                                    <Zap className="h-4 w-4 mr-2 fill-current" />
                                    {currentPlan.upgradeText}
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <motion.aside
            initial={false}
            animate={{ width: isMobile ? 'auto' : (isCollapsed ? 80 : 280) }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
                "flex flex-col border-r border-zinc-800 bg-zinc-950",
                isMobile ? "w-full" : "h-screen"
            )}
        >
            <SidebarContent />
        </motion.aside>
    );
};

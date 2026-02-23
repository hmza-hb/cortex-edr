"use client";

import React, { useState } from "react";
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
    Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
    user: any;
    planTier?: "VIBE_CODER" | "DEVELOPER" | "TEAMS" | "ENTERPRISE" | string;
    scanCount?: number;
    scanLimit?: number;
}

export const Sidebar = ({ user, planTier = "free", scanCount = 0, scanLimit = 1 }: SidebarProps) => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const mainNavItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: ScanLine, label: "New Scan", href: "/dashboard/new-scan", highlight: true },
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
        { icon: Gift, label: "Referrals", href: "/dashboard/referrals", badge: "3" },
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

        return (
            <Link
                href={item.locked ? "#" : item.href}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative",
                    isCollapsed && "justify-center px-2",
                    isActive && !item.locked
                        ? "bg-purple-500/10 text-white border border-purple-500/20"
                        : item.locked
                            ? "text-white/20 cursor-not-allowed"
                            : "text-white/70 hover:text-white hover:bg-white/10",
                    item.highlight && !isActive && "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 text-white hover:border-purple-500/50"
                )}
                onClick={(e) => item.locked && e.preventDefault()}
                title={isCollapsed ? item.label : undefined}
            >
                {isActive && !item.locked && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-500 rounded-r-full" />
                )}
                <item.icon className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-purple-400" : item.locked ? "text-white/20" : "text-white/60 group-hover:text-white"
                )} />
                {!isCollapsed && (
                    <>
                        <span className="text-sm font-semibold truncate group-hover:text-white transition-colors">{item.label}</span>
                        {item.locked && (
                            <span className="ml-auto text-[10px] font-mono text-white/20 font-bold">Pro</span>
                        )}
                        {item.badge && !item.locked && (
                            <span className="ml-auto px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs font-mono rounded-full font-black">
                                {item.badge}
                            </span>
                        )}
                        {item.hasUpdate && (
                            <span className="ml-auto h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                        {item.isPriority && (
                            <span className="ml-auto text-xs text-green-400 font-mono font-black italic">Priority</span>
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
            {/* Topbar Placeholder / Collapse Toggle */}
            <div className={cn(
                "p-4 border-b border-white/5 flex items-center transition-all h-16",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                {!isCollapsed && (
                    <div className="text-xs font-mono text-white/40 uppercase tracking-widest font-bold">
                        Systems Control
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white" />
                    ) : (
                        <ChevronLeft className="h-4 w-4 text-white/30 group-hover:text-white" />
                    )}
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
                {mainNavItems.map((item) => (
                    <NavLink key={item.href} item={item} />
                ))}

                {/* Account Section */}
                <div className="pt-8">
                    {!isCollapsed && (
                        <h3 className="px-4 text-[11px] font-bold text-white/30 tracking-widest mb-3 uppercase">
                            Account Control
                        </h3>
                    )}
                    {isCollapsed && (
                        <div className="h-px bg-white/5 my-4 mx-2" />
                    )}
                    <div className="space-y-1">
                        {accountItems.map((item) => (
                            <NavLink key={item.href} item={item} />
                        ))}
                    </div>
                </div>

                {/* Resources Section */}
                <div className="pt-8">
                    {!isCollapsed && (
                        <h3 className="px-4 text-[11px] font-bold text-white/30 tracking-widest mb-3 uppercase">
                            Resources & Knowledge
                        </h3>
                    )}
                    {isCollapsed && (
                        <div className="h-px bg-white/5 my-4 mx-2" />
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
                "p-4 border-t border-white/5 bg-[#080808]/50",
                isCollapsed && "flex justify-center"
            )}>
                {isCollapsed ? (
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center" title={`${currentPlan.name} Tier`}>
                        {getPlanIcon(currentPlan.icon)}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                {getPlanIcon(currentPlan.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-bold text-white tracking-tight">{currentPlan.name}</div>
                                    {currentPlan.badge && (
                                        <div className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold rounded">
                                            {currentPlan.badge}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-white/50 mt-1 font-mono uppercase tracking-tight font-medium">{currentPlan.description}</p>
                            </div>
                        </div>
                        {currentPlan.showUpgrade && currentPlan.upgradeHref && (
                            <Link href={currentPlan.upgradeHref}>
                                <Button
                                    size="sm"
                                    className="w-full bg-white text-black hover:bg-neutral-200 font-bold text-sm tracking-tight uppercase h-11 rounded-xl shadow-lg transition-all active:scale-[0.98]"
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
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 bg-black border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/5 transition-all"
            >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar - Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="hidden lg:flex flex-col h-screen border-r border-white/5 bg-[#050505]"
            >
                <SidebarContent />
            </motion.aside>

            {/* Sidebar - Mobile */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: isMobileOpen ? 0 : -280 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#050505] border-r border-white/5 z-50 flex flex-col"
            >
                <SidebarContent />
            </motion.aside>
        </>
    );
};

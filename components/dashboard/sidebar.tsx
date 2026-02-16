"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Scan,
    Shield,
    FileCode,
    Settings,
    LogOut,
    Brain,
    Activity,
    ChevronLeft,
    ChevronRight,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = ({ user }: { user: any }) => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
        { icon: Scan, label: "Live Scans", href: "/dashboard/scans" },
        { icon: FileCode, label: "Repositories", href: "/dashboard/repos" },
        { icon: Shield, label: "Security", href: "/dashboard/security" },
        { icon: Settings, label: "Config", href: "/dashboard/settings" },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 320 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="h-full border-r border-white/5 bg-[#050505] flex flex-col relative z-50 group"
        >
            {/* Brand HUD Section with Toggle Logic */}
            <div className={cn(
                "p-8 border-b border-white/5 flex items-center transition-all duration-300",
                isCollapsed ? "justify-center px-4" : "gap-3"
            )}>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center transition-all hover:border-purple-500/60 hover:bg-purple-500/20 active:scale-95 group/logo relative"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <Brain className="h-6 w-6 text-purple-500 transition-transform group-hover/logo:scale-110" />
                        {/* Subtle ping indicator when collapsed */}
                        {isCollapsed && (
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                        )}
                    </button>
                    {!isCollapsed && (
                        <Link href="/">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="hover:opacity-80 transition-opacity"
                            >
                                <div className="text-lg font-black tracking-tighter text-white leading-none">CORTEX<span className="text-purple-500">EDR</span></div>
                                <div className="text-[9px] font-mono text-purple-400/50 uppercase tracking-[0.2em] mt-1">INTERNAL_CONTROL</div>
                            </motion.div>
                        </Link>
                    )}
                </div>
            </div>

            {/* Navigation HUD */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-hidden">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center rounded-xl transition-all group relative overflow-hidden h-12",
                                isCollapsed ? "justify-center" : "px-4 gap-4",
                                isActive
                                    ? "bg-purple-500/10 text-white border border-purple-500/20"
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-purple-500" />
                            )}
                            <item.icon className={cn(
                                "h-5 w-5 shrink-0 transition-colors",
                                isActive ? "text-purple-400" : "group-hover:text-white"
                            )} />

                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-xs font-mono uppercase tracking-widest font-black truncate"
                                >
                                    {item.label}
                                </motion.span>
                            )}

                            {!isCollapsed && isActive && (
                                <Activity className="h-3 w-3 ml-auto text-purple-400 animate-pulse shrink-0" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User HUD Bottom */}
            <div className={cn(
                "p-6 border-t border-white/5 space-y-4 transition-all duration-300",
                isCollapsed ? "items-center flex flex-col" : ""
            )}>
                <form action="/auth/sign-out" method="post" className="w-full">
                    <button
                        type="submit"
                        className={cn(
                            "flex items-center rounded-xl text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all text-[10px] font-mono uppercase tracking-[0.2em] font-black border border-transparent hover:border-red-500/20 h-12 w-full",
                            isCollapsed ? "justify-center" : "px-4 gap-4"
                        )}
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        {!isCollapsed && <span>TERMINATE_SESSION</span>}
                    </button>
                </form>
            </div>
        </motion.aside>
    );
};

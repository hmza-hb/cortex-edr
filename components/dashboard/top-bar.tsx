"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Zap, Shield, HelpCircle, Share2, Command, Github, Slack, Figma, Bot, FileText, Wrench, Activity, Mail, MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CortexUserButton } from "@/components/auth/UserButton";
import { SYSTEM_CONFIG, TierId } from "@/lib/config/system";

interface TopBarProps {
    user: any;
    scanCount?: number;
    scanLimit?: number;
    planTier?: "SCOUT" | "SENTINEL" | "GUARDIAN" | "FORTRESS" | string;
}

export const TopBar = ({ user, scanCount = 0, scanLimit = 1, planTier = "SCOUT" }: TopBarProps) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isConnectMenuOpen, setIsConnectMenuOpen] = useState(false);
    const [isSupportMenuOpen, setIsSupportMenuOpen] = useState(false);

    const planConfig = {
        SCOUT: { name: "Scout", color: "text-gray-400", showUpgrade: true },
        SENTINEL: { name: "Sentinel", color: "text-purple-400", showUpgrade: true },
        GUARDIAN: { name: "Guardian", color: "text-blue-400", showUpgrade: true },
        FORTRESS: { name: "Fortress", color: "text-white", showUpgrade: false },
    };

    const rawTier = (planTier || "SCOUT").toUpperCase();
    const currentPlan = planConfig[rawTier as keyof typeof planConfig] || planConfig.SCOUT;
    const isUnlimited = rawTier === "FORTRESS";

    return (
        <div className="sticky top-0 z-50 bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-800/50">
            <div className="flex items-center justify-between px-6 h-16">
                <div className="flex items-center gap-8 flex-1">
                    {/* Left: Logo */}
                    <Link href="/dashboard" className="flex items-center gap-1.5 group shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-all duration-300 overflow-hidden">
                            <img src="/assets/logo.png" alt="CortexEDR Logo" className="h-7 w-7 object-contain transition-all group-hover:scale-110" />
                        </div>
                        <span className="font-semibold text-lg tracking-tight hidden md:block text-zinc-100 ml-2">
                            CortexEDR
                        </span>
                    </Link>

                    {/* Left: Professional Search Bar */}
                    <div className="relative max-w-md w-full hidden md:block group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-12 py-2 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:bg-zinc-900 focus:border-indigo-500/50 transition-all duration-200 text-sm"
                            placeholder="Search findings and protocols..."
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-zinc-800 bg-zinc-900">
                                <Command className="h-3 w-3 text-zinc-500" />
                                <span className="text-[10px] font-semibold text-zinc-500">K</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions & User */}
                <div className="flex items-center gap-4">
                    {/* Actions Group */}
                    <div className="flex items-center gap-2 pr-4 border-r border-zinc-800 mr-1 hidden sm:flex relative">
                        <div className="relative">
                            <button
                                onClick={() => setIsConnectMenuOpen(!isConnectMenuOpen)}
                                className={cn(
                                    "h-9 px-4 flex items-center gap-2 rounded-lg text-sm font-medium transition-colors border border-transparent",
                                    isConnectMenuOpen ? "text-white bg-zinc-900 border-zinc-800" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                )}
                            >
                                <Share2 className="h-4 w-4" />
                                Connect
                                <ChevronDown className={cn(
                                    "h-3 w-3 opacity-50 transition-transform duration-300",
                                    isConnectMenuOpen && "rotate-180"
                                )} />
                            </button>

                            <AnimatePresence>
                                {isConnectMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsConnectMenuOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute right-0 top-full mt-2 w-64 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                                        >
                                            <div className="px-3 py-2 border-b border-zinc-800/50 mb-2">
                                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Connect Integrations</h4>
                                            </div>

                                            <div className="space-y-1">
                                                {[
                                                    { name: "GitHub", logo: "https://cdn-icons-png.flaticon.com/512/25/25231.png", color: "hover:bg-zinc-100/10 hover:border-zinc-100/20" },
                                                    { name: "Slack", logo: "https://cdn-icons-png.flaticon.com/512/2111/2111694.png", color: "hover:bg-[#E01E5A]/10 hover:border-[#E01E5A]/20" },
                                                    { name: "Figma", logo: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png", color: "hover:bg-[#F24E1E]/10 hover:border-[#F24E1E]/20" }
                                                ].map((integration, idx) => (
                                                    <motion.div
                                                        key={integration.name}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 + (idx * 0.05), duration: 0.3 }}
                                                        className={cn(
                                                            "flex items-center justify-between p-2.5 rounded-xl border border-transparent transition-all cursor-not-allowed group",
                                                            integration.color
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                                                <img
                                                                    src={integration.logo}
                                                                    alt={`${integration.name} logo`}
                                                                    className="w-5 h-5 object-contain"
                                                                />
                                                            </div>
                                                            <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                                                                {integration.name}
                                                            </span>
                                                        </div>
                                                        <div className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-zinc-500 uppercase tracking-wider group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                                            Soon
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsSupportMenuOpen(!isSupportMenuOpen)}
                                className={cn(
                                    "h-9 px-4 flex items-center gap-2 rounded-lg text-sm font-medium transition-colors border border-transparent",
                                    isSupportMenuOpen ? "text-white bg-zinc-900 border-zinc-800" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                )}
                            >
                                <HelpCircle className="h-4 w-4" />
                                Support
                                <ChevronDown className={cn(
                                    "h-3 w-3 opacity-50 transition-transform duration-300",
                                    isSupportMenuOpen && "rotate-180"
                                )} />
                            </button>

                            <AnimatePresence>
                                {isSupportMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsSupportMenuOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute right-0 top-full mt-2 w-72 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
                                        >
                                            <div className="p-4 border-b border-zinc-800/50">
                                                <h4 className="text-sm font-bold text-white mb-1">Need help with your project?</h4>
                                                <p className="text-xs text-zinc-400">Start with our Assistant, docs, or community.</p>
                                            </div>

                                            <div className="p-2 space-y-0.5">
                                                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-900 transition-colors group">
                                                    <div className="w-6 h-6 flex items-center justify-center">
                                                        <img src="/assets/logo.png" alt="CortexEDR Logo" className={cn("w-5 h-5 object-contain", "filter brightness-0 invert")} />
                                                    </div>
                                                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Cortex Advisor</span>
                                                </Link>
                                                <Link href="/docs" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-900 transition-colors group">
                                                    <FileText className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                                                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Documentation</span>
                                                </Link>
                                                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-900 transition-colors group">
                                                    <Wrench className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                                                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Troubleshooting</span>
                                                </Link>
                                                <Link href="/status" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-900 transition-colors group">
                                                    <Activity className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                                                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Cortex status</span>
                                                </Link>
                                                <div className="h-px bg-zinc-800/50 my-1 mx-2" />
                                                <Link href="/support" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-900 transition-colors group">
                                                    <Mail className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                                                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Contact support</span>
                                                </Link>
                                            </div>

                                            <div className="p-4 bg-zinc-900/40 border-t border-zinc-800/50">
                                                <h4 className="text-xs font-bold text-white mb-1.5">Community support</h4>
                                                <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
                                                    Our Discord community can help with code-related issues. Many questions are answered in minutes.
                                                </p>
                                                <Link href="#">
                                                    <Button variant="outline" className="w-full bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/20 hover:border-[#5865F2]/40 h-9 text-xs font-bold shadow-none transition-all">
                                                        <MessageSquare className="h-3.5 w-3.5 mr-2" />
                                                        Join us on discord
                                                    </Button>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Upgrade Button (conditional) */}
                    {currentPlan.showUpgrade && (
                        <Link href="/pricing" className="hidden md:block">
                            <Button
                                size="sm"
                                className="bg-zinc-100 text-zinc-950 hover:bg-zinc-300 font-semibold text-sm px-5 h-9 border-0 rounded-lg transition-all active:scale-[0.98]"
                            >
                                <Zap className="h-4 w-4 mr-2 fill-current" />
                                Upgrade plan
                            </Button>
                        </Link>
                    )}

                    {/* User Menu Dropdown (Cortex Auth) */}
                    <div className="relative ml-1 flex items-center justify-center">
                        <CortexUserButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

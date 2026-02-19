"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Zap, Shield, HelpCircle, Share2, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopBarProps {
    user: any;
    scanCount?: number;
    scanLimit?: number;
    planTier?: "free" | "starter" | "professional" | "enterprise";
}

export const TopBar = ({ user, scanCount = 0, scanLimit = 1, planTier = "free" }: TopBarProps) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const planConfig = {
        free: { name: "Scout", color: "text-gray-400", showUpgrade: true },
        starter: { name: "Sentinel", color: "text-purple-400", showUpgrade: true },
        professional: { name: "Guardian", color: "text-blue-400", showUpgrade: false },
        enterprise: { name: "Fortress", color: "text-white", showUpgrade: false },
    };

    const currentPlan = planConfig[planTier];
    const isUnlimited = planTier === "professional" || planTier === "enterprise";

    return (
        <div className="sticky top-0 z-50 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-[#020202]/60">
            <div className="flex items-center justify-between px-6 h-16">
                <div className="flex items-center gap-8 flex-1">
                    {/* Left: Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
                        <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-all duration-300">
                            <Shield className="h-5 w-5 text-white transition-all group-hover:text-purple-400 group-hover:scale-110" />
                        </div>
                        <span className="font-bold text-sm tracking-tight hidden md:block text-white ml-3">
                            Cortex <span className="text-purple-500 font-black">EDR</span>
                        </span>
                    </Link>

                    {/* Left: Professional Search Bar */}
                    <div className="relative max-w-md w-full hidden md:block group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-12 py-2.5 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-purple-500/50 transition-all duration-200 text-sm font-medium"
                            placeholder="Operational search..."
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/10 bg-white/5">
                                <Command className="h-3.5 w-3.5 text-white/40" />
                                <span className="text-xs font-mono text-white/40 font-bold">K</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions & User */}
                <div className="flex items-center gap-4">
                    {/* Actions Group */}
                    <div className="flex items-center gap-2 pr-4 border-r border-white/5 mr-1 hidden sm:flex">
                        <button className="h-10 px-4 flex items-center gap-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                            <Share2 className="h-4 w-4" />
                            Connect
                        </button>
                        <button className="h-10 px-4 flex items-center gap-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                            <HelpCircle className="h-4 w-4" />
                            Support
                        </button>
                    </div>

                    {/* Upgrade Button (conditional) */}
                    {currentPlan.showUpgrade && (
                        <Link href="/pricing" className="hidden md:block">
                            <Button
                                size="sm"
                                className="bg-white text-black hover:bg-neutral-200 font-bold text-sm px-5 h-10 border-0 rounded-xl transition-all shadow-lg shadow-white/5 active:scale-[0.98]"
                            >
                                <Zap className="h-4 w-4 mr-2 fill-current" />
                                Upgrade Plan
                            </Button>
                        </Link>
                    )}

                    {/* User Menu Dropdown */}
                    <div className="relative ml-1">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 pl-1 pr-2 py-1.5 rounded-lg hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                        >
                            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0">
                                <span className="text-xs font-mono text-purple-400 font-bold relative z-10">
                                    {user.email?.[0].toUpperCase()}
                                </span>
                            </div>
                            <div className="hidden lg:flex flex-col items-start gap-0.5">
                                <span className="text-sm font-bold text-white truncate max-w-[120px]">
                                    {user.email?.split("@")[0]}
                                </span>
                                <span className={cn("text-[10px] font-mono font-bold uppercase tracking-widest leading-none", currentPlan.color)}>
                                    {currentPlan.name} Tier
                                </span>
                            </div>
                            <ChevronDown className={cn(
                                "h-3 w-3 text-white/40 transition-transform duration-300",
                                isUserMenuOpen && "rotate-180"
                            )} />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-60 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10 bg-white/5 uppercase tracking-wider", currentPlan.color)}>
                                                {currentPlan.name}
                                            </span>
                                            {isUnlimited ? (
                                                <span className="text-[10px] text-white/40">Unlimited scans</span>
                                            ) : (
                                                <span className="text-[10px] text-white/40">{scanCount}/{scanLimit} scans</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-2 space-y-0.5">
                                        <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors rounded-lg group">
                                            My Account
                                        </Link>
                                        <Link href="/dashboard/billing" className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors rounded-lg group">
                                            Billing & Plans
                                        </Link>
                                        <Link href="/dashboard/referrals" className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors rounded-lg group">
                                            Referrals
                                        </Link>
                                    </div>
                                    <div className="h-px bg-white/5 my-1 mx-2" />
                                    <div className="p-2 space-y-0.5">
                                        <Link href="/docs" className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors rounded-lg group">
                                            Documentation
                                        </Link>
                                        <Link href="/support" className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors rounded-lg group">
                                            Support
                                        </Link>
                                    </div>
                                    <div className="p-2 border-t border-white/5 bg-white/[0.02]">
                                        <form action="/auth/sign-out" method="post">
                                            <button
                                                type="submit"
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors rounded-lg"
                                            >
                                                Sign Out
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

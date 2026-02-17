"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
    // This would be replaced with actual plan tier from props/context
    const planTier = "free"; // or "starter"
    const isLocked = planTier === "free" || planTier === "starter";

    if (isLocked) {
        return (
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Intelligence Engine
                    </h1>
                    <p className="text-sm text-white/50">Advanced predictive analytics and security trend mapping.</p>
                </div>

                {/* Locked State */}
                <div className="relative">
                    {/* Blurred Preview */}
                    <div className="filter blur-md pointer-events-none select-none opacity-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 h-80">
                                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-8">Score Matrix Trends</h3>
                                <div className="h-48 flex items-end justify-around gap-2">
                                    {[40, 55, 60, 75, 80, 85, 90].map((height, i) => (
                                        <div key={i} className="flex-1 bg-white/10 rounded-t" style={{ height: `${height}%` }} />
                                    ))}
                                </div>
                            </div>
                            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 h-80">
                                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-8">Vulnerability Classification</h3>
                                <div className="space-y-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-2 bg-white/5 rounded-full" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unlock CTA Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pt-20 pb-20">
                        <div className="max-w-md w-full p-10 rounded-2xl bg-[#0A0A0A] border border-white/10 backdrop-blur-xl text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                            <div className="h-16 w-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6">
                                <Lock className="h-6 w-6 text-white/40" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Access Restricted</h2>
                            <p className="text-sm text-white/50 mb-10 leading-relaxed font-medium">
                                Advanced intelligence features require Guardian level clearance.
                            </p>

                            <div className="text-left space-y-4 mb-10 bg-white/[0.02] border border-white/5 p-6 rounded-xl">
                                {[
                                    "Predictive trend mapping",
                                    "Heuristic classification",
                                    "Cross-repository pattern detection",
                                    "Operational integrity insights"
                                ].map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-semibold text-white/60">
                                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                                        {feat}
                                    </div>
                                ))}
                            </div>

                            <Link href="/pricing">
                                <Button className="w-full h-14 bg-white text-black hover:bg-neutral-200 font-bold text-sm rounded-xl shadow-xl transition-all active:scale-[0.98]">
                                    Upgrade Plan
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Unlocked analytics view (for Professional/Enterprise users)
    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Intelligence Engine
                    </h1>
                    <p className="text-sm text-white/50 font-medium">Global telemetry mapping and predictive trend analysis.</p>
                </div>
                <select className="h-11 px-5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/70 focus:outline-none uppercase tracking-widest appearance-none cursor-pointer hover:bg-white/10 transition-all">
                    <option className="bg-[#0A0A0A]">Past 30 Days</option>
                    <option className="bg-[#0A0A0A]">Past 7 Days</option>
                    <option className="bg-[#0A0A0A]">Past 90 Days</option>
                    <option className="bg-[#0A0A0A]">All Time</option>
                </select>
            </div>

            {/* Analytics Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Trends */}
                <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl" />
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-10">Integrity Score Trend</h3>
                    <div className="h-64 flex items-end justify-around gap-2 relative z-10">
                        {[40, 55, 60, 75, 80, 85, 90].map((height, i) => (
                            <div key={i} className="flex-1 bg-white/10 group-hover:bg-purple-500/20 rounded-t transition-colors" style={{ height: `${height}%` }} />
                        ))}
                    </div>
                    <div className="flex justify-between mt-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        <span>Day 01</span>
                        <span>Day 05</span>
                        <span>Day 10</span>
                        <span>Day 15</span>
                        <span>Day 20</span>
                        <span>Day 25</span>
                        <span>Day 30</span>
                    </div>
                </div>

                {/* Issues by Category */}
                <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl" />
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-10">Issue Categorization</h3>
                    <div className="space-y-8 relative z-10">
                        {[
                            { label: "Injection Vectors", value: 45, color: "bg-red-500/50" },
                            { label: "Identity Leakage", value: 30, color: "bg-orange-500/50" },
                            { label: "Technical Latency", value: 15, color: "bg-yellow-500/50" },
                            { label: "Schema Integrity", value: 10, color: "bg-blue-500/50" }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-semibold text-white/50">{item.label}</span>
                                    <span className="text-xs font-bold text-white">{item.value}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${item.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Issues & Best Repo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/5">
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-8">Heuristic Pattern Alerts</h3>
                    <div className="space-y-4">
                        {[
                            { id: "01", label: "SQL Injection Vector", repos: 3, color: "text-red-500" },
                            { id: "02", label: "Exposed API Secret", repos: 2, color: "text-orange-500" },
                            { id: "03", label: "Unvalidated Input Buffer", repos: 4, color: "text-yellow-500" }
                        ].map((issue, i) => (
                            <div key={i} className="flex items-start gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/10 group hover:border-purple-500/30 hover:bg-purple-500/5 transition-all">
                                <span className={cn("text-xs font-bold", issue.color)}>{issue.id}.</span>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors tracking-tight">{issue.label}</div>
                                    <div className="text-[10px] font-bold text-white/30 mt-1 uppercase tracking-widest">Active in {issue.repos} repositories</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 rounded-2xl bg-gradient-to-br from-green-500/[0.03] to-blue-500/[0.03] border border-green-500/10 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-green-400/80 uppercase tracking-widest mb-8">Optimal Integrity Target</h3>
                        <div className="text-3xl font-bold text-white tracking-tight mb-3">API-Backend-Node-01</div>
                        <div className="text-xs font-semibold text-white/40 uppercase tracking-widest">Integrity Score: 92.4 / 100</div>
                    </div>

                    <div className="mt-12">
                        <Link href="/dashboard/repositories">
                            <Button size="sm" variant="ghost" className="h-12 w-full text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/20 hover:text-white transition-all hover:bg-white/5 rounded-xl">
                                Inspect Architecture
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React from "react";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, Filter, Clock, TrendingUp, MoreVertical, Shield, Zap, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function ScanHistoryPage() {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/login");
    }

    // Fetch all scans
    const { data: scans } = await supabaseAdmin
        .from("scans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400";
        if (score >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    const formatTimeAgo = (date: string) => {
        const now = new Date();
        const scanDate = new Date(date);
        const diffInHours = Math.floor((now.getTime() - scanDate.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Less than an hour ago";
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    };

    const groupScansByDate = (scans: any[]) => {
        const groups: { [key: string]: any[] } = {};
        const now = new Date();

        scans?.forEach(scan => {
            const scanDate = new Date(scan.created_at);
            const diffInDays = Math.floor((now.getTime() - scanDate.getTime()) / (1000 * 60 * 60 * 24));

            let group = "";
            if (diffInDays === 0) group = "Today";
            else if (diffInDays < 7) group = "This Week";
            else if (diffInDays < 30) group = "This Month";
            else group = "Older";

            if (!groups[group]) groups[group] = [];
            groups[group].push(scan);
        });

        return groups;
    };

    const groupedScans = groupScansByDate(scans || []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Audit History</h1>
                        <p className="text-sm text-white/50">Chronological list of all security audits and findings.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 text-sm font-semibold bg-white/5 border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all rounded-xl px-5">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                    <div className="h-10 flex items-center bg-white/10 border border-white/20 rounded-xl px-4 group focus-within:border-purple-500/50 transition-all">
                        <Search className="h-4 w-4 text-white/60 mr-3 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find repository..."
                            className="bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none w-48 font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest whitespace-nowrap">Quick Filters:</span>
                {["All Targets", "Critical Risk", "90+ Compliance", "Last 72h"].map((f, i) => (
                    <button key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/50 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/5 transition-all whitespace-nowrap">
                        {f}
                    </button>
                ))}
            </div>

            {/* Scans List */}
            {scans && scans.length > 0 ? (
                <div className="space-y-10">
                    {Object.entries(groupedScans).map(([group, groupScans]) => (
                        <div key={group}>
                            <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6 flex items-center gap-4">
                                <div className="h-1 w-4 bg-purple-500 rounded-full" />
                                {group}
                            </h2>
                            <div className="grid gap-3">
                                {groupScans.map((scan) => (
                                    <div key={scan.id} className="group p-5 bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all rounded-xl relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-purple-500/50 transition-all" />
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="h-10 w-10 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                                                    <Shield className={cn("h-5 w-5", (scan.score || 0) > 80 ? "text-green-500" : "text-yellow-500")} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                                                        {scan.repo_url?.split('/').pop() || 'Repository'}
                                                    </h3>
                                                    <div className="flex items-center gap-6 mt-1">
                                                        <p className="text-xs text-white/40 font-medium truncate max-w-[250px]">{scan.repo_url}</p>
                                                        <div className="flex items-center gap-2 text-[11px] font-medium text-white/40 whitespace-nowrap">
                                                            <Clock className="h-3 w-3" />
                                                            {formatTimeAgo(scan.created_at)}
                                                        </div>
                                                    </div>
                                                    streams                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 shrink-0">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Integrity Score</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn("text-2xl font-bold tracking-tight", getScoreColor(scan.score || 0))}>
                                                            {scan.score || 0}/100
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Link href={`/dashboard/report/${scan.id}`}>
                                                        <Button size="sm" className="h-9 px-6 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-lg transition-all shadow-lg shadow-white/5">
                                                            View Report
                                                        </Button>
                                                    </Link>
                                                    <Button size="icon" variant="ghost" className="h-10 w-10 border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all">
                                                        <MoreVertical className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-5 border-t border-white/5 flex flex-wrap items-center gap-8">
                                            <span className="text-xs font-bold text-red-500/80 flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                                                12 Critical
                                            </span>
                                            <span className="text-xs font-bold text-yellow-500/80 flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                                                23 Elevated
                                            </span>
                                            <span className="text-xs font-bold text-blue-500/80 flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                                                15 Baseline
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="text-center pt-8 border-t border-white/5">
                        <Button variant="ghost" className="text-sm font-bold text-white/30 hover:text-white h-12 w-full max-w-xs hover:bg-white/5 transition-all rounded-xl">
                            Load older audits
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="p-20 rounded-2xl bg-[#0A0A0A] border border-white/5 text-center">
                    <History className="h-12 w-12 text-white/10 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">No Audit History</h3>
                    <p className="text-sm text-white/40 mb-8">You haven't performed any security audits yet.</p>
                    <Link href="/dashboard/new-scan">
                        <Button className="h-14 px-10 bg-white text-black hover:bg-neutral-200 font-bold text-sm rounded-xl shadow-xl shadow-white/5 transition-all">
                            Start First Audit
                            <Zap className="ml-2 h-4 w-4 fill-black" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

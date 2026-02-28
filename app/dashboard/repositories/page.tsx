import React from "react";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderGit2, TrendingUp, TrendingDown, Minus, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function RepositoriesPage() {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/login");
    }

    // Fetch user's repositories
    const { data: repositories } = await supabaseAdmin
        .from("repositories")
        .select("*")
        .eq("user_id", userId)
        .order("last_scan_at", { ascending: false });

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case "improving": return <TrendingUp className="h-4 w-4 text-green-400" />;
            case "declining": return <TrendingDown className="h-4 w-4 text-red-400" />;
            default: return <Minus className="h-4 w-4 text-gray-400" />;
        }
    };

    const getTrendText = (trend: string) => {
        switch (trend) {
            case "improving": return "↑ Improving";
            case "declining": return "↓ Declining";
            default: return "→ Stable";
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400";
        if (score >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Monitored Repositories</h1>
                    <p className="text-sm text-white/50">Active repository targets configured for continuous security monitoring.</p>
                </div>
                <Link href="/dashboard/new-scan">
                    <Button className="h-11 px-6 bg-white text-black hover:bg-neutral-200 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-[0.98]">
                        Add Repository
                    </Button>
                </Link>
            </div>

            {/* Repositories List */}
            {repositories && repositories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {repositories.map((repo) => (
                        <Link key={repo.id} href={`/chat?repoId=${repo.id}`} className="block group">
                            <div className="p-6 bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all rounded-xl relative overflow-hidden cursor-pointer">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                                        <FolderGit2 className="h-6 w-6 text-white/40 group-hover:text-purple-400 transition-colors" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors truncate tracking-tight">
                                            {repo.name}
                                        </h3>
                                        <p className="text-xs text-white/40 mt-1 truncate font-medium">{repo.url}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Last Audit</div>
                                        <div className="text-xs text-white/80 font-semibold uppercase">
                                            {repo.last_scan_at ? new Date(repo.last_scan_at).toLocaleDateString() : 'No History'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Integrity Score</div>
                                        <div className={cn("text-sm font-bold", getScoreColor(repo.latest_score || 0))}>
                                            {repo.latest_score || 0}/100
                                            <span className="ml-2 text-[10px] font-bold opacity-40 uppercase tracking-tighter">
                                                {repo.trend || "Stable"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                                    <Link href={`/dashboard/new-scan?repo=${repo.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                                        <Button size="sm" className="w-full h-9 bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 text-xs font-bold transition-all text-white/60 hover:text-white rounded-lg">
                                            Initiate Scan
                                        </Button>
                                    </Link>
                                    <Link href={`/dashboard/scans?repo=${repo.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                                        <Button size="sm" className="w-full h-9 bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 text-xs font-bold transition-all text-white/60 hover:text-white rounded-lg">
                                            View History
                                        </Button>
                                    </Link>
                                    <Link href={`/dashboard/repositories/${repo.id}/settings`} onClick={(e) => e.stopPropagation()}>
                                        <Button size="icon" variant="ghost" className="h-10 w-10 border border-white/10 hover:border-white/30 text-white/40 hover:text-white transition-all">
                                            <SettingsIcon className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="p-20 rounded-2xl bg-[#0A0A0A] border border-white/5 text-center">
                    <FolderGit2 className="h-12 w-12 text-white/10 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">No Monitored Repositories</h3>
                    <p className="text-sm text-white/40 mb-8">Add your first repository to begin continuous security monitoring.</p>
                    <Link href="/dashboard/new-scan">
                        <Button className="h-14 px-10 bg-white text-black hover:bg-neutral-200 font-bold text-sm rounded-xl shadow-xl transition-all">
                            Add First Repository
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

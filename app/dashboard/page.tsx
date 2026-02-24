import React from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
    Shield,
    Activity,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Clock,
    Terminal,
    Globe,
    Cpu,
    Zap,
    History,
    Search,
    ShieldCheck,
    BarChart3,
    Layers,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) return redirect("/login");

    const supabase = await createClient();

    // 1. Fetch User Profile for Plan & Capacity
    // Map Clerk user to Supabase UUID via email since Supabase uses UUIDs
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.primaryEmailAddress?.emailAddress)
        .maybeSingle();

    const planTier = (profile?.plan_tier || "free") as "free" | "starter" | "professional" | "enterprise";
    const supabaseUserId = profile?.id;

    const scanLimits = {
        free: 1,
        starter: 10,
        professional: 1000, // Visual limit for "unlimited" feel
        enterprise: 5000,
    };

    const scanLimit = scanLimits[planTier];
    const scansRemaining = profile?.scans_remaining || 0;
    const scansUsed = Math.max(0, scanLimit - scansRemaining);

    // 2. Fetch Aggregated Scan Data (Only if we have a mapped Supabase UUID)
    let scans: any[] = [];
    if (supabaseUserId) {
        const { data } = await supabase
            .from("scans")
            .select("id, score, repo_url, created_at, status")
            .eq("user_id", supabaseUserId)
            .order("created_at", { ascending: false });
        scans = data || [];
    }

    const recentScans = scans?.slice(0, 5) || [];
    const totalScans = scans?.length || 0;

    // Calculate Average Score
    const avgScore = totalScans > 0
        ? Math.round(scans!.reduce((acc, s) => acc + (s.score || 0), 0) / totalScans)
        : 0;

    // 3. Fetch Repository Data
    let repoCount = 0;
    if (supabaseUserId) {
        const { count } = await supabase
            .from("repositories")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", supabaseUserId);
        repoCount = count || 0;
    }

    // 4. Fetch Issue Statistics (Across all user's scans)
    // We get all scan IDs first to filter issues
    const scanIds = scans?.map(s => s.id) || [];
    let totalIssues = 0;
    let criticalIssues = 0;

    if (scanIds.length > 0) {
        const { data: issuesData } = await supabase
            .from("issues")
            .select("severity")
            .in("scan_id", scanIds);

        totalIssues = issuesData?.length || 0;
        criticalIssues = issuesData?.filter(i => i.severity === 'critical' || i.severity === 'high').length || 0;
    }

    const metrics = [
        {
            label: "Total Detections",
            value: totalIssues.toString(),
            color: "text-red-400",
            sub: `${criticalIssues} high-risk findings`,
            icon: AlertCircle
        },
        {
            label: "Integrity Average",
            value: `${avgScore}%`,
            color: "text-purple-400",
            sub: "Overall security posture",
            icon: ShieldCheck
        },
        {
            label: "Monitored Assets",
            value: (repoCount || 0).toString(),
            color: "text-blue-400",
            sub: "Active repository targets",
            icon: Globe
        },
        {
            label: "Audit Capacity",
            value: planTier.charAt(0).toUpperCase() + planTier.slice(1),
            color: "text-green-400",
            sub: `${scansRemaining} audits available`,
            icon: Activity
        },
    ];

    const telemetry = [
        { label: "Control Plane", status: "Active", icon: Cpu, color: "text-emerald-400" },
        { label: "Deployment", status: "Global Edge", icon: Globe, color: "text-blue-400" },
        { label: "Heartbeat", status: "Synchronized", icon: Activity, color: "text-purple-400" },
        { label: "Auth Layer", status: "Encrypted", icon: Lock, color: "text-orange-400" },
    ];

    return (
        <div className="space-y-10 max-w-[1600px] mx-auto pb-24 animate-in fade-in duration-700">

            {/* Header Section */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between pb-8 border-b border-zinc-800">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Security overview</h1>
                    <p className="text-zinc-500 font-medium">Strategic intelligence and operational health metrics</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {telemetry.map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group">
                            <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-zinc-500">{item.label}:</span>
                                <span className="text-xs font-semibold text-zinc-300">{item.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {metrics.map((metric, i) => (
                    <div key={i} className="group relative p-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all rounded-3xl overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-semibold text-zinc-500 tracking-tight flex items-center gap-2">
                                    <metric.icon className={cn("w-4 h-4", metric.color)} />
                                    {metric.label}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold tracking-tight text-zinc-100">
                                    {metric.value}
                                </div>
                                <div className="text-xs text-zinc-500 font-medium">{metric.sub}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Actions & History */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Strategic Action Card */}
                    <Link
                        href="/dashboard/new-scan"
                        className="relative block p-8 md:p-12 bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden group shadow-2xl hover:border-indigo-500/30 transition-all duration-500"
                    >
                        {/* Decorative background flair */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/[0.03] blur-[120px] -mr-64 -mt-64 group-hover:bg-indigo-500/[0.08] transition-all duration-1000" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex-1 space-y-3 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 tracking-tight">
                                    <Zap className="w-3 h-3 fill-current" /> Priority operations
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Initiate new audit pipeline</h2>
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-md">
                                    Deploy our specialized AI agents to analyze a repository or infrastructure endpoint for vulnerabilities.
                                </p>
                            </div>
                            <div className="shrink-0 w-full md:w-auto">
                                <Button className="w-full md:w-auto h-12 px-8 bg-zinc-100 text-zinc-950 group-hover:bg-white font-bold text-sm rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                                    Initiate now
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Recent Audits List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <History className="w-4 h-4 text-zinc-500" />
                                <h2 className="text-lg font-bold text-zinc-100">Execution history</h2>
                            </div>
                            <Link href="/dashboard/scans" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                                View full history
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentScans.length > 0 ? (
                                recentScans.map((scan) => (
                                    <Link
                                        key={scan.id}
                                        href={`/dashboard/report/${scan.id}`}
                                        className="group flex items-center justify-between p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all rounded-2xl"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                                                (scan.score || 0) >= 80 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                                    (scan.score || 0) >= 50 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                                        "bg-red-500/10 border-red-500/20 text-red-500"
                                            )}>
                                                <Shield className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors truncate">
                                                    {scan.repo_url?.split('/').pop()}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">
                                                        {new Date(scan.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {new Date(scan.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight">
                                                        {scan.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="hidden sm:flex flex-col items-end">
                                                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight mb-0.5">Integrity</div>
                                                <div className={cn(
                                                    "text-lg font-bold tracking-tight",
                                                    (scan.score || 0) >= 80 ? "text-emerald-400" :
                                                        (scan.score || 0) >= 50 ? "text-amber-400" :
                                                            "text-red-500"
                                                )}>
                                                    {scan.score}%
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 border border-zinc-800 rounded-3xl bg-zinc-900/30">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-600">
                                        <Terminal className="w-6 h-6" />
                                    </div>
                                    <div className="max-w-xs space-y-1">
                                        <h3 className="text-base font-semibold text-zinc-300">No execution history</h3>
                                        <p className="text-sm text-zinc-500">Launch your first audit to populate your telemetry dashboard.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Insights & Plan */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Capacity Visualization */}
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Resource allotment</h3>
                            <div className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase">
                                {planTier} TIER
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="relative w-36 h-36">
                                <div className="absolute inset-0 rounded-full border-[10px] border-zinc-800" />
                                <div
                                    className="absolute inset-0 rounded-full border-[10px] border-indigo-500/40"
                                    style={{ clipPath: `inset(0 0 ${100 - (scansUsed / scanLimit * 100)}% 0)` }}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-zinc-100">{scansUsed}/<span className="text-zinc-600">{scanLimit}</span></span>
                                    <span className="text-[10px] font-bold text-zinc-500 tracking-tight mt-0.5">Audits used</span>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-500 font-medium text-center mt-6">
                                You have <span className="text-zinc-100">{scansRemaining}</span> audits remaining in this cycle.
                            </p>
                        </div>

                        <Link href="/pricing" className="block">
                            <Button variant="outline" className="w-full h-11 rounded-xl border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100 font-semibold text-sm transition-all">
                                Expand infrastructure
                            </Button>
                        </Link>
                    </div>

                    {/* Operational Guardrails */}
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-5">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Security guardrails</h3>

                        <div className="space-y-3">
                            {[
                                { label: "Monitoring", status: "Active", sub: "24/7 scanning of assets", icon: Activity },
                                { label: "Automated Pathing", status: "Operational", sub: "Strategic fix generation", icon: Zap },
                                { label: "Integrity Checks", status: "Stable", sub: "Pattern sanity", icon: ShieldCheck },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-zinc-950/30 border border-zinc-800">
                                    <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                                        <item.icon className="w-4 h-4 text-zinc-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-zinc-200">{item.label}</span>
                                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-[11px] text-zinc-500 font-medium">{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

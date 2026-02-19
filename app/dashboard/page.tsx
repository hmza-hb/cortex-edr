import React from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // 1. Fetch User Profile for Plan & Capacity
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const planTier = (profile?.plan_tier || "free") as "free" | "starter" | "professional" | "enterprise";

    const scanLimits = {
        free: 1,
        starter: 10,
        professional: 1000, // Visual limit for "unlimited" feel
        enterprise: 5000,
    };

    const scanLimit = scanLimits[planTier];
    const scansRemaining = profile?.scans_remaining || 0;
    const scansUsed = Math.max(0, scanLimit - scansRemaining);

    // 2. Fetch Aggregated Scan Data
    const { data: scans } = await supabase
        .from("scans")
        .select("id, score, repo_url, created_at, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const recentScans = scans?.slice(0, 5) || [];
    const totalScans = scans?.length || 0;

    // Calculate Average Score
    const avgScore = totalScans > 0
        ? Math.round(scans!.reduce((acc, s) => acc + (s.score || 0), 0) / totalScans)
        : 0;

    // 3. Fetch Repository Data
    const { count: repoCount } = await supabase
        .from("repositories")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

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
        <div className="space-y-12 max-w-[1600px] mx-auto pb-24 animate-in fade-in duration-1000">

            {/* Header Telemetry HUD */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 pb-4 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex -space-x-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <div className="h-2 w-2 rounded-full bg-blue-400/40" />
                        </div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                            Command Interface | Secure Session Active
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Security Overview
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {telemetry.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
                            <item.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", item.color)} />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none mb-1.5">{item.label}</span>
                                <span className="text-xs font-bold text-white/80">{item.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {metrics.map((metric, i) => (
                    <div key={i} className="group relative p-8 bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all rounded-[32px] overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                            <metric.icon className="h-32 w-32 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="text-[10px] font-black text-white/30 tracking-[0.2em] uppercase flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    {metric.label}
                                </div>
                                <div className="p-2 rounded-lg bg-white/5 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrendingUp className="w-3.5 h-3.5 text-white/40" />
                                </div>
                            </div>
                            <div className={cn("text-5xl font-extrabold tracking-tighter mb-3", metric.color)}>
                                {metric.value}
                            </div>
                            <div className="text-sm text-white/40 font-medium italic">{metric.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Actions & History */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Strategic Action Card */}
                    <div className="p-10 bg-gradient-to-br from-blue-600/10 via-[#0A0A0A] to-[#0A0A0A] border border-blue-500/20 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.03] blur-[120px] -mr-64 -mt-64 group-hover:bg-blue-500/[0.05] transition-all duration-1000" />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                    <Zap className="w-3 h-3 fill-current" /> Priority Operations
                                </div>
                                <h2 className="text-3xl font-bold text-white tracking-tight">Initiate New Audit Pipeline</h2>
                                <p className="text-white/50 text-base font-medium leading-relaxed max-w-md">
                                    Deploy our specialized AI agents to analyze a repository or infrastructure endpoint for vulnerabilities.
                                </p>
                            </div>
                            <Link href="/dashboard/new-scan" className="shrink-0 w-full md:w-auto">
                                <Button className="w-full md:w-auto h-16 px-10 bg-white text-black hover:bg-neutral-200 font-extrabold text-base rounded-2xl transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3">
                                    Launch Scanner
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Audits List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-white/20" />
                                <h2 className="text-xl font-bold text-white">Execution History</h2>
                            </div>
                            <Link href="/dashboard/scans" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-[0.2em]">
                                Explore Vault
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentScans.length > 0 ? (
                                recentScans.map((scan) => (
                                    <Link
                                        key={scan.id}
                                        href={`/dashboard/report/${scan.id}`}
                                        className="group flex items-center justify-between p-6 bg-[#0A0A0A] border border-white/5 hover:border-white/20 transition-all rounded-3xl"
                                    >
                                        <div className="flex items-center gap-5 min-w-0">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-105",
                                                (scan.score || 0) >= 80 ? "bg-green-500/10 border-green-500/20 text-green-400" :
                                                    (scan.score || 0) >= 50 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                                                        "bg-red-500/10 border-red-500/20 text-red-400"
                                            )}>
                                                <Shield className="w-6 h-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                                    {scan.repo_url?.split('/').pop()}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-white/30 font-medium">
                                                        {new Date(scan.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                                        {scan.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10">
                                            <div className="hidden sm:flex flex-col items-end">
                                                <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5">Integrity</div>
                                                <div className={cn(
                                                    "text-xl font-extrabold tracking-tight",
                                                    (scan.score || 0) >= 80 ? "text-green-400" :
                                                        (scan.score || 0) >= 50 ? "text-yellow-400" :
                                                            "text-red-400"
                                                )}>
                                                    {scan.score}%
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/10 transition-all">
                                                <ArrowRight className="w-4 h-4 text-white/40" />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-white/10 rounded-[40px] bg-white/[0.01]">
                                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/20">
                                        <Terminal className="w-8 h-8" />
                                    </div>
                                    <div className="max-w-xs space-y-2">
                                        <h3 className="text-lg font-bold text-white/80">No Execution History</h3>
                                        <p className="text-sm text-white/40 font-medium">Start your first audit to populate your telemetry dashboard.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Insights & Plan */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Capacity Visualization */}
                    <div className="p-8 bg-[#0A0A0A] border border-white/5 rounded-[40px] space-y-8 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/5 blur-[80px] -z-10" />

                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">Resource Allotment</h3>
                            <div className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-widest">
                                {planTier} TIER
                            </div>
                        </div>

                        <div className="flex items-center justify-center py-6">
                            <div className="relative w-40 h-40">
                                {/* SVG Circular Progress would go here, using a simpler representation for now */}
                                <div className="absolute inset-0 rounded-full border-[12px] border-white/5" />
                                <div
                                    className="absolute inset-0 rounded-full border-[12px] border-purple-500/40"
                                    style={{ clipPath: `inset(0 0 ${100 - (scansUsed / scanLimit * 100)}% 0)` }}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-white">{scansUsed}/<span className="text-white/30">{scanLimit}</span></span>
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Audits Used</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-white/50 font-medium leading-relaxed text-center">
                                You have <span className="text-white">{scansRemaining}</span> security audits remaining in your current cycle.
                            </p>
                            <Link href="/pricing" className="block">
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 hover:bg-white hover:text-black hover:border-white font-bold text-sm tracking-tight transition-all">
                                    Expand Infrastructure
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Operational Guardrails */}
                    <div className="p-8 bg-[#0A0A0A] border border-white/5 rounded-[40px] space-y-6">
                        <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">Security Guardrails</h3>

                        <div className="space-y-4">
                            {[
                                { label: "Real-time Monitoring", status: "Active", sub: "24/7 scanning of assets", icon: Activity },
                                { label: "Automated Patching", status: "Operational", sub: "Strategic fix generation", icon: Zap },
                                { label: "Integrity Verification", status: "Stable", sub: "Codebase pattern sanity", icon: ShieldCheck },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                        <item.icon className="w-5 h-5 text-white/40" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-sm font-bold text-white tracking-tight">{item.label}</span>
                                            <span className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                        </div>
                                        <p className="text-[11px] text-white/30 font-medium">{item.sub}</p>
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

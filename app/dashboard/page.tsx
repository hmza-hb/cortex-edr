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
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch user's recent scans
    const { data: scans } = await supabase
        .from("scans")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

    const totalScans = scans?.length || 0;
    const avgScore = scans && scans.length > 0
        ? Math.round(scans.reduce((acc, scan) => acc + (scan.score || 0), 0) / scans.length)
        : 0;

    const metrics = [
        { label: "Vulnerabilities Detected", value: "342", color: "text-red-400", sub: "+12.4% vs last cycle" },
        { label: "Integrity Core Score", value: `${avgScore}.4%`, color: "text-purple-400", sub: "Operational baseline stable" },
        { label: "Active Audit Coverage", value: "89.2%", color: "text-blue-400", sub: "184 targets monitored" },
        { label: "Threat Neutralization", value: "94.1%", color: "text-green-400", sub: "Automated patch success" },
    ];

    const telemetry = [
        { label: "System", status: "Stable", icon: Cpu },
        { label: "Network", status: "Global", icon: Globe },
        { label: "Latency", status: "14ms", icon: Activity },
        { label: "Nodes", status: "2.4k", icon: Shield },
    ];

    const activities = [
        { time: "09:32:11", msg: "Buffer overflow detected in main-api branch", type: "CRITICAL" },
        { time: "09:28:45", msg: "Repository sync completed: core-engine", type: "SYSTEM" },
        { time: "09:15:02", msg: "New credential leak audit initiated", type: "AUDIT" },
        { time: "08:55:30", msg: "Static analysis: 1,402 files verified in mobile-app", type: "SUCCESS" },
        { time: "08:42:19", msg: "Configuration drift detected: staging-server", type: "WARNING" },
    ];

    return (
        <div className="space-y-10 max-w-[1600px] mx-auto pb-20">
            {/* Header Telemetry HUD */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-2 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20" />
                        <span className="text-xs font-semibold text-white/50 tracking-wider">
                            Operational Status | Node: US-EAST-1
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Command Center
                    </h1>
                </div>

                <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                    {telemetry.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl shrink-0 h-11">
                            <item.icon className="h-3.5 w-3.5 text-white/40" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">{item.label}</span>
                                <span className="text-xs font-bold text-white">{item.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* High Density Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {metrics.map((metric, i) => (
                    <div key={i} className="group relative p-6 bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all rounded-xl overflow-hidden active:scale-95">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Activity className="h-24 w-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-xs font-bold text-white/40 tracking-widest uppercase mb-4 flex items-center gap-2">
                                <div className="h-1 w-3 bg-purple-500 rounded-full" />
                                {metric.label}
                            </div>
                            <div className={cn("text-4xl font-bold tracking-tight mb-2", metric.color)}>
                                {metric.value}
                            </div>
                            <div className="text-xs text-white/40 font-medium">{metric.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Functional Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Compliance Scorecard */}
                <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl" />
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-8">Compliance Scorecard</h3>
                    <div className="space-y-6">
                        {[
                            { label: "SOC2 Type II", value: 94, color: "bg-green-500" },
                            { label: "ISO 27001:2022", value: 88, color: "bg-purple-500" },
                            { label: "GDPR Privacy", value: 100, color: "bg-blue-500" }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-semibold text-white/40">{item.label}</span>
                                    <span className="text-xs font-bold text-white">{item.value}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${item.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Threat Vectors */}
                <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl" />
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-8">Top Threat Vectors</h3>
                    <div className="space-y-4">
                        {[
                            { label: "Injection Patterns", count: 124, trend: "+12%" },
                            { label: "Broken Identity", count: 86, trend: "-4%" },
                            { label: "Data Exposure", count: 42, trend: "+2%" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <div>
                                    <div className="text-sm font-bold text-white tracking-tight">{item.label}</div>
                                    <div className="text-[10px] font-bold text-white/30 uppercase mt-0.5 tracking-wider">Global Detections</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-white">{item.count}</div>
                                    <div className={cn("text-[10px] font-bold", item.trend.startsWith('+') ? "text-red-400" : "text-green-400")}>{item.trend}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deployment Topology */}
                <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl" />
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-8">Deployment Topology</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { region: "US-EAST-1", nodes: 412, status: "Healthy" },
                            { region: "EU-CENT-1", nodes: 284, status: "Stable" },
                            { region: "AP-SOUTH-1", nodes: 156, status: "Latent" },
                            { region: "SA-EAST-1", nodes: 92, status: "Healthy" }
                        ].map((node, i) => (
                            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="text-[10px] font-bold text-white/30 mb-2 tracking-widest uppercase">{node.region}</div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-white tracking-tight">{node.nodes} Nodes</span>
                                    <div className={cn(
                                        "h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]",
                                        node.status === "Healthy" ? "bg-green-500" : node.status === "Stable" ? "bg-blue-500" : "bg-yellow-500"
                                    )} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Audit Start Panel */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="p-8 bg-[#0A0A0A] border border-white/5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] -mr-32 -mt-32" />

                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <Terminal className="h-6 w-6 text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">Rapid Threat Audit</h2>
                                    <p className="text-sm text-white/50 mt-1 font-medium">Initiate manual scanning across multiple repository targets.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Globe className="h-4 w-4 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter repository URL..."
                                    className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all font-medium"
                                />
                            </div>
                            <Link href="/dashboard/new-scan" className="shrink-0">
                                <Button className="h-14 px-8 bg-white text-black hover:bg-neutral-200 font-bold text-sm rounded-xl transition-all shadow-xl shadow-white/5">
                                    Start Audit
                                    <Zap className="ml-2 h-4 w-4 fill-black" />
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <span className="text-xs font-bold text-white/30 uppercase tracking-widest block mb-5">Priority Targets</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {["main-engine-api", "frontend-mobile", "auth-service", "data-lake-v2"].map((repo, i) => (
                                    <button key={i} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-left truncate">
                                        {repo}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Audits */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6 px-1">
                            <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest">Recent Security Audits</h2>
                            <Link href="/dashboard/scans" className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors flex items-center gap-2">
                                View Vault <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        <div className="grid gap-3">
                            {scans?.map((scan) => (
                                <div key={scan.id} className="group p-5 bg-[#0A0A0A]/50 border border-white/5 hover:border-white/10 transition-all rounded-xl hover:bg-[#0A0A0A]">
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                <Shield className={cn("h-5 w-5", (scan.score || 0) > 80 ? "text-green-500" : "text-red-500")} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                                                    {scan.repo_url?.split('/').pop()}
                                                </h3>
                                                <p className="text-xs text-white/40 mt-1 font-medium truncate">{scan.repo_url}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 shrink-0">
                                            <div className="hidden md:flex flex-col items-end">
                                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Integrity Score</span>
                                                <span className={cn("text-xl font-bold tracking-tight", (scan.score || 0) > 80 ? "text-green-500" : "text-yellow-500")}>
                                                    {scan.score}/100
                                                </span>
                                            </div>
                                            <Link href={`/dashboard/scans/${scan.id}`}>
                                                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10">
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Telemetry Feed */}
                <div className="space-y-8">
                    {/* Activity Feed */}
                    <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl flex flex-col h-full min-h-[500px]">
                        <div className="flex items-center gap-3 mb-8">
                            <Activity className="h-4 w-4 text-purple-400" />
                            <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest">Security Event Feed</h2>
                        </div>

                        <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-none">
                            {activities.map((act, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={cn(
                                            "h-1.5 w-1.5 rounded-full mt-1.5 ring-4",
                                            act.type === "CRITICAL" ? "bg-red-500 ring-red-500/10" :
                                                act.type === "WARNING" ? "bg-yellow-500 ring-yellow-500/10" :
                                                    "bg-blue-500 ring-blue-500/10"
                                        )} />
                                        <div className="w-[1px] flex-1 bg-white/5 group-last:bg-transparent" />
                                    </div>
                                    <div className="pb-6">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className="text-xs font-mono text-white/30 font-bold">{act.time}</span>
                                            <span className={cn(
                                                "text-[9px] font-bold px-1.5 py-0.5 rounded border border-current/20 uppercase tracking-tight",
                                                act.type === "CRITICAL" ? "bg-red-500/10 text-red-500" :
                                                    act.type === "SYSTEM" ? "bg-blue-500/10 text-blue-500" :
                                                        act.type === "AUDIT" ? "bg-purple-500/10 text-purple-500" :
                                                            "bg-green-500/10 text-green-500"
                                            )}>
                                                {act.type}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/70 leading-relaxed font-medium">{act.msg}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <Button variant="ghost" className="w-full text-xs font-bold text-white/30 uppercase tracking-widest hover:bg-white/5 h-12 hover:text-white transition-colors rounded-xl border border-white/5">
                                View Full Activity Log
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats Mini */}
                    <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/10 rounded-2xl relative group">
                        <div className="relative z-10">
                            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <History className="h-3.5 w-3.5" />
                                SCAN CAPACITY
                            </h3>
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className="text-2xl font-bold text-white tracking-tight">14 / 20</div>
                                    <div className="text-[10px] font-bold text-white/30 uppercase mt-1">MONTHLY ALLOTMENT</div>
                                </div>
                                <div className="h-10 w-24 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                    <div className="h-1 bg-white/10 w-16 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[70%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


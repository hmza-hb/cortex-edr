import React from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SYSTEM_CONFIG, TierId } from "@/lib/config/system";
import {
    Shield,
    ShieldCheck,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Activity,
    Zap,
    Clock,
    CheckCircle,
    XCircle,
    Plus,
    BarChart3,
    FileText,
    MessageSquare,
    Settings,
    ArrowRight,
    Github,
    Target,
    Eye,
    RefreshCw,
    Calendar,
    Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) return redirect("/login");

    const supabase = await createClient();

    // Fetch user profile and scan data
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.primaryEmailAddress?.emailAddress)
        .maybeSingle();

    const rawTier = profile?.plan_tier || "vibe_coder";
    const tierId = rawTier.toUpperCase() as TierId;
    const tierConfig = SYSTEM_CONFIG.tiers[tierId] || SYSTEM_CONFIG.tiers[TierId.VIBE_CODER];

    const scanLimit = typeof tierConfig.limits.maxScansPerMonth === 'number'
        ? tierConfig.limits.maxScansPerMonth
        : 1000;

    const scansRemaining = profile?.scans_remaining ?? scanLimit;
    const scansUsed = Math.max(0, scanLimit - scansRemaining);

    // Fetch scan data
    let scans: any[] = [];
    if (profile?.id) {
        const { data } = await supabase
            .from("scans")
            .select("id, score, repo_url, created_at, status")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false });
        scans = data || [];
    }

    const recentScans = scans?.slice(0, 5) || [];
    const totalScans = scans?.length || 0;
    const avgScore = totalScans > 0
        ? Math.round(scans!.reduce((acc, s) => acc + (s.score || 0), 0) / totalScans)
        : 0;

    // Fetch repositories
    let repoCount = 0;
    if (profile?.id) {
        const { count } = await supabase
            .from("repositories")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", profile.id);
        repoCount = count || 0;
    }

    // Fetch issue statistics
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

    // Mock data for demo purposes (replace with real data later)
    const securityTrend = [
        { date: 'Jan 20', score: 65 },
        { date: 'Jan 25', score: 72 },
        { date: 'Feb 1', score: 78 },
        { date: 'Feb 5', score: 82 },
        { date: 'Feb 10', score: 85 },
        { date: 'Today', score: avgScore || 0 }
    ];

    const topVulnerabilities = [
        { type: 'SQL Injection', count: 3, severity: 'critical' },
        { type: 'XSS', count: 5, severity: 'high' },
        { type: 'Weak Authentication', count: 2, severity: 'medium' }
    ];

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-24 animate-in fade-in duration-700">

            {/* Hero Section - Security Overview */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/50 p-8 md:p-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5" />
                <div className="relative z-10">

                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">System Online</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Command Center</span>
                            </h1>
                            <p className="text-zinc-400 text-lg mt-2 max-w-xl">
                                Your comprehensive security intelligence hub. Monitor threats, track progress, and take action.
                            </p>
                        </div>

                        {/* Security Score Gauge */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 mb-4">
                                {/* Background circle */}
                                <div className="absolute inset-0 rounded-full border-[8px] border-zinc-700" />
                                {/* Progress circle */}
                                <div
                                    className="absolute inset-0 rounded-full border-[8px] border-transparent"
                                    style={{
                                        background: `conic-gradient(from 0deg, ${
                                            avgScore >= 80 ? '#10b981' :
                                            avgScore >= 60 ? '#f59e0b' :
                                            '#ef4444'
                                        } ${avgScore * 3.6}deg, transparent ${avgScore * 3.6}deg)`
                                    }}
                                />
                                {/* Inner circle */}
                                <div className="absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className={cn(
                                            "text-3xl font-black",
                                            avgScore >= 80 ? "text-green-400" :
                                            avgScore >= 60 ? "text-yellow-400" :
                                            "text-red-400"
                                        )}>
                                            {avgScore}%
                                        </div>
                                        <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Security Score</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                {avgScore >= 80 ? (
                                    <>
                                        <ShieldCheck className="h-4 w-4 text-green-400" />
                                        <span className="text-green-400 font-semibold">Excellent</span>
                                    </>
                                ) : avgScore >= 60 ? (
                                    <>
                                        <Shield className="h-4 w-4 text-yellow-400" />
                                        <span className="text-yellow-400 font-semibold">Good</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle className="h-4 w-4 text-red-400" />
                                        <span className="text-red-400 font-semibold">Needs Attention</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <AlertTriangle className="h-4 w-4 text-red-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">{criticalIssues}</div>
                                    <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Critical Issues</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <Target className="h-4 w-4 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">{repoCount}</div>
                                    <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Monitored Repos</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                    <Activity className="h-4 w-4 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">{totalScans}</div>
                                    <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Total Scans</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <Zap className="h-4 w-4 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">{scansRemaining}</div>
                                    <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Scans Left</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-3">
                        <Link href="/dashboard/new-scan">
                            <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Start New Scan
                            </Button>
                        </Link>
                        <Link href="/chat">
                            <Button variant="outline" className="h-12 px-6 border-zinc-600 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold rounded-xl transition-all flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Ask AI Advisor
                            </Button>
                        </Link>
                        <Link href="/dashboard/scans">
                            <Button variant="outline" className="h-12 px-6 border-zinc-600 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold rounded-xl transition-all flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                View Reports
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Security Trend Chart */}
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-400" />
                                    Security Trend
                                </h2>
                                <p className="text-sm text-zinc-400">Your security posture over the last 30 days</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    <span className="text-zinc-400">Score</span>
                                </div>
                            </div>
                        </div>

                        {/* Simple Chart Visualization */}
                        <div className="h-48 flex items-end justify-between gap-2 mb-4">
                            {securityTrend.map((point, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all hover:from-blue-500 hover:to-blue-300"
                                        style={{ height: `${(point.score / 100) * 160}px` }}
                                    />
                                    <span className="text-xs text-zinc-500 mt-2 font-medium">{point.date}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 font-semibold">+12% improvement</span>
                                <span className="text-zinc-500">this month</span>
                            </div>
                            <div className="text-zinc-500">Last updated: Just now</div>
                        </div>
                    </div>

                    {/* Recent Scans & Critical Issues */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Recent Scans */}
                        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-purple-400" />
                                    Recent Scans
                                </h3>
                                <Link href="/dashboard/scans" className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {recentScans.length > 0 ? (
                                    recentScans.map((scan) => (
                                        <Link
                                            key={scan.id}
                                            href={`/dashboard/report/${scan.id}`}
                                            className="group flex items-center justify-between p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-xl hover:border-zinc-600/50 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center",
                                                    scan.status === 'completed' ? "bg-green-500/10 border border-green-500/20" :
                                                    scan.status === 'failed' ? "bg-red-500/10 border border-red-500/20" :
                                                    "bg-yellow-500/10 border border-yellow-500/20"
                                                )}>
                                                    {scan.status === 'completed' ? (
                                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                                    ) : scan.status === 'failed' ? (
                                                        <XCircle className="h-4 w-4 text-red-400" />
                                                    ) : (
                                                        <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                        {scan.repo_url?.split('/').pop()}
                                                    </div>
                                                    <div className="text-xs text-zinc-500">
                                                        {new Date(scan.created_at).toLocaleDateString()} • {scan.status}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={cn(
                                                    "text-lg font-bold",
                                                    (scan.score || 0) >= 80 ? "text-green-400" :
                                                    (scan.score || 0) >= 50 ? "text-yellow-400" :
                                                    "text-red-400"
                                                )}>
                                                    {scan.score}%
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                                            <BarChart3 className="h-6 w-6 text-zinc-600" />
                                        </div>
                                        <h4 className="text-white font-semibold mb-2">No scans yet</h4>
                                        <p className="text-zinc-500 text-sm mb-4">Start your first security assessment</p>
                                        <Link href="/dashboard/new-scan">
                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                                                Start Scanning
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Top Vulnerabilities */}
                        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                    Top Vulnerabilities
                                </h3>
                                <Link href="/dashboard/scans" className="text-sm text-red-400 hover:text-red-300 font-medium">
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {topVulnerabilities.map((vuln, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                                vuln.severity === 'critical' ? "bg-red-500/10 border border-red-500/20" :
                                                vuln.severity === 'high' ? "bg-orange-500/10 border border-orange-500/20" :
                                                "bg-yellow-500/10 border border-yellow-500/20"
                                            )}>
                                                <AlertTriangle className={cn(
                                                    "h-4 w-4",
                                                    vuln.severity === 'critical' ? "text-red-400" :
                                                    vuln.severity === 'high' ? "text-orange-400" :
                                                    "text-yellow-400"
                                                )} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-white">{vuln.type}</div>
                                                <div className="text-xs text-zinc-500">{vuln.count} instances found</div>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                            vuln.severity === 'critical' ? "bg-red-500/20 text-red-400" :
                                            vuln.severity === 'high' ? "bg-orange-500/20 text-orange-400" :
                                            "bg-yellow-500/20 text-yellow-400"
                                        )}>
                                            {vuln.severity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Scan Capacity */}
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Scan Capacity</h3>
                                <p className="text-sm text-zinc-400">{rawTier.replace('_', ' ').toUpperCase()} Plan</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-400">Used this month</span>
                                <span className="text-white font-semibold">{scansUsed} / {scanLimit}</span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${(scansUsed / scanLimit) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-zinc-500">
                                <span>{scansRemaining} remaining</span>
                                <span>Resets in 18 days</span>
                            </div>
                        </div>

                        <Link href="/dashboard/new-scan" className="block mt-4">
                            <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl">
                                Start New Scan
                            </Button>
                        </Link>
                    </div>

                    {/* Repository Health */}
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                <Github className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Repository Health</h3>
                                <p className="text-sm text-zinc-400">{repoCount} repositories monitored</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {repoCount > 0 ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">Average health</span>
                                        <span className="text-green-400 font-semibold">85%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">Last scanned</span>
                                        <span className="text-white font-semibold">2 hours ago</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">Active alerts</span>
                                        <span className="text-yellow-400 font-semibold">3</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                                        <Github className="h-6 w-6 text-zinc-600" />
                                    </div>
                                    <h4 className="text-white font-semibold mb-2">No repositories</h4>
                                    <p className="text-zinc-500 text-sm mb-4">Connect your first repository to get started</p>
                                    <Link href="/dashboard/repositories">
                                        <Button size="sm" variant="outline" className="border-zinc-600 hover:bg-zinc-800">
                                            Add Repository
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Advisor */}
                    <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">AI Security Advisor</h3>
                                <p className="text-sm text-zinc-400">Get expert guidance on your findings</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-xl">
                                <p className="text-sm text-zinc-300 italic">"Your authentication layer looks solid, but consider implementing rate limiting for API endpoints."</p>
                            </div>
                        </div>

                        <Link href="/chat">
                            <Button variant="outline" className="w-full border-blue-500/30 hover:bg-blue-500/10 text-blue-400 hover:text-blue-300">
                                Ask AI Advisor
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

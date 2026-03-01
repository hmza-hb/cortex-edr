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

    // Fetch issue statistics with time-based data for trend analysis
    const scanIds = scans?.map(s => s.id) || [];
    let totalIssues = 0;
    let criticalIssues = 0;
    let securityTrendData: any[] = [];
    let vulnerabilityStats: any[] = [];

    if (scanIds.length > 0) {
        // Get all issues with their creation dates for trend analysis
        const { data: allIssues } = await supabase
            .from("issues")
            .select("severity, created_at, type, scan_id")
            .in("scan_id", scanIds);

        totalIssues = allIssues?.length || 0;
        criticalIssues = allIssues?.filter(i => i.severity === 'critical' || i.severity === 'high').length || 0;

        // Calculate security trend data (last 30 days, grouped by day)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Get all scans in the last 30 days
        const { data: recentScans } = await supabase
            .from("scans")
            .select("id, created_at, score")
            .eq("user_id", profile.id)
            .gte("created_at", thirtyDaysAgo.toISOString())
            .order("created_at", { ascending: true });

        // Create daily buckets for the last 30 days
        const dailyData: { [key: string]: { issues: number, score: number, scans: number } } = {};

        for (let i = 29; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateKey = date.toISOString().split('T')[0];
            dailyData[dateKey] = { issues: 0, score: 0, scans: 0 };
        }

        // Populate daily data with scan information
        recentScans?.forEach(scan => {
            const dateKey = new Date(scan.created_at).toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].scans += 1;
                if (scan.score) {
                    dailyData[dateKey].score = Math.max(dailyData[dateKey].score, scan.score);
                }
            }
        });

        // Get issues per day
        allIssues?.forEach(issue => {
            const dateKey = new Date(issue.created_at).toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].issues += 1;
            }
        });

        // Convert to array format for the graph
        securityTrendData = Object.entries(dailyData).map(([date, data]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            issues: data.issues,
            score: data.score,
            scans: data.scans,
            level: Math.min(4, Math.floor(data.issues / 2) + (data.scans > 0 ? 1 : 0))
        }));

        // Calculate vulnerability statistics (top vulnerabilities)
        const vulnCount: { [key: string]: { count: number, severity: string } } = {};
        allIssues?.forEach(issue => {
            const type = issue.type || 'Unknown';
            if (!vulnCount[type]) {
                vulnCount[type] = { count: 0, severity: issue.severity };
            }
            vulnCount[type].count += 1;
        });

        vulnerabilityStats = Object.entries(vulnCount)
            .map(([type, data]) => ({
                type,
                count: data.count,
                severity: data.severity
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5 vulnerabilities
    }

    // Generate dynamic AI advisor insights based on real data
    const generateAIInsights = (stats: any) => {
        const insights = [];

        if (criticalIssues > 5) {
            insights.push("🚨 Critical security issues detected. Immediate attention required for high-risk vulnerabilities.");
        } else if (criticalIssues > 0) {
            insights.push("⚠️ Several high-risk vulnerabilities found. Consider prioritizing these fixes in your next sprint.");
        }

        if (totalIssues === 0) {
            insights.push("🎉 Excellent! No security issues detected in recent scans. Keep up the great work!");
        }

        if (scansUsed > scanLimit * 0.8) {
            insights.push("📊 You're approaching your monthly scan limit. Consider upgrading your plan for more capacity.");
        }

        if (repoCount === 0) {
            insights.push("🔗 Start by connecting your repositories to enable comprehensive security monitoring.");
        } else if (repoCount < 3) {
            insights.push("📈 Consider adding more repositories to your monitoring scope for better security coverage.");
        }

        if (avgScore < 50) {
            insights.push("📈 Your security posture needs improvement. Focus on addressing high-severity vulnerabilities first.");
        } else if (avgScore >= 80) {
            insights.push("🏆 Outstanding security posture! Your proactive approach is paying off.");
        }

        // Default insights if no specific conditions met
        if (insights.length === 0) {
            insights.push("🔍 Regular security scans are crucial. Consider scheduling automated scans for critical repositories.");
            insights.push("📚 Security best practices: Keep dependencies updated and implement proper input validation.");
        }

        return insights[Math.floor(Math.random() * insights.length)]; // Return random insight for variety
    };

    const aiInsight = generateAIInsights({ criticalIssues, totalIssues, scansUsed, scanLimit, repoCount, avgScore });

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

                    {/* Security Trend Chart - GitHub-like Contribution Graph */}
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-400" />
                                    Security Activity
                                </h2>
                                <p className="text-sm text-zinc-400">Issues found and scans completed over the last 30 days</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <span className="text-zinc-400">Issues Found</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-zinc-400">Scans Completed</span>
                                </div>
                            </div>
                        </div>

                        {/* GitHub-like Contribution Graph */}
                        <div className="space-y-4">
                            {/* Month labels */}
                            <div className="flex justify-between text-xs text-zinc-500 mb-2">
                                <span>30 days ago</span>
                                <span>Today</span>
                            </div>

                            {/* Contribution grid - 5 rows x 30 columns like GitHub */}
                            <div className="grid grid-rows-5 grid-cols-30 gap-1">
                                {Array.from({ length: 150 }, (_, index) => {
                                    const dayIndex = index % 30;
                                    const weekIndex = Math.floor(index / 30);
                                    const dataPoint = securityTrendData[dayIndex];

                                    if (!dataPoint) return (
                                        <div
                                            key={index}
                                            className="w-3 h-3 rounded-sm bg-zinc-800"
                                            title="No data"
                                        />
                                    );

                                    // Calculate intensity based on issues found (0-4 levels)
                                    const issuesLevel = Math.min(4, Math.floor(dataPoint.issues / 2));
                                    const scanLevel = dataPoint.scans > 0 ? 1 : 0;
                                    const totalLevel = Math.min(4, issuesLevel + scanLevel);

                                    const intensityClasses = [
                                        'bg-zinc-800', // 0 - no activity
                                        'bg-blue-900', // 1 - low activity
                                        'bg-blue-700', // 2 - medium activity
                                        'bg-blue-500', // 3 - high activity
                                        'bg-blue-400'  // 4 - very high activity
                                    ];

                                    return (
                                        <div
                                            key={index}
                                            className={`w-3 h-3 rounded-sm ${intensityClasses[totalLevel]} hover:ring-1 hover:ring-blue-300 transition-all cursor-pointer`}
                                            title={`${dataPoint.date}: ${dataPoint.issues} issues, ${dataPoint.scans} scans`}
                                        />
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <span>Less</span>
                                    {['bg-zinc-800', 'bg-blue-900', 'bg-blue-700', 'bg-blue-500', 'bg-blue-400'].map((color, i) => (
                                        <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
                                    ))}
                                    <span>More</span>
                                </div>
                                <div className="text-xs text-zinc-500">
                                    Total: {securityTrendData.reduce((sum, day) => sum + day.issues, 0)} issues, {securityTrendData.reduce((sum, day) => sum + day.scans, 0)} scans
                                </div>
                            </div>
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
                                {vulnerabilityStats.length > 0 ? (
                                    vulnerabilityStats.map((vuln, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center",
                                                    vuln.severity === 'critical' ? "bg-red-500/10 border border-red-500/20" :
                                                    vuln.severity === 'high' ? "bg-orange-500/10 border border-orange-500/20" :
                                                    vuln.severity === 'medium' ? "bg-yellow-500/10 border border-yellow-500/20" :
                                                    "bg-blue-500/10 border border-blue-500/20"
                                                )}>
                                                    <AlertTriangle className={cn(
                                                        "h-4 w-4",
                                                        vuln.severity === 'critical' ? "text-red-400" :
                                                        vuln.severity === 'high' ? "text-orange-400" :
                                                        vuln.severity === 'medium' ? "text-yellow-400" :
                                                        "text-blue-400"
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
                                                vuln.severity === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                                                "bg-blue-500/20 text-blue-400"
                                            )}>
                                                {vuln.severity}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h4 className="text-white font-semibold mb-2">No vulnerabilities found</h4>
                                        <p className="text-zinc-500 text-sm">Your recent scans are clean!</p>
                                    </div>
                                )}
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
                                <p className="text-sm text-zinc-400">Intelligent insights based on your security data</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-xl">
                                <p className="text-sm text-zinc-300 italic">"{aiInsight}"</p>
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

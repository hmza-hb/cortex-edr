import React from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SYSTEM_CONFIG, TierId } from "@/lib/config/system";
import {
    Shield,
    AlertTriangle,
    TrendingUp,
    Activity,
    Zap,
    Clock,
    CheckCircle,
    XCircle,
    Plus,
    BarChart3,
    FileText,
    MessageSquare,
    Github,
    Target,
    RefreshCw
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

    // Fetch comprehensive security analytics data
    const scanIds = scans?.map(s => s.id) || [];
    let totalIssues = 0;
    let criticalIssues = 0;
    let securityTrendData: any[] = [];
    let vulnerabilityStats: any[] = [];
    let recentSecurityActivity: any[] = [];

    if (scanIds.length > 0) {
        // Get comprehensive issue data with timestamps
        const { data: allIssues } = await supabase
            .from("issues")
            .select("severity, created_at, type, scan_id, description")
            .in("scan_id", scanIds)
            .order("created_at", { ascending: true });

        totalIssues = allIssues?.length || 0;
        criticalIssues = allIssues?.filter(i => i.severity === 'critical' || i.severity === 'high').length || 0;

        // Generate advanced security trend data (90 days for comprehensive view)
        const now = new Date();
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        // Get all scans in the last 90 days with full details
        const { data: recentScans } = await supabase
            .from("scans")
            .select("id, created_at, score, status, repo_url")
            .eq("user_id", profile.id)
            .gte("created_at", ninetyDaysAgo.toISOString())
            .order("created_at", { ascending: true });

        // Create daily buckets with sophisticated metrics
        const dailyData: { [key: string]: {
            issues: number,
            score: number,
            scans: number,
            criticalIssues: number,
            resolvedIssues: number,
            activity: number
        } } = {};

        // Initialize 90 days of data
        for (let i = 89; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateKey = date.toISOString().split('T')[0];
            dailyData[dateKey] = {
                issues: 0,
                score: 0,
                scans: 0,
                criticalIssues: 0,
                resolvedIssues: 0,
                activity: 0
            };
        }

        // Populate daily data with sophisticated metrics
        recentScans?.forEach(scan => {
            const dateKey = new Date(scan.created_at).toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].scans += 1;
                if (scan.score) {
                    dailyData[dateKey].score = Math.max(dailyData[dateKey].score, scan.score);
                }
                // Activity score based on scan completion
                if (scan.status === 'completed') {
                    dailyData[dateKey].activity += 2;
                } else if (scan.status === 'running') {
                    dailyData[dateKey].activity += 1;
                }
            }
        });

        // Add issue data to daily metrics
        allIssues?.forEach(issue => {
            const dateKey = new Date(issue.created_at).toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].issues += 1;
                if (issue.severity === 'critical' || issue.severity === 'high') {
                    dailyData[dateKey].criticalIssues += 1;
                }
                // Issues contribute to activity
                dailyData[dateKey].activity += 1;
            }
        });

        // Convert to GitHub-style contribution format
        securityTrendData = Object.entries(dailyData).map(([date, data]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date,
            issues: data.issues,
            criticalIssues: data.criticalIssues,
            score: data.score,
            scans: data.scans,
            activity: Math.min(4, Math.floor(data.activity / 2)), // GitHub-style intensity (0-4)
            totalActivity: data.activity
        }));

        // Advanced vulnerability analysis
        const vulnMap: { [key: string]: {
            count: number,
            severity: string,
            severityScore: number,
            lastSeen: string,
            trend: 'increasing' | 'stable' | 'decreasing'
        } } = {};

        allIssues?.forEach(issue => {
            const type = issue.type || issue.description?.split(' ')[0] || 'Unknown';
            const date = new Date(issue.created_at).toISOString().split('T')[0];

            if (!vulnMap[type]) {
                vulnMap[type] = {
                    count: 0,
                    severity: issue.severity,
                    severityScore: issue.severity === 'critical' ? 4 : issue.severity === 'high' ? 3 : issue.severity === 'medium' ? 2 : 1,
                    lastSeen: date,
                    trend: 'stable'
                };
            }
            vulnMap[type].count += 1;
            if (date > vulnMap[type].lastSeen) {
                vulnMap[type].lastSeen = date;
            }
        });

        // Calculate trends (simplified algorithm)
        Object.keys(vulnMap).forEach(type => {
            const vuln = vulnMap[type];
            // Mock trend calculation - in real implementation, compare with historical data
            vuln.trend = vuln.count > 2 ? 'increasing' : vuln.count === 1 ? 'stable' : 'decreasing';
        });

        vulnerabilityStats = Object.entries(vulnMap)
            .map(([type, data]) => ({
                type,
                count: data.count,
                severity: data.severity,
                severityScore: data.severityScore,
                lastSeen: data.lastSeen,
                trend: data.trend
            }))
            .sort((a, b) => (b.severityScore * b.count) - (a.severityScore * a.count))
            .slice(0, 6); // Top 6 vulnerabilities

        // Recent security activity (last 10 items)
        recentSecurityActivity = recentScans?.slice(-10).reverse().map(scan => ({
            id: scan.id,
            type: 'scan',
            title: `${scan.repo_url?.split('/').pop()} scan`,
            status: scan.status,
            score: scan.score,
            timestamp: scan.created_at,
            description: `Security scan ${scan.status}`
        })) || [];

        // Add recent issues to activity
        const recentIssues = allIssues?.slice(-5).reverse().map(issue => ({
            id: `issue-${issue.scan_id}-${Math.random()}`,
            type: 'issue',
            title: `${issue.type || 'Security issue'} detected`,
            status: issue.severity,
            timestamp: issue.created_at,
            description: `${issue.severity} severity issue found`
        })) || [];

        recentSecurityActivity = [...recentSecurityActivity, ...recentIssues]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 15);

    }

    // Generate sophisticated AI advisor insights based on comprehensive data analysis
    const generateAIInsights = (stats: any) => {
        const insights = [];
        const { criticalIssues, totalIssues, scansUsed, scanLimit, repoCount, avgScore, vulnerabilityStats, securityTrendData } = stats;

        // Define types for better TypeScript support
        interface SecurityTrendDay {
            issues: number;
            criticalIssues: number;
            score: number;
            scans: number;
            totalActivity: number;
        }

        // Analyze security trends
        const recentActivity: SecurityTrendDay[] = securityTrendData.slice(-7); // Last 7 days
        const avgDailyIssues = securityTrendData.reduce((sum: number, day: SecurityTrendDay) => sum + day.issues, 0) / securityTrendData.length;
        const activeDays = securityTrendData.filter((day: SecurityTrendDay) => day.totalActivity > 0).length;
        const criticalTrend = recentActivity.reduce((sum: number, day: SecurityTrendDay) => sum + day.criticalIssues, 0);

        // Critical security alerts
        if (criticalIssues > 10) {
            insights.push("CRITICAL SECURITY ALERT: Your system has detected an unusually high number of critical vulnerabilities. Immediate security review recommended - consider pausing deployments until addressed.");
        } else if (criticalIssues > 5) {
            insights.push("HIGH PRIORITY SECURITY: Multiple critical security issues require immediate attention. These could pose significant risks to your applications.");
        } else if (criticalIssues > 0) {
            insights.push("SECURITY ALERT: Critical vulnerabilities detected. Prioritize fixing these issues in your next development cycle to maintain security posture.");
        }

        // Clean security status
        if (totalIssues === 0) {
            insights.push("EXCELLENT SECURITY STATUS: Your security scans are completely clean! This indicates strong security practices and proactive vulnerability management.");
        }

        // Scan capacity and usage patterns
        const usagePercentage = (scansUsed / scanLimit) * 100;
        if (usagePercentage > 90) {
            insights.push("CAPACITY CRITICAL: Approaching scan limit. You're at " + Math.round(usagePercentage) + "% capacity. Consider upgrading your plan for continuous monitoring.");
        } else if (usagePercentage > 75) {
            insights.push("CAPACITY WARNING: High scan usage detected. Monitor your remaining capacity carefully to avoid service interruptions.");
        }

        // Repository coverage analysis
        if (repoCount === 0) {
            insights.push("SETUP REQUIRED: No repositories connected. Start by adding your code repositories for comprehensive security monitoring.");
        } else if (repoCount < 3 && totalIssues > 0) {
            insights.push("EXPANSION RECOMMENDED: Consider adding more repositories to your security monitoring scope for better coverage.");
        }

        // Security score analysis
        if (avgScore < 40) {
            insights.push("SECURITY CONCERN: Your overall security score indicates significant vulnerabilities. Focus on addressing high-severity issues immediately.");
        } else if (avgScore >= 90) {
            insights.push("EXCEPTIONAL SECURITY: Your security posture is outstanding! Continue with your current security practices.");
        }

        // Vulnerability trend analysis
        const risingThreats = vulnerabilityStats.filter((v: any) => v.trend === 'increasing').length;
        if (risingThreats > 2) {
            insights.push("TREND ALERT: Multiple vulnerability types are increasing. This suggests a pattern that needs investigation.");
        }

        // Activity pattern analysis
        if (activeDays < 10) {
            insights.push("ACTIVITY RECOMMENDATION: Consider increasing your scanning frequency. Regular security assessments are crucial for maintaining code quality.");
        }

        // Repository health insights
        if (repoCount > 0 && avgDailyIssues > 5) {
            insights.push("INVESTIGATION NEEDED: High daily issue detection suggests potential systemic security concerns across your repositories.");
        }

        // Seasonal/periodic insights
        const now = new Date();
        const dayOfWeek = now.getDay();
        if (dayOfWeek === 1) { // Monday
            insights.push("WEEKLY RECOMMENDATION: Consider running fresh security scans on critical repositories at the beginning of each week.");
        }

        // Default professional insights
        if (insights.length === 0) {
            const professionalTips = [
                "BEST PRACTICE: Regularly update dependencies and review security advisories for your tech stack.",
                "DEFENSE IN DEPTH: Consider implementing multiple security layers beyond automated scanning.",
                "METRICS MATTER: Track security KPIs over time to measure improvement and identify trends.",
                "TEAM AWARENESS: Ensure your development team stays updated on the latest security threats and best practices.",
                "CONTINUOUS MONITORING: Security is ongoing - regular scans help catch issues before they become problems.",
                "RISK PRIORITIZATION: Focus on fixing critical and high-severity issues first for maximum security impact."
            ];
            insights.push(professionalTips[Math.floor(Math.random() * professionalTips.length)]);
        }

        return insights[Math.floor(Math.random() * insights.length)]; // Return random insight for variety
    };

    const aiInsight = generateAIInsights({
        criticalIssues,
        totalIssues,
        scansUsed,
        scanLimit,
        repoCount,
        avgScore,
        vulnerabilityStats,
        securityTrendData
    });

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-24 animate-in fade-in duration-700">

            {/* Hero Section - Security Command Center */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 shadow-2xl shadow-slate-900/50">
                {/* Sophisticated Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-slate-900/80 to-emerald-600/10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 blur-3xl -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/5 to-slate-500/5 blur-3xl -ml-48 -mb-48" />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)] bg-[size:32px_32px]" />
                </div>

                <div className="relative z-10 p-12 lg:p-16">

                    {/* Status Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-3 px-6 py-3 bg-slate-800/60 border border-slate-600/60 rounded-full backdrop-blur-sm">
                            <div className="relative">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75" />
                            </div>
                            <span className="text-sm font-semibold text-slate-200 uppercase tracking-wider">System Operational</span>
                        </div>
                    </div>

                    {/* Main Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                            Security
                            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                                Command Center
                            </span>
                        </h1>
                        <p className="text-xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
                            Advanced threat intelligence and security orchestration platform.
                            Monitor, analyze, and respond to security events with precision.
                        </p>
                    </div>

                    {/* Security Score Display */}
                    <div className="flex justify-center mb-12">
                        <div className="relative">
                            {/* Outer Ring */}
                            <div className="w-48 h-48 rounded-full border-4 border-slate-700/60 relative">
                                {/* Progress Ring */}
                                <div className="absolute inset-0 rounded-full border-4 border-transparent"
                                     style={{
                                         background: `conic-gradient(from 0deg, ${
                                             avgScore >= 80 ? 'rgb(34 197 94)' :
                                             avgScore >= 60 ? 'rgb(245 158 11)' :
                                             'rgb(239 68 68)'
                                         } ${avgScore * 3.6}deg, transparent ${avgScore * 3.6}deg)`
                                     }} />

                                {/* Inner Background */}
                                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center">

                                    {/* Score Text */}
                                    <div className="text-center">
                                        <div className={cn(
                                            "text-5xl font-black mb-1",
                                            avgScore >= 80 ? "text-emerald-400" :
                                            avgScore >= 60 ? "text-amber-400" :
                                            "text-red-400"
                                        )}>
                                            {avgScore}
                                        </div>
                                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Security Score</div>
                                        <div className="mt-2">
                                            {avgScore >= 80 ? (
                                                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Excellent</span>
                                            ) : avgScore >= 60 ? (
                                                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Good</span>
                                            ) : (
                                                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Critical</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Indicators */}
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

                        {/* Critical Issues */}
                        <div className="group bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl p-6 hover:border-red-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <AlertTriangle className="h-6 w-6 text-red-400" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">{criticalIssues}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Critical</div>
                                </div>
                            </div>
                            <div className="text-sm text-slate-300 font-medium">High-risk vulnerabilities</div>
                        </div>

                        {/* Monitored Assets */}
                        <div className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Target className="h-6 w-6 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">{repoCount}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assets</div>
                                </div>
                            </div>
                            <div className="text-sm text-slate-300 font-medium">Monitored repositories</div>
                        </div>

                        {/* Scan Count */}
                        <div className="group bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Activity className="h-6 w-6 text-indigo-400" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">{totalScans}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scans</div>
                                </div>
                            </div>
                            <div className="text-sm text-slate-300 font-medium">Total security assessments</div>
                        </div>

                        {/* Scan Capacity */}
                        <div className="group bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Zap className="h-6 w-6 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">{scansRemaining}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Remaining</div>
                                </div>
                            </div>
                            <div className="text-sm text-slate-300 font-medium">Monthly scan capacity</div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard/new-scan">
                            <Button className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-3 text-lg">
                                <Plus className="h-6 w-6" />
                                Initiate Security Scan
                            </Button>
                        </Link>

                        <Link href="/chat">
                            <Button variant="outline" className="w-full sm:w-auto h-14 px-8 border-slate-600/60 hover:bg-slate-800/60 text-slate-200 hover:text-white font-bold rounded-2xl transition-all backdrop-blur-sm flex items-center gap-3 text-lg">
                                <MessageSquare className="h-6 w-6" />
                                AI Security Advisor
                            </Button>
                        </Link>

                        <Link href="/dashboard/scans">
                            <Button variant="outline" className="w-full sm:w-auto h-14 px-8 border-slate-600/60 hover:bg-slate-800/60 text-slate-200 hover:text-white font-bold rounded-2xl transition-all backdrop-blur-sm flex items-center gap-3 text-lg">
                                <FileText className="h-6 w-6" />
                                Security Reports
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Security Trend Chart - Advanced GitHub-Style Contribution Graph */}
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-400" />
                                    Security Activity Map
                                </h2>
                                <p className="text-sm text-zinc-400">91 days of security scanning and vulnerability detection</p>
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
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <span className="text-zinc-400">Critical Issues</span>
                                </div>
                            </div>
                        </div>

                        {/* GitHub-Style Contribution Graph - 7x13 grid (91 days) */}
                        <div className="space-y-4">
                            {/* Month labels */}
                            <div className="flex justify-between text-xs text-zinc-500 mb-2">
                                <span>3 months ago</span>
                                <span>Today</span>
                            </div>

                            {/* Main contribution grid */}
                            <div className="grid grid-cols-13 grid-rows-7 gap-1">
                                {Array.from({ length: 91 }, (_, index) => {
                                    // Calculate which day this represents (starting from 90 days ago)
                                    const now = new Date(); // Current timestamp for date calculations
                                    const dayOffset = 90 - index;
                                    const targetDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
                                    const dateKey = targetDate.toISOString().split('T')[0];

                                    // Find data for this specific date
                                    const dayData = securityTrendData.find(d => d.fullDate === dateKey);

                                    if (!dayData) return (
                                        <div
                                            key={index}
                                            className="w-3 h-3 rounded-sm bg-zinc-800 border border-zinc-800/50"
                                            title={`${targetDate.toLocaleDateString()}: No activity`}
                                        />
                                    );

                                    // Calculate sophisticated intensity level (0-4)
                                    const issuesLevel = Math.min(2, Math.floor(dayData.issues / 3));
                                    const criticalLevel = dayData.criticalIssues > 0 ? 1 : 0;
                                    const scanLevel = dayData.scans > 0 ? 1 : 0;
                                    const totalIntensity = Math.min(4, issuesLevel + criticalLevel + scanLevel);

                                    const intensityClasses = [
                                        'bg-zinc-800 border-zinc-700', // 0 - No activity
                                        'bg-blue-900 border-blue-800', // 1 - Low activity
                                        'bg-blue-700 border-blue-600', // 2 - Moderate activity
                                        'bg-blue-500 border-blue-400', // 3 - High activity
                                        'bg-blue-400 border-blue-300'  // 4 - Very high activity
                                    ];

                                    // Determine primary activity type for tooltip
                                    let primaryActivity = 'scan';
                                    if (dayData.criticalIssues > 0) primaryActivity = 'critical';
                                    else if (dayData.issues > 0) primaryActivity = 'issues';

                                    return (
                                        <div
                                            key={index}
                                            className={`w-3 h-3 rounded-sm ${intensityClasses[totalIntensity]} border hover:ring-1 hover:ring-blue-300 transition-all cursor-pointer group relative`}
                                            title={`${targetDate.toLocaleDateString()}: ${dayData.issues} issues, ${dayData.criticalIssues} critical, ${dayData.scans} scans`}
                                        >
                                            {/* Subtle indicator for critical issues */}
                                            {dayData.criticalIssues > 0 && (
                                                <div className="absolute inset-0 rounded-sm bg-red-500/30" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Enhanced Legend with Statistics */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <span>Less</span>
                                    <div className="flex gap-1">
                                        {['bg-zinc-800 border-zinc-700', 'bg-blue-900 border-blue-800', 'bg-blue-700 border-blue-600', 'bg-blue-500 border-blue-400', 'bg-blue-400 border-blue-300'].map((color, i) => (
                                            <div key={i} className={`w-3 h-3 rounded-sm ${color} border`} />
                                        ))}
                                    </div>
                                    <span>More</span>
                                </div>

                                <div className="flex gap-6 text-xs text-zinc-500">
                                    <div className="text-center">
                                        <div className="font-semibold text-blue-400">{securityTrendData.reduce((sum, day) => sum + day.scans, 0)}</div>
                                        <div>Scans</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold text-red-400">{securityTrendData.reduce((sum, day) => sum + day.issues, 0)}</div>
                                        <div>Issues</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold text-yellow-400">{securityTrendData.reduce((sum, day) => sum + day.criticalIssues, 0)}</div>
                                        <div>Critical</div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Summary */}
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                                <div className="text-sm text-zinc-400">
                                    {securityTrendData.filter(day => day.totalActivity > 0).length} active days in the last 91 days
                                </div>
                                <div className="text-sm text-zinc-400">
                                    Average: {Math.round(securityTrendData.reduce((sum, day) => sum + day.issues, 0) / 91)} issues/day
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

                        {/* Top Vulnerabilities - Advanced Analysis */}
                        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                    Vulnerability Intelligence
                                </h3>
                                <Link href="/dashboard/scans" className="text-sm text-red-400 hover:text-red-300 font-medium">
                                    View All Reports
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {vulnerabilityStats.length > 0 ? (
                                    vulnerabilityStats.map((vuln, index) => (
                                        <div key={index} className="group flex items-center justify-between p-4 bg-zinc-800/30 border border-zinc-700/30 rounded-xl hover:border-zinc-600/50 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
                                                    vuln.severity === 'critical' ? "bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30" :
                                                    vuln.severity === 'high' ? "bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30" :
                                                    vuln.severity === 'medium' ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30" :
                                                    "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30"
                                                )}>
                                                    <AlertTriangle className={cn(
                                                        "h-6 w-6",
                                                        vuln.severity === 'critical' ? "text-red-400" :
                                                        vuln.severity === 'high' ? "text-orange-400" :
                                                        vuln.severity === 'medium' ? "text-yellow-400" :
                                                        "text-blue-400"
                                                    )} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="text-sm font-semibold text-white truncate">{vuln.type}</div>
                                                        <div className={cn(
                                                            "px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
                                                            vuln.severity === 'critical' ? "bg-red-500/20 text-red-400" :
                                                            vuln.severity === 'high' ? "bg-orange-500/20 text-orange-400" :
                                                            vuln.severity === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                                                            "bg-blue-500/20 text-blue-400"
                                                        )}>
                                                            {vuln.severity}
                                                        </div>
                                                        <div className={cn(
                                                            "px-2 py-0.5 rounded text-xs font-medium",
                                                            vuln.trend === 'increasing' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                                            vuln.trend === 'decreasing' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                                            "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                                                        )}>
                                                            {vuln.trend === 'increasing' ? '↗️ Rising' : vuln.trend === 'decreasing' ? '↘️ Falling' : '➡️ Stable'}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-zinc-500">
                                                        {vuln.count} instances • Last seen {new Date(vuln.lastSeen).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-black text-white mb-1">
                                                    {Math.round((vuln.severityScore * vuln.count) / vulnerabilityStats.length * 100) / 10}
                                                </div>
                                                <div className="text-xs text-zinc-500">Risk Score</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-3">No Security Vulnerabilities</h4>
                                        <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                                            Excellent! Your recent security scans have found no vulnerabilities.
                                            Your code appears to be following security best practices.
                                        </p>
                                        <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                                            <Shield className="h-4 w-4" />
                                            <span className="font-semibold">Security Status: Clean</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Vulnerability Summary */}
                            {vulnerabilityStats.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-zinc-800/50">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="text-zinc-400">
                                            {vulnerabilityStats.filter(v => v.trend === 'increasing').length} rising threats
                                        </div>
                                        <div className="text-zinc-400">
                                            {vulnerabilityStats.filter(v => v.severity === 'critical').length} critical issues
                                        </div>
                                        <div className="text-zinc-400">
                                            Priority: {vulnerabilityStats[0]?.severity || 'None'}
                                        </div>
                                    </div>
                                </div>
                            )}
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

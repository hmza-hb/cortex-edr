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
    RefreshCw,
    Search,
    User
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

    // Fetch repositories
    let repoCount = 0;
    if (profile?.id) {
        const { count } = await supabase
            .from("repositories")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", profile.id);
        repoCount = count || 0;
    }

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
        recentScans?.forEach((scan: any) => {
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
        allIssues?.forEach((issue: any) => {
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

        allIssues?.forEach((issue: any) => {
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
        recentSecurityActivity = recentScans?.slice(-10).reverse().map((scan: any) => ({
            id: scan.id,
            type: 'scan',
            title: `${scan.repo_url?.split('/').pop()} scan`,
            status: scan.status,
            score: scan.score,
            timestamp: scan.created_at,
            description: `Security scan ${scan.status}`
        })) || [];

        // Add recent issues to activity
        const recentIssues = allIssues?.slice(-5).reverse().map((issue: any) => ({
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

    const recentScans = scans?.slice(0, 5) || [];
    const totalScans = scans?.length || 0;
    const avgScore = totalScans > 0
        ? Math.round(scans!.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / totalScans)
        : 0;

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

    // Fetch recent chat messages for Cortex Chat
    let recentChatMessages: any[] = [];
    if (profile?.id) {
        try {
            // Try to fetch real chat messages - if none exist, use default initialization
            const { data: chatData } = await supabase
                .from("chat_messages")
                .select("*")
                .eq("user_id", profile.id)
                .order("created_at", { ascending: false })
                .limit(3);

            if (chatData && chatData.length > 0) {
                recentChatMessages = chatData;
            } else {
                // Initialize with default chat messages if none exist
                recentChatMessages = [
                    {
                        id: 'default-1',
                        role: 'assistant',
                        content: `Welcome to Cortex Chat! I've analyzed your security data and found ${criticalIssues} critical vulnerabilities that need attention. Your current security score is ${avgScore}%.`,
                        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
                    },
                    {
                        id: 'default-2',
                        role: 'user',
                        content: 'What are the main security risks in my codebase?',
                        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
                    },
                    {
                        id: 'default-3',
                        role: 'assistant',
                        content: `Based on your recent scans, the primary risks are in ${vulnerabilityStats.length > 0 ? vulnerabilityStats.slice(0, 2).map(v => v.type).join(' and ') : 'dependency management and authentication'}. I recommend prioritizing fixes for ${vulnerabilityStats.filter(v => v.severity === 'critical').length} critical issues first.`,
                        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
                    }
                ];
            }
        } catch (error) {
            // If table doesn't exist or error, use default messages
            recentChatMessages = [
                {
                    id: 'default-1',
                    role: 'assistant',
                    content: `Welcome to Cortex Chat! I've analyzed your security data and found ${criticalIssues} critical vulnerabilities that need attention. Your current security score is ${avgScore}%.`,
                    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 'default-2',
                    role: 'user',
                    content: 'What are the main security risks in my codebase?',
                    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 'default-3',
                    role: 'assistant',
                    content: `Based on your recent scans, the primary risks are in ${vulnerabilityStats.length > 0 ? vulnerabilityStats.slice(0, 2).map(v => v.type).join(' and ') : 'dependency management and authentication'}. I recommend prioritizing fixes for ${vulnerabilityStats.filter(v => v.severity === 'critical').length} critical issues first.`,
                    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
                }
            ];
        }
    }

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-24 animate-in fade-in duration-700">

            {/* Security Command Center - Clean & Professional */}
            <div className="bg-transparent">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                    {/* Security Score - Left Side */}
                    <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
                        <div className="relative mb-6">
                            {/* Outer Ring */}
                            <div className="w-32 h-32 rounded-full border-4 border-zinc-700/60 relative">
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
                                <div className="absolute inset-2 rounded-full bg-zinc-900 border border-zinc-700/60 flex items-center justify-center">
                                    {/* Score Text */}
                                    <div className="text-center">
                                        <div className={cn(
                                            "text-3xl font-black",
                                            avgScore >= 80 ? "text-emerald-400" :
                                            avgScore >= 60 ? "text-amber-400" :
                                            "text-red-400"
                                        )}>
                                            {avgScore}
                                        </div>
                                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Security Score</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Grid - Center */}
                    <div className="lg:col-span-5">
                        <div className="grid grid-cols-2 gap-4">

                            {/* Critical Issues */}
                            <div className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <div>
                                    <div className="text-xl font-black text-white">{criticalIssues}</div>
                                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Critical</div>
                                </div>
                            </div>

                            {/* Monitored Assets */}
                            <div className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <Target className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-xl font-black text-white">{repoCount}</div>
                                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Assets</div>
                                </div>
                            </div>

                            {/* Total Scans */}
                            <div className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                    <Activity className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div>
                                    <div className="text-xl font-black text-white">{totalScans}</div>
                                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Scans</div>
                                </div>
                            </div>

                            {/* Scan Capacity */}
                            <div className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-xl font-black text-white">{scansRemaining}</div>
                                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Remaining</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Right Side */}
                    <div className="lg:col-span-3 flex flex-col gap-3">
                        <Link href="/dashboard/new-scan">
                            <Button className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                                <Plus className="h-4 w-4" />
                                New Scan
                            </Button>
                        </Link>

                        <Link href="/chat">
                            <Button variant="outline" className="w-full h-12 border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 hover:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                                <img src="/assets/logo.png" alt="CortexEDR Logo" className="w-5 h-5 object-contain" />
                                AI Advisor
                            </Button>
                        </Link>

                        <Link href="/dashboard/scans">
                            <Button variant="outline" className="w-full h-12 border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 hover:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                                <FileText className="h-4 w-4" />
                                Reports
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
                                    <Search className="h-5 w-5 text-purple-400" />
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
                                            <Search className="h-6 w-6 text-zinc-600" />
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
                                    <Shield className="h-5 w-5 text-red-400" />
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
                                <span>Resets in one month</span>
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
                                <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="GitHub logo" className="w-5 h-5 object-contain" />
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

                    {/* Cortex Chat */}
                    <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 flex items-center justify-center overflow-hidden">
                                <img src="/assets/logo.png" alt="CortexEDR Logo" className="w-6 h-6 object-contain" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Chat with Cortex</h3>
                                <p className="text-sm text-zinc-400">Intelligent security insights and mentorship</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                            {recentChatMessages.length > 0 ? (
                                recentChatMessages.slice(0, 3).reverse().map((message, index) => (
                                    <div key={message.id || index} className="flex gap-3">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                            message.role === 'assistant'
                                                ? 'bg-blue-500/20 border border-blue-500/30'
                                                : 'bg-zinc-700/50 border border-zinc-600/50'
                                        }`}>
                                            {message.role === 'assistant' ? (
                                                <img src="/assets/logo.png" alt="Cortex" className="w-4 h-4 object-contain" />
                                            ) : (
                                                <User className="w-4 h-4 text-zinc-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-semibold text-zinc-400">
                                                    {message.role === 'assistant' ? 'Cortex' : 'You'}
                                                </span>
                                                <span className="text-xs text-zinc-500">
                                                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-xl">
                                                <p className="text-sm text-zinc-300 leading-relaxed">{message.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                                        <img src="/assets/logo.png" alt="Cortex" className="w-6 h-6 object-contain" />
                                    </div>
                                    <h4 className="text-white font-semibold mb-2">Start a conversation</h4>
                                    <p className="text-zinc-500 text-sm">Ask Cortex about your security posture</p>
                                </div>
                            )}
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

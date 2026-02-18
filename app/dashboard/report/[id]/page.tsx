"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ScoreCard } from "@/components/report/ScoreCard";
import { IssueList } from "@/components/report/IssueList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RotateCcw, ShieldCheck, Share2, Loader2, FileJson, Zap } from "lucide-react";
import Link from "next/link";
import { Issue } from "@/types/agent";

import { EnterpriseIssueCard } from "@/components/report/EnterpriseIssueCard";
import { ExecutiveReport } from "@/types/report";

export default function ReportPage() {
    const params = useParams();
    const router = useRouter();
    const scanId = params.id as string;

    const [scan, setScan] = useState<any>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`/api/scan/results/${scanId}`);
                if (!response.ok) throw new Error("Failed to fetch results");
                const data = await response.json();
                setScan(data.scan);
                setIssues(data.issues);
            } catch (err) {
                console.error(err);
                router.push("/dashboard/scan-history");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [scanId, router]);

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Decoding Audit Manifest...</p>
            </div>
        );
    }

    const enterpriseReport = scan?.enterprise_report as ExecutiveReport;
    const severityCounts = scan?.severity_counts || {
        critical: issues.filter(i => i.severity === 'critical').length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
    };

    return (
        <div className="max-w-7xl mx-auto space-y-16 py-12 animate-in fade-in duration-1000">
            {/* Nav Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/scan-history">
                        <Button variant="ghost" size="icon" className="h-14 w-14 border border-white/5 hover:bg-white/5 rounded-2xl transition-all hover:scale-105 active:scale-95">
                            <ArrowLeft className="h-6 w-6 text-white/40" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-4xl font-black text-white tracking-widest uppercase">Audit Report</h1>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">SYSTEM_VERIFIED</span>
                            </div>
                        </div>
                        <p className="text-[11px] font-bold text-white/20 tracking-[0.4em] uppercase">Target Endpoint: {scan?.repo_url}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="h-14 px-8 text-[11px] font-black tracking-widest uppercase text-white/40 border border-white/5 hover:text-white rounded-2xl hover:bg-white/5 transition-all">
                        <FileJson className="h-4 w-4 mr-3" />
                        Export JSON
                    </Button>
                    <Button className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black tracking-widest uppercase rounded-2xl shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                        <Share2 className="h-4 w-4 mr-3" />
                        Publish Report
                    </Button>
                </div>
            </div>

            {/* Score Section */}
            <ScoreCard
                score={scan?.score || 0}
                severityCounts={severityCounts}
                summary={enterpriseReport?.executiveSummary || scan?.summary}
                technicalAnalysis={enterpriseReport?.technicalAnalysis}
            />

            {/* Executive Synthesis Details */}
            {enterpriseReport && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-8">
                            <div>
                                <h3 className="text-[12px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6">Strategic Key Findings</h3>
                                <ul className="space-y-4">
                                    {enterpriseReport?.executiveSummary?.keyFindings?.map((finding, i) => (
                                        <li key={i} className="flex gap-4 text-white/70">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                            <p className="text-sm leading-relaxed font-medium">{finding}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <h3 className="text-[12px] font-black text-red-400 uppercase tracking-[0.3em] mb-6">Immediate Recommended Actions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {enterpriseReport?.executiveSummary?.recommendedActions?.map((action, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 flex gap-4 mt-2">
                                            <span className="text-red-500 font-black text-xs">0{i + 1}</span>
                                            <p className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">{action}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 rounded-[40px] bg-gradient-to-br from-purple-500/[0.03] to-blue-500/[0.03] border border-white/5 flex flex-col justify-center text-center">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 rotate-3 shadow-2xl">
                            <Zap className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-[12px] font-black text-white tracking-[0.3em] uppercase mb-4">Business Impact Analysis</h3>
                        <p className="text-sm text-white/50 leading-relaxed font-medium italic">
                            {enterpriseReport?.executiveSummary?.businessImpact}
                        </p>
                    </div>
                </div>
            )}

            {/* Top Priorities Section */}
            {enterpriseReport?.topPriorities && enterpriseReport.topPriorities.length > 0 && (
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-widest uppercase">Top Executive Priorities</h2>
                        <p className="text-[10px] font-bold text-white/20 tracking-[0.4em] uppercase mt-2">Deep analysis of high-impact vulnerabilities needing immediate attention</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {enterpriseReport.topPriorities.map((issue, i) => (
                            <EnterpriseIssueCard key={issue.id || i} issue={issue} rank={i + 1} />
                        ))}
                    </div>
                </div>
            )}

            {/* Full Issue List Section */}
            <div className="space-y-10 pt-10 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-widest uppercase">Full Detection Manifest</h2>
                        <p className="text-[10px] font-bold text-white/20 tracking-[0.4em] uppercase mt-2">Categorized breakdown of all identified system anomalies</p>
                    </div>

                    <Link href="/dashboard/new-scan">
                        <Button variant="ghost" className="h-12 px-6 text-[11px] font-black tracking-widest uppercase border border-white/5 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 rounded-2xl transition-all">
                            <RotateCcw className="h-4 w-4 mr-3" />
                            Re-Sync Repo
                        </Button>
                    </Link>
                </div>

                <IssueList issues={issues} />
            </div>

            {/* Footer Guidance */}
            <div className="p-16 rounded-[60px] bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent border border-white/5 text-center space-y-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/[0.02] group-hover:bg-blue-500/[0.04] transition-all duration-1000" />
                <div className="w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10 rotate-3 shadow-2xl relative z-10">
                    <ShieldCheck className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase relative z-10">Strengthen Your Perimeter</h2>
                <p className="text-base text-white/40 max-w-2xl mx-auto leading-relaxed font-medium relative z-10">
                    The findings above represent a snapshot of your repository's structural integrity.
                    Address critical items first to ensure maximum resilience against automated exploits
                    and long-term technical stagnation.
                </p>
                <div className="flex justify-center pt-6 relative z-10">
                    <Button variant="outline" className="h-14 border-white/10 text-white font-bold px-10 rounded-2xl hover:bg-white/5 transition-all hover:scale-105 active:scale-95">
                        Schedule Recurring Audit
                    </Button>
                </div>
            </div>
        </div>
    );
}


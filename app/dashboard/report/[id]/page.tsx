"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ScoreCard } from "@/components/report/ScoreCard";
import { IssueList } from "@/components/report/IssueList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RotateCcw, ShieldCheck, Share2, Loader2, FileJson, Zap, MessageCircle, ArrowRight, BookOpen, Star } from "lucide-react";
import Link from "next/link";
import { Issue } from "@/types/agent";

import { EnterpriseIssueCard } from "@/components/report/EnterpriseIssueCard";
import { MermaidDiagram } from "@/components/report/MermaidDiagram";
import { FileTreeVisualizer } from "@/components/report/FileTreeVisualizer";
import { ExecutiveReport } from "@/types/report";
import { motion } from "framer-motion";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFReport } from "@/components/report/PDFReport";
import { SYSTEM_CONFIG, TierId } from "@/lib/config/system";

export default function ReportPage() {
    const params = useParams();
    const router = useRouter();
    const scanId = (params?.id as string) || "";

    const [scan, setScan] = useState<any>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`/api/scan/results/${scanId}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error("Fetch failed:", response.status, errorData);
                    throw new Error(`Failed to fetch results: ${response.status} ${errorData.error || ''}`);
                }
                const data = await response.json();
                setScan(data.scan);
                setIssues(data.issues);
            } catch (err) {
                console.error(err);
                router.push("/dashboard/scans");
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
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-white/[0.05] pb-12"
            >
                <div className="flex items-center gap-8">
                    <Link href="/dashboard/scans">
                        <Button variant="ghost" size="icon" className="h-16 w-16 border border-white/10 hover:bg-white/5 rounded-3xl transition-all hover:scale-105 active:scale-95 shadow-xl">
                            <ArrowLeft className="h-6 w-6 text-white/50" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-5 mb-3">
                            <h1 className="text-3xl font-black text-white tracking-widest uppercase">Audit Manifest</h1>
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 backdrop-blur-sm">
                                <ShieldCheck className="w-4 h-4 text-blue-400" />
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">System.Verified</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 w-fit">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-[11px] font-bold text-white/30 tracking-[0.1em] uppercase">Endpoint: <span className="text-blue-400/80 lowercase">{scan?.repo_url}</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="h-14 px-8 text-[11px] font-black tracking-[0.2em] uppercase text-white/40 border border-white/10 hover:text-white rounded-2xl hover:bg-white/5 transition-all group">
                        <FileJson className="h-4 w-4 mr-3 text-white/20 group-hover:text-blue-400 transition-colors" />
                        Export Manifest
                    </Button>
                    {isMounted && (
                        <PDFDownloadLink
                            document={<PDFReport scan={scan} issues={issues} enterpriseReport={enterpriseReport} tierKey={scan?.tier} />}
                            fileName={`Cortex_Audit_${scan?.id || 'Report'}.pdf`}
                        >
                            {({ loading }) => (
                                <Button
                                    disabled={loading}
                                    className="h-14 px-10 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-black tracking-[0.2em] uppercase rounded-2xl shadow-[0_20px_50px_rgba(168,85,247,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Share2 className="h-4 w-4" />
                                    )}
                                    {loading ? "Marshalling PDF..." : "Share PDF"}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            </motion.div>

            {/* Brainstorming Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative group"
            >
                <div className="relative p-8 rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-white/[0.02] hover:border-white/10">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0">
                            <MessageCircle className="w-5 h-5 text-zinc-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white tracking-tight">Codebase Intelligence Brainstorm</h3>
                            <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-xl">
                                Cortex now understands your codebase far better than any other LLM.
                                Leverage this deep context to brainstorm architectural shifts or ask complex technical questions.
                            </p>
                        </div>
                    </div>
                    <Link href="/dashboard/chat">
                        <Button variant="ghost" className="h-11 px-6 border border-white/10 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-all flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                            Ask a Question
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Visualizer Section */}
            {(scan?.architecture_map || scan?.recon_data?.fileTree) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Architecture Diagram */}
                    {scan?.architecture_map && (
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-black text-white tracking-wider uppercase pl-2">System Architecture Blueprint</h2>
                            <MermaidDiagram chart={scan.architecture_map} />
                        </div>
                    )}

                    {/* File Tree */}
                    {(scan?.recon_data?.fileTree || scan?.annotated_file_tree) && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-white tracking-wider uppercase pl-2">Codebase Structure</h2>
                            <FileTreeVisualizer
                                files={scan.recon_data?.fileTree || []}
                                annotatedFiles={scan.annotated_file_tree || scan.recon_data?.annotatedFileTree}
                            />
                        </div>
                    )}
                </motion.div>
            )}

            {/* Application Story & Strengths Section */}
            {(scan?.application_story || scan?.strengths?.length > 0) && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* The Narrative */}
                    {scan?.application_story && (
                        <div className="lg:col-span-2 p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-2xl bg-blue-500/10">
                                    <BookOpen className="w-6 h-6 text-blue-400" />
                                </div>
                                <h2 className="text-xl font-black text-white tracking-wider uppercase">Your Application</h2>
                            </div>
                            <p className="text-sm leading-relaxed text-white/60 font-medium whitespace-pre-wrap">
                                {scan.application_story}
                            </p>
                        </div>
                    )}

                    {/* The Strengths */}
                    {scan?.strengths && scan.strengths.length > 0 && (
                        <div className="p-10 rounded-[40px] bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/10 space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-2xl bg-green-500/20">
                                    <Star className="w-6 h-6 text-green-400" />
                                </div>
                                <h2 className="text-xl font-black text-white tracking-wider uppercase">Core Strengths</h2>
                            </div>
                            <ul className="space-y-4">
                                {scan.strengths.map((strength: string, idx: number) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                                        <p className="text-sm font-medium text-white/70 leading-relaxed">
                                            {strength}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </motion.div>
            )}

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
                                            <p className="text-sm leading-relaxed font-medium">{typeof finding === 'string' ? finding : JSON.stringify(finding)}</p>
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
                                            <p className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">{typeof action === 'string' ? action : JSON.stringify(action)}</p>
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
                            {typeof enterpriseReport?.executiveSummary?.businessImpact === 'string' ? enterpriseReport.executiveSummary.businessImpact : JSON.stringify(enterpriseReport?.executiveSummary?.businessImpact)}
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
                            <EnterpriseIssueCard key={issue.id || i} issue={issue} rank={i + 1} tierKey={scan?.tier as TierId} />
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

                <IssueList issues={issues} tierKey={scan?.tier as TierId} />
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


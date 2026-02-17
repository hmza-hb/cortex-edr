"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ScoreCard } from "@/components/report/ScoreCard";
import { IssueList } from "@/components/report/IssueList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RotateCcw, ShieldCheck, Share2, Loader2, FileJson } from "lucide-react";
import Link from "next/link";
import { Issue } from "@/types/agent";

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

    const severityCounts = {
        critical: issues.filter(i => i.severity === 'critical').length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Nav Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/scan-history">
                        <Button variant="ghost" size="icon" className="h-12 w-12 border border-white/5 hover:bg-white/5 rounded-2xl">
                            <ArrowLeft className="h-5 w-5 text-white/40" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-white tracking-widest uppercase">Audit Result</h1>
                            <div className="flex items-center gap-2 px-2 py-0.5 rounded border border-blue-500/20 bg-blue-500/5">
                                <ShieldCheck className="w-3 h-3 text-blue-400" />
                                <span className="text-[9px] font-black text-blue-400 uppercase">SYSTEM_VERIFIED</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-white/30 tracking-[0.3em] uppercase">Target Endpoint: {scan?.repo_url}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="h-12 px-6 text-[10px] font-black tracking-widest uppercase text-white/40 border border-white/5 hover:text-white rounded-2xl">
                        <FileJson className="h-4 w-4 mr-2" />
                        Export JSON
                    </Button>
                    <Button className="h-12 px-8 bg-blue-500 hover:bg-blue-600 text-black text-[10px] font-black tracking-widest uppercase rounded-2xl shadow-xl shadow-blue-500/10">
                        <Share2 className="h-4 w-4 mr-2" />
                        Publish Report
                    </Button>
                </div>
            </div>

            {/* Score Section */}
            <ScoreCard
                score={scan?.score || 0}
                severityCounts={severityCounts}
                summary={scan?.summary?.executiveSummary}
            />

            {/* Issue List Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white tracking-widest uppercase">Detection Manifest</h2>
                        <p className="text-[10px] font-bold text-white/20 tracking-[0.3em] uppercase mt-1">Detailed breakdown of architectural & security anomalies</p>
                    </div>

                    <Link href="/dashboard/new-scan">
                        <Button variant="ghost" className="h-10 px-4 text-[10px] font-black tracking-widest uppercase border border-white/5 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 rounded-xl">
                            <RotateCcw className="h-3.5 w-3.5 mr-2" />
                            Re-Sync Repo
                        </Button>
                    </Link>
                </div>

                <IssueList issues={issues} />
            </div>

            {/* Footer Guidance */}
            <div className="p-12 rounded-[40px] bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/5 text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 rotate-3">
                    <ShieldCheck className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">Strengthen Your Perimeter</h2>
                <p className="text-sm text-white/40 max-w-2xl mx-auto leading-relaxed">
                    The findings above represent a snapshot of your repository's structural integrity.
                    Address critical items first to ensure maximum resilience against automated exploits
                    and long-term technical stagnation.
                </p>
                <div className="flex justify-center pt-4">
                    <Button variant="outline" className="h-12 border-white/10 text-white font-bold px-8 rounded-2xl">
                        Schedule Recurring Audit
                    </Button>
                </div>
            </div>
        </div>
    );
}

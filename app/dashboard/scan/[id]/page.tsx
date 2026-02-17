"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AgentCanvas } from "@/components/scan/AgentCanvas";
import { useSSEScan } from "@/hooks/useSSEScan";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function LiveScanPage() {
    const params = useParams();
    const router = useRouter();
    const scanId = params.id as string;

    const { status } = useSSEScan(scanId);

    // Auto-redirect to report when completed
    useEffect(() => {
        if (status === 'completed') {
            const timer = setTimeout(() => {
                router.push(`/dashboard/report/${scanId}`);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, scanId, router]);

    return (
        <div className="h-screen w-full relative overflow-hidden animate-in fade-in duration-1000">
            {/* Redesigned Canvas Wrapper - Now utilizes full screen */}
            <AgentCanvas scanId={scanId} />

            {status === 'failed' && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-8">
                    <div className="text-center max-w-md bg-[#0A0A0A] p-10 rounded-[40px] border border-red-500/20 shadow-2xl space-y-8">
                        <div className="w-20 h-20 rounded-3xl bg-red-500/5 border border-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-10 h-10 text-red-500 stroke-[1.5]" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-2xl font-black text-white tracking-[0.1em] uppercase">Pipeline Failure</h1>
                            <p className="text-xs text-white/40 leading-relaxed font-medium">
                                The architectural audit was interrupted due to a synchronization error.
                                This usually occurs when the target repository is unreachable or exceeds processing latency limits.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 pt-4">
                            <Link href="/dashboard/new-scan">
                                <Button className="w-full h-14 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl">
                                    Restart Audit Pipeline
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="w-full h-14 border border-white/5 text-white/20 font-black uppercase text-[10px] tracking-widest hover:text-white hover:bg-white/5 rounded-2xl">
                                    Return to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

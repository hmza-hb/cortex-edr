"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AgentCanvas } from "@/components/scan/AgentCanvas";
import { useSSEScan } from "@/hooks/useSSEScan";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, X, FileText, Loader2, Bug } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LiveScanPage() {
    const params = useParams();
    const router = useRouter();
    const scanId = params.id as string;
    const supabase = createClient();

    const { status } = useSSEScan(scanId);

    // Debug panel state
    const [showDebug, setShowDebug] = useState(false);
    const [aiLogs, setAiLogs] = useState<any>(null);
    const [loadingLogs, setLoadingLogs] = useState(false);

    // Load AI logs from Supabase
    const loadAILogs = useCallback(async () => {
        setLoadingLogs(true);
        try {
            const { data } = await supabase
                .from('ai_interaction_logs')
                .select('*')
                .eq('scan_id', scanId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            setAiLogs(data?.log_data || null);
        } catch {
            setAiLogs(null);
        }
        setLoadingLogs(false);
    }, [scanId, supabase]);

    // Shift+D keyboard shortcut
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'D' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
                setShowDebug(prev => {
                    const next = !prev;
                    if (next) loadAILogs();
                    return next;
                });
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [loadAILogs]);

    return (
        <div className="h-screen w-full relative overflow-hidden animate-in fade-in duration-1000 flex flex-col bg-zinc-950">
            {/* Slim Header Control Bar */}
            <div className="h-16 px-8 border-b border-white/[0.03] bg-zinc-900/20 backdrop-blur-2xl flex items-center justify-between z-50 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 mr-2 rounded-xl hover:bg-white/5 transition-all group hover:scale-110 active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-zinc-100 transition-colors" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Live audit session</span>
                        <h1 className="text-sm font-bold text-zinc-100 tracking-tight">Active intelligence pipeline</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex flex-col items-end opacity-40">
                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Session identifier</span>
                        <span className="text-[10px] font-mono text-zinc-400">{scanId?.substring(0, 16).toUpperCase()}</span>
                    </div>

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {status === 'completed' ? (
                                <motion.div
                                    key="completed-btn"
                                    initial={{ opacity: 0, scale: 0.8, y: 10, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.5
                                    }}
                                >
                                    <Button
                                        onClick={() => router.push(`/dashboard/report/${scanId}`)}
                                        className="h-10 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] tracking-wider rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center gap-2.5 group overflow-hidden relative"
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"
                                            style={{ backgroundSize: '200% 100%' }}
                                        />
                                        <FileText className="w-4 h-4" />
                                        <span>GET STRATEGY REPORT</span>
                                        <motion.div
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </motion.div>
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="auditing-btn"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
                                >
                                    <div className="h-10 px-6 bg-white/[0.03] border border-white/5 text-zinc-500 font-bold text-[10px] tracking-[0.15em] rounded-xl flex items-center gap-3 cursor-wait">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                                        <span>AUDITING INTELLIGENCE...</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative">
                <AgentCanvas scanId={scanId} />
            </div>

            {/* Debug hint - bottom left */}
            <div className="absolute bottom-4 left-4 z-40">
                <button
                    onClick={() => {
                        setShowDebug(true);
                        loadAILogs();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] tracking-widest uppercase font-mono text-white/20 hover:text-white/50 transition-colors bg-white/[0.02] border border-white/5 rounded-lg hover:border-white/10"
                    title="Toggle AI Debug Panel (Shift+D)"
                >
                    <Bug className="w-3 h-3" />
                    Debug
                </button>
            </div>

            {/* Failed state overlay */}
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

            {/* AI Debug Panel - Full screen overlay */}
            {showDebug && (
                <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl overflow-auto">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Bug className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold text-emerald-400 tracking-wider uppercase">AI Interaction Log</h1>
                                <p className="text-[10px] text-white/30 font-mono mt-0.5">
                                    Scan: {scanId?.substring(0, 8)}... | {aiLogs?.interactions?.length || 0} interactions
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowDebug(false)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors text-xs font-mono"
                        >
                            <X className="w-3.5 h-3.5" />
                            Close [Shift+D]
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 max-w-5xl mx-auto">
                        {loadingLogs && (
                            <div className="text-center py-20 text-white/30 text-sm">Loading AI logs...</div>
                        )}

                        {!loadingLogs && !aiLogs && (
                            <div className="text-center py-20 text-white/30 text-sm">
                                No AI interaction logs found for this scan.
                                <br />
                                <span className="text-[10px] text-white/15">Logs are saved after the scan completes.</span>
                            </div>
                        )}

                        {aiLogs?.interactions?.map((interaction: any, i: number) => (
                            <div key={i} className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.02]">
                                {/* Interaction header */}
                                <div className="px-5 py-3 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center justify-center">
                                            {interaction.agentId}
                                        </span>
                                        <span className="text-xs font-semibold text-white/70">{interaction.agentName}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-mono text-white/20">
                                        <span>{interaction.promptTokens} tokens sent</span>
                                        <span>{interaction.responseTokens} tokens received</span>
                                        <span>{interaction.durationMs}ms</span>
                                    </div>
                                </div>

                                {/* Prompt */}
                                <details className="group">
                                    <summary className="px-5 py-2.5 cursor-pointer text-xs font-mono text-amber-400/70 hover:text-amber-400 transition-colors border-b border-white/5 select-none">
                                        PROMPT SENT ({interaction.promptTokens} tokens)
                                    </summary>
                                    <pre className="px-5 py-3 text-[11px] font-mono text-white/50 overflow-x-auto whitespace-pre-wrap bg-black/40 max-h-[400px] overflow-y-auto">
                                        {interaction.prompt}
                                    </pre>
                                </details>

                                {/* Response */}
                                <details className="group">
                                    <summary className="px-5 py-2.5 cursor-pointer text-xs font-mono text-cyan-400/70 hover:text-cyan-400 transition-colors select-none">
                                        AI RESPONSE ({interaction.responseTokens} tokens)
                                    </summary>
                                    <pre className="px-5 py-3 text-[11px] font-mono text-emerald-400/60 overflow-x-auto whitespace-pre-wrap bg-emerald-950/10 max-h-[400px] overflow-y-auto">
                                        {interaction.response}
                                    </pre>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    Shield,
    FileCode,
    AlertTriangle,
    TrendingUp,
    Plus,
    Send,
    Loader2,
    X,
    MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant" | "system";

interface ChatMessage {
    id?: string;
    role: ChatRole;
    content: string;
    created_at?: string;
    attachments?: any;
}

interface ChatThread {
    id: string;
    title: string | null;
    last_scan_id: string | null;
    created_at: string;
    updated_at: string;
}

export default function CortexChatPage() {
    const searchParams = useSearchParams();
    const scanIdFromUrl = searchParams.get("scanId");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const [threads, setThreads] = useState<ChatThread[]>([]);
    const [threadId, setThreadId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [megaContext, setMegaContext] = useState<any>(null);

    const [input, setInput] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const scanId = useMemo(() => scanIdFromUrl, [scanIdFromUrl]);

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
        });
    };

    const load = async (preferredThreadId?: string | null) => {
        setLoading(true);
        try {
            const qs = new URLSearchParams();
            if (preferredThreadId) qs.set("threadId", preferredThreadId);
            if (scanId) qs.set("scanId", scanId);

            const res = await fetch(`/api/chat?${qs.toString()}`, { method: "GET" });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to load chat");

            setThreads(data.threads || []);
            setThreadId(data.threadId || null);
            setMessages(data.messages || []);
            setMegaContext(data.megaContext || null);
        } finally {
            setLoading(false);
            setTimeout(scrollToBottom, 50);
        }
    };

    useEffect(() => {
        load(null);
    }, [scanId]);

    const removeAttachment = (idx: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== idx));
    };

    const sendMessage = async () => {
        if (sending) return;
        if (!input.trim() && attachments.length === 0) return;

        setSending(true);
        const optimisticUser: ChatMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, optimisticUser]);
        scrollToBottom();

        try {
            const payload = {
                message: input,
                threadId,
                scanId,
                attachments: attachments.map((f) => ({ name: f.name, size: f.size, type: f.type }))
            };

            setInput("");
            setAttachments([]);

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to send message");

            if (data.threadId && data.threadId !== threadId) {
                setThreadId(data.threadId);
            }
            if (data.megaContext) setMegaContext(data.megaContext);

            const assistantMsg: ChatMessage = data.assistantMessage
                ? data.assistantMessage
                : { role: "assistant", content: data.response };

            setMessages((prev) => {
                // Replace the optimistic message if it is the last user message
                const next = [...prev];
                next.push(assistantMsg);
                return next;
            });

            // Refresh threads ordering/titles
            await load(data.threadId || threadId);
        } catch (e: any) {
            setMessages((prev) => [...prev, { role: "assistant", content: `I couldn't process that request. ${e?.message || ""}` }]);
        } finally {
            setSending(false);
            setTimeout(scrollToBottom, 50);
        }
    };

    const activeStats = megaContext?.stats;
    const scanCount = activeStats?.scanCount ?? 0;
    const avgScore = activeStats?.avgScore ?? 0;
    const issueCount = activeStats?.totalIssues ?? 0;
    const currentFocus = activeStats?.lastScan;

    return (
        <div className="flex h-[calc(100vh-64px)] w-full bg-zinc-950">
            {/* Context Sidebar */}
            <div className="hidden xl:flex w-80 shrink-0 border-r border-zinc-800 bg-zinc-950/60">
                <div className="w-full p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-purple-600/30 border border-white/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white tracking-tight">Cortex</div>
                            <div className="text-xs text-zinc-500 font-medium">Personal advisor</div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active context</div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                                <FileCode className="w-4 h-4 text-blue-400" />
                                <span>{scanCount} projects analyzed</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                                <AlertTriangle className="w-4 h-4 text-orange-400" />
                                <span>{issueCount} issues tracked</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                <span>Average score: {avgScore}/100</span>
                            </div>
                        </div>
                    </div>

                    {currentFocus && (
                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                            <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Current focus</div>
                            <div className="mt-2 text-xs text-zinc-200 font-semibold break-words">
                                {currentFocus.repo_url}
                            </div>
                            <div className="mt-1 text-[10px] text-zinc-500 font-medium">
                                Status: {currentFocus.status}{currentFocus.score != null ? ` • Score: ${currentFocus.score}` : ""}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Threads</div>
                        <div className="space-y-1 max-h-[40vh] overflow-auto custom-scrollbar pr-1">
                            {threads.length === 0 ? (
                                <div className="text-xs text-zinc-600 font-medium py-3">No conversations yet.</div>
                            ) : (
                                threads.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => load(t.id)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-xl border transition-all",
                                            t.id === threadId
                                                ? "bg-white/[0.04] border-white/10 text-white"
                                                : "bg-transparent border-transparent hover:bg-white/[0.03] text-zinc-400"
                                        )}
                                    >
                                        <div className="text-xs font-semibold truncate">
                                            {t.title || "Cortex Chat"}
                                        </div>
                                        <div className="text-[10px] text-zinc-600 font-medium truncate mt-0.5">
                                            {t.updated_at ? new Date(t.updated_at).toLocaleString() : ""}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-14 px-6 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-zinc-500" />
                        <div className="text-sm font-bold text-white">Chat with Cortex</div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => load(null)}
                        className="h-9 px-3 rounded-xl border border-white/5 text-zinc-400 hover:text-white"
                    >
                        Refresh
                    </Button>
                </div>

                <div ref={scrollerRef} className="flex-1 overflow-auto custom-scrollbar p-6 space-y-5">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-zinc-500">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="ml-2 text-sm font-medium">Loading context...</span>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="max-w-2xl mx-auto pt-12 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto">
                                <Shield className="w-6 h-6 text-zinc-400" />
                            </div>
                            <div className="mt-6 text-2xl font-bold text-white tracking-tight">Welcome back.</div>
                            <div className="mt-2 text-sm text-zinc-500 font-medium leading-relaxed">
                                Ask anything about your code, your security posture, your roadmap, or what’s blocking you.
                            </div>
                        </div>
                    ) : (
                        messages.map((m, idx) => (
                            <div
                                key={m.id || idx}
                                className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
                            >
                                {m.role !== "user" && (
                                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-purple-600/30 border border-white/10 flex items-center justify-center shrink-0">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "max-w-[820px] rounded-2xl border px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                                        m.role === "user"
                                            ? "bg-indigo-600/20 border-indigo-500/30 text-zinc-100"
                                            : "bg-white/[0.02] border-white/5 text-zinc-200"
                                    )}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))
                    )}

                    {sending && (
                        <div className="flex gap-3 items-start">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-purple-600/30 border border-white/10 flex items-center justify-center shrink-0">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <div className="rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-3 text-sm text-zinc-400 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Cortex is thinking...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="border-t border-zinc-800 bg-zinc-950/70 p-4">
                    {attachments.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {attachments.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-zinc-300">
                                    <FileCode className="w-4 h-4 text-blue-400" />
                                    <span className="max-w-[220px] truncate">{f.name}</span>
                                    <button
                                        onClick={() => removeAttachment(i)}
                                        className="text-zinc-500 hover:text-zinc-200 cursor-pointer"
                                        aria-label="Remove attachment"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-end gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 rounded-xl border-white/10 hover:bg-white/5"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Plus className="w-5 h-5 text-zinc-300" />
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length) setAttachments((prev) => [...prev, ...files]);
                                e.target.value = "";
                            }}
                        />

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            rows={1}
                            placeholder="Ask anything about your code, business, or strategy..."
                            className="flex-1 min-h-11 max-h-40 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 resize-none"
                        />

                        <Button
                            onClick={sendMessage}
                            disabled={sending || (!input.trim() && attachments.length === 0)}
                            className="h-11 px-4 rounded-2xl bg-zinc-100 text-zinc-950 hover:bg-white font-bold disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="mt-2 text-[10px] text-zinc-600 font-medium text-center">
                        Cortex adapts to your scans, your patterns, and your goals.
                    </div>
                </div>
            </div>
        </div>
    );
}


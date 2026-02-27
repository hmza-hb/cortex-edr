"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    BookOpen,
    Bot,
    ChevronDown,
    FolderGit2,
    HelpCircle,
    LogOut,
    Plus,
    Search,
    Settings,
    Shield,
    Sparkles,
    SquarePen,
    User,
    Send,
    X
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
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

function ThinkingDots() {
    return (
        <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" />
        </div>
    );
}

export default function ChatHomePage() {
    const searchParams = useSearchParams();
    const scanIdFromUrl = searchParams.get("scanId");

    const { user } = useUser();
    const { signOut } = useClerk();

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const [threads, setThreads] = useState<ChatThread[]>([]);
    const [threadId, setThreadId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [input, setInput] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);

    const [searchThreads, setSearchThreads] = useState("");
    const [isProfileOpen, setIsProfileOpen] = useState(false);

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
            if (!res.ok) throw new Error(data?.message || data?.error || "Failed to load chat");

            setThreads(data.threads || []);
            setThreadId(data.threadId || null);
            setMessages(data.messages || []);
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

    const startNewChat = async () => {
        setThreadId(null);
        setMessages([]);
        setInput("");
        setAttachments([]);
        setTimeout(scrollToBottom, 10);
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

            if (!res.ok) {
                if (data?.error === "AI_SERVICE_UNAVAILABLE") {
                    throw new Error("AI is temporarily unavailable right now. Please try again shortly.");
                }
                throw new Error(data?.message || data?.error || "Failed to send message");
            }

            if (data.threadId && data.threadId !== threadId) setThreadId(data.threadId);

            const assistantMsg: ChatMessage = data.assistantMessage
                ? data.assistantMessage
                : { role: "assistant", content: data.response };

            setMessages((prev) => {
                const next = [...prev];
                next.push(assistantMsg);
                return next;
            });

            await load(data.threadId || threadId);
        } catch (e: any) {
            const msg = typeof e?.message === "string" ? e.message : "";
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: msg || "I couldn't process that request."
                }
            ]);
        } finally {
            setSending(false);
            setTimeout(scrollToBottom, 50);
        }
    };

    const filteredThreads = useMemo(() => {
        const q = searchThreads.trim().toLowerCase();
        if (!q) return threads;
        return threads.filter((t) => (t.title || "Cortex Chat").toLowerCase().includes(q));
    }, [threads, searchThreads]);

    return (
        <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex overflow-hidden">
            <div className="w-[320px] shrink-0 border-r border-zinc-800/70 bg-zinc-950/70">
                <div className="h-full flex flex-col">
                    <div className="px-4 pt-4 pb-3">
                        <div className="flex items-center justify-between">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <div className="h-9 w-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-zinc-200" />
                                </div>
                                <div className="leading-tight">
                                    <div className="text-sm font-bold tracking-tight">Cortex Chat</div>
                                    <div className="text-[11px] text-zinc-500 font-medium">chat.cortex-edr.com</div>
                                </div>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={startNewChat}
                                className="h-9 w-9 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                                aria-label="New chat"
                            >
                                <SquarePen className="h-4 w-4 text-zinc-200" />
                            </Button>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <Link href="/dashboard" className="col-span-1">
                                <Button
                                    variant="outline"
                                    className="w-full h-9 rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-zinc-200"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    EDR
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={startNewChat}
                                className="col-span-1 h-9 rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-zinc-200"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                New
                            </Button>
                        </div>

                        <div className="mt-3 relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                value={searchThreads}
                                onChange={(e) => setSearchThreads(e.target.value)}
                                placeholder="Search chats"
                                className="w-full h-10 pl-10 pr-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"
                            />
                        </div>
                    </div>

                    <div className="px-2">
                        <div className="px-2 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Workspace</div>
                        <div className="space-y-1">
                            <Link
                                href="/dashboard/repositories"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:bg-white/[0.03]"
                            >
                                <FolderGit2 className="h-4 w-4 text-zinc-500" />
                                Saved repos
                            </Link>
                            <Link
                                href="/dashboard/scan-history"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:bg-white/[0.03]"
                            >
                                <Sparkles className="h-4 w-4 text-zinc-500" />
                                Artifacts
                            </Link>
                        </div>
                    </div>

                    <div className="mt-3 mx-4 h-px bg-zinc-800/70" />

                    <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recent chats</div>
                        <div className="text-[10px] text-zinc-600 font-semibold">{threads.length}</div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar px-2 pb-2">
                        {filteredThreads.length === 0 ? (
                            <div className="px-3 py-3 text-xs text-zinc-600 font-medium">No chats yet.</div>
                        ) : (
                            <div className="space-y-1">
                                {filteredThreads.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => load(t.id)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-xl border transition-all",
                                            t.id === threadId
                                                ? "bg-white/[0.04] border-white/10 text-white"
                                                : "bg-transparent border-transparent hover:bg-white/[0.03] text-zinc-300"
                                        )}
                                    >
                                        <div className="text-sm font-semibold truncate">{t.title || "Cortex Chat"}</div>
                                        <div className="text-[10px] text-zinc-600 font-medium truncate mt-0.5">
                                            {t.updated_at ? new Date(t.updated_at).toLocaleString() : ""}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative border-t border-zinc-800/70 p-3">
                        <button
                            onClick={() => setIsProfileOpen((v) => !v)}
                            className="w-full flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] px-3 py-2"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4 text-zinc-300" />
                                </div>
                                <div className="min-w-0 text-left">
                                    <div className="text-sm font-semibold truncate">
                                        {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Your profile"}
                                    </div>
                                    <div className="text-[11px] text-zinc-600 font-medium truncate">Manage your account</div>
                                </div>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform", isProfileOpen && "rotate-180")} />
                        </button>

                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                <div className="absolute left-3 right-3 bottom-[68px] z-50 rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                                    <div className="p-2">
                                        <Link
                                            href="/dashboard/settings"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200"
                                        >
                                            <Settings className="h-4 w-4 text-zinc-500" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => setIsProfileOpen(false)}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                        >
                                            <Bot className="h-4 w-4 text-zinc-500" />
                                            Personalization
                                        </button>
                                        <Link
                                            href="/pricing"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200"
                                        >
                                            <Sparkles className="h-4 w-4 text-zinc-500" />
                                            Upgrade plan
                                        </Link>

                                        <div className="my-2 h-px bg-zinc-800" />

                                        <Link
                                            href="/docs"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200"
                                        >
                                            <BookOpen className="h-4 w-4 text-zinc-500" />
                                            Learn more
                                        </Link>
                                        <Link
                                            href="/support"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200"
                                        >
                                            <HelpCircle className="h-4 w-4 text-zinc-500" />
                                            Get help
                                        </Link>

                                        <div className="my-2 h-px bg-zinc-800" />

                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                        >
                                            <LogOut className="h-4 w-4 text-zinc-500" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-14 px-6 border-b border-zinc-800/70 flex items-center justify-between bg-zinc-950/60 backdrop-blur-xl">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-zinc-200" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-bold truncate">{threadId ? "Chat" : "New chat"}</div>
                            <div className="text-[11px] text-zinc-500 font-medium truncate">
                                Ask about security, architecture, product, or strategy
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => load(threadId)}
                            className="h-9 px-3 rounded-xl border border-white/5 text-zinc-300 hover:text-white"
                        >
                            Refresh
                        </Button>
                    </div>
                </div>

                <div ref={scrollerRef} className="flex-1 overflow-auto custom-scrollbar">
                    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
                        {loading ? (
                            <div className="pt-24 text-center text-sm text-zinc-500 font-medium">Loading…</div>
                        ) : messages.length === 0 ? (
                            <div className="pt-24 text-center">
                                <div className="mx-auto h-12 w-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-zinc-300" />
                                </div>
                                <div className="mt-6 text-2xl font-bold tracking-tight text-white">How can I help?</div>
                                <div className="mt-2 text-sm text-zinc-500 font-medium">
                                    Ask anything. I’ll use your scans and context when available.
                                </div>
                            </div>
                        ) : (
                            messages.map((m, idx) => (
                                <div key={m.id || idx} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                                    <div
                                        className={cn(
                                            "max-w-[90%] md:max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap border",
                                            m.role === "user"
                                                ? "bg-indigo-600/15 border-indigo-500/20 text-zinc-50"
                                                : "bg-white/[0.02] border-white/5 text-zinc-200"
                                        )}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            ))
                        )}

                        {sending && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm border bg-white/[0.02] border-white/5 text-zinc-400 flex items-center gap-3">
                                    <ThinkingDots />
                                    <span className="font-medium">Thinking</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-zinc-800/70 bg-zinc-950/70 backdrop-blur-xl">
                    <div className="max-w-3xl mx-auto px-4 py-4">
                        {attachments.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                                {attachments.map((f, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-zinc-300"
                                    >
                                        <span className="max-w-[240px] truncate">{f.name}</span>
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
                                className="h-11 w-11 rounded-2xl border-white/10 hover:bg-white/5"
                                onClick={() => fileInputRef.current?.click()}
                                aria-label="Attach files"
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
                                placeholder="Message Cortex…"
                                className="flex-1 min-h-11 max-h-40 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 resize-none"
                            />

                            <Button
                                onClick={sendMessage}
                                disabled={sending || (!input.trim() && attachments.length === 0)}
                                className="h-11 px-4 rounded-2xl bg-zinc-100 text-zinc-950 hover:bg-white font-bold disabled:opacity-50"
                                aria-label="Send message"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="mt-2 text-[11px] text-zinc-600 font-medium text-center">
                            Cortex can make mistakes. Verify security-critical details.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

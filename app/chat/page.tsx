"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    BookOpen,
    Bot,
    ChevronDown,
    ChevronRight,
    Cloud,
    Copy,
    FolderGit2,
    Github,
    Globe,
    HelpCircle,
    History,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    Plus,
    RefreshCcw,
    Search,
    Settings,
    Share2,
    Shield,
    Sparkles,
    SquarePen,
    TriangleAlert,
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

function safeCopy(text: string) {
    try {
        void navigator.clipboard.writeText(text);
    } catch {
        // noop
    }
}

interface ChatThread {
    id: string;
    title: string | null;
    last_scan_id: string | null;
    created_at: string;
    updated_at: string;
}

export default function ChatHomePage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen bg-zinc-950 text-zinc-100" />}>
            <ChatHomeInner />
        </Suspense>
    );
}

function ChatHomeInner() {
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
    const [isLearnOpen, setIsLearnOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isPlanOpen, setIsPlanOpen] = useState(false);
    const [plan, setPlan] = useState<"Vibe Coder" | "Developer" | "Teams" | "Enterprise">("Vibe Coder");
    const [isPlusOpen, setIsPlusOpen] = useState(false);

    const [hoveredMessageIndex, setHoveredMessageIndex] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const scanId = useMemo(() => scanIdFromUrl, [scanIdFromUrl]);

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
        });
    }, []);

    const load = useCallback(async (preferredThreadId?: string | null) => {
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
    }, [scanId, scrollToBottom]);

    useEffect(() => {
        load(null);
    }, [load]);

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

    const sendMessageWithContent = async (content: string) => {
        if (sending) return;
        if (!content.trim() && attachments.length === 0) return;

        setSending(true);
        const optimisticUser: ChatMessage = { role: "user", content };
        setMessages((prev) => [...prev, optimisticUser]);
        scrollToBottom();

        try {
            const payload = {
                message: content,
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

    const sendMessage = async () => {
        const content = input;
        if (!content.trim() && attachments.length === 0) return;
        setInput("");
        setAttachments([]);
        setIsPlusOpen(false);
        await sendMessageWithContent(content);
    };

    const shareChat = async () => {
        safeCopy(window.location.href);
    };

    const filteredThreads = useMemo(() => {
        const q = searchThreads.trim().toLowerCase();
        if (!q) return threads;
        return threads.filter((t) => (t.title || "Cortex Chat").toLowerCase().includes(q));
    }, [threads, searchThreads]);

    return (
        <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex overflow-hidden">
            <div
                className={cn(
                    "shrink-0 border-r border-zinc-800/70 bg-zinc-950/70 transition-[width] duration-300 ease-out",
                    sidebarCollapsed ? "w-[72px]" : "w-[320px]"
                )}
            >
                <div className="h-full flex flex-col">
                    <div className="px-4 pt-4 pb-3">
                        <div className="flex items-center justify-between">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <div className="h-9 w-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center overflow-hidden">
                                    <Image src="/assets/logo.png" alt="Cortex" width={24} height={24} className="h-6 w-6" />
                                </div>
                                {!sidebarCollapsed && (
                                    <div className="leading-tight">
                                        <div className="text-sm font-bold tracking-tight">Cortex Chat</div>
                                        <div className="text-[11px] text-zinc-500 font-medium">chat.cortex-edr.com</div>
                                    </div>
                                )}
                            </Link>
                            <div className="flex items-center gap-2">
                                {!sidebarCollapsed && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={startNewChat}
                                        className="h-9 w-9 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                                        aria-label="New chat"
                                    >
                                        <SquarePen className="h-4 w-4 text-zinc-200" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSidebarCollapsed((v) => !v)}
                                    className="h-9 w-9 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                                    aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                                >
                                    {sidebarCollapsed ? (
                                        <PanelLeftOpen className="h-4 w-4 text-zinc-200" />
                                    ) : (
                                        <PanelLeftClose className="h-4 w-4 text-zinc-200" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {!sidebarCollapsed && (
                            <>
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
                            </>
                        )}
                    </div>

                    <div className="px-2">
                        {!sidebarCollapsed && (
                            <div className="px-2 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Workspace</div>
                        )}
                        <div className="space-y-1">
                            <Link
                                href="/dashboard/repositories"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03]",
                                    sidebarCollapsed ? "justify-center" : "text-sm text-zinc-300"
                                )}
                                aria-label={sidebarCollapsed ? "Saved repos" : undefined}
                            >
                                <FolderGit2 className="h-4 w-4 text-zinc-500" />
                                {!sidebarCollapsed && "Saved repos"}
                            </Link>
                            <Link
                                href="/dashboard/scan-history"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03]",
                                    sidebarCollapsed ? "justify-center" : "text-sm text-zinc-300"
                                )}
                                aria-label={sidebarCollapsed ? "Artifacts" : undefined}
                            >
                                <Sparkles className="h-4 w-4 text-zinc-500" />
                                {!sidebarCollapsed && "Artifacts"}
                            </Link>
                        </div>
                    </div>

                    {!sidebarCollapsed && <div className="mt-3 mx-4 h-px bg-zinc-800/70" />}

                    {!sidebarCollapsed && (
                        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recent chats</div>
                            <div className="text-[10px] text-zinc-600 font-semibold">{threads.length}</div>
                        </div>
                    )}

                    <div className="flex-1 overflow-auto custom-scrollbar px-2 pb-2">
                        {sidebarCollapsed ? (
                            <div className="space-y-1 pt-2">
                                {(filteredThreads || []).slice(0, 10).map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => load(t.id)}
                                        className={cn(
                                            "w-full px-3 py-2 rounded-xl transition-all flex items-center justify-center",
                                            t.id === threadId ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"
                                        )}
                                        aria-label={t.title || "Cortex Chat"}
                                    >
                                        <Shield className="h-4 w-4 text-zinc-400" />
                                    </button>
                                ))}
                            </div>
                        ) : filteredThreads.length === 0 ? (
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
                                <div className="h-9 w-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                    {user?.imageUrl ? (
                                        <img src={user.imageUrl} alt="Profile" className="h-9 w-9 object-cover" />
                                    ) : (
                                        <User className="h-4 w-4 text-zinc-300" />
                                    )}
                                </div>
                                {!sidebarCollapsed && (
                                    <div className="min-w-0 text-left">
                                        <div className="text-sm font-semibold truncate">
                                            {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Your profile"}
                                        </div>
                                        <div className="text-[11px] text-zinc-600 font-medium truncate">Manage your account</div>
                                    </div>
                                )}
                            </div>
                            {!sidebarCollapsed && (
                                <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform", isProfileOpen && "rotate-180")} />
                            )}
                        </button>

                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                <div className={cn(
                                    "absolute z-50 rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden",
                                    sidebarCollapsed ? "left-3 w-[260px] bottom-[68px]" : "left-3 right-3 bottom-[68px]"
                                )}>
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

                                        <div className="relative">
                                            <button
                                                onMouseEnter={() => setIsLearnOpen(true)}
                                                onMouseLeave={() => setIsLearnOpen(false)}
                                                onClick={() => setIsLearnOpen((v) => !v)}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                            >
                                                <span className="flex items-center gap-3">
                                                    <BookOpen className="h-4 w-4 text-zinc-500" />
                                                    Learn more
                                                </span>
                                                <ChevronRight className="h-4 w-4 text-zinc-600" />
                                            </button>

                                            {isLearnOpen && (
                                                <div
                                                    onMouseEnter={() => setIsLearnOpen(true)}
                                                    onMouseLeave={() => setIsLearnOpen(false)}
                                                    className="absolute left-full top-0 ml-2 w-64 rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                                                >
                                                    <div className="p-2">
                                                        <Link href="/features" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200">
                                                            <Shield className="h-4 w-4 text-zinc-500" />
                                                            About Project Cortex
                                                        </Link>
                                                        <Link href="/docs" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200">
                                                            <BookOpen className="h-4 w-4 text-zinc-500" />
                                                            Tutorials
                                                        </Link>
                                                        <button onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left">
                                                            <Sparkles className="h-4 w-4 text-zinc-500" />
                                                            Courses
                                                        </button>
                                                        <Link href="/legal/terms" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200">
                                                            <TriangleAlert className="h-4 w-4 text-zinc-500" />
                                                            Usage policy
                                                        </Link>
                                                        <Link href="/legal/privacy" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200">
                                                            <Shield className="h-4 w-4 text-zinc-500" />
                                                            Privacy policy
                                                        </Link>
                                                        <Link href="/legal/terms" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200">
                                                            <Shield className="h-4 w-4 text-zinc-500" />
                                                            Terms & conditions
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/10 text-sm text-red-400 text-left"
                                        >
                                            <LogOut className="h-4 w-4 text-red-400" />
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
                <div className="h-14 px-6 flex items-center justify-between bg-zinc-950/60 backdrop-blur-xl">
                    <div className="relative">
                        <button
                            onClick={() => setIsPlanOpen((v) => !v)}
                            className="h-9 px-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] flex items-center gap-2 text-sm font-semibold text-zinc-200"
                        >
                            {plan}
                            <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform", isPlanOpen && "rotate-180")} />
                        </button>

                        {isPlanOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsPlanOpen(false)} />
                                <div className="absolute left-0 top-full mt-2 z-50 w-56 rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                                    <div className="p-2">
                                        {(["Vibe Coder", "Developer", "Teams", "Enterprise"] as const).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => {
                                                    setPlan(p);
                                                    setIsPlanOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full px-3 py-2 rounded-xl text-left text-sm hover:bg-white/[0.03]",
                                                    p === plan ? "text-white" : "text-zinc-200"
                                                )}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <div className="mt-1 px-3 py-2 text-[11px] text-zinc-600 font-medium">
                                            Plan selection is UI-only for now.
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        onClick={shareChat}
                        className="h-9 px-3 rounded-xl border border-white/5 text-zinc-300 hover:text-white bg-white/[0.02] hover:bg-white/[0.05]"
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share chat
                    </Button>
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
                                <div
                                    key={m.id || idx}
                                    className={cn("group relative", m.role === "user" ? "flex justify-end" : "flex justify-start")}
                                    onMouseEnter={() => setHoveredMessageIndex(idx)}
                                    onMouseLeave={() => setHoveredMessageIndex((v) => (v === idx ? null : v))}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[92%] md:max-w-[78%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed whitespace-pre-wrap",
                                            m.role === "user"
                                                ? "bg-zinc-900/80 border border-white/5 text-zinc-50"
                                                : "text-zinc-200"
                                        )}
                                    >
                                        {m.content}
                                    </div>

                                    {m.role === "user" && hoveredMessageIndex === idx && (
                                        <div className="absolute -top-3 right-2 flex items-center gap-1">
                                            <button
                                                onClick={() => safeCopy(m.content)}
                                                className="h-7 px-2 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 text-[11px] text-zinc-300 flex items-center gap-1"
                                                aria-label="Copy message"
                                            >
                                                <Copy className="h-3 w-3" />
                                                Copy
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setInput(m.content);
                                                    scrollToBottom();
                                                }}
                                                className="h-7 px-2 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 text-[11px] text-zinc-300"
                                                aria-label="Edit message"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => void sendMessageWithContent(m.content)}
                                                className="h-7 px-2 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 text-[11px] text-zinc-300 flex items-center gap-1"
                                                aria-label="Retry"
                                            >
                                                <RefreshCcw className="h-3 w-3" />
                                                Retry
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}

                        {sending && (
                            <div className="text-xs font-semibold text-purple-300/80 tracking-wide">
                                Cortex is thinking…
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-950/70 backdrop-blur-xl">
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
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-11 w-11 rounded-2xl border-white/10 hover:bg-white/5"
                                    onClick={() => setIsPlusOpen((v) => !v)}
                                    aria-label="Add"
                                >
                                    <Plus className="w-5 h-5 text-zinc-300" />
                                </Button>

                                {isPlusOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsPlusOpen(false)} />
                                        <div className="absolute left-0 bottom-[52px] z-50 w-72 rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                                            <div className="p-2">
                                                <button
                                                    onClick={() => {
                                                        setIsPlusOpen(false);
                                                        fileInputRef.current?.click();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                                >
                                                    <Plus className="h-4 w-4 text-zinc-500" />
                                                    Add files & photos
                                                </button>
                                                <button
                                                    onClick={() => setIsPlusOpen(false)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                                >
                                                    <Cloud className="h-4 w-4 text-zinc-500" />
                                                    Add from Google Drive
                                                </button>
                                                <button
                                                    onClick={() => setIsPlusOpen(false)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                                >
                                                    <Github className="h-4 w-4 text-zinc-500" />
                                                    Add a GitHub repository
                                                </button>
                                                <button
                                                    onClick={() => setIsPlusOpen(false)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                                >
                                                    <History className="h-4 w-4 text-zinc-500" />
                                                    Add your recent scan
                                                </button>
                                                <button
                                                    onClick={() => setIsPlusOpen(false)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                                >
                                                    <Globe className="h-4 w-4 text-zinc-500" />
                                                    Web search
                                                </button>
                                                <button
                                                    onClick={() => setIsPlusOpen(false)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                                >
                                                    <Bot className="h-4 w-4 text-zinc-500" />
                                                    Research
                                                </button>
                                                <button
                                                    onClick={() => setIsPlusOpen(false)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                                >
                                                    <BookOpen className="h-4 w-4 text-zinc-500" />
                                                    Learn
                                                </button>
                                                <button
                                                    onClick={() => setIsPlusOpen(false)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                                >
                                                    <HelpCircle className="h-4 w-4 text-zinc-500" />
                                                    Guide
                                                </button>
                                                <div className="mt-1 px-3 py-2 text-[11px] text-zinc-600 font-medium">
                                                    Some actions will be enabled soon.
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
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

"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    ArrowLeft,
    BookOpen,
    Bot,
    ChevronDown,
    Cloud,
    Copy,
    FolderGit2,
    Github,
    Globe,
    HelpCircle,
    History,
    LogOut,
    Plus,
    RefreshCcw,
    Search,
    Settings,
    Share2,
    Shield,
    Sparkles,
    SquarePen,
    ThumbsDown,
    ThumbsUp,
    MoreHorizontal,
    CheckCheck,
    FileDown,
    Flag,
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

type EditState = {
    messageId: string;
    draft: string;
} | null;

function BrandXIcon(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={props.className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M18.244 2H21l-6.54 7.474L22.5 22h-6.69l-5.24-6.32L4.96 22H2.2l7.02-8.02L1.5 2h6.86l4.73 5.73L18.244 2Zm-2.35 18h1.86L7.34 3.93H5.36l10.535 16.07Z"
            />
        </svg>
    );
}

function BrandWhatsAppIcon(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={props.className} aria-hidden="true">
            <path
                fill="currentColor"
                d="M20.52 3.48A11.88 11.88 0 0 0 12.03 0C5.43 0 .06 5.37.06 11.97c0 2.1.55 4.16 1.6 5.98L0 24l6.2-1.62a11.9 11.9 0 0 0 5.82 1.48h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.2-3.48-8.41Zm-8.5 18.4h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.68.97.98-3.59-.23-.37a9.9 9.9 0 0 1-1.52-5.3C2.15 6.5 6.53 2.12 12.03 2.12c2.61 0 5.06 1.02 6.9 2.86a9.7 9.7 0 0 1 2.86 6.9c0 5.5-4.48 9.99-9.99 9.99Zm5.48-7.48c-.3-.15-1.77-.87-2.04-.97-.27-.1-.46-.15-.65.15-.19.3-.75.97-.92 1.17-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.48-1.74-1.65-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.65-1.57-.9-2.15-.24-.58-.48-.5-.65-.5h-.56c-.2 0-.52.08-.8.37-.27.3-1.05 1.02-1.05 2.49 0 1.47 1.08 2.89 1.23 3.09.15.2 2.12 3.23 5.13 4.53.72.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.41.25-.7.25-1.3.17-1.41-.07-.12-.27-.2-.57-.35Z"
            />
        </svg>
    );
}

function BrandLinkedInIcon(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={props.className} aria-hidden="true">
            <path
                fill="currentColor"
}

interface ChatThread {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
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
    const [isLearnDrawerOpen, setIsLearnDrawerOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isPlanOpen, setIsPlanOpen] = useState(false);
    const [plan, setPlan] = useState<"Vibe Coder" | "Developer" | "Teams" | "Enterprise">("Vibe Coder");
    const [isPlusOpen, setIsPlusOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isScanSelectorOpen, setIsScanSelectorOpen] = useState(false);
    const [availableScans, setAvailableScans] = useState<Array<{id: string; repo_url: string; score: number | null; created_at: string; status: string; title: string}>>([]);
    const [currentScanId, setCurrentScanId] = useState<string | null>(() => scanIdFromUrl);

    const [streamingMessage, setStreamingMessage] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [thinkingDots, setThinkingDots] = useState<"." | ".." | "...">(".");
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    // Load threads and messages
    const load = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const threadsRes = await fetch("/api/chat/threads");
            if (threadsRes.ok) {
                const threadsData = await threadsRes.json();
                setThreads(threadsData.threads || []);
            }

            const messagesRes = await fetch("/api/chat/messages");
            if (messagesRes.ok) {
                const messagesData = await messagesRes.json();
                setMessages(messagesData.messages || []);
            }
        } catch (error) {
            console.error("Failed to load chat data:", error);
        }
        setLoading(false);
    }, [user]);

    // Load available scans
    const loadAvailableScans = useCallback(async () => {
        if (!user) return;

        try {
            const res = await fetch("/api/scans");
            if (res.ok) {
                const data = await res.json();
                setAvailableScans(data.scans || []);
            }
        } catch (error) {
            console.error("Failed to load scans:", error);
        }
    }, [user]);

    // Select scan and reload chat
    const selectScan = useCallback((scanId: string) => {
        setCurrentScanId(scanId);
        setIsScanSelectorOpen(false);
        window.location.href = `/chat?scanId=${scanId}`;
    }, []);

    // Remove attachment
    const removeAttachment = useCallback((index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    }, []);

    // Send message
    const sendMessage = useCallback(async () => {
        if (!input.trim() && attachments.length === 0) return;
        if (!user) return;

        setSending(true);
        const messageToSend = input.trim();
        const attachmentsToSend = [...attachments];

        setInput("");
        setAttachments([]);

        const optimisticMessage: ChatMessage = {
            id: `pending-${Date.now()}`,
            role: "user",
            content: messageToSend,
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, optimisticMessage]);

        try {
            const formData = new FormData();
            formData.append("message", messageToSend);
            if (currentScanId) {
                formData.append("scanId", currentScanId);
            }
            attachmentsToSend.forEach((file, index) => {
                formData.append(`attachment-${index}`, file);
            });

            const res = await fetch("/api/chat", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                if (res.status === 503) {
                    const errorData = await res.json().catch(() => ({}));
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: errorData.message || "AI service is currently unavailable. Please try again later.",
                        created_at: new Date().toISOString()
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: "Sorry, I encountered an error. Please try again.",
                        created_at: new Date().toISOString()
                    }]);
                }
                return;
            }

            const data = await res.json();

            // Replace optimistic message with real one
            setMessages(prev => prev.map(msg =>
                msg.id === optimisticMessage.id
                    ? { ...data.userMessage, id: data.userMessage.id || msg.id }
                    : msg
            ));

            // Add assistant message
            if (data.assistantMessage) {
                setMessages(prev => [...prev, data.assistantMessage]);
            }

            // Reload threads to get updated titles
            load();

        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
                created_at: new Date().toISOString()
            }]);
        }
        setSending(false);
    }, [input, attachments, user, currentScanId, load]);

    // Auto-scroll handling
    const didUserScrollAwayRef = useRef(false);
    const shouldAutoScrollRef = useRef(true);

    const maybeAutoScroll = useCallback(() => {
        if (!shouldAutoScrollRef.current || !scrollerRef.current) return;
        scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }, []);

    // Thinking dots animation
    useEffect(() => {
        if (!isStreaming) return;

        const interval = setInterval(() => {
            setThinkingDots(prev => prev === "." ? ".." : prev === "..." ? "." : "...");
        }, 500);

        return () => clearInterval(interval);
    }, [isStreaming]);

    // Load data on mount
    useEffect(() => {
        load();
        loadAvailableScans();
    }, [load, loadAvailableScans]);

    // Auto-scroll when new messages arrive
    useEffect(() => {
        if (messages.length > 0 && shouldAutoScrollRef.current) {
            setTimeout(maybeAutoScroll, 100);
        }
    }, [messages, maybeAutoScroll]);

    const filteredThreads = useMemo(() => {
        const q = searchThreads.trim().toLowerCase();
        if (!q) return threads;
        return threads.filter((t) => (t.title || "Cortex Chat").toLowerCase().includes(q));
    }, [threads, searchThreads]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-100">
                <div className="text-sm text-zinc-500 font-medium">Loading…</div>
            </div>
        );
    }

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
                            <button
                                onClick={() => setSidebarCollapsed((v) => !v)}
                                className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center w-full")}
                                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            >
                                <div className={cn(
                                    "rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center overflow-hidden",
                                    sidebarCollapsed ? "h-11 w-11" : "h-11 w-11"
                                )}>
                                    <Image src="/assets/logo.png" alt="Cortex" width={32} height={32} className="h-8 w-8" />
                                </div>
                                {!sidebarCollapsed && (
                                    <div className="leading-tight text-left">
                                        <div className="text-sm font-bold tracking-tight">Cortex Chat</div>
                                        <div className="text-[11px] text-zinc-500 font-medium">chat.cortex-edr.com</div>
                                    </div>
                                )}
                            </button>
                            <div className="flex items-center gap-2">
                                {!sidebarCollapsed && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => window.location.href = '/chat'}
                                        className="h-9 w-9 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                                        aria-label="New chat"
                                    >
                                        <SquarePen className="h-4 w-4 text-zinc-200" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {!sidebarCollapsed && (
                            <>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <Link href="/" className="col-span-1">
                                        <Button
                                            variant="outline"
                                            className="w-full h-9 rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-zinc-200"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Home
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.href = '/chat'}
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

                        {sidebarCollapsed && (
                            <div className="mt-3 flex flex-col items-center gap-2">
                                <Link href="/" className="w-full flex justify-center">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-2xl border-white/10 bg-transparent hover:bg-white/5"
                                        aria-label="Back to home"
                                    >
                                        <ArrowLeft className="h-4 w-4 text-zinc-200" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => window.location.href = '/chat'}
                                    className="h-10 w-10 rounded-2xl border-white/10 bg-transparent hover:bg-white/5"
                                    aria-label="New chat"
                                >
                                    <SquarePen className="h-4 w-4 text-zinc-200" />
                                </Button>
                            </div>
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
                                        onClick={() => window.location.href = `/chat?threadId=${t.id}`}
                                        className={cn(
                                            "w-full px-3 py-2 rounded-xl transition-all flex items-center justify-center",
                                            t.id === threadId ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"
                                        )}
                                        aria-label={t.title || "Cortex Chat"}
                                    >
                                        <div className="h-4 w-4" />
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
                                        onClick={() => window.location.href = `/chat?threadId=${t.id}`}
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

                                        <button
                                            onMouseEnter={() => setIsLearnDrawerOpen(true)}
                                            onClick={() => setIsLearnDrawerOpen(true)}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                        >
                                            <BookOpen className="h-4 w-4 text-zinc-500" />
                                            Learn more
                                        </button>
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
                        onClick={() => setIsShareOpen(true)}
                        className="h-9 px-3 rounded-xl border border-white/5 text-zinc-300 hover:text-white bg-white/[0.02] hover:bg-white/[0.05]"
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share chat
                    </Button>
                </div>

                {isShareOpen && (
                    <>
                        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setIsShareOpen(false)} />
                        <div className="fixed inset-x-0 top-24 z-50">
                            <div className="mx-auto w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                                <div className="p-4">
                                    <div className="text-sm font-bold text-white">Share this chat</div>
                                    <div className="mt-1 text-xs text-zinc-500 font-medium">Make your conversation shareable.</div>

                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => safeCopy(window.location.href)}
                                            className="h-11 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-sm font-semibold text-zinc-200"
                                        >
                                            Copy chat link
                                        </button>
                                        <button
                                            onClick={() => setIsShareOpen(false)}
                                            className="h-11 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-sm font-semibold text-zinc-200"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        <a
                                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="h-11 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center gap-2 text-sm font-semibold text-zinc-200"
                                        >
                                            <BrandXIcon className="h-4 w-4" />
                                            X
                                        </a>
                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="h-11 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center gap-2 text-sm font-semibold text-zinc-200"
                                        >
                                            <BrandWhatsAppIcon className="h-4 w-4" />
                                            WhatsApp
                                        </a>
                                        <a
                                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="h-11 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center gap-2 text-sm font-semibold text-zinc-200"
                                        >
                                            <BrandLinkedInIcon className="h-4 w-4" />
                                            LinkedIn
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {isLearnDrawerOpen && (
                    <>
                        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setIsLearnDrawerOpen(false)} />
                        <div className="fixed right-0 top-0 bottom-0 z-50 w-[360px] border-l border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl">
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold text-white">Learn more</div>
                                    <div className="text-xs text-zinc-500 font-medium">Project Cortex resources</div>
                                </div>
                                <button
                                    onClick={() => setIsLearnDrawerOpen(false)}
                                    className="h-9 w-9 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center"
                                    aria-label="Close"
                                >
                                    <X className="h-4 w-4 text-zinc-200" />
                                </button>
                            </div>

                            <div className="px-2 pb-4">
                                <Link href="/features" onClick={() => setIsLearnDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-white/[0.03] text-sm text-zinc-200">
                                    <Shield className="h-4 w-4 text-zinc-500" />
                                    About Project Cortex
                                </Link>
                                <Link href="/docs" onClick={() => setIsLearnDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-white/[0.03] text-sm text-zinc-200">
                                    <BookOpen className="h-4 w-4 text-zinc-500" />
                                    Tutorials
                                </Link>
                                <button onClick={() => setIsLearnDrawerOpen(false)} className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left">
                                    <Sparkles className="h-4 w-4 text-zinc-500" />
                                    Courses
                                </button>
                                <Link href="/legal/terms" onClick={() => setIsLearnDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-white/[0.03] text-sm text-zinc-200">
                                    <TriangleAlert className="h-4 w-4 text-zinc-500" />
                                    Usage policy
                                </Link>
                                <Link href="/legal/privacy" onClick={() => setIsLearnDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-white/[0.03] text-sm text-zinc-200">
                                    <Shield className="h-4 w-4 text-zinc-500" />
                                    Privacy policy
                                </Link>
                                <Link href="/legal/terms" onClick={() => setIsLearnDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-white/[0.03] text-sm text-zinc-200">
                                    <Shield className="h-4 w-4 text-zinc-500" />
                                    Terms & conditions
                                </Link>
                            </div>
                        </div>
                    </>
                )}

                <div
                    ref={scrollerRef}
                    className="flex-1 overflow-auto custom-scrollbar"
                    onScroll={() => {
                        const nearBottom = isNearBottom();
                        shouldAutoScrollRef.current = nearBottom;
                        didUserScrollAwayRef.current = !nearBottom;
                    }}
                >
                    <div className="max-w-4xl mx-auto px-[20px] py-8 space-y-6">
                        {loading ? (
                            <div className="pt-24 text-center text-sm text-zinc-500 font-medium">Loading…</div>
                        ) : messages.length === 0 ? (
                            <div className="pt-24 text-center">
                                <div className="mx-auto h-14 w-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center overflow-hidden">
                                    <Image src="/assets/logo.png" alt="CortexEDR" width={56} height={56} />
                                </div>
                                <div className="mt-6 text-3xl font-bold tracking-tight text-white">Chat with Cortex</div>
                                <div className="mt-3 text-sm text-zinc-300 font-semibold leading-6 max-w-xl mx-auto">
                                    Ship with clarity. Fix what matters. Leave the rest.
                                </div>
                                <div className="mt-2 text-sm text-zinc-500 font-medium leading-6 max-w-xl mx-auto">
                                    Direct, point-to-point guidance grounded in your scans, your architecture, and your priorities.
                                </div>
                            </div>
                        ) : (
                            messages.map((m, idx) => (
                                <div
                                    key={m.id || idx}
                                    className={cn("group", m.role === "user" ? "flex justify-end" : "flex justify-start")}
                                >
                                    <div className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
                                        <div
                                            className={cn(
                                                "rounded-2xl px-5 py-4 text-[15px] leading-7 whitespace-pre-wrap",
                                                m.role === "user"
                                                    ? "max-w-[84%] md:max-w-[72%] bg-zinc-900/80 border border-white/5 text-zinc-50"
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
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
                d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.37V9h3.41v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.33 2.41 4.33 5.55v6.19ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .78 0 1.74v20.52C0 23.22.79 24 1.77 24h20.46c.98 0 1.77-.78 1.77-1.74V1.74C24 .78 23.21 0 22.23 0Z"
            />
        </svg>
    );
}

function BrandGoogleDriveIcon(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={props.className} aria-hidden="true">
            <path fill="currentColor" d="M7.67 3 1.5 13.67l3.1 5.36L10.77 8.36 7.67 3Zm14.83 10.67L16.33 3h-6.2l6.17 10.67h6.2ZM4.6 19.03h12.33l3.1-5.36H7.7l-3.1 5.36Z" />
        </svg>
    );
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
    const [isLearnDrawerOpen, setIsLearnDrawerOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isPlanOpen, setIsPlanOpen] = useState(false);
    const [plan, setPlan] = useState<"Vibe Coder" | "Developer" | "Teams" | "Enterprise">("Vibe Coder");
    const [isPlusOpen, setIsPlusOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [thinkingDots, setThinkingDots] = useState<"." | ".." | "...">(".");
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [editState, setEditState] = useState<EditState>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const scanId = useMemo(() => scanIdFromUrl, [scanIdFromUrl]);

    const isNearBottom = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return true;
        const threshold = 140;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        return distanceFromBottom < threshold;
    }, []);

    const shouldAutoScrollRef = useRef(true);
    const didUserScrollAwayRef = useRef(false);

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
        });
    }, []);

    const maybeAutoScroll = useCallback(() => {
        if (!shouldAutoScrollRef.current) return;
        if (didUserScrollAwayRef.current) return;
        scrollToBottom();
    }, [scrollToBottom]);

    const typewriterEffect = useCallback((text: string, callback?: () => void) => {
        const nearBottom = isNearBottom();
        shouldAutoScrollRef.current = nearBottom;
        didUserScrollAwayRef.current = !nearBottom;
        setIsStreaming(true);
        setStreamingMessage("");
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setStreamingMessage((prev) => prev + text[index]);
                index++;
                maybeAutoScroll();
            } else {
                clearInterval(interval);
                setIsStreaming(false);
                if (callback) callback();
            }
        }, 12); // Adjust speed here (lower = faster)
    }, [isNearBottom, maybeAutoScroll]);

    useEffect(() => {
        if (!sending || isStreaming) return;
        const tick = setInterval(() => {
            setThinkingDots((prev) => (prev === "..." ? "." : prev === ".." ? "..." : ".."));
        }, 450);
        return () => clearInterval(tick);
    }, [sending, isStreaming]);

    const load = useCallback(async (preferredThreadId?: string | null) => {
        setLoading(true);
        try {
            const qs = new URLSearchParams();
            if (preferredThreadId) qs.set("threadId", preferredThreadId);
            if (scanId) qs.set("scanId", scanId);

            const res = await fetch(`/api/chat?${qs.toString()}`, { method: "GET" });
            const data = await res.json();
            if (res.status === 401) {
                setLoading(false);
                setMessages((prev) =>
                    prev.length
                        ? prev
                        : [{ role: "assistant", content: "Your session expired. Please refresh and sign in again." }]
                );
                return;
            }
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

    const replayFromMessage = async (messageId: string, editedContent?: string) => {
        if (!threadId) return;
        const res = await fetch("/api/chat/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                threadId,
                messageId,
                action: editedContent ? "edit" : "retry",
                content: editedContent
            })
        });
        const data = await res.json();
        if (res.status === 401) {
            throw new Error("Your session expired. Please refresh and sign in again.");
        }
        if (!res.ok) throw new Error(data?.message || data?.error || "Failed to replay message");
        setMessages(data.messages || []);
        if (data.threadId) setThreadId(data.threadId);
    };

    const startEditMessage = (m: ChatMessage) => {
        if (!m.id) return;
        setEditState({ messageId: m.id, draft: m.content });
    };

    const cancelEdit = () => {
        setEditState(null);
    };

    const saveEdit = async () => {
        if (!editState) return;
        const trimmed = editState.draft.trim();
        if (!trimmed) return;
        await replayFromMessage(editState.messageId, trimmed);
        setEditState(null);
    };

    const sendMessageWithContent = async (content: string) => {
        if (sending) return;
        if (!content.trim() && attachments.length === 0) return;

        const isNewThread = !threadId;
        const optimisticThreadId = isNewThread ? `pending-${Date.now()}` : null;
        if (optimisticThreadId) {
            const words = content
                .trim()
                .replace(/\s+/g, " ")
                .split(" ")
                .filter(Boolean);
            const title = words.slice(0, 4).join(" ") || "New chat";
            setThreads((prev) => [
                {
                    id: optimisticThreadId,
                    title,
                    last_scan_id: scanId || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                ...prev
            ]);
            setThreadId(optimisticThreadId);
        }

        setSending(true);
        const optimisticUser: ChatMessage = { role: "user", content };
        setMessages((prev) => [...prev, optimisticUser]);
        scrollToBottom();

        try {
            const realThreadId = threadId && !threadId.startsWith("pending-") ? threadId : null;
            const payload = {
                message: content,
                threadId: isNewThread ? null : realThreadId,
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

            if (res.status === 401) {
                throw new Error("Unauthorized. Please refresh and sign in again.");
            }

            if (!res.ok) {
                if (data.error === "AI_SERVICE_UNAVAILABLE") {
                    const fallback = typeof data.fallbackResponse === "object" 
                        ? JSON.stringify(data.fallbackResponse, null, 2)
                        : data.fallbackResponse || "Cortex AI is temporarily unavailable. Please try again shortly.";
                    const assistantMsg: ChatMessage = { role: "assistant", content: fallback };
                    setMessages((prev) => [...prev, assistantMsg]);
                    scrollToBottom();
                    return;
                }
                throw new Error(data?.message || data?.error || "Failed to send message");
            }

            // Update thread ID if this was a new thread
            if (optimisticThreadId && data.threadId) {
                setThreadId(data.threadId);
                // Replace optimistic thread with real one
                setThreads((prev) => prev.map((t) => 
                    t.id === optimisticThreadId 
                        ? { ...t, id: data.threadId, title: data.threadTitle || t.title }
                        : t
                ));
            }

            // Use typewriter effect for the assistant response
            const assistantText = data.response || "I'm here to help!";
            typewriterEffect(assistantText, () => {
                // After typewriter finishes, add the message to the list
                const assistantMsg: ChatMessage = data.assistantMessage
                    ? {
                        id: data.assistantMessage.id,
                        role: data.assistantMessage.role,
                        content: data.assistantMessage.content,
                        attachments: data.assistantMessage.attachments ?? null,
                        created_at: data.assistantMessage.created_at
                    }
                    : { role: "assistant", content: assistantText };

                setMessages((prev) => {
                    // If we already appended the assistant msg earlier, avoid duplicates
                    const alreadyHas = prev.some((m) => m.role === 'assistant' && m.content === assistantMsg.content);
                    return alreadyHas ? prev : [...prev, assistantMsg];
                });
                setStreamingMessage("");
            });

        } catch (err) {
            console.error("Send error:", err);
            const errMsg = err instanceof Error ? err.message : "Something went wrong";
            const assistantMsg: ChatMessage = { role: "assistant", content: errMsg };
            setMessages((prev) => [...prev, assistantMsg]);
            scrollToBottom();
        } finally {
            setSending(false);
            setAttachments([]);
            setInput("");
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
        setIsShareOpen(true);
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
                                        onClick={startNewChat}
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

                        {sidebarCollapsed && (
                            <div className="mt-3 flex flex-col items-center gap-2">
                                <Link href="/dashboard" className="w-full flex justify-center">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-2xl border-white/10 bg-transparent hover:bg-white/5"
                                        aria-label="Back to EDR"
                                    >
                                        <ArrowLeft className="h-4 w-4 text-zinc-200" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={startNewChat}
                                    className="h-10 w-10 rounded-2xl border-white/10 bg-transparent hover:bg-white/5"
                                    aria-label="New chat"
                                >
                                    <SquarePen className="h-4 w-4 text-zinc-200" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setSidebarCollapsed(false)}
                                    className="h-10 w-10 rounded-2xl border-white/10 bg-transparent hover:bg-white/5"
                                    aria-label="Search chats"
                                >
                                    <Search className="h-4 w-4 text-zinc-200" />
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
                                        onClick={() => load(t.id)}
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
                        onClick={shareChat}
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
                                                    : "w-full max-w-[92%] md:max-w-[82%] text-zinc-200"
                                            )}
                                        >
                                            {m.role === "assistant" ? (
                                                <div className="min-w-0">
                                                    <div className="prose prose-invert max-w-none prose-p:my-2 prose-li:my-0.5 prose-ul:my-2 prose-ol:my-2 prose-pre:my-3 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4 prose-headings:tracking-tight prose-headings:text-zinc-100 prose-strong:text-zinc-100">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                p: (p) => <p className="leading-7 text-zinc-200" {...p} />,
                                                                a: (p) => <a className="text-zinc-100 hover:text-white underline" {...p} />,
                                                                code: (p) => <code className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[13px]" {...p} />,
                                                                pre: (p) => <pre className="overflow-auto" {...p} />
                                                            }}
                                                        >
                                                            {m.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            ) : (
                                                m.content
                                            )}
                                        </div>

                                        {m.role === "user" && editState?.messageId === m.id && (
                                            <div className="w-full mt-2 max-w-[84%] md:max-w-[72%]">
                                                {(() => {
                                                    const localDraft = editState?.draft ?? "";
                                                    return (
                                                        <textarea
                                                            value={localDraft}
                                                            onChange={(e) => {
                                                                const next = e.target.value;
                                                                setEditState((prev) => {
                                                                    if (!prev) return prev;
                                                                    return { ...prev, draft: next };
                                                                });
                                                            }}
                                                            className="w-full min-h-[80px] resize-none rounded-xl bg-zinc-950/40 border border-white/10 px-4 py-3 text-[15px] leading-7 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                                                        />
                                                    );
                                                })()}
                                                <div className="mt-2 flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="h-8 px-3 rounded-lg border border-white/10 bg-transparent hover:bg-white/5 text-xs font-semibold text-zinc-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => void saveEdit()}
                                                        className="h-8 px-3 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {m.role === "user" && (
                                            <div className="mt-2 h-8">
                                                <div className="flex items-center gap-2 opacity-0 translate-y-1 pointer-events-none transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                                                    <button
                                                        onClick={() => {
                                                            safeCopy(m.content);
                                                            const key = `user-${m.id || idx}`;
                                                            setCopiedKey(key);
                                                            setTimeout(() => setCopiedKey((v) => (v === key ? null : v)), 900);
                                                        }}
                                                        className="h-7 px-2 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 text-[11px] text-zinc-300 flex items-center gap-1"
                                                        aria-label="Copy message"
                                                    >
                                                        {copiedKey === `user-${m.id || idx}` ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                                        Copy
                                                    </button>
                                                    <button
                                                        onClick={() => startEditMessage(m)}
                                                        disabled={!m.id}
                                                        className="h-7 px-2 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 text-[11px] text-zinc-300 disabled:opacity-40"
                                                        aria-label="Edit message"
                                                        title={m.id ? "Edit" : "Save to enable editing"}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => (m.id ? void replayFromMessage(m.id) : undefined)}
                                                        disabled={!m.id}
                                                        className="h-7 px-2 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 text-[11px] text-zinc-300 flex items-center gap-1 disabled:opacity-40"
                                                        aria-label="Retry"
                                                        title={m.id ? "Retry" : "Save to enable retry"}
                                                    >
                                                        <RefreshCcw className="h-3 w-3" />
                                                        Retry
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {m.role === "assistant" && (
                                            <div className="mt-2 h-8">
                                                <div className="flex items-center gap-2 opacity-0 translate-y-1 pointer-events-none transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                                                    <button
                                                        onClick={() => {
                                                            safeCopy(m.content);
                                                            const key = `assistant-${m.id || idx}`;
                                                            setCopiedKey(key);
                                                            setTimeout(() => setCopiedKey((v) => (v === key ? null : v)), 900);
                                                        }}
                                                        className="h-7 w-7 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 flex items-center justify-center text-zinc-300"
                                                        aria-label="Copy"
                                                        title="Copy"
                                                    >
                                                        {copiedKey === `assistant-${m.id || idx}` ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                    </button>
                                                    <button
                                                        className="h-7 w-7 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 flex items-center justify-center text-zinc-300"
                                                        aria-label="Like"
                                                        title="Like"
                                                        onClick={() => {}}
                                                    >
                                                        <ThumbsUp className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        className="h-7 w-7 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 flex items-center justify-center text-zinc-300"
                                                        aria-label="Dislike"
                                                        title="Dislike"
                                                        onClick={() => {}}
                                                    >
                                                        <ThumbsDown className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setIsShareOpen(true)}
                                                        className="h-7 w-7 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 flex items-center justify-center text-zinc-300"
                                                        aria-label="Share"
                                                        title="Share"
                                                    >
                                                        <Share2 className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        className="h-7 w-7 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 flex items-center justify-center text-zinc-300"
                                                        aria-label="Retry"
                                                        title="Retry"
                                                        onClick={() => {}}
                                                    >
                                                        <RefreshCcw className="h-3.5 w-3.5" />
                                                    </button>

                                                    <div className="relative">
                                                        <button
                                                            className="h-7 w-7 rounded-lg border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 flex items-center justify-center text-zinc-300"
                                                            aria-label="More"
                                                            title="More"
                                                            onClick={() => {}}
                                                        >
                                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                                        </button>
                                                        <div className="hidden" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        {isStreaming && (
                            <div className="flex justify-start">
                                <div className="flex flex-col items-start max-w-[92%] md:max-w-[78%]">
                                    <div className="rounded-2xl px-5 py-4 text-[15px] leading-relaxed whitespace-pre-wrap text-zinc-200">
                                        {streamingMessage}
                                        <span className="animate-pulse">|</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {sending && !isStreaming && (
                            <div className="text-xs font-semibold tracking-wide">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300 animate-pulse">
                                    Cortex is thinking{thinkingDots}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-950/70 backdrop-blur-xl">
                    <div className="max-w-4xl mx-auto px-[20px] py-4">
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
                                                    <BrandGoogleDriveIcon className="h-4 w-4 text-zinc-500" />
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

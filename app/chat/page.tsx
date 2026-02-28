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
    metadata?: any;
}

interface ChatThread {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

interface EditState {
    messageId: string;
    message: string;
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
    const [editState, setEditState] = useState<EditState | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const scanId = useMemo(() => scanIdFromUrl, [scanIdFromUrl]);

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
        // Reload with new scan context
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
        setEditState(null);

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

            // Add assistant message and start streaming
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

    const handleScroll = useCallback(() => {
        if (!scrollerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollerRef.current;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

        if (!isNearBottom && !didUserScrollAwayRef.current) {
            didUserScrollAwayRef.current = true;
            shouldAutoScrollRef.current = false;
        } else if (isNearBottom && didUserScrollAwayRef.current) {
            didUserScrollAwayRef.current = false;
            shouldAutoScrollRef.current = true;
        }
    }, []);

    // Thinking dots animation
    useEffect(() => {
        if (!isStreaming) return;

        const interval = setInterval(() => {
            setThinkingDots(prev => prev === "." ? ".." : prev === ".." ? "..." : ".");
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-100"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-100">
            {/* Sidebar */}
            <div className={cn(
                "flex flex-col border-r border-zinc-800 bg-zinc-900 transition-all duration-300",
                sidebarCollapsed ? "w-16" : "w-80"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    {!sidebarCollapsed && (
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-lg">CortexEDR</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className={cn("w-4 h-4 transition-transform", sidebarCollapsed ? "rotate-180" : "")} />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="p-4">
                    <Link href="/chat" className="w-full flex items-center gap-3 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors">
                        <Plus className="w-4 h-4" />
                        {!sidebarCollapsed && "New Chat"}
                    </Link>
                </div>

                {/* Threads */}
                <div className="flex-1 overflow-hidden">
                    {!sidebarCollapsed && (
                        <div className="p-4 pb-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchThreads}
                                    onChange={(e) => setSearchThreads(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-600"
                                />
                            </div>
                        </div>
                    )}

                    <div className="px-2">
                        {threads.filter(thread =>
                            !searchThreads ||
                            thread.title.toLowerCase().includes(searchThreads.toLowerCase())
                        ).map((thread) => (
                            <Link
                                key={thread.id}
                                href={`/chat?threadId=${thread.id}`}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-zinc-800 transition-colors mb-1",
                                    thread.id === threadId ? "bg-zinc-800" : ""
                                )}
                            >
                                <Bot className="w-4 h-4 text-zinc-400" />
                                {!sidebarCollapsed && (
                                    <span className="truncate">{thread.title}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-zinc-800">
                    <div className="space-y-1">
                        <button
                            onClick={() => setIsScanSelectorOpen(true)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                        >
                            <History className="h-4 w-4 text-zinc-500" />
                            {!sidebarCollapsed && "Add your recent scan"}
                        </button>
                        <Link href="/docs" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left">
                            <BookOpen className="h-4 w-4 text-zinc-500" />
                            {!sidebarCollapsed && "Documentation"}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold">Cortex</h1>
                            <p className="text-sm text-zinc-400">AI Security Advisor</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div
                    ref={scrollerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                                    <Bot className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold">Welcome to Cortex</h2>
                                <p className="text-zinc-400 max-w-md">
                                    I'm your AI security advisor. I analyze code for vulnerabilities, architecture issues, and provide expert recommendations. Let's get started!
                                </p>
                            </div>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id || Math.random()}
                                className={cn(
                                    "flex gap-4 max-w-4xl",
                                    message.role === "user" ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                    message.role === "user"
                                        ? "bg-zinc-100 text-zinc-950"
                                        : "bg-gradient-to-br from-blue-500 to-purple-600"
                                )}>
                                    {message.role === "user" ? (
                                        <User className="w-4 h-4" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-white" />
                                    )}
                                </div>

                                <div className={cn(
                                    "flex-1 space-y-2",
                                    message.role === "user" ? "text-right" : ""
                                )}>
                                    <div className={cn(
                                        "rounded-2xl px-4 py-3 inline-block max-w-2xl",
                                        message.role === "user"
                                            ? "bg-zinc-100 text-zinc-950 ml-auto"
                                            : "bg-zinc-800 text-zinc-100"
                                    )}>
                                        {message.role === "assistant" ? (
                                            <div className="prose prose-invert prose-zinc max-w-none text-sm">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        p: ({children}) => <p className="mb-2 last:mb-0 leading-5">{children}</p>,
                                                        ul: ({children}) => <ul className="mb-2 last:mb-0 space-y-0.5 ml-4">{children}</ul>,
                                                        ol: ({children}) => <ol className="mb-2 last:mb-0 space-y-0.5 ml-4">{children}</ol>,
                                                        li: ({children}) => <li className="leading-5">{children}</li>,
                                                        h1: ({children}) => <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
                                                        h2: ({children}) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                                                        h3: ({children}) => <h3 className="text-sm font-bold mb-1 mt-2 first:mt-0">{children}</h3>,
                                                        h4: ({children}) => <h4 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h4>,
                                                        code: ({children, className}) => {
                                                            const isInline = !className;
                                                            return isInline ? (
                                                                <code className="bg-zinc-700 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                                                            ) : (
                                                                <code className="block bg-zinc-900 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">{children}</code>
                                                            );
                                                        },
                                                        blockquote: ({children}) => (
                                                            <blockquote className="border-l-2 border-zinc-600 pl-4 italic text-zinc-300 mb-2">
                                                                {children}
                                                            </blockquote>
                                                        )
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Streaming indicator */}
                    {isStreaming && (
                        <div className="flex gap-4 max-w-4xl">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-zinc-800 text-zinc-100 rounded-2xl px-4 py-3 inline-block">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                    </div>
                                    <span className="text-sm text-zinc-400">Cortex is thinking{thinkingDots}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-zinc-800">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    placeholder="Ask Cortex about security, code quality, or architecture..."
                                    className="w-full min-h-[44px] max-h-32 resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 pr-12 text-sm focus:outline-none focus:border-zinc-600"
                                    rows={1}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-zinc-800 rounded"
                                >
                                    <FileDown className="w-4 h-4 text-zinc-400" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        setAttachments(prev => [...prev, ...files]);
                                    }}
                                />
                            </div>

                            <Button
                                onClick={sendMessage}
                                disabled={sending || (!input.trim() && attachments.length === 0)}
                                className="h-11 px-4 rounded-2xl bg-zinc-100 text-zinc-950 hover:bg-white font-bold disabled:opacity-50"
                                aria-label="Send message"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Attachments */}
                        {attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {attachments.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                                        <FileDown className="w-4 h-4 text-zinc-400" />
                                        <span className="text-sm text-zinc-200 truncate max-w-32">{file.name}</span>
                                        <button
                                            onClick={() => removeAttachment(index)}
                                            className="p-1 hover:bg-zinc-700 rounded"
                                        >
                                            <X className="w-3 h-3 text-zinc-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-2 text-[11px] text-zinc-600 font-medium text-center">
                            Cortex can make mistakes. Verify security-critical details.
                        </div>
                    </div>
                </div>
            </div>

            {/* Scan Selector Modal */}
            {isScanSelectorOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setIsScanSelectorOpen(false)} />
                    <div className="fixed inset-x-0 top-24 z-50 mx-auto max-w-md">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
                            <div className="p-4 border-b border-zinc-800">
                                <h3 className="font-bold">Select a Scan</h3>
                                <p className="text-sm text-zinc-400 mt-1">Load scan data into your chat context</p>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {availableScans.length === 0 ? (
                                    <div className="p-4 text-center text-zinc-400">
                                        No scans available. Run a scan first to load context.
                                    </div>
                                ) : (
                                    availableScans.map((scan) => (
                                        <button
                                            key={scan.id}
                                            onClick={() => selectScan(scan.id)}
                                            className="w-full p-4 text-left hover:bg-zinc-800 border-b border-zinc-800 last:border-b-0 transition-colors"
                                        >
                                            <div className="font-medium text-zinc-200">{scan.title}</div>
                                            <div className="text-sm text-zinc-400 mt-1">
                                                {new Date(scan.created_at).toLocaleDateString()} •
                                                Score: {scan.score ? `${scan.score}%` : 'N/A'}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-100"></div>
            </div>
        }>
            <ChatHomeInner />
        </Suspense>
    );
}

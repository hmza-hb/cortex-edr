import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AgentStatus } from '@/types/agent';
import { Github, Shield, Bug, Search, Code, Layers, Brain, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentNodeProps {
    id: number;
    name: string;
    status: AgentStatus;
    repoName?: string;
    message?: string;
    issueCount?: number;
    filesProcessed?: number;
    totalFiles?: number;
}

const GithubLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="white"
        className={className}
    >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const ICONS = {
    0: GithubLogo,
    1: Search,
    2: Shield,
    3: Layers,
    4: Code,
    5: Bug,
    6: Brain,
    7: FileText,
};

const STATUS_MESSAGES = ["Initializing...", "Connecting...", "Cloning...", "Cloned ✓"];

export const AgentNode = React.forwardRef<HTMLDivElement, AgentNodeProps>(
    ({ id, name, status, repoName, message, issueCount = 0, filesProcessed = 0, totalFiles = 0 }, ref) => {
        const Icon = ICONS[id as keyof typeof ICONS] || Bug;

        const isWaiting = status === 'waiting' && id !== 0;
        const isActive = status === 'active';
        const isCompleted = status === 'completed';
        const isIdle = !isActive && !isCompleted && !isWaiting;

        const [typedRepo, setTypedRepo] = useState("");
        const isGit = id === 0;

        // Issue badge state for animation
        const [prevIssues, setPrevIssues] = useState(issueCount);
        const [shouldPulse, setShouldPulse] = useState(false);

        useEffect(() => {
            if (issueCount > prevIssues) {
                setShouldPulse(true);
                const timer = setTimeout(() => setShouldPulse(false), 500);
                setPrevIssues(issueCount);
                return () => clearTimeout(timer);
            }
        }, [issueCount, prevIssues]);

        useEffect(() => {
            if (isCompleted && repoName && isGit) {
                let i = 0;
                const fullText = `github.com/${repoName}`;
                const interval = setInterval(() => {
                    setTypedRepo(fullText.slice(0, i));
                    i++;
                    if (i > fullText.length) clearInterval(interval);
                }, 50);
                return () => clearInterval(interval);
            }
        }, [isCompleted, repoName, isGit]);

        const getStyles = () => {
            if (isActive) return {
                border: "border-[#3b82f6]",
                glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
                circle: "bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]",
                pill: "bg-[#3b82f6]/20 text-[#3b82f6]",
                opacity: "opacity-100",
                status: "ACTIVE",
                theme: "#3b82f6"
            };
            if (isWaiting) return {
                border: "border-[#f59e0b]",
                glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
                circle: "bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]",
                pill: "bg-[#f59e0b]/20 text-[#f59e0b]",
                opacity: "opacity-100",
                status: "WAITING",
                theme: "#f59e0b"
            };
            if (isCompleted) return {
                border: "border-[#10b981]",
                glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]",
                circle: "bg-[#10b981] shadow-[0_0_10px_#10b981]",
                pill: "bg-[#10b981]/20 text-[#10b981]",
                opacity: "opacity-100",
                status: "COMPLETE",
                theme: "#10b981"
            };
            return { // idle
                border: "border-[#1e1e2e]",
                glow: "shadow-none",
                circle: "bg-white/10",
                pill: "bg-white/5 text-white/40",
                opacity: "opacity-70",
                status: "IDLE",
                theme: "#1e1e2e"
            };
        };

        const currentStyle = getStyles();
        const progressPercent = totalFiles > 0 ? (filesProcessed / totalFiles) * 100 : 0;

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex flex-col transition-all duration-700 w-[220px] h-[140px]",
                    isActive ? "z-50" : "z-10",
                    currentStyle.opacity
                )}
            >
                {/* Status Indicator (Top-Left) */}
                <div className={cn(
                    "absolute top-[-3px] left-[-3px] w-2.5 h-2.5 rounded-full z-20 transition-all duration-500",
                    currentStyle.circle
                )} />

                {/* Issue Badge (Top-Right) */}
                <AnimatePresence>
                    {issueCount > 0 && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: shouldPulse ? 1.2 : 1,
                                opacity: 1
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-2 -right-2 z-20 flex items-center gap-1 bg-red-500/90 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                        >
                            <span className="text-[12px] leading-none">🔴</span>
                            {issueCount}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Box */}
                <div className={cn(
                    "flex-1 bg-[#0d0d0d] border rounded-[12px] relative overflow-hidden transition-all duration-700 flex flex-col",
                    currentStyle.border,
                    currentStyle.glow
                )}>
                    {/* Internal Container */}
                    <div className="flex-1 flex flex-col p-[14px] overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">
                                {isGit ? "SOURCE" : "AGENT MODULE"}
                            </span>
                            {isActive && (
                                <div className="flex items-center gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.2, 1, 0.2] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            className="w-1 h-1 rounded-full bg-[#3b82f6]"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {isActive ? (
                            <div className="flex-1 flex flex-col gap-2.5">
                                <div className="flex items-center gap-3">
                                    <div className="text-[#3b82f6]">
                                        <Icon size={32} />
                                    </div>
                                    <span className="text-sm font-bold text-white tracking-tight truncate">
                                        {name}
                                    </span>
                                </div>

                                <div className="h-4 overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.p
                                            key={message || 'waiting'}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-[9px] font-mono text-[#a0a0a0] truncate"
                                        >
                                            {message || "Processing..."}
                                        </motion.p>
                                    </AnimatePresence>
                                </div>

                                <div className="mt-auto space-y-1.5">
                                    <div className="flex items-center justify-between text-[8px] font-mono text-white/30">
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "h-2 w-1 rounded-[1px]",
                                                        i < Math.floor(progressPercent / 8.33) ? "bg-[#3b82f6]" : "bg-white/5"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span>{isGit ? `${filesProcessed}%` : `${filesProcessed}/${totalFiles}`} {isGit ? "SYNC" : "FILES"}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "transition-all duration-500",
                                        isCompleted ? "text-[#10b981]" : "text-white/20"
                                    )}>
                                        <Icon size={24} />
                                    </div>
                                    <span className="text-[15px] font-bold text-white tracking-tight">
                                        {name}
                                    </span>
                                </div>

                                <div className="mt-auto">
                                    <p className="text-[10px] font-mono text-white/40 truncate">
                                        {isGit && isCompleted ? `cloned: ${typedRepo}` :
                                            isCompleted ? "analysis cycle finished" : "waiting for nexus signal"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Bar */}
                    <div className="h-9 border-t border-white/5 bg-white/[0.02] px-[14px] flex items-center justify-between">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                            {isActive ? "ENGINE.LIVE" : "SYSTEM.IDLE"}
                        </span>

                        <div className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black tracking-tighter uppercase",
                            currentStyle.pill
                        )}>
                            {currentStyle.status}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

AgentNode.displayName = 'AgentNode';

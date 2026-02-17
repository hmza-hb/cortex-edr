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

export const AgentNode: React.FC<AgentNodeProps> = ({ id, name, status, repoName }) => {
    const Icon = ICONS[id as keyof typeof ICONS] || Bug;
    const isActive = status === 'active';
    const isCompleted = status === 'completed';
    const [statusIndex, setStatusIndex] = useState(0);
    const [typedRepo, setTypedRepo] = useState("");

    // Typewriter effect for repo URL
    useEffect(() => {
        if (isCompleted && repoName) {
            let i = 0;
            const fullText = `github.com/${repoName}`;
            const interval = setInterval(() => {
                setTypedRepo(fullText.slice(0, i));
                i++;
                if (i > fullText.length) clearInterval(interval);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isCompleted, repoName]);

    // Status cycle animation
    useEffect(() => {
        if (isActive && id === 0) {
            const interval = setInterval(() => {
                setStatusIndex((prev) => (prev < 2 ? prev + 1 : 2));
            }, 2000);
            return () => clearInterval(interval);
        } else if (isCompleted && id === 0) {
            setStatusIndex(3);
        }
    }, [isActive, isCompleted, id]);

    return (
        <div className={cn(
            "relative w-[280px] h-[160px] flex flex-col transition-all duration-700",
            isActive ? "z-50" : "z-10"
        )}>
            {/* Top-left Indicator */}
            <div className={cn(
                "absolute top-[-5px] left-[-5px] w-[10px] h-[10px] rounded-full z-20 transition-all duration-500",
                isActive || isCompleted ? "bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" : "bg-white/10"
            )} />

            {/* Main Box */}
            <div className={cn(
                "flex-1 bg-[#0d0d0d] border rounded-[20px] relative overflow-hidden transition-all duration-700 flex flex-col p-[4px]",
                isActive ? "border-[#3b82f6] shadow-[0_0_25px_rgba(59,130,246,0.3),inset_0_0_15px_rgba(59,130,246,0.1)] scale-[1.02]" :
                    isCompleted ? "border-[#3b82f6]/40 opacity-90 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "border-[#1a1a1a]"
            )}>
                {/* Top Section */}
                <div className={cn(
                    "p-3 flex-1 flex flex-col gap-4 transition-opacity duration-700",
                    !isActive && isCompleted && "opacity-70"
                )}>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "transition-all duration-500",
                            isActive ? "text-[#3b82f6] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : isCompleted ? "text-[#3b82f6]/60" : "text-white/20"
                        )}>
                            <Icon size={32} />
                        </div>

                        <div className="flex items-center h-8">
                            {isActive && (
                                <div className="flex gap-1.5 px-2">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-pulse"
                                            style={{ animationDelay: `${i * 300}ms` }}
                                        />
                                    ))}
                                </div>
                            )}
                            {isCompleted && !isActive && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-[#3b82f6]/40"
                                >
                                    <Check size={20} strokeWidth={3} />
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                            {id === 0 ? "GitHub Source" : "Agent Module"}
                        </span>
                        <div className="h-6">
                            {id === 0 && isCompleted ? (
                                <span className="text-xs font-mono text-white/80">Cloned: {typedRepo}</span>
                            ) : (
                                <span className="text-sm font-bold text-white">{name}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={cn(
                    "h-12 border-t border-white/5 bg-white/[0.02] px-4 flex items-center justify-between transition-opacity duration-700",
                    !isActive && isCompleted && "opacity-50"
                )}>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                            {id === 0 ? "GITHUB CONNECT" : "ENGINE STATUS"}
                        </span>
                        <span className="text-[9px] font-bold text-white/40 uppercase">
                            {id === 0 ? "Clone Repo" : "Processing"}
                        </span>
                    </div>

                    <div className="relative h-4 w-24">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={statusIndex}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className={cn(
                                    "absolute right-0 text-[10px] font-mono font-bold whitespace-nowrap",
                                    isCompleted && !isActive ? "text-[#3b82f6]/60" : "text-[#3b82f6]"
                                )}
                            >
                                {id === 0 ? STATUS_MESSAGES[statusIndex] :
                                    isActive ? "ACTIVE..." : isCompleted ? "COMPLETED" : "IDLE"}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Connection Point (RIGHT EDGE) */}
            <div className={cn(
                "absolute top-1/2 right-[-4px] transform -translate-y-1/2 w-[8px] h-[8px] rounded-full z-20 transition-all duration-500",
                isCompleted ? "bg-[#3b82f6] shadow-[0_0_15px_#3b82f6]" : "bg-white/10"
            )}>
                {isActive && (
                    <div className="absolute inset-0 bg-[#3b82f6] rounded-full animate-ping opacity-75" />
                )}
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
            `}</style>
        </div>
    );
};

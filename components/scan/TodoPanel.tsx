import React, { useRef, useEffect } from 'react';
import { AgentStatus } from '@/types/agent';
import { UIEvent } from '@/hooks/useSSEScan';
import { cn } from '@/lib/utils';
import {
    Search,
    FileText,
    Zap,
    AlertCircle,
    Check,
    Circle,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TodoStep {
    id: string;
    label: string;
    status: AgentStatus;
    logs: string[];
}

interface TodoPanelProps {
    steps: TodoStep[];
    events: UIEvent[];
}

export const TodoPanel: React.FC<TodoPanelProps> = ({ steps, events }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic for events
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [events]);

    const formatMessage = (msg: string) => {
        // Highlight file paths: src/... or any/...
        const parts = msg.split(/(\b(?:src|app|components|lib|hooks|types|utils)\/[^\s]+\b)/);
        return parts.map((part, i) => {
            if (i % 2 === 1) {
                return <span key={i} className="text-[#3b82f6] font-bold">{part}</span>;
            }
            // Highlight "FOUND:" and issues
            if (part.includes('FOUND:')) {
                const subParts = part.split(/(FOUND:[^:]+:|FOUND:[^:]+)/);
                return subParts.map((sub, j) => (
                    j % 2 === 1 ? <span key={`${i}-${j}`} className="text-[#ef4444] font-bold">{sub}</span> : sub
                ));
            }
            return part;
        });
    };

    const getIconForEvent = (type: string) => {
        switch (type) {
            case 'started': return <Search size={10} className="text-white/40" />;
            case 'processing': return <FileText size={10} className="text-[#3b82f6]" />;
            case 'found_issue': return <AlertCircle size={10} className="text-[#ef4444]" />;
            case 'completed': return <Check size={10} className="text-[#10b981]" />;
            default: return <Zap size={10} className="text-white/40" />;
        }
    };

    return (
        <div className="w-[420px] border-l border-zinc-900 bg-zinc-950 flex flex-col h-full overflow-hidden z-50">
            {/* Section 1: Pipeline Execution */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="p-6 border-b border-zinc-900 bg-zinc-950/50">
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-6">Pipeline execution</h2>

                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-500px)]">
                        {steps.map((step) => {
                            const isCompleted = step.status === 'completed';
                            const isActive = step.status === 'active';
                            const isPending = !isActive && !isCompleted;

                            return (
                                <div key={step.id} className="flex flex-col gap-1.5 px-1 text-zinc-400">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {isCompleted ? (
                                                <Check size={14} className="text-emerald-500" />
                                            ) : isActive ? (
                                                <div className="relative">
                                                    <Loader2 size={14} className="text-indigo-400 animate-spin" />
                                                    <div className="absolute inset-0 bg-indigo-400/20 blur-sm rounded-full animate-pulse" />
                                                </div>
                                            ) : (
                                                <Circle size={14} className="text-zinc-800" />
                                            )}
                                        </div>

                                        <div className="relative">
                                            <span className={cn(
                                                "text-[11px] font-bold tracking-widest uppercase transition-colors duration-500",
                                                isPending ? "text-zinc-700" : isCompleted ? "text-zinc-500" : "text-zinc-100"
                                            )}>
                                                {step.label}
                                            </span>

                                            {/* Animated Strikethrough */}
                                            <AnimatePresence>
                                                {isCompleted && (
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                                        className="absolute top-1/2 left-0 h-[1.5px] bg-emerald-500/50 -translate-y-1/2"
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Live Sub-text */}
                                    {isActive && step.logs.length > 0 && (
                                        <div className="pl-6 flex items-start gap-2">
                                            <span className="text-zinc-800 text-[10px] font-mono mt-0.5">└─</span>
                                            <p className="text-[10px] font-mono text-zinc-500 transition-opacity duration-300">
                                                {step.logs[step.logs.length - 1]}<span className="animate-pulse">_</span>
                                            </p>
                                        </div>
                                    )}

                                    {/* Completed Strike-through Sub-text */}
                                    {isCompleted && step.logs.length > 0 && (
                                        <div className="pl-6 flex items-start gap-2 opacity-30">
                                            <span className="text-zinc-800 text-[10px] font-mono mt-0.5">└─</span>
                                            <div className="relative">
                                                <p className="text-[10px] font-mono text-zinc-500">
                                                    {step.logs[step.logs.length - 1]}
                                                </p>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                                                    className="absolute top-1/2 left-0 h-[1px] bg-emerald-500/50 -translate-y-1/2"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Section 2: Live Activity */}
            <div className="flex-1 flex flex-col min-h-0 bg-zinc-900/50 border-t border-zinc-800 shadow-inner">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                    <h2 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Live activity</h2>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                        <span className="text-[8px] font-mono text-zinc-600">BUFFERED</span>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 font-mono no-scrollbar flex flex-col gap-1 relative"
                >
                    {/* Top Fade Overlay */}
                    <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-zinc-900 to-transparent z-10 pointer-events-none" />

                    <AnimatePresence initial={false}>
                        {events.slice(-30).map((event) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-start gap-2.5 text-[10px] leading-relaxed group"
                            >
                                <div className="mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                    {getIconForEvent(event.type)}
                                </div>
                                <div className="text-zinc-500 flex-1 break-all">
                                    {formatMessage(event.message)}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Terminal Footer Overlay */}
            <div className="h-2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none sticky bottom-0" />
        </div>
    );
};

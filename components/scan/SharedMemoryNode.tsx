import React from 'react';
import { Database, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SharedMemoryNodeProps {
    issuesCount: number;
    active: boolean;
    className?: string;
}

export const SharedMemoryNode: React.FC<SharedMemoryNodeProps> = ({ issuesCount, active, className }) => {
    return (
        <div className={cn(
            "w-[260px] p-6 rounded-[20px] border-2 bg-[#020202]/90 backdrop-blur-3xl flex flex-col items-center gap-5 transition-all duration-1000",
            active ? "border-purple-500/60 shadow-[0_0_80px_rgba(168,85,247,0.3)] scale-105" : "border-white/10",
            className
        )}>
            {/* Brain Icon Core */}
            <div className={cn(
                "p-5 rounded-full bg-purple-500/10 border border-purple-500/30 relative shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]",
                active && "animate-pulse"
            )}>
                <Brain className="w-12 h-12 text-purple-400" />
                <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full opacity-50" />
            </div>

            <div className="text-center">
                <h3 className="text-lg font-black text-white uppercase tracking-[0.3em] mb-1 italic">Cortex</h3>
                <div className="flex items-center justify-center gap-2">
                    <span className="w-8 h-[1px] bg-purple-500/30" />
                    <p className="text-[9px] text-purple-400/60 font-black tracking-[0.2em] uppercase">The Orchestrator (Boss)</p>
                    <span className="w-8 h-[1px] bg-purple-500/30" />
                </div>
            </div>

            {/* Findings Display */}
            <div className="w-full space-y-3">
                <div className="w-full flex justify-between items-center py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 relative group cursor-default">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping opacity-50" />
                        <Database className="w-4 h-4 text-purple-400" />
                        <span className="text-[11px] font-black text-white/50 tracking-widest uppercase">Controlling</span>
                    </div>
                    <span className="text-xl font-black text-purple-400 tracking-tight">{issuesCount}</span>
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-2 w-full px-2">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1.5 flex-1 rounded-full overflow-hidden bg-white/5",
                                active && "bg-white/10"
                            )}
                        >
                            <div
                                className={cn(
                                    "h-full w-full bg-purple-500 transition-all duration-1000",
                                    active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
                                )}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

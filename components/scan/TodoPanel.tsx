import React from 'react';
import { AgentStatus } from '@/types/agent';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Loader2, Info, AlertTriangle, ShieldCheck, Terminal } from 'lucide-react';

interface TodoStep {
    id: string;
    label: string;
    status: AgentStatus;
    logs: string[];
}

interface TodoPanelProps {
    steps: TodoStep[];
}

export const TodoPanel: React.FC<TodoPanelProps> = ({ steps }) => {
    const executedSteps = steps.filter(s => s.status === 'completed').length;
    const progress = Math.round((executedSteps / steps.length) * 100);

    return (
        <div className="w-[380px] border-l border-white/10 bg-[#020202]/90 backdrop-blur-3xl flex flex-col h-full overflow-hidden shadow-2xl z-50">
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[11px] font-black text-white/60 tracking-[0.4em] uppercase">Audit Manifest</h2>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[9px] font-mono text-blue-400 font-bold tracking-tighter">LIVE FEED</span>
                    </div>
                </div>
                <div className="flex items-end justify-between mt-6">
                    <div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Process Status</div>
                        <span className="text-xl font-black text-white tracking-tight uppercase italic">Pipeline Execution</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-1">
                            {progress}%
                        </span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Efficiency</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Steps List (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {steps.map((step, index) => {
                    const isCompleted = step.status === 'completed';
                    const isActive = step.status === 'active';

                    return (
                        <div key={step.id} className="group">
                            <div className="flex items-start gap-4">
                                <div className="mt-0.5 shrink-0 relative">
                                    {isCompleted ? (
                                        <div className="relative z-10">
                                            <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                                                <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
                                            </div>
                                            <div className="absolute inset-0 bg-green-500/20 blur-md rounded-full" />
                                        </div>
                                    ) : isActive ? (
                                        <div className="relative z-10">
                                            <div className="w-4 h-4 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/50 animate-pulse">
                                                <Loader2 className="w-2.5 h-2.5 text-blue-500 animate-spin" />
                                            </div>
                                            <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full animate-pulse" />
                                        </div>
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                                            <Circle className="w-2 h-2 text-white/10" />
                                        </div>
                                    )}

                                    {/* Vertical Line Connection */}
                                    {index !== steps.length - 1 && (
                                        <div className={cn(
                                            "absolute top-4 left-1/2 -translate-x-1/2 w-[1px] h-full -mb-4 transition-all duration-1000",
                                            isCompleted ? "bg-green-500/20" : "bg-white/5"
                                        )} />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className={cn(
                                            "text-[11px] font-bold tracking-widest uppercase transition-all duration-300",
                                            isActive ? "text-blue-400" : isCompleted ? "text-green-500/80 line-through decoration-green-500/50 decoration-2" : "text-white/30"
                                        )}>
                                            {step.label}
                                        </h3>
                                        {isCompleted && (
                                            <span className="text-[8px] font-mono text-green-500/60 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                                                PASSED
                                            </span>
                                        )}
                                    </div>

                                    {/* Telemetry Log for Active Step */}
                                    {(isActive || (isCompleted && step.logs.length > 0)) && (
                                        <div className="mt-3 relative overflow-hidden rounded-lg bg-black/40 border border-white/5 p-3">
                                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                            {step.logs.slice(-2).map((log, i) => (
                                                <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
                                                    <Terminal className="w-2 h-2 text-white/20 shrink-0" />
                                                    <p className="text-[9px] font-mono text-white/50 truncate animate-in slide-in-from-left-2 duration-300">
                                                        {log}
                                                    </p>
                                                </div>
                                            ))}
                                            {isActive && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping" />
                                                    <span className="text-[8px] text-blue-500/60 font-mono animate-pulse">AWAITING OUTPUT...</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Telemetry */}
            <div className="p-4 bg-black/60 border-t border-white/5 backdrop-blur-md">
                <div className="flex items-center justify-between text-[9px] font-mono text-white/20">
                    <span>SYS.V.1.0.4</span>
                    <span className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        SECURE CONNECTION
                    </span>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(2px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

import React, { useEffect, useRef } from 'react';
import { UIEvent } from '@/hooks/useSSEScan';
import { cn } from '@/lib/utils';
import {
    Search, Shield, Layout, Zap,
    Layers, Brain, FileText, Activity
} from 'lucide-react';

const AGENT_ICONS = {
    1: Search,
    2: Shield,
    3: Layout,
    4: Zap,
    5: Layers,
    6: Brain,
    7: FileText,
};

interface ActivityFeedProps {
    events: UIEvent[];
    className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events, className }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0; // New events are at the top in my hook implementation
        }
    }, [events]);

    return (
        <div className={cn(
            "bg-[#0A0A0A] border-t border-white/5 flex flex-col h-[200px]",
            className
        )}>
            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-white/40" />
                    <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Real-time Component Audit Feed</h2>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest">Live Stream</span>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/10"
            >
                {events.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[10px] font-bold text-white/10 uppercase tracking-widest">
                        Waiting for pipeline initialization...
                    </div>
                ) : (
                    events.map((event) => {
                        const Icon = AGENT_ICONS[event.agentId as keyof typeof AGENT_ICONS] || Activity;

                        return (
                            <div
                                key={event.id}
                                className={cn(
                                    "flex items-start gap-4 p-3 rounded-lg border border-transparent transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
                                    event.type === 'found_issue' && "bg-orange-500/5 border-orange-500/10",
                                    event.type === 'error' && "bg-red-500/5 border-red-500/10",
                                    event.type === 'completed' && "bg-green-500/5 border-green-500/10"
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded bg-white/5 mt-0.5",
                                    event.type === 'found_issue' && "text-orange-400",
                                    event.type === 'error' && "text-red-400",
                                    event.type === 'completed' && "text-green-400"
                                )}>
                                    <Icon className="w-3 h-3" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[10px] font-black text-white/60 tracking-wider">
                                            {event.agentName.toUpperCase()}
                                        </span>
                                        <span className="text-[10px] text-white/20 font-medium">
                                            {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-xs font-medium leading-relaxed truncate",
                                        event.type === 'found_issue' ? "text-orange-200" : "text-white/60"
                                    )}>
                                        {event.message}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

import React from 'react';
import { usePathname } from 'next/navigation';
import { AgentNode } from './AgentNode';
import { SharedMemoryNode } from './SharedMemoryNode';
import { AgentConnection } from './AgentConnection';
import { ActivityFeed } from './ActivityFeed';
import { useSSEScan } from '@/hooks/useSSEScan';
import { AgentStatus } from '@/types/agent';
import { cn } from '@/lib/utils';
import { TodoPanel } from './TodoPanel';

interface AgentCanvasProps {
    scanId: string;
}

// Coordinate system: 0-1000 for internal placement
const NODE_POSITIONS = {
    0: { x: 140, y: 500 }, // Clone (Entry)
    1: { x: 380, y: 500 }, // Recon (Detection)
    2: { x: 380, y: 180 }, // Security
    3: { x: 860, y: 180 }, // Arch
    4: { x: 880, y: 500 }, // Quality
    5: { x: 880, y: 820 }, // Debt
    6: { x: 620, y: 850 }, // AI
    7: { x: 380, y: 800 }, // Synthesis
};

const HUB_POSITION = { x: 620, y: 400 };

const AGENTS = [
    { id: 0, name: 'Git Connect' },
    { id: 1, name: 'Reconnaissance' },
    { id: 2, name: 'Security Scanner' },
    { id: 3, name: 'Architecture' },
    { id: 4, name: 'Code Quality' },
    { id: 5, name: 'Technical Debt' },
    { id: 6, name: 'AI-Engine Review' },
    { id: 7, name: 'Synthesis & Report' },
];

export const AgentCanvas: React.FC<AgentCanvasProps> = ({ scanId }) => {
    const { agentStates, activityFeed, issuesCount, status, repoName } = useSSEScan(scanId);
    const pathname = usePathname();
    const isImmersive = pathname?.includes("/dashboard/scan/");

    // Map legacy status to agent 0 if pending/processing clone
    const augmentedStates: Record<number, AgentStatus> = {
        ...agentStates,
        0: (status === 'pending' ? 'active' : 'completed') as AgentStatus
    };

    const isAnyAgentActive = Object.values(augmentedStates).some(s => s === 'active');

    return (
        <div className={cn(
            "flex w-full relative bg-[#010101] overflow-hidden transition-all duration-1000",
            isImmersive ? "h-screen rounded-none" : "h-[calc(100vh-120px)] rounded-[32px] border border-white/5 shadow-2xl"
        )}>
            {/* 3D Infinite Grid Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 [perspective:1400px] [perspective-origin:50%_50%]">
                    <div className="absolute inset-0 [transform:rotateX(60deg)_translateY(-50%)] bg-[linear-gradient(to_right,#181818_1px,transparent_1px),linear-gradient(to_bottom,#181818_1px,transparent_1px)] bg-[size:80px_80px] opacity-60 animate-[grid_20s_linear_infinite]" />
                </div>
                {/* Dotted HUD Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                {/* Vignette */}
                <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,#010101_85%)" />
            </div>

            <div className="flex-1 relative flex flex-col min-w-0">
                {/* Canvas Area with viewbox for coordinates */}
                <div className="flex-1 relative overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
                        {/* Connections */}
                        {AGENTS.map((agent) => {
                            const pos = NODE_POSITIONS[agent.id as keyof typeof NODE_POSITIONS];

                            // Sequential flow logic
                            let endPos = HUB_POSITION;
                            if (agent.id === 0) endPos = NODE_POSITIONS[1];
                            if (agent.id === 7) endPos = HUB_POSITION;

                            // Adjust offsets
                            const startOffsetX = 80;
                            const endOffsetX = (endPos === HUB_POSITION) ? 0 : -140; // End at left edge of next node

                            return (
                                <AgentConnection
                                    key={`conn-${agent.id}`}
                                    startX={pos.x + startOffsetX}
                                    startY={pos.y}
                                    endX={endPos.x + endOffsetX}
                                    endY={endPos.y}
                                    active={augmentedStates[agent.id] === 'active'}
                                    completed={augmentedStates[agent.id] === 'completed'}
                                />
                            );
                        })}
                    </svg>

                    {/* Central Hub */}
                    <div
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                        style={{ left: `${HUB_POSITION.x / 10}%`, top: `${HUB_POSITION.y / 10}%` }}
                    >
                        <SharedMemoryNode
                            issuesCount={issuesCount}
                            active={isAnyAgentActive}
                        />
                    </div>

                    {/* Agent Nodes */}
                    {AGENTS.map((agent) => {
                        const pos = NODE_POSITIONS[agent.id as keyof typeof NODE_POSITIONS];
                        return (
                            <div
                                key={`node-${agent.id}`}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                                style={{ left: `${pos.x / 10}%`, top: `${pos.y / 10}%` }}
                            >
                                <AgentNode
                                    id={agent.id}
                                    name={agent.name}
                                    status={augmentedStates[agent.id] as AgentStatus}
                                    repoName={repoName}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Status Bar (Pinned Bottom) */}
                <div className="px-10 py-6 border-t border-white/10 bg-[#020202]/90 backdrop-blur-3xl flex items-center justify-between z-40">
                    <div className="flex items-center gap-6">
                        <div className={cn(
                            "w-4 h-4 rounded-full shadow-[0_0_12px]",
                            status === 'processing' ? "bg-blue-500 shadow-blue-500 animate-pulse" :
                                status === 'completed' ? "bg-green-500 shadow-green-500" : "bg-white/10"
                        )} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/40 tracking-[0.4em] uppercase leading-none mb-1">Orchestrator Status</span>
                            <span className="text-lg font-black text-white tracking-tight uppercase italic">{status}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-12">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] leading-none mb-1">Knowledge Ingress</span>
                            <span className="text-2xl font-black text-blue-400 tracking-tighter">{issuesCount} <span className="text-[10px] text-white/40 ml-1">OBJECTS DETECTED</span></span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                            <span className="text-[9px] font-black tracking-[0.4em] text-white/40 uppercase">Real-time Telemetry Enabled</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Todo List Panel (Audit Manifest) */}
            <TodoPanel steps={
                AGENTS.map(a => ({
                    id: a.id.toString(),
                    label: a.name,
                    status: augmentedStates[a.id] as any,
                    logs: activityFeed.filter(e => e.agentId === a.id).map(e => e.message)
                }))
            } />

            <style jsx global>{`
                @keyframes grid {
                    from { background-position: 0 0; }
                    to { background-position: 0 64px; }
                }
            `}</style>
        </div>
    );
};

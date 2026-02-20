import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { AgentNode } from './AgentNode';
import { SharedMemoryNode } from './SharedMemoryNode';
import { ConnectionLine } from './ConnectionLine';
import { useSSEScan } from '@/hooks/useSSEScan';
import { AgentStatus } from '@/types/agent';
import { cn } from '@/lib/utils';
import { TodoPanel } from './TodoPanel';

interface AgentCanvasProps {
    scanId: string;
}

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
    const { agentStates, activityFeed, issuesCount, status, repoName, cloningProgress } = useSSEScan(scanId);
    const pathname = usePathname();
    const isImmersive = pathname?.includes("/dashboard/scan/");

    const canvasRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const cortexRef = useRef<HTMLDivElement>(null);

    const [connections, setConnections] = useState<any[]>([]);

    // Core Scan State
    const augmentedStates: Record<number, AgentStatus> = {
        ...agentStates,
        0: (status === 'pending' || status === 'processing' ? 'active' : 'completed') as AgentStatus
    };

    const isAnyAgentActive = Object.values(augmentedStates).some(s => s === 'active');

    // Status Bar State
    const [timer, setTimer] = useState(0);
    const [lastWritingAgent, setLastWritingAgent] = useState<{ name: string; timestamp: number } | null>(null);

    // Orchestrator Status
    const orchestratorStatus = status === 'completed' ? 'COMPLETED' :
        status === 'processing' || isAnyAgentActive ? 'RUNNING' : 'PENDING';

    // Timer Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (orchestratorStatus === 'RUNNING') {
            const start = Date.now() - timer * 1000;
            interval = setInterval(() => {
                setTimer(Math.floor((Date.now() - start) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [orchestratorStatus]);

    // Writing Indicator Effect
    useEffect(() => {
        if (activityFeed.length > 0) {
            const latestEvent = activityFeed[0];
            const agent = AGENTS.find(a => a.id === latestEvent.agentId);
            if (agent) {
                setLastWritingAgent({ name: agent.name, timestamp: Date.now() });
                const timer = setTimeout(() => setLastWritingAgent(null), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [activityFeed]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const completedAgentsCount = Object.values(augmentedStates).filter(s => s === 'completed').length;
    const scanProgress = Math.round((completedAgentsCount / AGENTS.length) * 100);

    function getConnectionPoint(ref: { current: HTMLDivElement | null } | React.RefObject<HTMLDivElement>, side: string) {
        if (!ref.current || !canvasRef.current) return { x: 0, y: 0 };

        const rect = ref.current.getBoundingClientRect();
        const canvasRect = canvasRef.current.getBoundingClientRect();

        const x = rect.left - canvasRect.left;
        const y = rect.top - canvasRect.top;

        switch (side) {
            case 'right':
                return { x: x + rect.width, y: y + rect.height / 2 };
            case 'left':
                return { x: x, y: y + rect.height / 2 };
            case 'top':
                return { x: x + rect.width / 2, y: y };
            case 'bottom':
                return { x: x + rect.width / 2, y: y + rect.height };
            default:
                return { x: x + rect.width / 2, y: y + rect.height / 2 };
        }
    }

    const calculateConnections = () => {
        if (!canvasRef.current || !cortexRef.current) return;

        const newConnections = [
            // GIT to CORTEX
            {
                id: 'git-to-cortex',
                from: getConnectionPoint({ current: nodeRefs.current['node-0'] }, 'right'),
                to: getConnectionPoint(cortexRef, 'left'),
                active: augmentedStates[0] === 'active',
                completed: augmentedStates[0] === 'completed'
            },
            // CORTEX to RECON
            {
                id: 'cortex-to-recon',
                from: getConnectionPoint(cortexRef, 'left'),
                to: getConnectionPoint({ current: nodeRefs.current['node-1'] }, 'right'),
                active: augmentedStates[1] === 'active',
                completed: augmentedStates[1] === 'completed'
            },
            // CORTEX to SECURITY
            {
                id: 'cortex-to-security',
                from: getConnectionPoint(cortexRef, 'left'),
                to: getConnectionPoint({ current: nodeRefs.current['node-2'] }, 'right'),
                active: augmentedStates[2] === 'active',
                completed: augmentedStates[2] === 'completed'
            },
            // CORTEX to ARCHITECTURE
            {
                id: 'cortex-to-architecture',
                from: getConnectionPoint(cortexRef, 'right'),
                to: getConnectionPoint({ current: nodeRefs.current['node-3'] }, 'left'),
                active: augmentedStates[3] === 'active',
                completed: augmentedStates[3] === 'completed'
            },
            // CORTEX to QUALITY
            {
                id: 'cortex-to-quality',
                from: getConnectionPoint(cortexRef, 'right'),
                to: getConnectionPoint({ current: nodeRefs.current['node-4'] }, 'left'),
                active: augmentedStates[4] === 'active',
                completed: augmentedStates[4] === 'completed'
            },
            // CORTEX to DEBT
            {
                id: 'cortex-to-debt',
                from: getConnectionPoint(cortexRef, 'right'),
                to: getConnectionPoint({ current: nodeRefs.current['node-5'] }, 'left'),
                active: augmentedStates[5] === 'active',
                completed: augmentedStates[5] === 'completed'
            },
            // CORTEX to AI
            {
                id: 'cortex-to-ai',
                from: getConnectionPoint(cortexRef, 'bottom'),
                to: getConnectionPoint({ current: nodeRefs.current['node-6'] }, 'top'),
                active: augmentedStates[6] === 'active',
                completed: augmentedStates[6] === 'completed'
            },
            // CORTEX to SYNTHESIS
            {
                id: 'cortex-to-synthesis',
                from: getConnectionPoint(cortexRef, 'left'),
                to: getConnectionPoint({ current: nodeRefs.current['node-7'] }, 'right'),
                active: augmentedStates[7] === 'active',
                completed: augmentedStates[7] === 'completed'
            }
        ];
        setConnections(newConnections);
    };

    useEffect(() => {
        const timer = setTimeout(calculateConnections, 200);
        window.addEventListener('resize', calculateConnections);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculateConnections);
        };
    }, [augmentedStates, status]);

    const getAgentPosition = (id: number) => {
        // x≈270px for Left Column, x≈650px for Right Column
        // y values balanced around center
        switch (id) {
            case 0: return { left: '70px', top: '420px' }; // Git Connect
            case 1: return { left: '300px', top: '270px' }; // Recon (Middle Left)
            case 2: return { left: '370px', top: '100px' }; // Security (Top Left)
            case 3: return { left: '1050px', top: '100px' }; // Architecture (Top Right)
            case 4: return { left: '1050px', top: '300px' }; // Code Quality (Middle Right)
            case 5: return { left: '1050px', top: '550px' }; // Technical Debt (Bottom Right)
            case 6: return { left: '50%', top: '650px', transform: 'translateX(-50%)' }; // AI-Engine (Bottom Center)
            case 7: return { left: '270px', top: '600px' }; // Synthesis (Bottom Left)
            default: return {};
        }
    };

    return (
        <div className={cn(
            "flex w-full relative bg-[#010101] overflow-hidden transition-all duration-1000",
            isImmersive ? "h-screen rounded-none" : "h-[calc(100vh-120px)] rounded-[32px] border border-white/5 shadow-2xl"
        )}>
            {/* 3D Infinite Grid Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Dotted HUD Overlay */}
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 2px, transparent 1px)', backgroundSize: '24px 24px' }} />
                {/* Vignette */}
                <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,#010101_85%)" />
            </div>

            <div ref={canvasRef} className="flex-1 relative flex flex-col min-w-0">
                <div className="flex-1 relative overflow-hidden">
                    {/* SVG layer - sits on top of everything */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                        {connections.map(conn => (
                            <ConnectionLine
                                key={conn.id}
                                id={conn.id}
                                from={conn.from}
                                to={conn.to}
                                active={conn.active}
                                completed={conn.completed}
                            />
                        ))}
                    </svg>

                    {/* Central Hub */}
                    <motion.div
                        drag
                        dragMomentum={false}
                        onDrag={calculateConnections}
                        className="absolute z-20 cursor-grab active:cursor-grabbing"
                        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                        <SharedMemoryNode
                            ref={cortexRef}
                            issuesCount={issuesCount}
                            active={isAnyAgentActive}
                        />
                    </motion.div>

                    {/* Agent Nodes */}
                    {AGENTS.map((agent) => {
                        const agentEvents = activityFeed.filter(e => e.agentId === agent.id);
                        const latestMessage = agentEvents[0]?.message;
                        const agentIssueCount = agentEvents.filter(e => e.type === 'found_issue').length;

                        // Simulated file progress: count "Reading:" events or use a base progression
                        const filesRead = agentEvents.filter(e => e.message.toLowerCase().includes('reading:')).length;
                        const totalFiles = 47; // Base target as per design example
                        const filesProcessed = Math.min(filesRead, totalFiles);

                        return (
                            <motion.div
                                key={`node-${agent.id}`}
                                drag
                                dragMomentum={false}
                                onDrag={calculateConnections}
                                className="absolute z-30 cursor-grab active:cursor-grabbing"
                                style={getAgentPosition(agent.id)}
                            >
                                <AgentNode
                                    ref={(el: any) => nodeRefs.current[`node-${agent.id}`] = el}
                                    id={agent.id}
                                    name={agent.name}
                                    status={augmentedStates[agent.id] as AgentStatus}
                                    repoName={repoName}
                                    message={latestMessage}
                                    issueCount={agentIssueCount}
                                    filesProcessed={agent.id === 0 ? cloningProgress : filesProcessed}
                                    totalFiles={agent.id === 0 ? 100 : totalFiles}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Status Bar (Pinned Bottom) */}
                <div className="px-10 py-3 border-t border-white/5 bg-[#020202]/95 backdrop-blur-2xl flex items-center justify-between z-40">
                    {/* LEFT SECTION */}
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                orchestratorStatus === 'RUNNING' ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" :
                                    orchestratorStatus === 'COMPLETED' ? "bg-green-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-white/10"
                            )} />
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-white/20 tracking-[0.3em] uppercase mb-0.5">Orchestrator Status</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">{orchestratorStatus}</span>
                                    {orchestratorStatus === 'RUNNING' && (
                                        <span className="text-[10px] font-mono text-white/40">• {formatTime(timer)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CENTER SECTION */}
                    <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-6 py-1.5 rounded-xl">
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Knowledge Ingress</span>
                            <div className="flex items-baseline gap-2">
                                <motion.span
                                    key={issuesCount}
                                    initial={{ scale: 1.2, color: "#60a5fa" }}
                                    animate={{ scale: 1, color: "#60a5fa" }}
                                    className="text-xl font-black tracking-tighter"
                                >
                                    {issuesCount}
                                </motion.span>
                                <span className="text-[9px] font-bold text-white/40 tracking-widest uppercase">Objects Detected</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-3">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Real-time Telemetry</span>
                                <span className="text-[8px] font-mono text-[#3b82f6] bg-[#3b82f6]/10 px-1.5 py-0.5 rounded">[v4.0.2-EDGE]</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <AnimatePresence>
                                    {lastWritingAgent && (
                                        <motion.span
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="text-[9px] font-mono text-[#a855f7] animate-pulse"
                                        >
                                            ← {lastWritingAgent.name} writing
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Enabled</span>
                                </div>
                            </div>
                        </div>

                        {/* PROGRESS SECTION */}
                        <div className="flex flex-col items-end border-l border-white/10 pl-8">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Efficiency</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-white italic">{scanProgress}</span>
                                <span className="text-xs font-black text-white/20">%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TodoPanel
                events={activityFeed}
                steps={
                    AGENTS.map(a => ({
                        id: a.id.toString(),
                        label: a.name,
                        status: augmentedStates[a.id] as any,
                        logs: activityFeed.filter(e => e.agentId === a.id).map(e => e.message)
                    }))
                }
            />

            <style jsx global>{`
            `}</style>
        </div>
    );
};

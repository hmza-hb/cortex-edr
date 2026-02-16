"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Layers,
    Database,
    Cpu,
    Search,
    Activity,
    CheckCircle,
    FileSearch,
    BrainCircuit,
    BarChart3,
    Circle
} from "lucide-react";

const AGENTS = [
    {
        id: "recon",
        name: "Reconnaissance Agent",
        shortName: "Reconnaissance",
        icon: Search,
        color: "#3b82f6",
        description: "Repository mapping and file discovery",
        status: "Scanning file tree...",
        findings: [
            "Detected 247 source files",
            "Mapped 18 dependencies",
            "Identified 12 entry points",
            "Found 3 configuration files"
        ]
    },
    {
        id: "security",
        name: "Security Agent",
        shortName: "Security",
        icon: Shield,
        color: "#ef4444",
        description: "Vulnerability and threat detection",
        status: "Analyzing security patterns...",
        findings: [
            "SQL Injection vulnerabilities: 3",
            "XSS attack vectors: 2",
            "Exposed API keys: 1",
            "Insecure dependencies: 4",
            "Authentication flow issues: 2"
        ]
    },
    {
        id: "arch",
        name: "Architecture Agent",
        shortName: "Architecture",
        icon: Layers,
        color: "#a855f7",
        description: "Code structure and pattern analysis",
        status: "Evaluating architecture...",
        findings: [
            "Circular dependencies: 2",
            "Code duplication: 15.3%",
            "Complexity hotspots: 8 files",
            "Missing error handling: 12 locations",
            "Test coverage gaps: 32%"
        ]
    },
    {
        id: "quality",
        name: "Code Quality Agent",
        shortName: "Code Quality",
        icon: CheckCircle,
        color: "#22c55e",
        description: "Code standards and best practices",
        status: "Checking quality metrics...",
        findings: [
            "Naming convention violations: 12",
            "Missing documentation: 34 functions",
            "Unused variables: 18",
            "Long functions (>50 lines): 9",
            "Complexity score: 6.8/10"
        ]
    },
    {
        id: "debt",
        name: "Tech Debt Agent",
        shortName: "Tech Debt",
        icon: Activity,
        color: "#eab308",
        description: "Technical debt identification",
        status: "Tracking technical debt...",
        findings: [
            "TODO/FIXME comments: 34",
            "Hardcoded values: 18",
            "Magic numbers: 23",
            "Deprecated dependencies: 3",
            "Performance anti-patterns: 7"
        ]
    },
    {
        id: "ai",
        name: "AI Specific Agent",
        shortName: "AI Analysis",
        icon: BrainCircuit,
        color: "#ec4899",
        description: "AI-generated code analysis",
        status: "Analyzing AI patterns...",
        findings: [
            "Over-engineered solutions: 5",
            "Inconsistent coding styles: 9",
            "Redundant implementations: 4",
            "Missing error boundaries: 6",
            "Incomplete features: 3"
        ]
    },
    {
        id: "synthesis",
        name: "Synthesis Agent",
        shortName: "Synthesis",
        icon: BarChart3,
        color: "#ffffff",
        description: "Report compilation and prioritization",
        status: "Generating final report...",
        findings: [
            "Critical issues: 8",
            "High priority: 23",
            "Medium priority: 47",
            "Low priority: 89",
            "Overall risk score: 7.2/10"
        ]
    },
];

const FILE_SCAN_EXAMPLES = [
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/components/auth/login-form.tsx",
    "src/lib/database/client.ts",
    "src/utils/validation.ts",
    "src/api/routes/users.ts",
    "package.json",
    "tsconfig.json",
    "next.config.js",
    "middleware.ts"
];

export const AgentScanningVfx = () => {
    const [activeAgentIndex, setActiveAgentIndex] = useState(0);
    const [currentFile, setCurrentFile] = useState(FILE_SCAN_EXAMPLES[0]);
    const [filesScanned, setFilesScanned] = useState(0);
    const [sharedMemory, setSharedMemory] = useState<Array<{ agent: string, message: string }>>([]);

    useEffect(() => {
        const agentInterval = setInterval(() => {
            setActiveAgentIndex((prev) => {
                const completedAgent = AGENTS[prev];

                // Add to shared memory
                setSharedMemory((mem) => [
                    ...mem.slice(-4),
                    {
                        agent: completedAgent.shortName,
                        message: `Analysis complete - ${completedAgent.findings.length} findings`
                    }
                ]);

                return (prev + 1) % AGENTS.length;
            });
        }, 5000);

        return () => clearInterval(agentInterval);
    }, []);

    useEffect(() => {
        const fileInterval = setInterval(() => {
            setCurrentFile(FILE_SCAN_EXAMPLES[Math.floor(Math.random() * FILE_SCAN_EXAMPLES.length)]);
            setFilesScanned((prev) => (prev + 1) % 248);
        }, 800);

        return () => clearInterval(fileInterval);
    }, []);

    const activeAgent = AGENTS[activeAgentIndex];
    const progress = ((activeAgentIndex + 1) / AGENTS.length) * 100;

    return (
        <div className="w-full max-w-7xl mx-auto min-h-[800px] relative py-12">
            {/* Dotted Grid Background */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(100, 100, 100, 0.4) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative z-10">
                {/* Agent Chain Workflow */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-16">
                    {AGENTS.map((agent, idx) => {
                        const isActive = idx === activeAgentIndex;
                        const isCompleted = idx < activeAgentIndex;
                        const isPending = idx > activeAgentIndex;

                        return (
                            <React.Fragment key={agent.id}>
                                {/* Agent Module */}
                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.02 : 1,
                                    }}
                                    className="relative"
                                >
                                    <div
                                        className={`
                                            relative p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-500
                                            ${isActive ? 'border-opacity-100 shadow-lg' : 'border-opacity-30'}
                                        `}
                                        style={{
                                            borderColor: agent.color,
                                            backgroundColor: isActive
                                                ? `${agent.color}15`
                                                : `${agent.color}08`,
                                            boxShadow: isActive ? `0 0 20px ${agent.color}40` : 'none'
                                        }}
                                    >
                                        {/* Status Dot */}
                                        <div
                                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center"
                                            style={{
                                                backgroundColor: isActive ? '#22c55e' : isCompleted ? '#3b82f6' : '#6b7280'
                                            }}
                                        >
                                            {isCompleted && <Circle className="h-2 w-2 text-white fill-white" />}
                                        </div>

                                        <div className="flex flex-col items-center gap-2 text-center">
                                            <agent.icon className="h-7 w-7 text-white" />
                                            <div className="text-[9px] font-mono text-white uppercase tracking-wider leading-tight">
                                                {agent.shortName}
                                            </div>
                                            <div
                                                className="text-[7px] font-mono px-2 py-0.5 rounded"
                                                style={{
                                                    backgroundColor: isActive ? '#22c55e20' : isCompleted ? '#3b82f620' : '#6b728020',
                                                    color: isActive ? '#22c55e' : isCompleted ? '#3b82f6' : '#9ca3af'
                                                }}
                                            >
                                                {isActive ? 'Active' : isCompleted ? 'Complete' : 'Idle'}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Connection Line */}
                                {idx < AGENTS.length - 1 && (
                                    <div className="hidden md:flex items-center justify-center -mx-3">
                                        <div className="relative w-full h-0.5 bg-neutral-700">
                                            {/* Data Flow Animation */}
                                            {idx < activeAgentIndex && (
                                                <div className="absolute inset-0 bg-blue-500" />
                                            )}
                                            {idx === activeAgentIndex - 1 && (
                                                <motion.div
                                                    animate={{ x: ['-100%', '200%'] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                    className="absolute top-0 left-0 w-8 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                                                />
                                            )}
                                            {/* Connection Dots */}
                                            <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500" />
                                            <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-red-500" />
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Active Agent Details */}
                    <div className="md:col-span-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeAgent.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-6 rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl"
                            >
                                {/* Agent Header */}
                                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/10">
                                    <div
                                        className="p-4 rounded-xl"
                                        style={{ backgroundColor: `${activeAgent.color}20` }}
                                    >
                                        <activeAgent.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-1">{activeAgent.name}</h3>
                                        <p className="text-sm text-neutral-400 font-mono mb-2">{activeAgent.description}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-xs text-green-400 font-mono">{activeAgent.status}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Current File Scanning */}
                                <div className="mb-6 p-4 rounded-lg bg-black/40 border border-white/5">
                                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                                        Currently Scanning
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FileSearch className="h-4 w-4 text-blue-400" />
                                        <motion.span
                                            key={currentFile}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm text-neutral-300 font-mono"
                                        >
                                            {currentFile}
                                        </motion.span>
                                    </div>
                                    <div className="mt-2 text-xs text-neutral-600 font-mono">
                                        Files scanned: {filesScanned}/247
                                    </div>
                                </div>

                                {/* Findings */}
                                <div>
                                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-3">
                                        Analysis Results
                                    </div>
                                    <div className="space-y-2">
                                        {activeAgent.findings.map((finding, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                                            >
                                                <div
                                                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                                    style={{ backgroundColor: activeAgent.color }}
                                                />
                                                <span className="text-xs text-neutral-300 font-mono leading-relaxed">{finding}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Shared Memory & Progress */}
                    <div className="space-y-6">
                        {/* Shared Memory */}
                        <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="h-5 w-5 text-purple-400" />
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Shared Memory</h3>
                            </div>

                            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                                <AnimatePresence>
                                    {sharedMemory.map((entry, idx) => (
                                        <motion.div
                                            key={`${entry.agent}-${idx}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
                                        >
                                            <div className="text-[10px] text-purple-300 font-mono font-bold mb-1">
                                                {entry.agent}
                                            </div>
                                            <div className="text-xs text-purple-200/70 font-mono">
                                                {entry.message}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Progress Tracker */}
                        <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl">
                            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-4">
                                Scan Progress
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-neutral-400 font-mono mb-2">
                                        <span>Overall Progress</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-3">
                                        Agent Status
                                    </div>
                                    <div className="space-y-2">
                                        {AGENTS.map((agent, idx) => (
                                            <div key={agent.id} className="flex items-center justify-between text-xs font-mono">
                                                <span className={idx <= activeAgentIndex ? 'text-neutral-300' : 'text-neutral-600'}>
                                                    {agent.shortName}
                                                </span>
                                                <span className={`text-[10px] ${idx < activeAgentIndex ? 'text-blue-400' :
                                                        idx === activeAgentIndex ? 'text-green-400' :
                                                            'text-neutral-600'
                                                    }`}>
                                                    {idx < activeAgentIndex ? 'Done' : idx === activeAgentIndex ? 'Running' : 'Pending'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enterprise Note */}
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="text-[9px] font-mono text-blue-300 uppercase tracking-widest mb-2">
                                Enterprise Intelligence
                            </div>
                            <p className="text-[10px] text-neutral-400 font-mono leading-relaxed">
                                Sequential multi-agent analysis ensures comprehensive coverage across security, architecture, quality, and technical debt dimensions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldAlert, Cpu, CheckCircle2, ChevronRight, Terminal as TerminalIcon } from "lucide-react";

const COMMAND = "cortex --mode=deep-analyze --target=./src/auth --engine=v4.rc2";

const SCAN_LOGS = [
    { type: "sys", text: "[SYS] KERNEL_ATTACHED: PID 49201", delay: 300 },
    { type: "info", text: "[DETECTION] REPO_TYPE: TypeScript/React Mono", delay: 800 },
    { type: "info", text: "[ANALYSIS] Mapping Abstract Syntax Tree (AST)...", delay: 1400 },
    { type: "proc", text: "[PROCESS] Resolving complex dependency graph...", delay: 2000 },
    { type: "vuln", severity: "critical", code: "CVE-2024-SQLX", title: "SQL_INJECTION_RISK", detail: "Unsanitized input flow from authController.ts:88 to databaseProvider.ts:241", delay: 2800 },
    { type: "info", text: "[ANALYSIS] Checking architectural integrity...", delay: 3800 },
    { type: "vuln", severity: "warning", code: "ARCH_ISO", title: "DOMAIN_LEAK", detail: "Domain models leaking into infrastructure layer in services/user.ts", delay: 4500 },
    { type: "proc", text: "[PROCESS] Generating remediation patches...", delay: 5200 },
    { type: "success", text: "[SUCCESS] Deep Scan Complete. Critical: 1, Warnings: 1, Patches: 3 Ready.", delay: 6000 },
];

const ProcessingBar = ({ active }: { active: boolean }) => (
    <div className="flex items-center gap-2 mt-4">
        <div className="flex-1 h-1 bg-neutral-900 rounded-full overflow-hidden">
            <motion.div
                animate={active ? { x: ["-100%", "200%"] } : { x: "-100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-1/3 h-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
            />
        </div>
        <span className="text-[9px] font-mono text-purple-400 uppercase tracking-tighter">Processing...</span>
    </div>
);

export const TerminalDemo = () => {
    const [typedCommand, setTypedCommand] = useState("");
    const [showLogs, setShowLogs] = useState<number[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [memoryUsage, setMemoryUsage] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            setTypedCommand(COMMAND.slice(0, i));
            i++;
            if (i > COMMAND.length) {
                clearInterval(typingInterval);
                startLogs();
            }
        }, 40);

        const memInterval = setInterval(() => {
            setMemoryUsage(Math.floor(Math.random() * 20) + 40);
        }, 2000);

        return () => {
            clearInterval(typingInterval);
            clearInterval(memInterval);
        };
    }, []);

    const startLogs = () => {
        SCAN_LOGS.forEach((_, index) => {
            setTimeout(() => {
                setShowLogs((prev) => [...prev, index]);
                if (index === SCAN_LOGS.length - 1) {
                    setIsComplete(true);
                }
            }, SCAN_LOGS[index].delay);
        });
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [showLogs, typedCommand]);

    return (
        <div className="relative">
            {/* Cyber Aura */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

            <div className="rounded-2xl border border-white/10 bg-[#050505] shadow-2xl overflow-hidden relative z-10">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/50 border-b border-white/5 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-white/5"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-white/5"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-white/5"></div>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
                        <div className="flex items-center gap-2">
                            <Cpu className="h-3 w-3 text-purple-500" />
                            <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase mb-0.5">Core_executor::v4.2</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            Secure_Link
                        </span>
                        <span className="hidden md:block">MEM: {memoryUsage}MB</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 min-h-[500px]">
                    {/* Lateral Status Bar */}
                    <div className="hidden md:flex flex-col border-r border-white/5 bg-black/20 p-4 space-y-6">
                        <div>
                            <div className="text-[8px] text-neutral-600 font-mono uppercase tracking-widest mb-3">System_Status</div>
                            <div className="space-y-2">
                                {["LOAD", "THREAT", "I/O", "SYNC"].map(stat => (
                                    <div key={stat} className="flex flex-col gap-1">
                                        <div className="flex justify-between text-[7px] font-mono text-neutral-500">
                                            <span>{stat}</span>
                                            <span>{Math.floor(Math.random() * 30 + 70)}%</span>
                                        </div>
                                        <div className="h-0.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500/40 w-[80%]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="text-[8px] text-neutral-600 font-mono uppercase tracking-widest mb-3">Live_Stream</div>
                            <div className="space-y-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="text-[7px] font-mono text-purple-500/50 truncate">
                                        RAW_PKT_{0x4000 + i * 128} {Math.random().toString(16).slice(2, 10)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Terminal Content */}
                    <div ref={scrollRef} className="md:col-span-3 p-8 font-mono text-[13px] text-neutral-400 h-[500px] overflow-y-auto custom-scrollbar relative">
                        {/* Prompt */}
                        <div className="flex items-center text-purple-500 mb-8 border-l-2 border-purple-500 pl-4 py-1 bg-purple-500/5">
                            <span className="mr-3 text-xs opacity-50 tracking-tighter">16:56:50</span>
                            <ChevronRight className="h-3 w-3 mr-2" />
                            <span className="text-white font-bold">{typedCommand}</span>
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-1.5 h-4 bg-purple-500 ml-1.5"
                            />
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {showLogs.map((logIndex) => {
                                    const log = SCAN_LOGS[logIndex];

                                    if (log.type === "sys" || log.type === "info" || log.type === "proc") {
                                        return (
                                            <motion.div
                                                key={logIndex}
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-start gap-4"
                                            >
                                                <div className="w-1 h-1 rounded-full mt-2 bg-neutral-700" />
                                                <div className="flex-1">
                                                    <span className={`text-[11px] ${log.type === 'proc' ? 'text-blue-400/70' : 'text-neutral-500'}`}>
                                                        {log.text}
                                                    </span>
                                                    {log.type === "proc" && !isComplete && <ProcessingBar active={true} />}
                                                </div>
                                            </motion.div>
                                        );
                                    }

                                    if (log.type === "vuln") {
                                        return (
                                            <motion.div
                                                key={logIndex}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`p-4 rounded-xl border-l-4 backdrop-blur-md ${log.severity === "critical"
                                                        ? "bg-red-500/5 border-red-500/40"
                                                        : "bg-yellow-500/5 border-yellow-500/40"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    {log.severity === "critical" ? (
                                                        <ShieldAlert className="h-4 w-4 text-red-500" />
                                                    ) : (
                                                        <Activity className="h-4 w-4 text-yellow-500" />
                                                    )}
                                                    <span className={`font-black text-xs uppercase tracking-tighter ${log.severity === "critical" ? "text-red-500" : "text-yellow-500"
                                                        }`}>
                                                        {log.title}
                                                    </span>
                                                    <div className="ml-auto text-[10px] bg-black/40 px-2 py-0.5 rounded border border-white/5">
                                                        {log.code}
                                                    </div>
                                                </div>
                                                <p className="text-neutral-300 text-xs leading-relaxed font-sans">{log.detail}</p>
                                            </motion.div>
                                        );
                                    }

                                    if (log.type === "success") {
                                        return (
                                            <motion.div
                                                key={logIndex}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-8 p-6 rounded-2xl bg-green-500/5 border border-green-500/20 flex flex-col items-center text-center gap-4"
                                            >
                                                <div className="p-3 rounded-full bg-green-500/20">
                                                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                                                </div>
                                                <div>
                                                    <div className="text-green-500 font-black text-sm uppercase tracking-widest mb-1">SCAN_COMPLETE</div>
                                                    <div className="text-neutral-500 text-[10px] uppercase font-mono">{log.text}</div>
                                                </div>
                                                <button className="text-[10px] font-mono text-green-500 underline uppercase tracking-widest hover:text-green-400 transition-colors">
                                                    Download_JSON_Report
                                                </button>
                                            </motion.div>
                                        );
                                    }
                                    return null;
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>
        </div>
    );
};

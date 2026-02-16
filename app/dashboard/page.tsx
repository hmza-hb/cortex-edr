"use client";
import React from "react";
import { motion } from "framer-motion";
import {
    Activity,
    ShieldAlert,
    Cpu,
    Binary,
    Signal,
    Code2,
    Zap,
    Bug,
    Brain
} from "lucide-react";

export default function DashboardPage() {
    const stats = [
        { label: "Active Nodes", val: "14/14", icon: Cpu, color: "text-purple-400" },
        { label: "Neural Integrity", val: "99.8%", icon: Signal, color: "text-green-400" },
        { label: "Vulnerabilities", val: "0", icon: Bug, color: "text-blue-400" },
        { label: "Processing Power", val: "2.4 TF/s", icon: Zap, color: "text-yellow-400" },
    ];

    const timelineUpdates = [
        { time: "14:24:02", msg: "Neural mapping of core-engine.sys completed.", type: "system" },
        { time: "14:20:15", msg: "Detections engine v2.4 initialized on Cluster_01.", type: "process" },
        { time: "13:58:30", msg: "Zero-day signature sweep: Negative results found.", type: "security" },
        { time: "13:45:11", msg: "User session authenticated via secure node.", type: "auth" },
    ];

    return (
        <div className="space-y-8 max-w-7xl">
            {/* Mission Overview Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Command Center_</h1>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] mt-2">Operational Telemetry & Neural Mapping</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
                        <Activity className="h-4 w-4 text-purple-500 animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Real-time Feed Active</span>
                    </div>
                </div>
            </div>

            {/* Core Stats HUD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="p-6 rounded-2xl bg-[#080808] border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                        <div className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.val}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Repository Map Analysis */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-8 rounded-3xl bg-[#080808] border border-white/5 relative overflow-hidden min-h-[400px]">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-3">
                                <Code2 className="h-5 w-5 text-purple-500" />
                                <h2 className="text-sm font-black text-white uppercase tracking-widest">Architectural_Neural_Map</h2>
                            </div>
                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Last updated: 2m ago</span>
                        </div>

                        {/* Abstract Visual Map */}
                        <div className="relative h-64 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="absolute h-full aspect-square border-2 border-dashed border-purple-500/10 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute h-[70%] aspect-square border border-dashed border-blue-500/10 rounded-full"
                            />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="h-16 w-16 rounded-3xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                    <Brain className="h-8 w-8 text-white" />
                                </div>
                                <div className="mt-4 text-[10px] font-mono text-purple-400 font-bold uppercase tracking-[0.3em]">Module_Core</div>
                            </div>

                            {/* Floating "Nodes" */}
                            {[
                                { t: "10%", l: "20%", c: "bg-purple-500" },
                                { t: "20%", r: "15%", c: "bg-blue-500" },
                                { b: "25%", l: "12%", c: "bg-green-500" },
                                { b: "15%", r: "25%", c: "bg-purple-500" },
                            ].map((node, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.3, 1, 0.3]
                                    }}
                                    transition={{ duration: 2 + i, repeat: Infinity }}
                                    className={`absolute h-2 w-2 rounded-full ${node.c} blur-[2px]`}
                                    style={{ ...node }}
                                />
                            ))}
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-[10px] font-mono text-white/30 uppercase mb-2">Complexity_Index</div>
                                <div className="flex items-end gap-2 text-white">
                                    <span className="text-xl font-bold font-mono">2.44</span>
                                    <span className="text-[10px] text-green-500 mb-1 font-mono md:inline hidden uppercase tracking-widest">_STABLE</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-[10px] font-mono text-white/30 uppercase mb-2">Debt_Quantifier</div>
                                <div className="flex items-end gap-2 text-white">
                                    <span className="text-xl font-bold font-mono">128</span>
                                    <span className="text-[10px] text-yellow-500 mb-1 font-mono md:inline hidden uppercase tracking-widest">_MODERATE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Activity Feed */}
                <div className="space-y-6">
                    <div className="p-8 rounded-3xl bg-[#080808] border border-white/5 h-full relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-8">
                            <Binary className="h-5 w-5 text-blue-500" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">System_Logs_v2</h2>
                        </div>

                        <div className="space-y-6">
                            {timelineUpdates.map((update, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    key={i}
                                    className="relative pl-6 border-l border-white/10 pb-6 last:pb-0"
                                >
                                    <div className="absolute left-[-4.5px] top-0 h-2 w-2 rounded-full bg-white/20 border border-white/40" />
                                    <div className="text-[9px] font-mono text-white/20 mb-1 uppercase tracking-widest">{update.time}</div>
                                    <p className="text-xs text-white/70 leading-relaxed font-mono tracking-tight">{update.msg}</p>
                                </motion.div>
                            ))}
                        </div>

                        <button className="w-full mt-12 py-3 border border-white/10 rounded-xl text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] hover:bg-white/5 transition-colors font-black">
                            DOWNLOAD_FULL_LOG_MANIFEST
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

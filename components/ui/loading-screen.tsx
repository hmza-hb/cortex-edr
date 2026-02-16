"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_LOGS = [
    "NEURAL_LINK_ESTABLISHED",
    "DECRYPTING_CORTEX_LAYERS",
    "INITIALIZING_LOGIC_GATES",
    "SYNCHRONIZING_QUANTUM_BUFFER",
    "ACTIVATING_SECURITY_PROTOCOLS",
    "LOADING_CORE_RESOURCES",
    "OPTIMIZING_NEURAL_WEIGHTS",
    "SYSTEM_CORTEX_ONLINE"
];

const NeuralCore = ({ percent }: { percent: number }) => {
    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Pulsing Circles */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border border-purple-500/30"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1.4, 1.2],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border border-blue-500/20"
            />

            {/* SVG Brain/Neural Pattern */}
            <svg viewBox="0 0 100 100" className="w-32 h-32 text-purple-500 fill-none stroke-current stroke-[0.5]">
                <motion.path
                    d="M50 20 C30 20 20 40 20 60 C20 80 40 90 50 90 C60 90 80 80 80 60 C80 40 70 20 50 20"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: percent / 100 }}
                    transition={{ duration: 0.5 }}
                />
                {/* Neural Nodes */}
                {[...Array(6)].map((_, i) => (
                    <motion.circle
                        key={i}
                        cx={50 + 25 * Math.cos((i * 60 * Math.PI) / 180)}
                        cy={55 + 25 * Math.sin((i * 60 * Math.PI) / 180)}
                        r="1.5"
                        fill="currentColor"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: percent > (i + 1) * 15 ? 1 : 0.2 }}
                    />
                ))}
                {/* Connections */}
                {[...Array(6)].map((_, i) => (
                    <motion.line
                        key={`line-${i}`}
                        x1="50"
                        y1="55"
                        x2={50 + 25 * Math.cos((i * 60 * Math.PI) / 180)}
                        y2={55 + 25 * Math.sin((i * 60 * Math.PI) / 180)}
                        strokeWidth="0.2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: percent > (i + 1) * 15 ? 0.5 : 0 }}
                    />
                ))}
            </svg>

            {/* Percentage Display */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-mono text-white tracking-widest">
                    {Math.min(100, percent)}
                    <span className="text-xs text-purple-500">%</span>
                </span>
            </div>
        </div>
    );
};

export const LoadingScreen = () => {
    const [loading, setLoading] = useState(true);
    const [percent, setPercent] = useState(0);
    const [logIndex, setLogIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPercent((prev) => {
                const next = prev + Math.floor(Math.random() * 8) + 2;
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setLoading(false), 1200);
                    return 100;
                }
                return next;
            });
        }, 120);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const logChange = setInterval(() => {
            setLogIndex((prev) => (prev + 1) % INITIAL_LOGS.length);
        }, 1500);
        return () => clearInterval(logChange);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.05,
                        filter: "blur(20px)",
                    }}
                    transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
                >
                    {/* Background Visuals */}
                    <div className="absolute inset-0 z-0">
                        {/* Grid Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

                        {/* Scanning Bar */}
                        <motion.div
                            animate={{ top: ["-10%", "110%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent z-10"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <NeuralCore percent={percent} />

                        <div className="mt-8 flex flex-col items-center gap-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={logIndex}
                                    initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                                    className="flex flex-col items-center"
                                >
                                    <span className="text-[10px] font-mono text-purple-400 tracking-[0.4em] uppercase">
                                        {INITIAL_LOGS[logIndex]}
                                    </span>
                                </motion.div>
                            </AnimatePresence>

                            <div className="h-[1px] w-32 bg-neutral-800 relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: `${percent - 100}%` }}
                                />
                            </div>

                            <span className="text-[9px] font-mono text-neutral-600 tracking-widest uppercase">
                                Initializing_System_Cortex.sh --run
                            </span>
                        </div>
                    </div>

                    {/* High-tech corners */}
                    <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-purple-500/30" />
                    <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-purple-500/30" />
                    <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-purple-500/30" />
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-purple-500/30" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

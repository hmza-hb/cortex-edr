import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { ShieldCheck, Bug, Zap } from 'lucide-react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface ScoreCardProps {
    score: number;
    severityCounts: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    summary?: {
        overview: string;
        keyFindings?: string[];
        recommendedActions?: string[];
        businessImpact?: string;
    } | string;
    technicalAnalysis?: {
        architecture: string;
        securityPosture: string;
        codeQuality: string;
        maintainability: string;
    };
}

const AnimatedNumber = ({ value }: { value: number }) => {
    const spring = useSpring(0, { damping: 40, stiffness: 100 });
    const displayValue = useTransform(spring, (current) => Math.round(current));

    React.useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{displayValue}</motion.span>;
};

const getScoreColor = (score: number) => {
    // 0-10: Deep Critical
    if (score <= 10) return {
        primary: '#991b1b', bg: 'bg-red-900/[0.03]', hoverBg: 'group-hover:bg-red-900/[0.06]',
        text: 'text-red-800', border: 'border-red-900/30'
    };
    // 11-20: Critical
    if (score <= 20) return {
        primary: '#b91c1c', bg: 'bg-red-700/[0.03]', hoverBg: 'group-hover:bg-red-700/[0.06]',
        text: 'text-red-700', border: 'border-red-700/30'
    };
    // 21-30: High Risk
    if (score <= 30) return {
        primary: '#dc2626', bg: 'bg-red-600/[0.03]', hoverBg: 'group-hover:bg-red-600/[0.06]',
        text: 'text-red-600', border: 'border-red-600/30'
    };
    // 31-40: Elevated Risk
    if (score <= 40) return {
        primary: '#f87171', bg: 'bg-red-400/[0.03]', hoverBg: 'group-hover:bg-red-400/[0.06]',
        text: 'text-red-400', border: 'border-red-400/30'
    };
    // 41-50: Moderate Risk
    if (score <= 50) return {
        primary: '#f97316', bg: 'bg-orange-500/[0.03]', hoverBg: 'group-hover:bg-orange-500/[0.06]',
        text: 'text-orange-500', border: 'border-orange-500/30'
    };
    // 51-60: Cautionary
    if (score <= 60) return {
        primary: '#f59e0b', bg: 'bg-amber-500/[0.03]', hoverBg: 'group-hover:bg-amber-500/[0.06]',
        text: 'text-amber-500', border: 'border-amber-500/30'
    };
    // 61-70: Sub-Optimal
    if (score <= 70) return {
        primary: '#eab308', bg: 'bg-yellow-500/[0.03]', hoverBg: 'group-hover:bg-yellow-500/[0.06]',
        text: 'text-yellow-500', border: 'border-yellow-500/30'
    };
    // 71-80: Stable
    if (score <= 80) return {
        primary: '#84cc16', bg: 'bg-lime-500/[0.03]', hoverBg: 'group-hover:bg-lime-500/[0.06]',
        text: 'text-lime-500', border: 'border-lime-500/30'
    };
    // 81-90: Optimal
    if (score <= 90) return {
        primary: '#22c55e', bg: 'bg-green-500/[0.03]', hoverBg: 'group-hover:bg-green-500/[0.06]',
        text: 'text-green-500', border: 'border-green-500/30'
    };
    // 91-100: Premium/Verified
    return {
        primary: '#bb3bf6', bg: 'bg-purple-500/[0.03]', hoverBg: 'group-hover:bg-purple-500/[0.06]',
        text: 'text-purple-400', border: 'border-purple-500/30'
    };
};

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, severityCounts, summary, technicalAnalysis }) => {
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score },
    ];

    const scoreTheme = getScoreColor(score);
    const COLORS = [scoreTheme.primary, '#1a1a1a'];
    const summaryText = typeof summary === 'string' ? summary : summary?.overview;

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
                {/* Audit Score Card */}
                <div className="lg:col-span-1 p-8 rounded-[40px] bg-[#0A0A0A] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
                    <div className={cn(
                        "absolute inset-0 transition-all duration-700",
                        scoreTheme.bg,
                        scoreTheme.hoverBg
                    )} />

                    <div className="w-44 h-44 relative mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={85}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                    startAngle={90}
                                    endAngle={-270}
                                    animationBegin={0}
                                    animationDuration={1500}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <h2 className="text-6xl font-black text-white tracking-tighter">
                                <AnimatedNumber value={score} />
                            </h2>
                            <p className={cn(
                                "text-[10px] font-black tracking-[0.3em] uppercase mt-2",
                                scoreTheme.text
                            )}>Audit Rank</p>
                        </div>
                    </div>
                </div>

                {/* Risk Distribution Card */}
                <div className="lg:col-span-1 p-8 rounded-[40px] bg-[#0A0A0A] border border-white/10 flex flex-col shadow-2xl">
                    <h3 className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase mb-8">Risk Distribution</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Critical', count: severityCounts.critical, color: 'bg-red-500', text: 'text-red-400' },
                            { label: 'High', count: severityCounts.high, color: 'bg-orange-500', text: 'text-orange-400' },
                            { label: 'Medium', count: severityCounts.medium, color: 'bg-yellow-500', text: 'text-yellow-400' },
                            { label: 'Low', count: severityCounts.low, color: 'bg-blue-500', text: 'text-blue-400' },
                        ].map((sev, i) => (
                            <motion.div
                                key={sev.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i + 0.5 }}
                                className="flex items-center justify-between group cursor-default"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-2 h-2 rounded-full", sev.color)} />
                                    <span className="text-[11px] font-bold text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">{sev.label}</span>
                                </div>
                                <span className={cn("text-sm font-black tracking-tight", sev.text)}>{sev.count}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Executive Summary Card */}
                <div className="lg:col-span-2 p-10 rounded-[40px] bg-gradient-to-br from-white/[0.01] via-transparent to-transparent border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                        <div className={cn(
                            "px-4 py-2 rounded-xl backdrop-blur-sm bg-white/5 border flex items-center gap-3",
                            scoreTheme.border
                        )}>
                            <ShieldCheck className={cn("w-4 h-4", scoreTheme.text)} />
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", scoreTheme.text)}>Enterprise Verified</span>
                        </div>
                    </div>

                    <div>
                        <h3 className={cn(
                            "text-[10px] font-black uppercase tracking-[0.4em] mb-8 opacity-50",
                            scoreTheme.text
                        )}>Executive Synthesis</h3>
                        <p className="text-lg text-white/80 leading-relaxed font-semibold italic tracking-tight max-w-xl">
                            "{summaryText || "Executing architectural deep-scan and security posture assessment..."}"
                        </p>
                    </div>

                    <div className="flex items-center gap-4 pt-10">
                        <div className={cn("h-[2px] w-12", scoreTheme.bg.replace('/[0.03]', '/20'))} />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Secure Audit Manifest v4.0</span>
                    </div>
                </div>
            </motion.div>

            {/* Technical Analysis Strip */}
            {technicalAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Architecture', value: technicalAnalysis.architecture, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/5' },
                        { label: 'Security Posture', value: technicalAnalysis.securityPosture, icon: ShieldCheck, color: 'text-red-400', bg: 'bg-red-500/5' },
                        { label: 'Code Quality', value: technicalAnalysis.codeQuality, icon: Bug, color: 'text-orange-400', bg: 'bg-orange-500/5' },
                        { label: 'Maintainability', value: technicalAnalysis.maintainability, icon: Zap, color: 'text-green-400', bg: 'bg-green-500/5' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + (i * 0.1) }}
                            className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-white/20 transition-all duration-500 shadow-xl group"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn("p-2 rounded-xl border border-white/5", item.bg)}>
                                    <item.icon className={cn("w-4 h-4", item.color)} />
                                </div>
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{item.label}</span>
                            </div>
                            <p className="text-[13px] text-white/60 leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                                {item.value}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

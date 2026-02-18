import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { ShieldCheck, AlertTriangle, Bug, Zap } from 'lucide-react';

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

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, severityCounts, summary, technicalAnalysis }) => {
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score },
    ];

    const COLORS = ['#3b82f6', '#111'];

    const summaryText = typeof summary === 'string' ? summary : summary?.overview;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Donut */}
                <div className="p-8 rounded-[32px] bg-[#0A0A0A] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/[0.02] group-hover:bg-blue-500/[0.05] transition-colors duration-700" />
                    <div className="w-48 h-48 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={80} paddingAngle={0} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-black text-white">{score}</span>
                            <span className="text-[10px] font-black text-white/30 tracking-widest uppercase mt-1">Audit Score</span>
                        </div>
                    </div>
                </div>

                {/* Severity Breakdown */}
                <div className="p-8 rounded-[32px] bg-[#0A0A0A] border border-white/5 space-y-6 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex flex-col">
                            <span className="text-red-400 font-black text-xl">{severityCounts.critical}</span>
                            <span className="text-[8px] font-black text-red-500/40 tracking-[0.2em] uppercase mt-1">Critical</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex flex-col">
                            <span className="text-orange-400 font-black text-xl">{severityCounts.high}</span>
                            <span className="text-[8px] font-black text-orange-500/40 tracking-[0.2em] uppercase mt-1">High Risk</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 flex flex-col">
                            <span className="text-yellow-400 font-black text-xl">{severityCounts.medium}</span>
                            <span className="text-[8px] font-black text-yellow-500/40 tracking-[0.2em] uppercase mt-1">Medium</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex flex-col">
                            <span className="text-blue-400 font-black text-xl">{severityCounts.low}</span>
                            <span className="text-[8px] font-black text-blue-500/40 tracking-[0.2em] uppercase mt-1">Low Severity</span>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="p-8 rounded-[32px] bg-blue-500/[0.02] border border-blue-500/10 flex flex-col justify-center">
                    <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-4">Executive Synthesis</h3>
                    <p className="text-sm text-white/60 leading-relaxed italic font-medium">
                        "{summaryText || "Analyzing architectural integrity and security posture..."}"
                    </p>
                    <div className="mt-6 flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full border border-[#0A0A0A] bg-blue-500/20 flex items-center justify-center">
                                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-white/30 tracking-widest uppercase ml-2">Verified Audit</span>
                    </div>
                </div>
            </div>

            {/* Technical Analysis Section */}
            {technicalAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    {[
                        { label: 'Architecture', value: technicalAnalysis.architecture, icon: Zap, color: 'text-blue-400' },
                        { label: 'Security Posture', value: technicalAnalysis.securityPosture, icon: ShieldCheck, color: 'text-red-400' },
                        { label: 'Code Quality', value: technicalAnalysis.codeQuality, icon: Bug, color: 'text-orange-400' },
                        { label: 'Maintainability', value: technicalAnalysis.maintainability, icon: Zap, color: 'text-green-400' },
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-[24px] bg-[#0A0A0A] border border-white/5 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-4 h-4", item.color)} />
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</span>
                            </div>
                            <p className="text-[12px] text-white/60 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-default">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

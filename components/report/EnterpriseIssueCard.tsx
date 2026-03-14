'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, AlertTriangle, AlertCircle, Terminal, Info, Zap, ShieldCheck, FileText, Clock, CheckCircle2, BarChart3, HelpCircle, Lightbulb, Sparkles, Lock, Rocket, Flag } from 'lucide-react'
import { EnterpriseIssue } from '@/types/report'
import { SYSTEM_CONFIG, TierId } from '@/lib/config/system'
import Link from 'next/link'

interface EnterpriseIssueCardProps {
    issue: EnterpriseIssue
    rank: number
    tierKey?: TierId
}

export function EnterpriseIssueCard({ issue, rank, tierKey = TierId.VIBE_CODER }: EnterpriseIssueCardProps) {
    const [expanded, setExpanded] = useState(rank <= 3) // Auto-expand top 3
    const [copied, setCopied] = useState<string | null>(null)

    const tierConfig = SYSTEM_CONFIG.tiers[tierKey] || SYSTEM_CONFIG.tiers[TierId.VIBE_CODER];
    const canSeeExplanations = tierConfig.features.detailedExplanations ?? false;
    const canSeeFixes = tierConfig.features.fixSuggestions ?? false;
    const canSeePrompts = tierConfig.features.executionReadyPrompts ?? false;

    const severityColors = {
        critical: 'border-red-500/50 bg-red-500/[0.02]',
        high: 'border-orange-500/50 bg-orange-500/[0.02]',
        medium: 'border-yellow-500/50 bg-yellow-500/[0.02]',
        low: 'border-blue-500/50 bg-blue-500/[0.02]',
        informational: 'border-gray-500/50 bg-gray-500/[0.02]'
    }

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text)
        setCopied(type)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className={`border rounded-[32px] overflow-hidden transition-all duration-500 ${severityColors[issue.severity || 'medium']}`}>

            {/* Header - Always Visible */}
            <div
                className="p-8 flex items-start justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl font-black text-white/10 italic">#{rank.toString().padStart(2, '0')}</span>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`
                px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                ${issue.severity === 'critical' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                                    issue.severity === 'high' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' :
                                        issue.severity === 'medium' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' :
                                            'bg-blue-500 text-white shadow-lg shadow-blue-500/20'}
                `}>
                                {issue.severity}
                            </span>

                            {/* Strategic Identifier Badge */}
                            {(issue.severity === 'critical' || issue.severity === 'high') ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-black text-red-400 uppercase tracking-widest">
                                    <Flag className="w-3 h-3" /> Red Flag Fix
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                    <Rocket className="w-3 h-3" /> Launch Anyway
                                </span>
                            )}

                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                {issue.category}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                        {issue.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
                        <span className="flex items-center gap-2 border-r border-white/10 pr-6">
                            <FileText className="w-3 h-3 text-blue-400/50" /> {issue.file}
                        </span>
                        {issue.line && (
                            <span className="flex items-center gap-2 border-r border-white/10 pr-6">
                                Line {issue.line}
                            </span>
                        )}
                        <span className="flex items-center gap-2 text-blue-400">
                            <Clock className="w-3 h-3 text-blue-400/50" /> {issue.estimatedTimeToFix}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/5 text-white/40">
                    {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="px-8 pb-8 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">

                    {/* WHAT WE FOUND */}
                    <section className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Info className="w-4 h-4 text-blue-400" />
                            </div>
                            <h4 className="text-[12px] font-black text-white tracking-[0.2em] uppercase">
                                Audit Discovery
                            </h4>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
                            {!canSeeExplanations && (
                                <div className="absolute inset-0 z-10 backdrop-blur-md bg-black/40 flex flex-col items-center justify-center">
                                    <Lock className="w-6 h-6 text-white/50 mb-3" />
                                    <p className="text-sm font-bold text-white mb-2">Detailed Explanations Locked</p>
                                    <Link href="/pricing">
                                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-full transition-all">
                                            Upgrade to Developer Tier
                                        </button>
                                    </Link>
                                </div>
                            )}
                            <div className={!canSeeExplanations ? 'blur-sm select-none opacity-50' : ''}>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {issue.whatWeFound}
                                </p>
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                    <span className="text-blue-500/50">Discovered by:</span> {issue.agentName || 'Security Scanner'}
                                    <span className="mx-2">•</span>
                                    <span className="text-blue-500/50">Pattern:</span> {issue.searchingFor}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* WHY THIS MATTERS */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-orange-400" />
                            </div>
                            <h4 className="text-[12px] font-black text-white tracking-[0.2em] uppercase">
                                Consequence Matrix
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {issue.impact?.definite && issue.impact.definite.length > 0 && (
                                <div className="p-6 rounded-2xl bg-red-500/[0.03] border border-red-500/10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle2 className="w-3 h-3 text-red-400/50" />
                                        <p className="text-[10px] font-black text-red-400/50 uppercase tracking-widest">
                                            Immediate Impact
                                        </p>
                                    </div>
                                    <ul className="space-y-3">
                                        {issue.impact.definite.map((item: string, i: number) => (
                                            <li key={i} className="text-sm text-gray-300 flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/40 mt-1.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {issue.impact?.likely && issue.impact.likely.length > 0 && (
                                <div className="p-6 rounded-2xl bg-orange-500/[0.03] border border-orange-500/10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Zap className="w-3 h-3 text-orange-400/50" />
                                        <p className="text-[10px] font-black text-orange-400/50 uppercase tracking-widest">
                                            High Probability
                                        </p>
                                    </div>
                                    <ul className="space-y-3">
                                        {issue.impact.likely.map((item: string, i: number) => (
                                            <li key={i} className="text-sm text-gray-300 flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/40 mt-1.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {issue.impact?.reported && issue.impact.reported.length > 0 && (
                                <div className="p-6 rounded-2xl bg-yellow-500/[0.03] border border-yellow-500/10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BarChart3 className="w-3 h-3 text-yellow-400/50" />
                                        <p className="text-[10px] font-black text-yellow-400/50 uppercase tracking-widest">
                                            Industry Reports
                                        </p>
                                    </div>
                                    <ul className="space-y-3">
                                        {issue.impact.reported.map((item: string, i: number) => (
                                            <li key={i} className="text-sm text-gray-300 flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40 mt-1.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {issue.impact?.possible && issue.impact.possible.length > 0 && (
                                <div className="p-6 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <HelpCircle className="w-3 h-3 text-blue-400/50" />
                                        <p className="text-[10px] font-black text-blue-400/50 uppercase tracking-widest">
                                            Long-term Risk
                                        </p>
                                    </div>
                                    <ul className="space-y-3">
                                        {issue.impact.possible.map((item: string, i: number) => (
                                            <li key={i} className="text-sm text-gray-300 flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 mt-1.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* THE SOLUTION */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-green-400" />
                            </div>
                            <h4 className="text-[12px] font-black text-white tracking-[0.2em] uppercase">
                                Remediation Protocol
                            </h4>
                        </div>

                        <div className="space-y-4 relative overflow-hidden">
                            {!canSeeFixes && (
                                <div className="absolute inset-0 z-10 backdrop-blur-md bg-black/40 flex flex-col items-center justify-center rounded-2xl">
                                    <Lock className="w-6 h-6 text-white/50 mb-3" />
                                    <p className="text-sm font-bold text-white mb-2">Code Solutions Locked</p>
                                    <Link href="/pricing">
                                        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-full transition-all">
                                            Unlock AI Fixes
                                        </button>
                                    </Link>
                                </div>
                            )}
                            <div className={!canSeeFixes ? 'blur-sm select-none opacity-50 space-y-4' : 'space-y-4'}>
                                {issue.solution?.must && issue.solution.must.length > 0 && (
                                    <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20">
                                        <div className="flex items-center gap-2 mb-4">
                                            <AlertCircle className="w-3 h-3 text-red-400" />
                                            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Mandatory Action</p>
                                        </div>
                                        <div className="space-y-4">
                                            {issue.solution.must.map((item: any, i: number) => (
                                                <div key={i} className="flex gap-4">
                                                    <span className="text-red-500/50 mt-1 font-black text-xs">M{i + 1}</span>
                                                    <div>
                                                        <strong className="text-white block mb-1">{item.action}</strong>
                                                        <p className="text-sm text-gray-400 font-medium italic">Why: {item.reason}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {issue.solution?.should && issue.solution.should.length > 0 && (
                                    <div className="p-6 rounded-2xl bg-orange-950/10 border border-orange-500/10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Zap className="w-3 h-3 text-orange-400" />
                                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Tactical Recommendation</p>
                                        </div>
                                        <div className="space-y-4">
                                            {issue.solution.should.map((item: any, i: number) => (
                                                <div key={i} className="flex gap-4">
                                                    <span className="text-orange-500/50 mt-1 font-black text-xs">T{i + 1}</span>
                                                    <div>
                                                        <strong className="text-white block mb-1">{item.action}</strong>
                                                        <p className="text-sm text-gray-400 font-medium italic">Why: {item.reason}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* AI FIX PROMPTS */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <Terminal className="w-4 h-4 text-purple-400" />
                            </div>
                            <h4 className="text-[12px] font-black text-white tracking-[0.2em] uppercase">
                                Autonomous Repair Commands
                            </h4>
                        </div>

                        <div className="relative overflow-hidden">
                            {!canSeePrompts && (
                                <div className="absolute inset-0 z-10 backdrop-blur-md bg-black/40 flex flex-col items-center justify-center rounded-2xl">
                                    <Lock className="w-6 h-6 text-white/50 mb-3" />
                                    <p className="text-sm font-bold text-white mb-2">AI Engineer Protocols Locked</p>
                                    <Link href="/pricing">
                                        <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-full transition-all">
                                            Unlock Execution Prompts
                                        </button>
                                    </Link>
                                </div>
                            )}
                            <div className={`grid grid-cols-1 gap-4 ${!canSeePrompts ? 'blur-sm select-none opacity-50' : ''}`}>
                                {[
                                    { id: 'cursor', label: 'Cursor / Windsurf AI', prompt: issue.aiPrompts?.cursor },
                                    { id: 'chatgpt', label: 'ChatGPT / Claude Web', prompt: issue.aiPrompts?.chatgpt },
                                    { id: 'claude', label: 'Vibe Coding Execution', prompt: issue.aiPrompts?.claude }
                                ].filter(p => p.prompt).map((p) => (
                                    <div key={p.id} className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Sparkles className="w-3 h-3 text-purple-400" />
                                                {p.label}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(p.prompt!, p.id)}
                                                className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500 border border-blue-500/20 hover:border-blue-500 hover:text-white transition-all text-blue-400 flex items-center gap-2"
                                            >
                                                {copied === p.id ? (
                                                    <>
                                                        <ShieldCheck className="w-4 h-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Copy Prompt</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="h-24 overflow-y-auto custom-scrollbar text-[12px] font-mono text-gray-400 group-hover:text-gray-300 transition-colors bg-black/20 p-4 rounded-xl border border-white/5">
                                            {p.prompt}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ROI */}
                    <section className="pt-8 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest px-3 py-1 bg-green-500/5 border border-green-500/10 rounded-full">
                                Positive ROI Fix
                            </span>
                            <p className="text-sm font-bold text-white/40 italic">
                                {issue.roi}
                            </p>
                        </div>
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">
                            Manifest_ID: {issue.id?.substring(0, 8)}
                        </span>
                    </section>

                </div>
            )}

        </div>
    )
}

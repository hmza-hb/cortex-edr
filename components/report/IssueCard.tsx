import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Issue } from '@/types/agent';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SYSTEM_CONFIG, TierId } from '@/lib/config/system';
import Link from 'next/link';
import { AlertCircle, Copy, Check, Terminal, ExternalLink, Lightbulb, Zap, Lock } from 'lucide-react';

interface IssueCardProps {
    issue: Issue;
    tierKey?: TierId;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, tierKey = TierId.SCOUT }) => {
    const [copied, setCopied] = React.useState(false);

    const tierConfig = SYSTEM_CONFIG.tiers[tierKey] || SYSTEM_CONFIG.tiers[TierId.SCOUT];
    const canSeeExplanations = tierConfig.features.detailedExplanations ?? false;
    const canSeeFixes = tierConfig.features.fixSuggestions ?? false;
    const canSeePrompts = tierConfig.features.executionReadyPrompts ?? false;

    const formatDescription = (text: string) => {
        if (!text) return null;

        // Split text to handle EXPLOIT: and IMPACT: highlighting
        const parts = text.split(/(EXPLOIT:|IMPACT:)/g);

        return parts.map((part, i) => {
            if (part === "EXPLOIT:") {
                return <span key={i} className="text-orange-400 font-black mr-1 ring-1 ring-orange-400/20 px-1.5 py-0.5 rounded bg-orange-400/5 select-none tracking-tighter shadow-sm animate-pulse-subtle">EXPLOIT</span>;
            }
            if (part === "IMPACT:") {
                return <span key={i} className="text-yellow-400 font-black mr-1 ring-1 ring-yellow-400/20 px-1.5 py-0.5 rounded bg-yellow-400/5 select-none tracking-tighter shadow-sm animate-pulse-subtle">IMPACT</span>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    const handleCopyPrompt = () => {
        // Construct a highly optimized prompt if ai_prompt is missing or to enhance it
        const basePrompt = issue.ai_prompt || `Fix this ${issue.severity} ${issue.category} issue.`;

        const fullPrompt = `ACT AS AN EXPERT SOFTWARE SECURITY ARCHITECT.
        
I HAVE IDENTIFIED THE FOLLOWING ISSUE IN MY CODEBASE:
ISSUE: ${issue.title}
SEVERITY: ${issue.severity.toUpperCase()}
CATEGORY: ${issue.category.toUpperCase()}

DESCRIPTION:
${issue.description}

CONSEQUENCE & IMPACT:
${issue.fix_suggestion}

FILE PATH: ${issue.file_path || "Project-wide"}
${issue.line_number ? `LINE: ${issue.line_number}` : ""}

CODE CONTEXT:
\`\`\`
${issue.code_snippet}
\`\`\`

YOUR TASK:
1. EXPLAIN exactly why this is a risk.
2. PROVIDE a detailed, production-ready code fix.
3. ENSURE the fix follows best practices and security standards.

ADDITIONAL INSTRUCTIONS:
${basePrompt}

RESPOND ONLY WITH THE SOLUTION AND BRIEF EXPLANATION.`;

        navigator.clipboard.writeText(fullPrompt.replace(/^\s+/gm, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const severityColor = {
        critical: "text-red-400 border-red-500/20 bg-red-500/5",
        high: "text-orange-400 border-orange-500/20 bg-orange-500/5",
        medium: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
        low: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    };

    return (
        <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] overflow-hidden group hover:border-white/20 transition-all duration-500">
            {/* Header */}
            <div className="p-6 md:p-8 flex items-start justify-between gap-6 border-b border-white/[0.03]">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={cn(
                            "px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border",
                            severityColor[issue.severity]
                        )}>
                            {issue.severity}
                        </span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                            {issue.category.replace('_', ' ')}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight mb-4 group-hover:text-blue-400 transition-colors duration-300">
                        {issue.title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-2">
                            <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">Location</span>
                            <code className="text-[11px] font-mono text-blue-400/60 font-medium">
                                {issue.file_path || "Project-wide"} {issue.line_number && `:L${issue.line_number}`}
                            </code>
                        </div>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 shrink-0">
                    <AlertCircle className={cn(
                        "w-6 h-6",
                        issue.severity === 'critical' || issue.severity === 'high' ? "text-red-400/40" : "text-yellow-400/40"
                    )} />
                </div>
            </div>

            {/* Description */}
            <div className="px-6 md:px-8 py-6 relative overflow-hidden">
                {!canSeeExplanations && (
                    <div className="absolute inset-0 z-10 backdrop-blur-md bg-black/40 flex flex-col items-center justify-center">
                        <Lock className="w-4 h-4 text-white/50 mb-2" />
                        <p className="text-[10px] font-bold text-white mb-2 uppercase tracking-widest">Explanations Locked</p>
                        <Link href="/pricing">
                            <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full transition-all">
                                Upgrade Tier
                            </button>
                        </Link>
                    </div>
                )}
                <p className={cn(
                    "text-base text-white/60 leading-relaxed font-medium",
                    !canSeeExplanations && "blur-sm select-none opacity-40"
                )}>
                    {formatDescription(issue.description)}
                </p>
            </div>

            {/* Code Snippet */}
            {issue.code_snippet && (
                <div className="px-6 md:px-8 pb-6">
                    <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/40">
                        <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5 text-white/20" />
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest text-[9px]">Contextual Snippet</span>
                            </div>
                        </div>
                        <SyntaxHighlighter
                            language="typescript"
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: '24px',
                                fontSize: '12px',
                                background: 'transparent',
                                fontFamily: 'JetBrains Mono, monospace',
                                lineHeight: '1.5'
                            }}
                        >
                            {issue.code_snippet}
                        </SyntaxHighlighter>
                    </div>
                </div>
            )}

            {/* Fix Advice */}
            <div className="px-6 md:px-8 py-6 border-t border-white/5 bg-white/[0.01] relative overflow-hidden">
                {!canSeeFixes && (
                    <div className="absolute inset-0 z-10 backdrop-blur-md bg-black/40 flex flex-col items-center justify-center">
                        <Lock className="w-5 h-5 text-white/50 mb-3" />
                        <p className="text-xs font-bold text-white mb-2 uppercase tracking-widest">Fix Recommendations Locked</p>
                        <Link href="/pricing">
                            <button className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all">
                                Unlock AI Fixes
                            </button>
                        </Link>
                    </div>
                )}
                <div className={cn(
                    "flex items-start gap-4",
                    !canSeeFixes && "blur-sm select-none opacity-40"
                )}>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/10 text-blue-400 shrink-0">
                        <Lightbulb className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Technical Fix Recommendation</h4>
                        <p className="text-sm text-blue-100/60 font-medium leading-relaxed mb-6">
                            {issue.fix_suggestion}
                        </p>

                        <div className="flex flex-wrap gap-3 relative">
                            {!canSeePrompts && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center">
                                    <div className="px-3 py-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg flex items-center gap-2">
                                        <Lock className="w-3 h-3 text-white/40" />
                                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Prompts Disabled</span>
                                    </div>
                                </div>
                            )}
                            <Button
                                size="sm"
                                onClick={handleCopyPrompt}
                                disabled={!canSeePrompts}
                                className={cn(
                                    "h-10 px-6 rounded-xl flex items-center gap-3 transition-all duration-300 font-bold uppercase tracking-widest text-[10px]",
                                    copied
                                        ? "bg-green-500/20 text-green-400 border border-green-500/20"
                                        : "bg-white/[0.03] hover:bg-white/[0.06] text-white/40 hover:text-white border border-white/5",
                                    !canSeePrompts && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {copied ? (
                                    <Check className="w-3.5 h-3.5" />
                                ) : (
                                    <Zap className="w-3.5 h-3.5" />
                                )}
                                {copied ? "Prompt Copied" : "Copy AI Fix Prompt"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Issue } from '@/types/agent';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertCircle, Copy, Check, Terminal, ExternalLink, Lightbulb } from 'lucide-react';

interface IssueCardProps {
    issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopyPrompt = () => {
        if (!issue.ai_prompt) return;
        navigator.clipboard.writeText(issue.ai_prompt);
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
        <div className="rounded-2xl border border-white/5 bg-[#0A0A0A] overflow-hidden group hover:border-white/10 transition-all duration-500">
            {/* Header */}
            <div className="p-6 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                            severityColor[issue.severity]
                        )}>
                            {issue.severity}
                        </span>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                            {issue.category.replace('_', ' ')}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
                        {issue.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/40 font-medium">
                        <code className="bg-white/5 px-2 py-1 rounded text-[10px] border border-white/5">
                            {issue.file_path || "Project-wide"} {issue.line_number && `:L${issue.line_number}`}
                        </code>
                    </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <AlertCircle className={cn(
                        "w-5 h-5",
                        issue.severity === 'critical' || issue.severity === 'high' ? "text-red-400" : "text-yellow-400"
                    )} />
                </div>
            </div>

            {/* Description */}
            <div className="px-6 pb-6">
                <p className="text-sm text-white/60 leading-relaxed font-medium">
                    {issue.description}
                </p>
            </div>

            {/* Code Snippet */}
            {issue.code_snippet && (
                <div className="px-6 pb-6">
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
                        <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Contextual Snippet</span>
                            <Terminal className="w-3 h-3 text-white/20" />
                        </div>
                        <SyntaxHighlighter
                            language="typescript"
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: '20px',
                                fontSize: '11px',
                                background: 'transparent',
                                fontFamily: 'JetBrains Mono, monospace'
                            }}
                        >
                            {issue.code_snippet}
                        </SyntaxHighlighter>
                    </div>
                </div>
            )}

            {/* Fix Advice */}
            <div className="px-6 pb-6 pt-2 border-t border-white/5 bg-white/[0.01]">
                <div className="flex items-start gap-4 mt-6">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Technical Fix Recommendation</h4>
                        <p className="text-xs text-blue-200/60 font-medium leading-relaxed">
                            {issue.fix_suggestion}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyPrompt}
                                className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border border-white/10 text-white/40 hover:text-white"
                            >
                                {copied ? (
                                    <Check className="w-3 h-3 mr-2 text-green-400" />
                                ) : (
                                    <Copy className="w-3 h-3 mr-2" />
                                )}
                                {copied ? "Prompt Stored" : "Store AI Fix Prompt"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { Issue } from '@/types/agent';
import { IssueCard } from './IssueCard';
import { cn } from '@/lib/utils';
import {
    ShieldAlert, Layout, Zap,
    Layers, Brain, ListFilter
} from 'lucide-react';

import { TierId } from '@/lib/config/system';

interface IssueListProps {
    issues: Issue[];
    tierKey?: TierId;
}

type Tab = 'all' | 'security' | 'architecture' | 'quality' | 'debt' | 'ai_specific';

export const IssueList: React.FC<IssueListProps> = ({ issues, tierKey = TierId.SCOUT }) => {
    const [activeTab, setActiveTab] = useState<Tab>('all');

    const filteredIssues = activeTab === 'all'
        ? issues
        : issues.filter(i => i.category === activeTab);

    const TABS = [
        { id: 'all', label: 'All Issues', icon: ListFilter },
        { id: 'security', label: 'Security', icon: ShieldAlert },
        { id: 'architecture', label: 'Architecture', icon: Layout },
        { id: 'quality', label: 'Code Quality', icon: Zap },
        { id: 'debt', label: 'Tech Debt', icon: Layers },
        { id: 'ai_specific', label: 'AI Artifacts', icon: Brain },
    ];

    return (
        <div className="space-y-8">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0A0A0A] border border-white/5 w-fit overflow-x-auto no-scrollbar shadow-xl">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const count = tab.id === 'all'
                        ? issues.length
                        : issues.filter(i => i.category === tab.id).length;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-white text-black font-bold text-[11px] shadow-lg shadow-white/5"
                                    : "text-white/40 hover:text-white/60 font-medium text-[11px]"
                            )}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="tracking-tight">{tab.label}</span>
                            <span className={cn(
                                "min-w-[18px] h-4.5 px-1 flex items-center justify-center rounded-md text-[9px] font-bold",
                                activeTab === tab.id ? "bg-black/10" : "bg-white/5"
                            )}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-6">
                {filteredIssues.length === 0 ? (
                    <div className="py-20 rounded-3xl border border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/5 border border-green-500/10 flex items-center justify-center mb-6">
                            <span className="text-2xl">🌿</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Pristine Architecture</h3>
                        <p className="text-sm text-white/40 max-w-xs px-6">
                            No violations detected for the {activeTab.replace('_', ' ')} category.
                            Component integrity is maintained.
                        </p>
                    </div>
                ) : (
                    filteredIssues
                        .sort((a, b) => {
                            const priority = { critical: 0, high: 1, medium: 2, low: 3 };
                            return priority[a.severity] - priority[b.severity];
                        })
                        .map((issue) => (
                            <IssueCard key={issue.id} issue={issue} tierKey={tierKey} />
                        ))
                )}
            </div>
        </div>
    );
};

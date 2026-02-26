"use client";

import React from "react";
import { Sparkles, Zap, Shield, MessageCircle, BarChart3 } from "lucide-react";

export default function WhatsNewPage() {
    const updates = [
        {
            date: "Feb 25, 2026",
            title: "OpenRouter & Elite AI Routing",
            desc: "We've integrated OpenRouter to provide dynamic, tiered model selection. Free users now enjoy Liquid LFM speed, while Developers get DeepSeek R1 reasoning.",
            icon: Zap,
            tag: "MAJOR UPDATE"
        },
        {
            date: "Feb 24, 2026",
            title: "Cortex Intelligence Chat (Beta)",
            desc: "The foundation for codebase chat is live. Semantic search now powers how Cortex understands your repository architecture.",
            icon: MessageCircle,
            tag: "NEW FEATURE"
        },
        {
            date: "Feb 20, 2026",
            title: "Dashboard HUD Overhaul",
            desc: "A completely redesigned dashboard interface with enhanced readability, premium Zinc aesthetics, and real-time agent feedback.",
            icon: BarChart3,
            tag: "UI/UX"
        },
        {
            date: "Feb 15, 2026",
            title: "Clerk Authentication Identity",
            desc: "Enterprise-grade authentication with Clerk is now standard across the platform, providing faster logins and secure session management.",
            icon: Shield,
            tag: "SECURITY"
        }
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
            <header className="space-y-4">
                <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                    <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Intelligence Updates</h1>
                <p className="text-zinc-400 text-lg">
                    CortexEDR is evolving daily. Here are the latest agents, features, and security protocols deployed to the network.
                </p>
            </header>

            <div className="space-y-12 relative">
                <div className="absolute left-[27px] top-4 bottom-4 w-px bg-zinc-800" />

                {updates.map((update, i) => (
                    <div key={i} className="flex gap-8 relative">
                        <div className="h-[54px] w-[54px] rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 z-10">
                            <update.icon className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div className="flex-1 space-y-2 pt-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{update.date}</span>
                                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded border border-indigo-500/20">{update.tag}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">{update.title}</h3>
                            <p className="text-zinc-500 leading-relaxed max-w-2xl">{update.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

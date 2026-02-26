"use client";

import React from "react";
import { HelpCircle, Mail, MessageSquare, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
            <header className="space-y-4">
                <div className="h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <HelpCircle className="h-6 w-6 text-indigo-400" />
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Support Center</h1>
                <p className="text-zinc-400 text-lg">
                    Need help with an audit or have a technical question? Our engineering team is here to assist.
                </p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4 group hover:border-indigo-500/50 transition-all">
                    <Mail className="h-8 w-8 text-indigo-400" />
                    <h3 className="text-xl font-bold text-white">Direct Support</h3>
                    <p className="text-zinc-500">Email our engineering team for complex security questions or infrastructure support.</p>
                    <Button variant="outline" className="w-full border-zinc-800 hover:bg-zinc-800 text-white">
                        upvistadigital@gmail.com
                    </Button>
                </div>

                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4 group hover:border-indigo-500/50 transition-all">
                    <MessageSquare className="h-8 w-8 text-indigo-400" />
                    <h3 className="text-xl font-bold text-white">Community Discord</h3>
                    <p className="text-zinc-500">Join 1,000+ developers to discuss security patterns, AI agents, and codebase audits.</p>
                    <Button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white">
                        Join Discord
                    </Button>
                </div>
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Common Resources</h2>
                <div className="grid gap-4">
                    {[
                        { icon: BookOpen, title: "Documentation", desc: "Full API reference and agent configuration guides.", href: "/docs" },
                        { icon: MessageSquare, title: "Feature Requests", desc: "Vote on the next AI agents and dashboard features.", href: "#" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-900 transition-all cursor-pointer">
                            <item.icon className="h-6 w-6 text-zinc-500" />
                            <div className="flex-1">
                                <h4 className="text-white font-semibold">{item.title}</h4>
                                <p className="text-sm text-zinc-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

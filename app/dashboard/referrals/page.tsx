"use client";

import React from "react";
import { Gift, Copy, Share2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReferralsPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
            <header className="space-y-4 text-center">
                <div className="h-16 w-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/20">
                    <Gift className="h-8 w-8 text-indigo-400" />
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Refer & Earn</h1>
                <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                    Invite your team and colleagues to CortexEDR and earn premium scan credits for every successful signup.
                </p>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { icon: Copy, title: "1. Copy Link", desc: "Share your unique referral link with anyone." },
                    { icon: Share2, title: "2. They Sign Up", desc: "Your friends join the elite security circle." },
                    { icon: Users, title: "3. Get Rewarded", desc: "Earn 5 free scans for every new developer." },
                ].map((step, i) => (
                    <div key={i} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
                        <step.icon className="h-6 w-6 text-indigo-400" />
                        <h3 className="font-semibold text-white">{step.title}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                    </div>
                ))}
            </div>

            <div className="p-1 px-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
                <div className="bg-zinc-950 p-8 rounded-[14px] flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Your Unique Link</label>
                        <div className="flex gap-3">
                            <div className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-xl font-mono text-sm text-zinc-300 truncate">
                                https://cortex-edr.com/ref/user_2b3k...
                            </div>
                            <Button className="bg-white text-black hover:bg-zinc-200">Copy</Button>
                        </div>
                    </div>
                    <div className="md:border-l border-zinc-800 md:pl-8 space-y-2">
                        <div className="text-zinc-500 text-sm font-medium">Total Earned</div>
                        <div className="text-3xl font-bold text-white">0 Scans</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

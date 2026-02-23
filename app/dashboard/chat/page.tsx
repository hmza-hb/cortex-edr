"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ChatPlaceholderPage() {
    const router = useRouter();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 space-y-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
            >
                <div className="relative w-24 h-24 rounded-3xl bg-white/[0.01] border border-white/5 flex items-center justify-center shadow-xl backdrop-blur-sm">
                    <MessageCircle className="w-8 h-8 text-zinc-500" />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-md">
                        <Terminal className="w-4 h-4 text-zinc-400" />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center space-y-4"
            >
                <h1 className="text-2xl font-bold text-white tracking-tight">Codebase intelligence brainstorm</h1>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                    Launching soon
                </div>
                <p className="text-sm text-zinc-500 font-medium max-w-md mx-auto leading-relaxed pt-2">
                    Cortex is analyzing the structural integrity of your repository. Soon, you will be able to interrogate the audit manifest and collaboratively brainstorm architectural solutions.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    className="h-11 px-6 border border-white/5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/[0.02] transition-all flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Return to manifest
                </Button>
            </motion.div>
        </div>
    );
}


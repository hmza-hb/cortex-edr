"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ChatPlaceholderPage() {
    const router = useRouter();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 space-y-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
            >
                <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" />
                <div className="relative w-32 h-32 rounded-[40px] bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl">
                    <MessageSquare className="w-12 h-12 text-indigo-400" />
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-indigo-600 border border-indigo-400 flex items-center justify-center shadow-lg"
                    >
                        <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl font-black text-white tracking-widest uppercase">Deep Brainstorming</h1>
                <p className="text-indigo-400 font-bold tracking-[0.4em] uppercase text-sm animate-pulse">Launching Soon</p>
                <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
                    We're training your codebase's digital twin. Soon you'll be able to have complex, context-aware conversations with Cortex about architecture, security, and refactoring.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Return to Manifest</span>
                </Button>
            </motion.div>
        </div>
    );
}

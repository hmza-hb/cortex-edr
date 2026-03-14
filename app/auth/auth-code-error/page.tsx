"use client"

import Link from 'next/link'
import { ChevronLeft, AlertCircle, ShieldAlert, RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6 font-outfit">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="p-8 md:p-12 rounded-[2rem] border border-white/5 bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center space-y-8">
                    <div className="w-20 h-20 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.05)]">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter text-white">Handshake Failed</h1>
                        <p className="text-zinc-500 text-sm">Security protocol interrupted during identity exchange.</p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <AlertCircle className="w-3 h-3" /> Potential Causes
                            </p>
                            <ul className="text-xs text-zinc-500 space-y-2 font-medium">
                                <li className="flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-zinc-700 mt-1.5" />
                                    Your authentication session has expired.
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-zinc-700 mt-1.5" />
                                    Security mismatch in the redirect handshake.
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-zinc-700 mt-1.5" />
                                    Temporary synchronization delay.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <Link
                            href="/auth"
                            className="w-full h-14 bg-white text-black font-bold rounded-full flex items-center justify-center gap-2 transition-all hover:bg-zinc-200 active:scale-[0.98] shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            Restart Protocol
                        </Link>

                        <Link
                            href="/"
                            className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <ChevronLeft className="w-3 h-3" /> Return Home
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] opacity-30 select-none">
                    Cortex Secure Access // Error 401::Handshake_Failed
                </div>
            </motion.div>
        </div>
    )
}

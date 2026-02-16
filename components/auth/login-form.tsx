"use client";

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github } from "lucide-react"

export function LoginForm({
    signIn,
    signUp,
    signInWithGithub,
    signInWithGoogle,
    message
}: {
    signIn: (formData: FormData) => void,
    signUp: (formData: FormData) => void,
    signInWithGithub: () => void,
    signInWithGoogle: () => void,
    message?: string
}) {
    const [mode, setMode] = useState<"signin" | "signup" | "forgot-pass">("signin")
    const [isGlitching, setIsGlitching] = useState(false)

    const toggleMode = (newMode?: "signin" | "signup" | "forgot-pass") => {
        setIsGlitching(true)
        setTimeout(() => {
            if (newMode) {
                setMode(newMode)
            } else {
                setMode(prev => prev === "signin" ? "signup" : "signin")
            }
            setIsGlitching(false)
        }, 400)
    }

    return (
        <div className="w-full max-w-[400px] space-y-10 relative">
            <AnimatePresence mode="wait">
                {isGlitching && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 pointer-events-none"
                    >
                        <div className="digital-noise" />
                        <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`space-y-10 transition-all duration-300 ${isGlitching ? "blur-[2px] scale-95 opacity-50" : "animate-in fade-in slide-in-from-right-4 duration-700"}`}>
                <header className="space-y-4">
                    <motion.h1
                        key={mode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black tracking-tighter text-white font-outfit drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] uppercase"
                    >
                        {mode === "signin" ? "JOIN THE ELITE" : mode === "signup" ? "START NOW" : "RECOVERY MODE"}
                    </motion.h1>
                    <p className="text-white font-mono text-xs uppercase tracking-[0.25em] leading-relaxed max-w-[320px] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                        {mode === "signin"
                            ? "Sign in to access your secure command center."
                            : mode === "signup"
                                ? "Create your secure account to begin."
                                : "Initialize digital identifier recovery protocol."}
                    </p>
                </header>

                <div className="space-y-8">
                    {mode !== "forgot-pass" && (
                        <>
                            {/* Social Logins */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-12 bg-white/[0.1] border-white/30 hover:bg-white/[0.2] hover:border-white text-white text-[11px] font-mono uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]"
                                    onClick={() => signInWithGithub()}
                                >
                                    <Github className="mr-3 h-4 w-4" />
                                    GitHub
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-12 bg-white/[0.1] border-white/30 hover:bg-white/[0.2] hover:border-white text-white text-[11px] font-mono uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]"
                                    onClick={() => signInWithGoogle()}
                                >
                                    <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/20" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-[0.4em]">
                                    <span className="bg-[#050505] px-6 text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                        OR USE EMAIL
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    <form action={mode === "signin" ? signIn : signUp} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-mono uppercase tracking-[0.3em] text-white font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" htmlFor="email">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@domain.com"
                                    required
                                    className="h-12 bg-white/[0.08] border-white/30 rounded-lg text-white placeholder:text-neutral-500 focus:border-white focus:ring-white/20 transition-all font-mono text-[12px] tracking-wider"
                                />
                            </div>
                            {mode !== "forgot-pass" && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-mono uppercase tracking-[0.3em] text-white font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" htmlFor="password">
                                            Password
                                        </label>
                                        {mode === "signin" && (
                                            <button
                                                type="button"
                                                onClick={() => toggleMode("forgot-pass")}
                                                className="text-[10px] font-mono uppercase tracking-[0.2em] text-white hover:text-purple-300 transition-colors font-black underline decoration-white/30 decoration-2 underline-offset-4 glitch-hover"
                                                data-text="Forgot Password?"
                                            >
                                                Forgot Password?
                                            </button>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="h-12 bg-white/[0.08] border-white/30 rounded-lg text-white focus:border-white focus:ring-white/20 transition-all font-mono text-sm tracking-widest"
                                    />
                                </div>
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, x: mode === "signin" ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: mode === "signin" ? 20 : -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Button
                                    className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-mono uppercase tracking-[0.3em] text-[11px] font-black shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] transition-all duration-500 relative group overflow-hidden"
                                    type="submit"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-scan-fast" />
                                    <span className="relative text-black">
                                        {mode === "signin" ? "SIGN IN" : mode === "signup" ? "CREATE ACCOUNT" : "SEND RECOVERY KEY"}
                                    </span>
                                </Button>
                            </motion.div>
                        </AnimatePresence>

                        <div className="pt-4 text-center">
                            {mode === "forgot-pass" ? (
                                <button
                                    type="button"
                                    onClick={() => toggleMode("signin")}
                                    className="text-[10px] font-mono uppercase tracking-[0.25em] text-white hover:text-purple-300 transition-colors font-black flex items-center justify-center w-full gap-2"
                                >
                                    ← BACK TO SIGN IN
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => toggleMode()}
                                    className="text-[10px] font-mono uppercase tracking-[0.25em] text-white hover:text-purple-300 transition-colors font-black"
                                >
                                    {mode === "signin"
                                        ? "New here? [Create an account]"
                                        : "Have an account? [Sign in]"}
                                </button>
                            )}
                        </div>

                        {message && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[10px] font-mono text-red-500 text-center uppercase tracking-[0.2em] mt-8 bg-white/5 p-4 rounded-lg border border-red-500/40 font-black"
                            >
                                ALERT: {message}
                            </motion.p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

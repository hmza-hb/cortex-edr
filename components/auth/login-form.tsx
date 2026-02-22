"use client";

import * as React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Loader2, Mail, Lock, ShieldCheck, AlertCircle } from "lucide-react"

const authSchema = z.object({
    email: z.string().email("Please enter a valid business email"),
    password: z.string().min(8, "Password must be at least 8 characters for security"),
})

const recoverySchema = z.object({
    email: z.string().email("Please enter a valid business email"),
})

type AuthValues = z.infer<typeof authSchema>

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
    const [isGithubLoading, setIsGithubLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [isFormLoading, setIsFormLoading] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<AuthValues>({
        // @ts-ignore - Dynamic resolver based on mode
        resolver: zodResolver(mode === "forgot-pass" ? recoverySchema : authSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const toggleMode = (newMode?: "signin" | "signup" | "forgot-pass") => {
        setIsGlitching(true)
        setTimeout(() => {
            if (newMode) {
                setMode(newMode)
            } else {
                setMode(prev => prev === "signin" ? "signup" : "signin")
            }
            reset()
            setIsGlitching(false)
        }, 400)
    }

    const onFormSubmit = async (data: AuthValues) => {
        setIsFormLoading(true)
        const formData = new FormData()
        formData.append("email", data.email)
        if (data.password) formData.append("password", data.password)

        try {
            if (mode === "signin") {
                await signIn(formData)
            } else if (mode === "signup") {
                await signUp(formData)
            } else {
                // Handle forgot pass if needed
            }
        } catch (error) {
            console.error("Auth error:", error)
            setIsFormLoading(false)
        }
    }

    return (
        <div className="w-full max-w-[440px] space-y-8 relative">
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

            <div className={`space-y-8 transition-all duration-300 ${isGlitching ? "blur-[2px] scale-95 opacity-50" : "animate-in fade-in slide-in-from-right-4 duration-700"}`}>
                <header className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-purple-500 rounded-full" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-purple-400 font-bold">Protocol Active</span>
                    </div>
                    <motion.h1
                        key={mode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black tracking-tighter text-white font-outfit drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] uppercase"
                    >
                        {mode === "signin" ? "AUTHENTICATE" : mode === "signup" ? "INITIALIZE" : "RECOVER"}
                    </motion.h1>
                    <p className="text-white/60 font-mono text-[11px] uppercase tracking-[0.2em] leading-relaxed max-w-[360px]">
                        {mode === "signin"
                            ? "Provide credentials to access the secure node."
                            : mode === "signup"
                                ? "Configure your biometric identifier for network access."
                                : "Emergency credentials bypass protocol initialized."}
                    </p>
                </header>

                <div className="space-y-6">
                    {mode !== "forgot-pass" && (
                        <>
                            {/* Social Logins */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="h-12 bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/30 text-white text-[11px] font-mono uppercase tracking-[0.2em] transition-all group disabled:opacity-50"
                                    onClick={() => {
                                        setIsGithubLoading(true)
                                        signInWithGithub()
                                    }}
                                    disabled={isGithubLoading || isGoogleLoading || isFormLoading}
                                >
                                    {isGithubLoading ? (
                                        <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Github className="mr-3 h-4 w-4 transition-transform group-hover:scale-110" />
                                    )}
                                    {isGithubLoading ? "LINKING..." : "GITHUB"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-12 bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/30 text-white text-[11px] font-mono uppercase tracking-[0.2em] transition-all group disabled:opacity-50"
                                    onClick={() => {
                                        setIsGoogleLoading(true)
                                        signInWithGoogle()
                                    }}
                                    disabled={isGithubLoading || isGoogleLoading || isFormLoading}
                                >
                                    {isGoogleLoading ? (
                                        <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                                    ) : (
                                        <svg className="mr-3 h-4 w-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" className="opacity-80" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" className="opacity-80" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="currentColor" className="opacity-80" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" className="opacity-80" />
                                        </svg>
                                    )}
                                    {isGoogleLoading ? "LINKING..." : "GOOGLE"}
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/5" />
                                </div>
                                <div className="relative flex justify-center text-[9px] uppercase font-mono tracking-[0.5em]">
                                    <span className="bg-[#050505] px-4 text-white/40 font-bold">
                                        Manual Override
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    <form onSubmit={handleSubmit((data) => onFormSubmit(data as unknown as AuthValues))} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50 font-bold" htmlFor="email">
                                        Interface ID (Email)
                                    </label>
                                    {errors.email && (
                                        <span className="text-[9px] font-mono text-red-400 uppercase tracking-wider flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" /> {errors.email.message}
                                        </span>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                                    <Input
                                        id="email"
                                        placeholder="admin@cortex-edr.network"
                                        {...register("email")}
                                        className={`h-12 pl-11 bg-white/[0.02] border-white/10 rounded-lg text-white placeholder:text-neutral-700 focus:border-purple-500 focus:ring-purple-500/20 transition-all font-mono text-[12px] tracking-wider ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                    />
                                </div>
                            </div>
                            {mode !== "forgot-pass" && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50 font-bold" htmlFor="password">
                                            Access Key (Password)
                                        </label>
                                        {errors.password && (
                                            <span className="text-[9px] font-mono text-red-400 uppercase tracking-wider flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" /> {errors.password.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            {...register("password")}
                                            className={`h-12 pl-11 bg-white/[0.02] border-white/10 rounded-lg text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all font-mono text-sm tracking-widest ${errors.password ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                        />
                                    </div>
                                    {mode === "signin" && (
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => toggleMode("forgot-pass")}
                                                className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 hover:text-purple-400 transition-colors font-bold underline decoration-white/10 underline-offset-4"
                                            >
                                                Lost Access Key?
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <Button
                                className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-mono uppercase tracking-[0.3em] text-[11px] font-black shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] transition-all duration-500 relative group overflow-hidden disabled:opacity-50"
                                type="submit"
                                disabled={isGithubLoading || isGoogleLoading || isFormLoading}
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -translate-x-full group-hover:animate-scan-fast" />
                                <span className="relative flex items-center justify-center gap-2">
                                    {isFormLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            DECRYPTING...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="h-4 w-4" />
                                            {mode === "signin" ? "EXECUTE AUTH" : mode === "signup" ? "INITIALIZE ID" : "REQUEST BYPASS"}
                                        </>
                                    )}
                                </span>
                            </Button>
                        </div>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => toggleMode(mode === "forgot-pass" ? "signin" : undefined)}
                                className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 hover:text-purple-400 transition-colors font-bold"
                            >
                                {mode === "forgot-pass" ? (
                                    "← Back to terminal"
                                ) : mode === "signin" ? (
                                    "No identity found? [Register Node]"
                                ) : (
                                    "Identity already exists? [Auth Node]"
                                )}
                            </button>
                        </div>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`text-[10px] font-mono p-4 rounded-lg border flex items-start gap-3 mt-4 ${message.toLowerCase().includes('sent') || message.toLowerCase().includes('success')
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                    : 'bg-red-500/10 border-red-500/40 text-red-400'
                                    }`}
                            >
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-bold uppercase tracking-wider">System Alert</p>
                                    <p className="opacity-80 leading-relaxed uppercase">{message}</p>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

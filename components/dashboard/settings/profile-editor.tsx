"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, User, Building2, Briefcase, Mail, CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { updateProfile } from "@/app/actions/profile";

interface ProfileEditorProps {
    profile: any;
    user: any;
}

export const ProfileEditor = ({ profile, user }: ProfileEditorProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: profile?.full_name || user?.name || "",
        company: profile?.company || "",
        role: profile?.role || "",
        securityLevel: profile?.security_level || "intermediate"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        const result = await updateProfile(formData);

        if (result.success) {
            setMessage({ type: 'success', text: "Operational profile synchronized successfully." });
        } else {
            setMessage({ type: 'error', text: result.error || "Failed to update profile." });
        }
        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.05]">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tighter">Enterprise Identity</h1>
                    <p className="text-zinc-500 font-medium">Manage your professional security profile and technical context.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Node Verified</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-12 space-y-10">

                    {/* Identity Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                <User className="w-4 h-4 text-indigo-400" />
                            </div>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Public Identity</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                                    </div>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-11 h-12 bg-zinc-900/50 border-zinc-800 focus:border-indigo-500/50 rounded-xl transition-all"
                                        placeholder="Operational handle"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 opacity-60">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Work Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-zinc-600" />
                                    </div>
                                    <Input
                                        value={user?.email || ""}
                                        disabled
                                        className="pl-11 h-12 bg-zinc-900/30 border-zinc-800/50 cursor-not-allowed rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Organization Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <Building2 className="w-4 h-4 text-blue-400" />
                            </div>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Organization Context</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Company / Team</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Building2 className="h-4 w-4 text-zinc-600 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <Input
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="pl-11 h-12 bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50 rounded-xl transition-all"
                                        placeholder="Enterprise entity"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Professional Role</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Briefcase className="h-4 w-4 text-zinc-600 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <Input
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="pl-11 h-12 bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50 rounded-xl transition-all"
                                        placeholder="Security Analyst, Lead Engineer..."
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Security Level Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                <Shield className="w-4 h-4 text-orange-400" />
                            </div>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Security Architecture Expertise</h2>
                        </div>

                        <div className="p-2 rounded-[22px] bg-zinc-900/50 border border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-2">
                            {['beginner', 'intermediate', 'advanced'].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, securityLevel: level })}
                                    className={cn(
                                        "px-6 py-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 border border-transparent",
                                        formData.securityLevel === level
                                            ? "bg-white/10 border-white/10 text-white shadow-xl"
                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                                    )}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">{level}</span>
                                    <div className="flex gap-1">
                                        {[...Array(level === 'beginner' ? 1 : level === 'intermediate' ? 2 : 3)].map((_, i) => (
                                            <div key={i} className={cn(
                                                "h-1 w-4 rounded-full",
                                                formData.securityLevel === level ? "bg-orange-400" : "bg-zinc-700"
                                            )} />
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Feedback & Actions */}
                    <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/[0.05]">
                        <div className="flex-1">
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-2xl border",
                                        message.type === 'success'
                                            ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
                                            : "bg-red-500/5 border-red-500/10 text-red-400"
                                    )}
                                >
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <span className="text-xs font-bold uppercase tracking-tight">{message.text}</span>
                                </motion.div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="h-14 px-10 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all active:scale-[0.98] shrink-0"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                    Synchronizing...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-3" />
                                    Save Profile
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Account Metadata (Bottom Info) */}
            <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30">
                <div className="p-6 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-loose">Internal Reference</p>
                    <p className="text-xs font-mono text-zinc-300 break-all">{profile?.id || user?.id}</p>
                </div>
                <div className="p-6 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-loose">Account Created</p>
                    <p className="text-xs font-mono text-zinc-300">{new Date(profile?.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="p-6 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-loose">Last Handshake</p>
                    <p className="text-xs font-mono text-zinc-300">{new Date(profile?.updated_at || Date.now()).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

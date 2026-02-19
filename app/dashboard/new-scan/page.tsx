"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Github,
    GitBranch,
    Folder,
    Loader2,
    Globe,
    ShieldCheck,
    Cpu,
    Activity,
    CheckCircle2,
    ArrowRight,
    Search,
    History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function NewScanPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [repositories, setRepositories] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [scanMode, setScanMode] = useState<"quick" | "managed">("quick");

    useEffect(() => {
        fetchRepositories();
    }, []);

    const fetchRepositories = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("repositories")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(4);

        if (data) setRepositories(data);
    };

    const handleStartScan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const repo_url = formData.get("repo_url");

        try {
            const response = await fetch("/api/scan/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repo_url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to start scan");
            }

            router.push(`/dashboard/scan/${data.scan_id}`);
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Minimal Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Return to Dashboard</span>
                </Button>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold text-white/50 tracking-wider">SECURE_CHANNEL_READY</span>
                </div>
            </div>

            {/* Strategic Intro */}
            <header>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
                    Configure New Security Audit
                </h1>
                <p className="text-lg text-white/50 font-medium">
                    Deploy autonomous intelligence agents to audit your infrastructure and codebase.
                </p>
            </header>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Mode: Quick Scan */}
                <button
                    onClick={() => setScanMode("quick")}
                    className={cn(
                        "relative p-8 rounded-3xl border transition-all duration-500 text-left group overflow-hidden",
                        scanMode === "quick"
                            ? "bg-white/[0.04] border-blue-500/50 shadow-2xl shadow-blue-500/10"
                            : "bg-[#0A0A0A] border-white/5 hover:border-white/20"
                    )}
                >
                    {scanMode === "quick" && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
                    )}
                    <div className="flex items-center justify-between mb-6">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors",
                            scanMode === "quick" ? "bg-blue-500/20 border-blue-500/30 text-blue-400" : "bg-white/5 border-white/10 text-white/40"
                        )}>
                            <Globe className="w-6 h-6" />
                        </div>
                        {scanMode === "quick" && <CheckCircle2 className="w-6 h-6 text-blue-400 animate-in zoom-in duration-300" />}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Quick Scan Entry</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-4">
                        Perform a rapid deep-scan on any public or private repository via URL endpoint.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400/80 uppercase tracking-widest">
                        Instant Deployment <ArrowRight className="w-3 h-3" />
                    </div>
                </button>

                {/* Mode: Managed Workspace */}
                <button
                    onClick={() => setScanMode("managed")}
                    className={cn(
                        "relative p-8 rounded-3xl border transition-all duration-500 text-left group overflow-hidden",
                        scanMode === "managed"
                            ? "bg-white/[0.04] border-purple-500/50 shadow-2xl shadow-purple-500/10"
                            : "bg-[#0A0A0A] border-white/5 hover:border-white/20"
                    )}
                >
                    {scanMode === "managed" && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
                    )}
                    <div className="flex items-center justify-between mb-6">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors",
                            scanMode === "managed" ? "bg-purple-500/20 border-purple-500/30 text-purple-400" : "bg-white/5 border-white/10 text-white/40"
                        )}>
                            <Github className="w-6 h-6" />
                        </div>
                        {scanMode === "managed" && <CheckCircle2 className="w-6 h-6 text-purple-400 animate-in zoom-in duration-300" />}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Managed Workspace</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-4">
                        Direct GitHub integration with CortexEDR App for automated, team-wide oversight.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-400/80 uppercase tracking-widest">
                        GitHub App Integration <ArrowRight className="w-3 h-3" />
                    </div>
                </button>
            </div>

            {/* Form Section */}
            <div className="p-10 rounded-3xl bg-[#0A0A0A] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] -z-10 group-hover:bg-blue-500/10 transition-all duration-1000" />

                {scanMode === "quick" ? (
                    <form className="space-y-8 relative z-10" onSubmit={handleStartScan}>
                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white/60 ml-1">
                                    GitHub Repository URL
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-blue-400 transition-colors">
                                        <Search className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="url"
                                        name="repo_url"
                                        placeholder="https://github.com/organization/repository"
                                        className="w-full h-16 pl-14 pr-6 bg-white/[0.02] border border-white/5 rounded-2xl text-[15px] text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all font-medium"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                    <Activity className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                    <p className="text-sm text-red-400 font-medium leading-tight">
                                        Deployment Error: {error}
                                    </p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-16 bg-white text-black hover:bg-neutral-200 font-bold text-base tracking-tight rounded-2xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Marshalling AI Agents...
                                    </>
                                ) : (
                                    <>
                                        Initiate Full Audit
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="flex items-center gap-6 justify-center text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" /> ISO 27001 Protocol</span>
                            <span className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> Neural Synthesis</span>
                        </div>
                    </form>
                ) : (
                    <div className="py-12 flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
                            <Github className="w-10 h-10" />
                        </div>
                        <div className="max-w-md space-y-3">
                            <h3 className="text-2xl font-bold text-white">GitHub App Integration</h3>
                            <p className="text-white/50 font-medium">
                                Sync all your repositories instantly by authorizing the CortexEDR GitHub App. Perfect for team collaboration and institutional audits.
                            </p>
                        </div>
                        <Button className="h-14 px-10 bg-purple-500 text-white hover:bg-purple-600 font-bold text-base rounded-2xl transition-all shadow-lg active:scale-[0.98]">
                            Install GitHub App
                        </Button>
                    </div>
                )}
            </div>

            {/* Recent Manifests Section */}
            {repositories.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <History className="w-5 h-5 text-white/20" />
                            <h2 className="text-lg font-bold text-white">Audit Manifest History</h2>
                        </div>
                        <Link href="/dashboard/scans" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                            View All History
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {repositories.map((repo) => (
                            <button
                                key={repo.id}
                                onClick={() => {
                                    const input = document.querySelector('input[name="repo_url"]') as HTMLInputElement;
                                    if (input) {
                                        setScanMode("quick");
                                        input.value = repo.url;
                                        input.focus();
                                    }
                                }}
                                className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/20 hover:bg-white/[0.02] transition-all text-left flex items-center justify-between group"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <GitBranch className="w-3.5 h-3.5 text-white/20" />
                                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                            {repo.name || repo.url.split('/').pop()}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-white/30 font-medium tracking-tight">
                                        Endpoint: {repo.url.replace('https://github.com/', '')}
                                    </div>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Load Manifest</div>
                                    <div className="text-[10px] text-white/20 font-medium">
                                        {repo.last_scanned_at ? new Date(repo.last_scanned_at).toLocaleDateString() : 'Never Scanned'}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

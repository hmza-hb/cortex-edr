"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
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
import { useUser } from "@clerk/nextjs";

export default function NewScanPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [repositories, setRepositories] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [scanMode, setScanMode] = useState<"quick" | "managed">("quick");

    useEffect(() => {
        if (isLoaded) {
            fetchRepositories();
        }
    }, [isLoaded, user]);

    const fetchRepositories = async () => {
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
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 pb-16 lg:pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Responsive Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-zinc-500 hover:text-zinc-100 transition-colors w-fit"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Return to dashboard</span>
                </Button>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 self-start sm:self-auto">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-zinc-500 tracking-tight">Secure channel active</span>
                </div>
            </div>

            <header className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100 tracking-tight">
                    Start a security scan
                </h1>
                <p className="text-sm lg:text-base text-zinc-500 font-medium">
                    Choose how you want to scan your code repository for security vulnerabilities.
                </p>
            </header>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

                {/* Mode: Quick Scan */}
                <button
                    onClick={() => setScanMode("quick")}
                    className={cn(
                        "relative p-6 lg:p-8 rounded-3xl border transition-all duration-500 text-left group overflow-hidden",
                        scanMode === "quick"
                            ? "bg-zinc-900 border-indigo-500/50 shadow-2xl"
                            : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                    )}
                >
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                        <div className={cn(
                            "w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center border transition-colors",
                            scanMode === "quick" ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                        )}>
                            <Globe className="w-5 h-5 lg:w-6 lg:h-6" />
                        </div>
                        {scanMode === "quick" && <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-400 animate-in zoom-in duration-300" />}
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-zinc-100 mb-2">Quick scan</h3>
                    <p className="text-sm lg:text-base text-zinc-500 leading-relaxed mb-3 lg:mb-4 font-medium">
                        Scan any public or private repository by entering its URL. Get instant security results.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-400/80 tracking-tight">
                        Start scanning now <ArrowRight className="w-3 h-3" />
                    </div>
                </button>

                {/* Mode: Managed Workspace */}
                <button
                    onClick={() => setScanMode("managed")}
                    className={cn(
                        "relative p-6 lg:p-8 rounded-3xl border transition-all duration-500 text-left group overflow-hidden",
                        scanMode === "managed"
                            ? "bg-zinc-900 border-indigo-500/50 shadow-2xl"
                            : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                    )}
                >
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                        <div className={cn(
                            "w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center border transition-colors",
                            scanMode === "managed" ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                        )}>
                            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub logo" className="w-5 h-5 lg:w-6 lg:h-6 object-contain filter brightness-0 invert" />
                        </div>
                        {scanMode === "managed" && <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-400 animate-in zoom-in duration-300" />}
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-zinc-100 mb-2">Connect GitHub</h3>
                    <p className="text-sm lg:text-base text-zinc-500 leading-relaxed mb-3 lg:mb-4 font-medium">
                        Link your GitHub account to automatically scan all your repositories. Perfect for teams and organizations.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-400/80 tracking-tight">
                        Connect account <ArrowRight className="w-3 h-3" />
                    </div>
                </button>
            </div>

            {/* Form Section */}
            <div className="p-6 lg:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] -z-10 group-hover:bg-indigo-500/10 transition-all duration-1000" />

                {scanMode === "quick" ? (
                    <form className="space-y-6 lg:space-y-8 relative z-10" onSubmit={handleStartScan}>
                        <div className="flex flex-col gap-4 lg:gap-6">
                            <div className="space-y-2.5">
                                <label className="text-sm font-semibold text-zinc-500 ml-1">
                                    Repository URL
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 lg:pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within/input:text-indigo-400 transition-colors">
                                        <Search className="h-4 w-4 lg:h-5 lg:w-5" />
                                    </div>
                                    <input
                                        type="url"
                                        name="repo_url"
                                        placeholder="https://github.com/username/repository"
                                        className="w-full h-12 lg:h-14 pl-12 lg:pl-14 pr-4 lg:pr-6 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-sm lg:text-[15px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-950 transition-all font-medium"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 lg:p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                    <Activity className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                    <p className="text-sm text-red-400 font-medium leading-tight">
                                        Deployment failure: {error}
                                    </p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-10 lg:h-12 bg-zinc-100 text-zinc-950 hover:bg-zinc-300 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Starting security scan...
                                    </>
                                ) : (
                                    <>
                                        Start security scan
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 justify-center text-[10px] font-bold text-zinc-600 tracking-tight">
                            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Security protocol active</span>
                            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> Neural analysis enabled</span>
                        </div>
                    </form>
                ) : (
                    <div className="py-8 lg:py-12 flex flex-col items-center text-center space-y-6 lg:space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
                            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub logo" className="w-7 h-7 lg:w-8 lg:h-8 object-contain filter brightness-0 invert" />
                        </div>
                        <div className="max-w-md space-y-2">
                            <h3 className="text-xl lg:text-2xl font-bold text-zinc-100">Connect your GitHub account</h3>
                            <p className="text-sm lg:text-base text-zinc-500 font-medium">
                                Automatically scan all your repositories by connecting your GitHub account. Perfect for teams and continuous monitoring.
                            </p>
                        </div>
                        <Button className="h-10 lg:h-12 px-8 lg:px-10 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-[0.98]">
                            Install GitHub app
                        </Button>
                    </div>
                )}
            </div>

            {/* Recent Repositories Section */}
            {repositories.length > 0 && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-zinc-500" />
                            <h2 className="text-base lg:text-lg font-bold text-zinc-100">Recent repositories</h2>
                        </div>
                        <Link href="/dashboard/scans" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                            View all scans
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
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
                                className="p-4 lg:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all text-left flex items-center justify-between group min-h-[80px] lg:min-h-[88px]"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <GitBranch className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                                        <span className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors truncate">
                                            {repo.name || repo.url.split('/').pop()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-zinc-500 font-medium truncate">
                                        {repo.url.replace('https://github.com/', '')}
                                    </div>
                                </div>
                                <div className="text-right ml-3 lg:ml-4 flex-shrink-0">
                                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight mb-0.5">Use this repo</div>
                                    <div className="text-[10px] text-zinc-600 font-medium">
                                        {repo.last_scanned_at ? new Date(repo.last_scanned_at).toLocaleDateString() : 'Never scanned'}
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

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Github, GitBranch, Folder, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function NewScanPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [repositories, setRepositories] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRepositories();
    }, []);

    const fetchRepositories = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Sorting by created_at as 'last_scan_at' error was reported
        const { data } = await supabase
            .from("repositories")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

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
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">
                        Initialize Pipeline
                    </h1>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Deploy automated security & architectural audit agents</p>
                </div>
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:bg-white/5 text-white/40 hover:text-white transition-all border border-white/10 rounded-xl h-10 px-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                </Link>
            </div>

            {/* Main Scan Form */}
            <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10 group-hover:bg-blue-500/10 transition-all duration-700" />

                <form className="space-y-8 relative z-10" onSubmit={handleStartScan}>
                    <div>
                        <label className="block text-[10px] font-black text-white/20 mb-4 tracking-[0.2em] uppercase">
                            Target Repository Endpoint
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/10 group-focus-within:text-blue-400 transition-colors">
                                <Github className="h-4 w-4" />
                            </div>
                            <input
                                type="url"
                                name="repo_url"
                                placeholder="https://github.com/organization/repository"
                                className="w-full h-16 pl-12 pr-4 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all font-medium"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <p className="mt-4 text-[10px] font-black text-red-400 bg-red-400/5 p-4 rounded-xl border border-red-400/10 flex items-center gap-2 tracking-widest uppercase">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 h-16 bg-purple-500 hover:bg-blue-600 text-black font-black text-[10px] tracking-[0.3em] uppercase rounded-2xl transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Firing Up Agents...
                                </>
                            ) : (
                                "Initiate Security Audit"
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Saved Repositories */}
            {repositories.length > 0 && (
                <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/5">
                    <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                        <Folder className="h-4 w-4 text-white/20" />
                        Operation History
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {repositories.map((repo) => (
                            <button
                                key={repo.id}
                                onClick={() => {
                                    const input = document.querySelector('input[name="repo_url"]') as HTMLInputElement;
                                    if (input) input.value = repo.url;
                                }}
                                className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all text-left group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight truncate">
                                            {repo.name || repo.url.split('/').pop()}
                                        </div>
                                        <div className="text-[9px] text-white/20 mt-1 font-black uppercase tracking-wider">
                                            Last Audit: {repo.last_scanned_at ? new Date(repo.last_scanned_at).toLocaleDateString() : 'Never'}
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-9 text-[9px] tracking-widest uppercase font-black border border-white/5 text-white/20 group-hover:border-blue-500/30 group-hover:text-blue-400 px-4 transition-all hover:bg-blue-500/5 rounded-xl ml-4">
                                        Load Path
                                    </Button>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-black antialiased relative overflow-x-hidden flex flex-col">
            {/* Header - Shared across legal pages */}
            <header className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4">
                <div className="bg-black/40 backdrop-blur-xl border border-white/[0.1] rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl shadow-2xl">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="font-mono text-[10px] tracking-widest uppercase">BACK_TO_SYSTEM</span>
                    </Link>
                    <div className="flex items-center gap-2 font-bold text-lg tracking-tighter text-white">
                        <img src="/assets/logo.png" alt="CortexEDR Logo" className="h-5 w-5" />
                        <span className="font-mono text-[11px] tracking-[0.3em] uppercase hidden md:inline">CORTEX_LEGAL_MODULE</span>
                    </div>
                    <div className="w-24 hidden md:block" />
                </div>
            </header>

            <div className="flex-grow pt-40 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="prose prose-invert prose-sm max-w-none">
                        {children}
                    </div>
                </div>
            </div>

            <footer className="py-8 border-t border-white/5 text-center bg-black/40 backdrop-blur-sm relative z-10">
                <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
                    © {new Date().getFullYear()} Cortex EDR // ALL SYSTEM RIGHTS RESERVED
                </p>
            </footer>
        </main>
    );
}

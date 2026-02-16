"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Shield,
    Layers,
    Cpu,
    Brain,
    Code2,
    Zap,
    Lock,
    Search,
    FileCode,
    Activity,
    ArrowLeft,
    ChevronRight,
    Binary
} from "lucide-react";
import { Footer } from "@/components/landing/footer";

const FeatureLayer = ({ title, items, icon: Icon, delay = 0 }: { title: string, items: { label: string, desc: string }[], icon: any, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        className="relative p-8 rounded-3xl bg-[#030303] border border-white/5 overflow-hidden group hover:border-purple-500/20 transition-all duration-500"
    >
        <div className="absolute top-0 right-0 p-6 flex gap-2">
            <div className="h-[1px] w-8 bg-purple-500/20" />
            <div className="h-[1px] w-2 bg-purple-500/40" />
        </div>

        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                <div className="text-[10px] font-mono text-white/40 tracking-[0.2em] mt-1">Intelligence Layer Unit</div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            {items.map((item, idx) => (
                <div key={idx} className="relative pl-6">
                    <div className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-purple-500/30" />
                    <h4 className="text-white text-sm font-bold mb-1 tracking-wide">{item.label}</h4>
                    <p className="text-white/70 text-[11px] leading-relaxed font-mono tracking-tight">{item.desc}</p>
                </div>
            ))}
        </div>
    </motion.div>
);

export default function FeaturesPage() {
    const layers = [
        {
            title: "Security Layer",
            icon: Shield,
            items: [
                { label: "Injection Mitigation", desc: "Real-time detection and neutralization of SQLi, XSS, and CSRF vectors." },
                { label: "Identity Flows", desc: "Comprehensive audit of authentication and authorization logic chains." },
                { label: "Secret Synthesis", desc: "Automated indexing of exposed environmental variables and API keys." },
                { label: "Dependency Graph", desc: "Deep-pass analysis of insecure or compromised upstream packages." },
                { label: "Encryption Enforcer", desc: "Verification of data-at-rest and data-in-transit cryptographic standards." },
                { label: "OWASP Compliance", desc: "Native alignment with Top 10 security standards and vulnerability mapping." }
            ]
        },
        {
            title: "Architecture Layer",
            icon: Layers,
            items: [
                { label: "Logic Duplication", desc: "Identification of redundant business logic and code clones across nodes." },
                { label: "Complexity Metrics", desc: "Quantifying cyclomatic complexity and cognitive load across functions." },
                { label: "Naming Protocols", desc: "Enforcement of standardized naming conventions for maintainable systems." },
                { label: "Error Gaps", desc: "Mapping of missing exception handlers and inconsistent fail-over logic." },
                { label: "Edge Case Logic", desc: "Predictive analysis of unhandled states and boundary condition failures." },
                { label: "Coverage Intelligence", desc: "Real-time tracking of test coverage gaps within critical path assets." }
            ]
        },
        {
            title: "Technical Debt Layer",
            icon: Code2,
            items: [
                { label: "Static Indicators", desc: "Detection of hard-coded values, magic numbers, and static strings." },
                { label: "Legacy Tracking", desc: "Automated identification of deprecated dependencies and API usage." },
                { label: "System TODOs", desc: "Comprehensive indexing of FIXME and TODO markers for debt resolution." },
                { label: "Performance Anti-Patterns", desc: "Detection of inefficient loop structures and blocking I/O operations." },
                { label: "Memory Hygiene", desc: "Predictive leak detection and garbage collection optimization triggers." },
                { label: "Resource Leaks", desc: "Identification of unclosed handles and dangling pointer references." }
            ]
        },
        {
            title: "AI-Specific Layer",
            icon: Brain,
            items: [
                { label: "Agent Over-Engineering", desc: "Identification of unnecessary abstractions created by multi-agent workflows." },
                { label: "Style Uniformity", desc: "Enforcement of consistent coding patterns across hybrid human-AI codebases." },
                { label: "Redundancy Filter", desc: "Removal of overlapping logic generated during multi-pass agent execution." },
                { label: "Missing Boundaries", desc: "Detection of absent safety gates and error boundaries in AI-generated modules." },
                { label: "Incomplete Triggers", desc: "Identification of partial implementations and logical hallucinations." },
                { label: "Hallucination Logic", desc: "Heuristic-based filtering for functionally invalid or unreachable AI code." }
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-black antialiased relative overflow-x-hidden">
            {/* Nav - Minimal */}
            <header className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4">
                <div className="bg-black/40 backdrop-blur-xl border border-white/[0.1] rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl shadow-2xl">
                    <Link href="/" className="flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="font-mono text-[10px] tracking-widest">Back to system</span>
                    </Link>
                    <div className="flex items-center gap-2 font-bold text-lg tracking-tighter text-white">
                        <Brain className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="w-24" /> {/* Spacer */}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.1),transparent_70%)]" />
                    <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-black to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 font-mono text-[10px] text-purple-400 tracking-[0.4em]"
                    >
                        <Binary className="h-3 w-3" />
                        System intelligence index v2.0
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85]"
                    >
                        Intelligence<br />
                        <span className="text-purple-500">Capabilities</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-white text-xs md:text-sm leading-relaxed tracking-wide max-w-2xl mx-auto"
                    >
                        CortexEDR deploys a multi-dimensional analysis engine traversing four distinct operational layers to ensure absolute codebase integrity.
                    </motion.p>
                </div>
            </section>

            {/* Intelligence Layers Grid */}
            <section className="py-32 relative">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 max-w-6xl mx-auto">
                        {layers.map((layer, idx) => (
                            <FeatureLayer key={idx} {...layer} delay={idx * 0.1} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Advanced Tool Integrations */}
            <section className="py-32 bg-white/5 border-y border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-none">
                                    Advanced Tool<br />
                                    <span className="text-blue-500">Synchronization</span>
                                </h2>
                                <p className="text-white text-xs leading-relaxed tracking-wide mb-12">
                                    Cortex doesn't just work alone. It orchestrates and synthesizes data from the world's leading security infrastructures, providing a unified intelligence feed.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { name: "Snyk core", status: "Ready" },
                                        { name: "Sonar engine", status: "Ready" },
                                        { name: "Vuln scanner", status: "Active" },
                                        { name: "PortSwigger", status: "Active" }
                                    ].map((tool, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-black border border-white/10 flex items-center justify-between">
                                            <span className="text-[10px] font-mono text-white tracking-widest font-bold">{tool.name}</span>
                                            <span className="text-[9px] font-mono text-green-500 animate-pulse">{tool.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-3xl" />
                                <div className="relative p-8 rounded-3xl bg-black border border-blue-500/20 backdrop-blur-xl">
                                    <div className="flex items-center gap-3 mb-8">
                                        <Activity className="h-5 w-5 text-blue-500" />
                                        <span className="text-[10px] font-mono text-blue-400 tracking-[0.3em] font-bold">Synchronized Data Hub</span>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { tool: "Snyk", msg: "Cross-referencing CVE-2024-512... [Matched]" },
                                            { tool: "SonarQube", msg: "Cyclomatic complexity delta analysis: +4.2%" },
                                            { tool: "System", msg: "Neural-AST mapping synchronized with core" }
                                        ].map((log, i) => (
                                            <div key={i} className="font-mono text-[10px] tracking-tight">
                                                <span className="text-blue-500 mr-2 font-bold">[{log.tool}]</span>
                                                <span className="text-white tracking-tight">{log.msg}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div className="h-1 w-24 bg-blue-500/20 rounded-full overflow-hidden">
                                            <motion.div
                                                animate={{ x: ["-100%", "100%"] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="h-full w-full bg-blue-500"
                                            />
                                        </div>
                                        <span className="text-[9px] font-mono text-white/40">Encrypt channel: AES_256</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-48 relative">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tight uppercase">Ready to secure your <span className="text-purple-500">legacy?</span></h2>
                    <Link href="/login">
                        <button className="px-12 py-5 bg-white text-black font-mono text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300">
                            Initialize connection
                        </button>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}

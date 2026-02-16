"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Check,
    X,
    Brain,
    Zap,
    Server,
    Shield,
    Activity,
    Database,
    ArrowLeft,
    Binary,
    ChevronRight
} from "lucide-react";
import { Footer } from "@/components/landing/footer";

const pricingTiers = [
    {
        name: "Scout",
        id: "scout",
        price: "$0",
        period: "per month",
        desc: "Essential reconnaissance node for public repo auditing.",
        icon: Binary,
        cta: "Initiate system",
        color: "neutral"
    },
    {
        name: "Sentinel",
        id: "sentinel",
        price: "$9",
        period: "per month",
        desc: "Advanced security unit for professional auditors.",
        icon: Zap,
        cta: "Activate node",
        color: "purple",
        popular: true
    },
    {
        name: "Guardian",
        id: "guardian",
        price: "$29",
        period: "per month",
        desc: "High-capacity cluster for serious engineering operations.",
        icon: Server,
        cta: "Connect cluster",
        color: "blue"
    },
    {
        name: "Fortress",
        id: "fortress",
        price: "Custom",
        period: "Contact sales",
        desc: "Enterprise-grade isolation and custom scaling protocols.",
        icon: Shield,
        cta: "Inquire access",
        color: "white"
    }
];

const comparisonData = [
    {
        category: "Intelligence & Analysis",
        features: [
            { name: "Repo URL scan protocol", scout: true, sentinel: true, guardian: true },
            { name: "Overall security score (1-100)", scout: true, sentinel: true, guardian: true },
            { name: "Issue categorization", scout: true, sentinel: true, guardian: true },
            { name: "File + line number detection", scout: true, sentinel: true, guardian: true },
            { name: "Detailed issue explanations", scout: false, sentinel: true, guardian: true },
            { name: "Fix suggestions with code", scout: false, sentinel: true, guardian: true },
            { name: "Execution-ready AI prompts", scout: false, sentinel: true, guardian: true },
            { name: "Severity prioritization", scout: false, sentinel: true, guardian: true },
            { name: "AI hallucination logic", scout: false, sentinel: "Basic", guardian: "Full" },
        ]
    },
    {
        category: "Operational Capacity",
        features: [
            { name: "Monthly scan limit", scout: "1", sentinel: "10", guardian: "Unlimited" },
            { name: "Repository limit", scout: "1 (5k lines)", sentinel: "3 (50k lines)", guardian: "10 (200k lines)" },
            { name: "PDF report manifest", scout: false, sentinel: true, guardian: true },
            { name: "Scan history retention", scout: "7 Days", sentinel: "30 Days", guardian: "Forever" },
            { name: "Processing priority", scout: "Standard", sentinel: "High", guardian: "Fast-track" },
        ]
    },
    {
        category: "Ecosystem & Support",
        features: [
            { name: "Email notifications", scout: false, sentinel: true, guardian: true },
            { name: "Delta tracking (Scan vs Scan)", scout: false, sentinel: true, guardian: true },
            { name: "Dependency CVE tracking", scout: false, sentinel: false, guardian: true },
            { name: "Shareable report links", scout: false, sentinel: false, guardian: true },
            { name: "Team access", scout: false, sentinel: false, guardian: "3 Seats" },
            { name: "Support response time", scout: "Best-effort", sentinel: "48h", guardian: "24h Priority" },
        ]
    }
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-black antialiased relative overflow-x-hidden">
            {/* Header / Nav */}
            <header className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4">
                <div className="bg-black/40 backdrop-blur-xl border border-white/[0.1] rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl shadow-2xl">
                    <Link href="/" className="flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="font-mono text-[10px] tracking-widest">Back to system</span>
                    </Link>
                    <div className="flex items-center gap-2 font-bold text-lg tracking-tighter text-white">
                        <Brain className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="w-24" />
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-48 pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_70%)]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 font-mono text-[10px] text-blue-400 tracking-[0.4em]"
                    >
                        Tier configuration module
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85]"
                    >
                        Pricing<br />
                        <span className="text-blue-500">Transparency</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-white text-xs md:text-sm leading-relaxed tracking-wide max-w-2xl mx-auto font-mono"
                    >
                        Choose the operational capacity that aligns with your intelligence requirements. Full transparency for total peace of mind.
                    </motion.p>
                </div>
            </section>

            {/* Pricing Cards Overview */}
            <section className="pb-32 container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {pricingTiers.map((tier, idx) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 + 0.4 }}
                            className={`p-8 rounded-[2rem] border relative overflow-hidden flex flex-col ${tier.popular
                                ? 'bg-black border-purple-500/50 shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)]'
                                : 'bg-black border-white/10'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 right-0 p-6">
                                    <div className="px-3 py-1 bg-purple-500 text-black text-[9px] font-black tracking-widest rounded-sm">Recommended</div>
                                </div>
                            )}

                            <div className="mb-12">
                                <tier.icon className={`h-8 w-8 mb-6 ${tier.color === 'purple' ? 'text-purple-500' : tier.color === 'blue' ? 'text-blue-500' : 'text-white'}`} />
                                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                                <p className="text-white/50 text-xs font-mono tracking-tight leading-relaxed">{tier.desc}</p>
                            </div>

                            <div className="mb-12">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white tracking-tighter">{tier.price}</span>
                                    {tier.id !== 'fortress' && <span className="text-white/40 text-[10px] font-mono">{tier.period}</span>}
                                </div>
                            </div>

                            <button className={`w-full py-5 rounded-2xl font-black font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 group mt-auto ${tier.popular
                                ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                                : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black'
                                }`}>
                                {tier.cta}
                                <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-32 border-t border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-20 text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Complete comparison index</h2>
                            <p className="text-white/40 font-mono text-sm tracking-[0.2em]">Operational capability detailed breakdown</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-10 px-8 text-left text-white font-black text-base tracking-widest w-1/4">Features list</th>
                                        <th className="py-10 px-8 text-center text-white/50 font-bold text-sm tracking-widest">Scout</th>
                                        <th className="py-10 px-8 text-center text-purple-400 font-bold text-sm tracking-widest">Sentinel</th>
                                        <th className="py-10 px-8 text-center text-blue-400 font-bold text-sm tracking-widest">Guardian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((section, sIdx) => (
                                        <React.Fragment key={sIdx}>
                                            <tr className="bg-white/5">
                                                <td colSpan={4} className="py-5 px-8 text-[11px] font-mono text-white/40 tracking-[0.4em] font-black border-b border-white/5">
                                                    {section.category}
                                                </td>
                                            </tr>
                                            {section.features.map((feature: any, fIdx) => (
                                                <tr key={fIdx} className="border-b border-white/5 group hover:bg-white/[0.03] transition-colors">
                                                    <td className="py-8 px-8 text-white text-base font-medium tracking-tight">{feature.name}</td>
                                                    <td className="py-8 px-8 text-center">
                                                        {typeof feature.scout === 'boolean' ? (
                                                            feature.scout ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-white/10 mx-auto" />
                                                        ) : (
                                                            <span className="text-white/60 font-mono text-sm">{feature.scout}</span>
                                                        )}
                                                    </td>
                                                    <td className="py-8 px-8 text-center">
                                                        {typeof feature.sentinel === 'boolean' ? (
                                                            feature.sentinel ? <Check className="h-5 w-5 text-purple-500 mx-auto" /> : <X className="h-5 w-5 text-white/10 mx-auto" />
                                                        ) : (
                                                            <span className="text-purple-400 font-mono text-sm">{feature.sentinel}</span>
                                                        )}
                                                    </td>
                                                    <td className="py-8 px-8 text-center">
                                                        {typeof feature.guardian === 'boolean' ? (
                                                            feature.guardian ? <Check className="h-5 w-5 text-blue-500 mx-auto" /> : <X className="h-5 w-5 text-white/10 mx-auto" />
                                                        ) : (
                                                            <span className="text-blue-400 font-mono text-sm">{feature.guardian}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Supplemental Modules */}
            <section className="py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-10 rounded-3xl bg-black border border-white/10 group hover:border-purple-500/20 transition-all">
                                <Database className="h-10 w-10 text-purple-500 mb-8" />
                                <h3 className="text-2xl font-black text-white mb-4">Credit packs</h3>
                                <p className="text-white/60 text-sm font-mono leading-relaxed mb-8 tracking-wide">
                                    On-demand compute scaling. $2 per deep-scan module. No subscription required, zero commitment protocols.
                                </p>
                                <button className="text-[10px] font-black font-mono text-purple-500 border-b border-purple-500/50 pb-1 tracking-[0.3em] uppercase hover:text-white hover:border-white transition-all">
                                    Acquire dynamic credits
                                </button>
                            </div>

                            <div className="p-10 rounded-3xl bg-black border border-white/10 group hover:border-blue-500/20 transition-all">
                                <Shield className="h-10 w-10 text-blue-500 mb-8" />
                                <h3 className="text-2xl font-black text-white mb-4">Custom isolation</h3>
                                <p className="text-white/60 text-sm font-mono leading-relaxed mb-8 tracking-wide">
                                    Dedicated clusters, VPC deployment protocols, and custom data residency. Perfect for complex regulatory environments.
                                </p>
                                <button className="text-[10px] font-black font-mono text-blue-500 border-b border-blue-500/50 pb-1 tracking-[0.3em] uppercase hover:text-white hover:border-white transition-all">
                                    Initialize enterprise ops
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

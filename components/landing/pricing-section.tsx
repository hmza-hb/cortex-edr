"use client";
import React from "react";
import { motion } from "framer-motion";
import {
    Shield,
    Zap,
    Cpu,
    Network,
    Lock,
    Verified,
    Activity,
    Server,
    Database,
    Binary,
    Terminal as TerminalIcon,
    ChevronRight,
    ArrowUpRight,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const PricingSection = () => {
    return (
        <section id="pricing" className="py-32 bg-black relative overflow-hidden border-t border-white/5">
            {/* Background Visuals */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_70%)]" />
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Technical Alert Banner */}
                <div className="max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-[1px] rounded-xl bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                    >
                        <div className="bg-black/90 backdrop-blur-xl rounded-[11px] px-6 py-3 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <Activity className="h-4 w-4 text-purple-400 animate-pulse" />
                                <span className="text-[10px] font-mono text-purple-100/80 tracking-[0.2em] uppercase">
                                    <span className="text-purple-400 font-bold">SYSTEM_PROMO::</span> EARLY_BIRD_PROTOCOL ACTIVE
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest hidden md:block">
                                    REMAINING_ALOC: 42/100
                                </span>
                                <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-mono font-bold tracking-widest uppercase rounded">
                                    50%_MARKDOWN_APPLIED
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
                        COMPUTE <span className="text-purple-500">TIERS_</span>
                    </h2>
                    <p className="text-neutral-500 font-mono text-[10px] tracking-[0.4em] uppercase">
                        Select operational module for deep-pass core analysis
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
                    {[
                        {
                            name: "LEVEL_01::CORE",
                            price: "0",
                            originalPrice: null,
                            period: "PERMANENT",
                            description: "Entry-level node for basic telemetry",
                            icon: Binary,
                            features: [
                                "3 Deep scans / cycle",
                                "Basic AST mapping",
                                "Primary vuln detection",
                                "Standard logic check",
                                "Public repos only"
                            ],
                            cta: "INITIATE_UPVISTA",
                            popular: false
                        },
                        {
                            name: "LEVEL_02::EXECUTOR",
                            price: "9",
                            originalPrice: "19",
                            period: "CYCLE",
                            description: "Primary unit for professional auditors",
                            icon: Zap,
                            features: [
                                "25 Deep scans / cycle",
                                "Full semantic intent mapping",
                                "Vulnerability flow tracking",
                                "Private repo access",
                                "High-priority execution",
                                "JSON/PDF report exports",
                                "REST_API gateway"
                            ],
                            cta: "ACTIVATE_NODE",
                            popular: true
                        },
                        {
                            name: "LEVEL_03::CLUSTER",
                            price: "29",
                            originalPrice: "59",
                            period: "CYCLE",
                            description: "Distributed compute for organizations",
                            icon: Server,
                            features: [
                                "Unlimited scan capacity",
                                "Multi-agent orchestration",
                                "CI/CD pipeline hooks",
                                "Custom security protocols",
                                "Historical delta tracking",
                                "Dedicated compute node",
                                "99.9% uptime SLA",
                                "Full audit logging"
                            ],
                            cta: "CONNECT_SALES",
                            popular: false
                        }
                    ].map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`
                                relative p-8 rounded-2xl border flex flex-col group transition-all duration-500
                                ${tier.popular
                                    ? 'bg-[#080808] border-purple-500/50 shadow-[0_0_80px_-20px_rgba(168,85,247,0.3)]'
                                    : 'bg-[#050505] border-white/5 hover:border-white/10'
                                }
                            `}
                        >
                            {tier.popular && (
                                <div className="absolute -top-3 left-6 px-3 py-1 bg-purple-500 text-black text-[9px] font-mono font-black uppercase tracking-widest rounded-sm">
                                    RECOMMENDED_CORE
                                </div>
                            )}

                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                        <tier.icon className={`h-5 w-5 ${tier.popular ? 'text-purple-400' : 'text-neutral-500'}`} />
                                    </div>
                                    <div className="text-[9px] font-mono text-neutral-600 tracking-tighter uppercase whitespace-nowrap">
                                        REF_ID: CV_{0x1000 + i * 256}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-purple-400 transition-colors">
                                    {tier.name}
                                </h3>
                                <p className="text-[11px] text-neutral-600 font-mono uppercase mb-6 leading-relaxed">
                                    {tier.description}
                                </p>

                                <div className="flex items-baseline gap-2">
                                    {tier.originalPrice && (
                                        <span className="text-xl text-neutral-800 line-through font-mono">
                                            ${tier.originalPrice}
                                        </span>
                                    )}
                                    <span className="text-5xl font-black text-white tracking-tighter">
                                        ${tier.price}
                                    </span>
                                    <span className="text-neutral-600 text-[10px] font-mono uppercase ml-1">
                                        /{tier.period}
                                    </span>
                                </div>
                            </div>

                            <div className="h-[1px] w-full bg-white/5 mb-8" />

                            <ul className="space-y-3 mb-10 flex-1">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-4">
                                        <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${tier.popular ? 'bg-purple-500' : 'bg-neutral-800'}`} />
                                        <span className="text-[11px] text-neutral-400 font-mono tracking-tight leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={
                                    tier.name.includes('LEVEL_01')
                                        ? "/dashboard"
                                        : `/dashboard/billing/checkout/${tier.name.includes('LEVEL_02') ? 'developer' : 'teams'}`
                                }
                                className="block mt-auto"
                            >
                                <button className={`
                                    w-full py-4 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2
                                    ${tier.popular
                                        ? 'bg-purple-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:bg-purple-500 hover:scale-[1.02]'
                                        : 'bg-white/5 border border-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                                    }
                                `}>
                                    {tier.cta}
                                    <ChevronRight className="h-3 w-3" />
                                </button>
                            </Link>

                            <div className="mt-4 flex items-start gap-2 opacity-50">
                                <AlertCircle className="h-3 w-3 text-neutral-500 mt-0.5" />
                                <p className="text-[9px] font-mono text-neutral-600 leading-relaxed uppercase">
                                    {tier.price === "0"
                                        ? "Instant deployment following protocol initiation."
                                        : "Protocol activation finalized within 24-48 hours of verification."}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Humble Activation Note */}
                <div className="max-w-2xl mx-auto mb-32 text-center px-6">
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] leading-relaxed italic opacity-60">
                        "Your patience is valued as our engineers manually verify transaction integrity to ensure the highest security standards for your dedicated node cluster. Activation typically concludes within 24 to 48 hours."
                    </p>
                </div>

                {/* Technical Module Connectors */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl border border-white/5 bg-[#050505] group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 group-hover:border-purple-500/40 transition-colors">
                                <Database className="h-6 w-6 text-purple-500/80" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[9px] font-mono text-purple-500 mb-1 uppercase tracking-widest">Compute_on_demand</div>
                                <h3 className="text-lg font-bold text-white mb-2">CREDIT_PACKS_</h3>
                                <p className="text-[11px] text-neutral-500 font-mono mb-4 uppercase">
                                    $2 per deep-scan module. Zero protocol commitment.
                                </p>
                                <button className="text-[10px] font-mono text-white underline tracking-widest uppercase hover:text-purple-400 transition-colors">
                                    ACQUIRE_CREDITS_&gt;&gt;
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl border border-white/5 bg-[#050505] group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 group-hover:border-blue-500/40 transition-colors">
                                <Shield className="h-6 w-6 text-blue-500/80" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[9px] font-mono text-blue-500 mb-1 uppercase tracking-widest">Enterprise_integration</div>
                                <h3 className="text-lg font-bold text-white mb-2">CUSTOM_ISOLATION_</h3>
                                <p className="text-[11px] text-neutral-500 font-mono mb-4 uppercase">
                                    Dedicated clusters & VPC deployment protocols.
                                </p>
                                <button className="text-[10px] font-mono text-white underline tracking-widest uppercase hover:text-blue-400 transition-colors">
                                    CONTACT_OPS_&gt;&gt;
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Network Expansion Protocol (Referrals) */}
                <div className="max-w-6xl mx-auto">
                    <div className="relative p-12 rounded-[2rem] bg-[#030303] border border-white/5 overflow-hidden group">
                        {/* Internal Hud Elements */}
                        <div className="absolute top-0 right-0 p-6 flex gap-2">
                            <div className="h-1 w-8 bg-purple-500/20" />
                            <div className="h-1 w-4 bg-purple-500/40" />
                            <div className="h-1 w-1 bg-purple-500" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-blue-500/10 border border-blue-500/20 mb-8 font-mono text-[9px] text-blue-400 tracking-[0.2em] uppercase">
                                    <Network className="h-3 w-3" />
                                    Expansion Protocol
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9]">
                                    LEAK_THE_CORE<br />
                                    <span className="text-blue-400">REWARD NODES</span>
                                </h2>
                                <p className="text-white font-mono text-[11px] leading-relaxed uppercase tracking-widest border-l-2 border-blue-900/50 pl-6 mb-10 max-w-md">
                                    Invite other developers to the Cortex network. Successful node activation triggers automated reward allocation to your account.
                                </p>
                                <button className="group relative px-8 py-4 bg-blue-600 text-white rounded-lg font-mono text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-blue-500">
                                    <span className="relative z-10 flex items-center gap-2">
                                        GET REFERRAL LINK
                                        <ArrowUpRight className="h-4 w-4" />
                                    </span>
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {[
                                    {
                                        level: "MOD_01",
                                        target: "02 ENTITIES",
                                        reward: "05 FREE SCANS",
                                        desc: "Initial network validation payload",
                                        progress: 40
                                    },
                                    {
                                        level: "MOD_02",
                                        target: "05 ENTITIES",
                                        reward: "10 SCANS + 05 PRIVATE NODES",
                                        desc: "Advanced infrastructure access",
                                        progress: 15
                                    },
                                    {
                                        level: "MOD_03",
                                        target: "10 ENTITIES",
                                        reward: "PRO PLAN UNLOCKED (30D)",
                                        desc: "Full operational capacity permit",
                                        progress: 0
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-6 rounded-xl border border-white/5 bg-black/40 hover:bg-black/60 transition-colors relative">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="text-[10px] font-mono text-blue-400/60 uppercase mb-2">TARGET: {item.target}</div>
                                                <div className="text-sm font-black text-white uppercase tracking-tight mb-1">{item.reward}</div>
                                                <div className="text-[9px] font-mono text-neutral-400 uppercase">{item.desc}</div>
                                            </div>
                                            <div className="text-[9px] font-mono text-blue-500/50">{item.level}</div>
                                        </div>
                                        <div className="h-[2px] w-full bg-neutral-900 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${item.progress}%` }}
                                                transition={{ duration: 1, delay: idx * 0.2 }}
                                                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

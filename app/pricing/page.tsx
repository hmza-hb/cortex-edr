"use client";

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
    CheckCircle2, 
    Zap, 
    Shield, 
    ArrowRight, 
    Sparkles, 
    HelpCircle, 
    Lock,
    ArrowLeft,
    Clock,
    Scale,
    Building2,
    Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PricingPage() {
    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;

    const plans = [
        {
            id: "scout",
            name: "Scout",
            price: "$0",
            tagline: "Essential codebase scanning",
            badge: "Free",
            offer: "Free Forever",
            features: [
                "20 Free Scans / month",
                "Unlimited files & lines per scan",
                "Basic AI security analysis",
                "Standard community support",
                "Watermarked audit reports"
            ],
            cta: isLoggedIn ? "Go to Dashboard" : "Get Started Free",
            href: isLoggedIn ? "/dashboard" : "/auth?callbackUrl=/dashboard",
            popular: false
        },
        {
            id: "sentinel",
            name: "Sentinel",
            price: "$9",
            originalPrice: "$9/mo",
            tagline: "For professional developers",
            badge: "Free for next 3 months",
            offer: "3 Months Trial • $0 now",
            features: [
                "20 Deep AI Scans / month",
                "Unlimited files & lines",
                "Detailed logic analysis & fixes",
                "Priority AI model routing",
                "Watermark-free PDF reports"
            ],
            cta: isLoggedIn ? "Upgrade to Sentinel" : "Start 3 Months Trial",
            href: isLoggedIn ? "/dashboard/billing" : "/auth?callbackUrl=/dashboard/billing",
            popular: true
        },
        {
            id: "guardian",
            name: "Guardian",
            price: "$49",
            originalPrice: "$49/mo",
            tagline: "For scaling security teams",
            badge: "Free for next 3 months",
            offer: "3 Months Trial • $0 now",
            features: [
                "100 Deep AI Scans / month",
                "Up to 5 team seats included",
                "Enterprise security rule checks",
                "API access for CI/CD pipelines",
                "1,000 API calls / month"
            ],
            cta: isLoggedIn ? "Upgrade to Guardian" : "Start Team Trial",
            href: isLoggedIn ? "/dashboard/billing" : "/auth?callbackUrl=/dashboard/billing",
            popular: false
        },
        {
            id: "fortress",
            name: "Fortress",
            price: "$299",
            originalPrice: "$299/mo",
            tagline: "For global infrastructure",
            badge: "Free for next 3 months",
            offer: "3 Months Trial • $0 now",
            features: [
                "5,000 Deep AI Scans / month",
                "Unlimited repositories & lines",
                "Military-grade compliance logs",
                "Dedicated solution architect",
                "Unlimited API integration access"
            ],
            cta: isLoggedIn ? "Upgrade to Fortress" : "Start Enterprise Trial",
            href: isLoggedIn ? "/dashboard/billing" : "/auth?callbackUrl=/dashboard/billing",
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col font-sans selection:bg-indigo-500/30">
            {/* Background glowing gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[120px] pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Navigation Header */}
            <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-zinc-900 relative z-10">
                <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
                    <div className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-all duration-300 overflow-hidden">
                        <img src="/assets/logo.png" alt="CortexEDR" className="h-6 w-6 object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                        Cortex EDR
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href={isLoggedIn ? "/dashboard" : "/auth"}>
                        <Button variant="ghost" className="text-zinc-400 hover:text-white text-sm font-medium">
                            {isLoggedIn ? "Go to Dashboard" : "Sign In"}
                        </Button>
                    </Link>
                    {!isLoggedIn && (
                        <Link href="/auth">
                            <Button className="bg-white text-black hover:bg-zinc-200 text-sm font-bold px-4 h-9 rounded-lg">
                                Get Started
                            </Button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Pricing Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 lg:py-20 relative z-10 flex flex-col justify-center">
                
                {/* Header text */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                        <Sparkles className="h-3.5 w-3.5" />
                        Special Launch Offer
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                        Security audit pipelines, <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Free for the next 3 months.
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto font-medium">
                        Try any pro tier entirely free for your first 3 months. Change or cancel at any time. Get 20 free scans per month on the basic tier.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={cn(
                                "rounded-2xl border flex flex-col justify-between p-6 relative transition-all duration-300",
                                plan.popular 
                                    ? "bg-zinc-950/80 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.1)]" 
                                    : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-[10px] font-black uppercase tracking-wider shadow-lg">
                                    Recommended
                                </div>
                            )}

                            <div className="space-y-5">
                                {/* Plan Header */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-white tracking-tight">{plan.name}</h3>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                                            plan.id === 'scout' 
                                                ? "bg-zinc-800 text-zinc-400 border border-zinc-700" 
                                                : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                        )}>
                                            {plan.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">{plan.tagline}</p>
                                </div>

                                {/* Plan Price */}
                                <div className="pt-2">
                                    <div className="flex items-baseline gap-1.5">
                                        {plan.id === 'scout' ? (
                                            <span className="text-3xl font-black tracking-tight text-white">$0</span>
                                        ) : (
                                            <>
                                                <span className="text-3xl font-black tracking-tight text-white">$0</span>
                                                <span className="text-sm text-zinc-500 font-semibold line-through">{plan.originalPrice}</span>
                                            </>
                                        )}
                                        {plan.id !== 'scout' && (
                                            <span className="text-xs text-zinc-500 font-medium ml-1">for 3 months</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {plan.offer}
                                    </p>
                                </div>

                                <div className="h-px bg-zinc-900" />

                                {/* Plan Features */}
                                <ul className="space-y-3.5">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-[11px] text-zinc-400 font-medium leading-relaxed">
                                            <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Plan CTA */}
                            <div className="pt-8">
                                <Link href={plan.href} className="block">
                                    <Button
                                        className={cn(
                                            "w-full h-10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                                            plan.popular 
                                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 shadow-md"
                                                : plan.id === 'scout'
                                                    ? "bg-transparent border border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                                                    : "bg-zinc-900 text-zinc-200 hover:bg-zinc-800 border border-zinc-800"
                                        )}
                                    >
                                        {plan.cta}
                                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ section or Trust banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-zinc-900 mt-8 text-center md:text-left">
                    <div className="space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto md:mx-0">
                            <Lock className="h-5 w-5 text-indigo-400" />
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-tight uppercase">Secure checkout</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto md:mx-0">
                            All transaction routing and recurring billing management is compliance-validated by our Merchant of Record.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto md:mx-0">
                            <Scale className="h-5 w-5 text-indigo-400" />
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-tight uppercase">Cancel Any Time</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto md:mx-0">
                            No commitment required. Cancel trial subscriptions at any point with a single click in your billing dashboard.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto md:mx-0">
                            <Building2 className="h-5 w-5 text-indigo-400" />
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-tight uppercase">Enterprise Grade</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto md:mx-0">
                            Need specific self-hosted options or customized auditing agreements? Contact our team for bespoke enterprise deployments.
                        </p>
                    </div>
                </div>

            </main>

            {/* Simple Footer */}
            <footer className="py-6 border-t border-zinc-900 bg-zinc-950/20 text-center relative z-10">
                <p className="text-[10px] text-zinc-600 font-semibold tracking-wider uppercase">
                    © {new Date().getFullYear()} Cortex EDR Inc. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

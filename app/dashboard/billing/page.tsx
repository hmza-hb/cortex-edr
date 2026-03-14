"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
    Zap,
    Shield,
    CheckCircle2,
    ArrowUpRight,
    Loader2,
    Target,
    Activity,
    Lock,
    Scale,
    CreditCard,
    ChevronRight,
    Download,
    History
} from 'lucide-react';
import { SYSTEM_CONFIG, TierId } from '@/lib/config/system';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { useSession } from "next-auth/react";

export default function BillingPage() {
    const { data: session, status } = useSession();
    const isLoaded = status !== "loading";
    const user = session?.user;
    const [profile, setProfile] = React.useState<any>(null);
    const [invoices, setInvoices] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const supabase = createClient();

    React.useEffect(() => {
        const fetchData = async () => {
            if (isLoaded && user) {
                // Fetch Profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', (user as any).id)
                    .single();
                setProfile(profileData);

                // Fetch Invoices
                const { data: invoiceData } = await supabase
                    .from('billing_invoices')
                    .select('*')
                    .eq('user_id', (user as any).id)
                    .order('created_at', { ascending: false });
                setInvoices(invoiceData || []);
            }
            if (isLoaded) setLoading(false);
        };
        fetchData();
    }, [isLoaded, user]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
            </div>
        );
    }

    const currentTierId = (profile?.plan_tier?.toUpperCase() || "VIBE_CODER") as TierId;
    const tierConfig = SYSTEM_CONFIG.tiers[currentTierId];

    const plans = [
        {
            id: TierId.DEVELOPER,
            name: "Sentinel",
            tagline: "For professional developers",
            price: "$9",
            features: ["20 Deep Scans / month", "Detailed logic analysis", "Priority AI routing"],
            cta: "Get Sentinel"
        },
        {
            id: TierId.TEAMS,
            name: "Guardian",
            tagline: "For scaling teams",
            price: "$49",
            popular: true,
            features: ["100 Deep Scans / month", "5 team seats", "Enterprise security checks"],
            cta: "Get Guardian"
        },
        {
            id: TierId.ENTERPRISE,
            name: "Fortress",
            tagline: "For global infrastructure",
            price: "$299",
            features: ["5,000 Deep Scans / month", "Military-grade compliance", "Dedicated support"],
            cta: "Get Fortress"
        }
    ];

    // Helper to calculate next invoice date
    const getNextInvoiceDate = (paymentDate: string | null, cycle: string | null) => {
        if (!paymentDate) return "N/A";
        const date = new Date(paymentDate);
        if (cycle === 'annual') {
            date.setFullYear(date.getFullYear() + 1);
        } else {
            date.setMonth(date.getMonth() + 1);
        }
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 lg:pt-16 space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">Usage & Billing</h1>
                <p className="text-sm text-zinc-500 font-medium">Manage your subscription, usage limits, and financial history.</p>
            </div>

            {/* Current Plan Overview */}
            <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Subscription</label>
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="capitalize">{profile?.plan_tier?.replace('_', ' ')}</span>
                                <span className={cn(
                                    "px-2 py-0.5 text-[10px] font-black uppercase rounded-full border",
                                    profile?.payment_status === 'paid'
                                        ? "bg-green-500/10 border-green-500/20 text-green-500"
                                        : "bg-zinc-500/10 border-zinc-500/20 text-zinc-500"
                                )}>
                                    {profile?.payment_status || 'Inactive'}
                                </span>
                            </h2>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Billing Period</p>
                                <p className="text-sm text-zinc-300 font-medium capitalize">{profile?.billing_cycle || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Next Invoice</p>
                                <p className="text-sm text-zinc-300 font-medium">
                                    {getNextInvoiceDate(profile?.payment_date, profile?.billing_cycle)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px md:h-20 w-full md:w-px bg-zinc-800" />

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-zinc-500">Scan Usage</span>
                            <span className="text-white">
                                {profile?.scans_remaining || 0} / {tierConfig.limits.maxScansPerMonth === "Unlimited" ? "∞" : tierConfig.limits.maxScansPerMonth} Remaining
                            </span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                    width: tierConfig.limits.maxScansPerMonth === "Unlimited"
                                        ? "100%"
                                        : `${Math.min(100, ((profile?.scans_remaining || 0) / (tierConfig.limits.maxScansPerMonth as number)) * 100)}%`
                                }}
                                className="h-full bg-white transition-all duration-1000"
                            />
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium">Usage resets on your next billing cycle.</p>
                    </div>
                </div>

                <div className="px-8 py-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        Subscription ID: <span className="text-zinc-400">{profile?.subscription_id || 'NOT_CONNECTED'}</span>
                    </p>
                    {profile?.subscription_id && (
                        <button className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
                            Cancel Subscription
                            <ChevronRight className="h-3 w-3" />
                        </button>
                    )}
                </div>
            </section>

            {/* Plans List */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Available Upgrades</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                        <Lock className="h-3 w-3" />
                        SECURE CHECKOUT
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const isCurrent = currentTierId === plan.id;

                        return (
                            <div
                                key={plan.id}
                                className={cn(
                                    "p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300",
                                    plan.popular ? "bg-white/[0.03] border-white/20" : "bg-transparent border-zinc-800"
                                )}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-bold text-white tracking-tight">{plan.name}</h4>
                                        {plan.popular && (
                                            <span className="text-[8px] font-black bg-white text-black px-2 py-0.5 rounded-full uppercase tracking-widest">Recommended</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-500 font-medium">{plan.tagline}</p>
                                </div>

                                <div className="text-3xl font-bold text-white tracking-tighter">
                                    {plan.price}
                                    <span className="text-sm text-zinc-500 font-medium tracking-normal ml-1">/mo</span>
                                </div>

                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[11px] text-zinc-400 font-medium">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link href={`/dashboard/billing/checkout/${plan.id.toLowerCase()}`} className="block">
                                    <Button
                                        disabled={isCurrent}
                                        className={cn(
                                            "w-full h-11 mt-8 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                                            isCurrent
                                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                                                : plan.popular
                                                    ? "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                                    : "bg-transparent border border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                                        )}
                                    >
                                        {isCurrent ? "Current Plan" : plan.cta}
                                    </Button>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Invoices */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <History className="h-4 w-4 text-zinc-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Invoices</h3>
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
                    {invoices.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Service</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {invoices.map((inv, i) => (
                                    <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-4 text-xs font-medium text-zinc-300">
                                            {new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-white italic">{inv.billing_reason || 'Subscription Renewal'}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-white">{inv.currency === 'USD' ? '$' : inv.currency}{inv.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-0.5 text-[10px] font-black uppercase rounded-full border",
                                                inv.status === 'paid'
                                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                    : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                            )}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {inv.pdf_url ? (
                                                <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer" className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 transition-all">
                                                    <Download className="h-3.5 w-3.5" />
                                                </a>
                                            ) : (
                                                <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-500/30 cursor-not-allowed">
                                                    <Download className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-xs text-zinc-500 font-medium tracking-widest uppercase">No invoice records found in your account history.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom Note */}
            <div className="pt-12 flex flex-col items-center gap-6 border-t border-zinc-900">
                <div className="flex items-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    <img src="https://paddle.com/assets/images/paddle-logo-white.svg" alt="Paddle" className="h-5" />
                    <div className="h-4 w-px bg-zinc-800" />
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Scale className="h-4 w-4" />
                        PCI DSS COMPLIANT
                    </div>
                </div>
                <p className="max-w-md text-center text-[10px] text-zinc-600 font-medium leading-relaxed uppercase tracking-widest">
                    All payment processing is handled securely by Paddle, our Merchant of Record.
                    <br />
                    Taxes calculated based on your jurisdiction.
                </p>
            </div>
        </div>
    );
}

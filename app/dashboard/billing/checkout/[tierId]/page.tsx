"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft,
    CreditCard,
    Shield,
    CheckCircle2,
    Upload,
    AlertCircle,
    Info,
    Building2,
    Smartphone,
    Globe,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { SYSTEM_CONFIG, TierId } from '@/lib/config/system';
import { useSession } from "next-auth/react";
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { submitManualPayment } from '@/app/actions/checkout';

const PAYMENT_METHODS = [
    {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        icon: Building2,
        details: [
            { label: 'Bank Name', value: 'National Bank of Cortex' },
            { label: 'Account Title', value: 'CORTEX EDR PVT LTD' },
            { label: 'Account Number', value: '1234-5678-9012-3456' },
            { label: 'Swift/BIC', value: 'CTXBNKPK' }
        ]
    },
    {
        id: 'jazzcash',
        name: 'JazzCash / EasyPaisa',
        icon: Smartphone,
        details: [
            { label: 'Account Number', value: '0300-1234567' },
            { label: 'Account Title', value: 'Hamza Hafeez' },
            { label: 'Procedure', value: 'Send as "Money Transfer" and save the SMS screenshot.' }
        ]
    },
    {
        id: 'western_union',
        name: 'Western Union',
        icon: Globe,
        details: [
            { label: 'Full Name', value: 'Hamza Hafeez' },
            { label: 'Country', value: 'Pakistan' },
            { label: 'Requirement', value: 'Share the 10-digit MTCN number in the transaction ID field.' }
        ]
    }
];

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const isLoaded = status !== "loading";
    const user = session?.user;
    const supabase = createClient();

    const tierId = (params.tierId as string)?.toUpperCase() as TierId;
    const tierConfig = SYSTEM_CONFIG.tiers[tierId];

    const [selectedMethod, setSelectedMethod] = React.useState(PAYMENT_METHODS[0].id);
    const [amount, setAmount] = React.useState(tierConfig?.priceMonthly?.toString() || '0');
    const [transactionId, setTransactionId] = React.useState('');
    const [file, setFile] = React.useState<File | null>(null);
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    if (!isLoaded) return null;
    if (!tierConfig) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <AlertCircle className="h-12 w-12 text-zinc-500" />
                <h2 className="text-xl font-bold text-white">Invalid Plan Selected</h2>
                <Link href="/dashboard/billing">
                    <Button variant="outline">Back to Billing</Button>
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        setError(null);

        try {
            let proof_url = null;

            // Upload proof if selected
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${(user as any).id}-${Math.random()}.${fileExt}`;
                const filePath = `payment_proofs/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('billing_assets')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('billing_assets')
                    .getPublicUrl(filePath);

                proof_url = publicUrl;
            }

            // Trigger Server Action (Includes DB logging + Dual Emails)
            const result = await submitManualPayment({
                userId: (user as any).id,
                userEmail: user.email || '',
                userName: user.name || 'User',
                tierId: tierId,
                amount: parseFloat(amount),
                paymentMethod: selectedMethod,
                proofUrl: proof_url,
                transactionId: transactionId
            });

            if (!result.success) throw new Error(result.error);

            router.push('/dashboard/billing?success=checkout_submitted');
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to submit request. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
            <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest mb-8"
            >
                <ChevronLeft className="h-3 w-3" />
                Back to Billing
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Side: Plan Info & Instructions */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-white tracking-tighter">
                            Upgrade to <span className="text-zinc-400 capitalize">{tierConfig.name}</span>
                        </h1>
                        <p className="text-zinc-500 text-sm font-medium">Complete your payment manually to activate your new tier.</p>
                    </div>

                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-6">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total to Pay</span>
                            <span className="text-2xl font-black text-white tracking-tighter">${tierConfig.priceMonthly}</span>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Info className="h-3 w-3 text-zinc-500" />
                                Payment Instructions
                            </h3>

                            <div className="grid grid-cols-3 gap-3">
                                {PAYMENT_METHODS.map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2",
                                            selectedMethod === method.id
                                                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                                : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                                        )}
                                    >
                                        <method.icon className="h-5 w-5" />
                                        <span className="text-[8px] font-black uppercase text-center leading-tight">{method.name.replace(' / EasyPaisa', '')}</span>
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedMethod}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="p-5 bg-black/40 rounded-xl space-y-4 border border-zinc-800/50"
                                >
                                    {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.details.map((detail, i) => (
                                        <div key={i} className="flex flex-col">
                                            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{detail.label}</span>
                                            <span className="text-xs font-bold text-zinc-300 break-all">{detail.value}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl text-zinc-500">
                        <Shield className="h-4 w-4 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Activation Protocol</p>
                            <p className="text-[10px] font-medium leading-relaxed">
                                Once submitted, our team will manually verify your transaction integrity. Please allow **24-48 hours** for protocol activation. Your patience is valued as we ensure the highest security standards for your dedicated node cluster.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Submission Form */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-white tracking-tight">Submit Proof</h2>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Attach your payment receipt or enter transaction details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Amount Paid (USD)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                                    placeholder="e.g. 49"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Transaction ID / Reference</label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                                    placeholder="MTCN, ID, or Reference Name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Upload Receipt (Optional)</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept="image/*,.pdf"
                                    />
                                    <div className={cn(
                                        "w-full bg-black/40 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all",
                                        file ? "border-white/40 bg-white/5" : "border-zinc-800 group-hover:border-zinc-700"
                                    )}>
                                        <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center">
                                            <Upload className="h-4 w-4 text-zinc-500" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">
                                                {file ? file.name : "Choose File"}
                                            </p>
                                            <p className="text-[10px] text-zinc-500 font-medium">PDF, JPG, PNG up to 5MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                                <AlertCircle className="h-3 w-3" />
                                {error}
                            </div>
                        )}

                        <Button
                            disabled={submitting}
                            className="w-full h-14 bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_4px_30px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                                    Submitting Requst...
                                </>
                            ) : (
                                <>
                                    Initialize Activation
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

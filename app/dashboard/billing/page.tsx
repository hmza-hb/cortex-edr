"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
    CreditCard,
    Zap,
    Shield,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function BillingPage() {
    const [profile, setProfile] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const supabase = createClient();

    React.useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(data);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const openCustomerPortal = () => {
        // Paddle doesn't have a direct "Portal" link like Stripe, 
        // usually you provide a "Cancel/Update" button that opens Paddle.js
        // or redirect to a management URL if you use Paddle Billing's out-of-the-box portal.
        toast.info("Customer portal access initiated. Connecting to secure billing unit.");
        // Implement Paddle.js management overlay here if needed
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Subscription & Billing</h1>
                <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Management Protocol</p>
            </motion.div>

            <div className="grid gap-8">
                {/* Current Plan Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-3xl bg-neutral-900/50 border border-white/10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        {profile?.plan_tier === 'vibe_coder' ? <Zap className="h-24 w-24" /> : <Shield className="h-24 w-24" />}
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                <CreditCard className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white capitalize">{profile?.plan_tier?.replace('_', ' ')} Plan</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${profile?.subscription_status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <p className="text-xs font-mono text-white/40 uppercase tracking-widest">{profile?.subscription_status}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-end">
                            <div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-white/60">
                                        <CheckCircle2 className="h-4 w-4 text-purple-500" />
                                        <span>Unlimited intelligence scans</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/60">
                                        <CheckCircle2 className="h-4 w-4 text-purple-500" />
                                        <span>Priority security orchestration</span>
                                    </div>
                                </div>
                                <button
                                    onClick={openCustomerPortal}
                                    className="px-6 py-3 rounded-xl bg-white text-black text-xs font-black font-mono uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all flex items-center gap-2"
                                >
                                    Manage Subscription
                                    <ArrowUpRight className="h-3 w-3" />
                                </button>
                            </div>

                            {profile?.plan_tier === 'vibe_coder' && (
                                <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                                    <div className="flex gap-3">
                                        <AlertCircle className="h-5 w-5 text-purple-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-white/80 font-bold mb-1">Upgrade Available</p>
                                            <p className="text-[10px] text-white/40 leading-relaxed font-mono">Unlock advanced security units and deeper logic analysis by upgrading to the Developer Tier.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Billing History Placeholder or Paddle Link */}
                <div className="p-8 rounded-3xl bg-black border border-white/5 font-mono text-[10px] text-white/20 tracking-widest uppercase text-center py-16">
                    Historical transaction records are managed securely via Paddle
                </div>
            </div>
        </div>
    );
}

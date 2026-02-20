"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    User,
    Settings,
    Shield,
    Bell,
    Zap,
    CreditCard,
    Lock,
    Globe,
    Cpu,
    Activity,
    ChevronRight,
    Loader2,
    Slack,
    Github,
    MessageSquare,
    Save,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Tab Components (To be extracted later if they get too big) ---

const ProfileTab = ({ profile, onSave }: any) => {
    const [fullName, setFullName] = useState(profile?.full_name || "");
    const [role, setRole] = useState(profile?.role || "Lead Developer");
    const [frameworks, setFrameworks] = useState<string[]>(profile?.primary_stack?.frameworks || []);
    const [languages, setLanguages] = useState<string[]>(profile?.primary_stack?.languages || []);
    const [isSaving, setIsSaving] = useState(false);

    const toggleItem = (item: string, list: string[], setList: Function) => {
        setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
    };

    const handleSave = async () => {
        setIsSaving(true);
        await onSave({
            full_name: fullName,
            role: role,
            primary_stack: {
                ...profile?.primary_stack,
                frameworks,
                languages
            }
        });
        setIsSaving(false);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Professional Identity</h3>
                    <p className="text-sm text-white/40 mt-1 font-medium">Manage your public presence and professional details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Professional Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium appearance-none"
                        >
                            <option value="CTO">CTO</option>
                            <option value="Lead Developer">Lead Developer</option>
                            <option value="Security Engineer">Security Engineer</option>
                            <option value="Founder">Founder</option>
                            <option value="DevOps">DevOps</option>
                        </select>
                    </div>
                </div>
            </section>

            <div className="h-px bg-white/5" />

            <section className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Development Environment</h3>
                    <p className="text-sm text-white/40 mt-1 font-medium">Tailor audit intelligence to your specific technology stack.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Primary Frameworks</label>
                        <div className="flex flex-wrap gap-2">
                            {["Next.js", "React", "Vue", "Django", "Rails", "FastAPI"].map(f => (
                                <button
                                    key={f}
                                    onClick={() => toggleItem(f, frameworks, setFrameworks)}
                                    className={cn(
                                        "px-4 py-2 border rounded-lg text-xs font-bold transition-all",
                                        frameworks.includes(f)
                                            ? "bg-blue-600/20 border-blue-500/50 text-blue-400"
                                            : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-blue-500/30"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Core Languages</label>
                        <div className="flex flex-wrap gap-2">
                            {["TypeScript", "Python", "Go", "Rust", "Ruby", "Java"].map(l => (
                                <button
                                    key={l}
                                    onClick={() => toggleItem(l, languages, setLanguages)}
                                    className={cn(
                                        "px-4 py-2 border rounded-lg text-xs font-bold transition-all",
                                        languages.includes(l)
                                            ? "bg-purple-600/20 border-purple-500/50 text-purple-400"
                                            : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-purple-500/30"
                                    )}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-end pt-6">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? "Saving Configuration..." : "Apply Strategic Changes"}
                </Button>
            </div>
        </div>
    );
};

const PreferencesTab = ({ profile, onSave }: any) => {
    const [detailLevel, setDetailLevel] = useState(profile?.report_settings?.detailLevel || "Technical");
    const [preferredAI, setPreferredAI] = useState(profile?.report_settings?.preferredAI || "Cursor");
    const [notifications, setNotifications] = useState(profile?.notification_settings || {
        scanComplete: true,
        criticalIssues: true,
        weeklyDigest: false,
        monthlyReport: true
    });
    const [isSaving, setIsSaving] = useState(false);

    const toggleNotification = (key: string) => {
        setNotifications((prev: any) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await onSave({
            report_settings: { ...profile?.report_settings, detailLevel, preferredAI },
            notification_settings: notifications
        });
        setIsSaving(false);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Audit Intelligence</h3>
                    <p className="text-sm text-white/40 mt-1 font-medium">Configure how the security engine presents findings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">Detail Complexity</span>
                            <select
                                value={detailLevel}
                                onChange={(e) => setDetailLevel(e.target.value)}
                                className="bg-transparent text-[10px] font-black text-blue-400 uppercase tracking-widest focus:outline-none"
                            >
                                <option value="Executive">Executive</option>
                                <option value="Technical">Technical</option>
                                <option value="Detailed">Deep Dive</option>
                            </select>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={cn(
                                "h-full bg-blue-500 transition-all duration-500",
                                detailLevel === "Executive" ? "w-[33%]" : detailLevel === "Technical" ? "w-[66%]" : "w-full"
                            )} />
                        </div>
                        <p className="text-[10px] text-white/30 font-medium">Balanced for developers and security reviewers.</p>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">Preferred AI Tool</span>
                            <select
                                value={preferredAI}
                                onChange={(e) => setPreferredAI(e.target.value)}
                                className="bg-transparent text-[10px] font-black text-purple-400 uppercase tracking-widest focus:outline-none text-right"
                            >
                                <option value="Cursor">Cursor</option>
                                <option value="ChatGPT">ChatGPT</option>
                                <option value="Claude">Claude</option>
                                <option value="All">Unified</option>
                            </select>
                        </div>
                        <p className="text-[10px] text-white/30 font-medium leading-relaxed">Fix prompts will be optimized for seamless integration with your chosen IDE or assistant.</p>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Notification Channels</h3>
                    <p className="text-sm text-white/40 mt-1 font-medium">Stay synchronized with your infrastructure security state.</p>
                </div>

                <div className="space-y-3">
                    {[
                        { id: "scanComplete", label: "Audit Completion", desc: "Receive alerts when a scan pipeline finishes." },
                        { id: "criticalIssues", label: "Critical Vulnerabilities", desc: "Immediate notification for High/Critical risk findings." },
                        { id: "weeklyDigest", label: "Weekly Security Pulse", desc: "A consolidated digest of your security posture improvements." },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                            <div>
                                <div className="text-sm font-bold text-white">{item.label}</div>
                                <div className="text-xs text-white/30 font-medium mt-0.5">{item.desc}</div>
                            </div>
                            <div
                                onClick={() => toggleNotification(item.id)}
                                className={cn(
                                    "w-12 h-6 rounded-full p-1 transition-colors cursor-pointer",
                                    notifications[item.id] ? "bg-blue-600" : "bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "h-4 w-4 bg-white rounded-full transition-transform",
                                    notifications[item.id] ? "translate-x-6" : "translate-x-0"
                                )} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex justify-end pt-6">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? "Saving Preferences..." : "Update Security Channels"}
                </Button>
            </div>
        </div>
    );
};

const IntegrationsTab = ({ profile, onSave }: any) => {
    const [discordWebhook, setDiscordWebhook] = useState(profile?.integrations?.discordWebhook || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveDiscord = async () => {
        if (!discordWebhook) return;
        setIsSaving(true);
        await onSave({
            integrations: { ...profile?.integrations, discordWebhook }
        });
        setIsSaving(false);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-6 group hover:border-blue-500/20 transition-all">
                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Slack className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">Slack Notifications</h4>
                        <p className="text-sm text-white/40 mt-2 font-medium leading-relaxed">
                            Streamline your dev workflow by sending audit results directly to a team channel.
                        </p>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all">
                        Connect Slack
                    </Button>
                </div>

                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-6 group hover:border-purple-500/20 transition-all">
                    <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <MessageSquare className="w-7 h-7 text-purple-400" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">Discord Webhooks</h4>
                        <p className="text-sm text-white/40 mt-2 font-medium leading-relaxed">
                            Highly configurable alerts for your private servers and developer communities.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <input
                            type="password"
                            placeholder="Paste Discord Webhook URL..."
                            value={discordWebhook}
                            onChange={(e) => setDiscordWebhook(e.target.value)}
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                        <Button
                            onClick={handleSaveDiscord}
                            disabled={isSaving}
                            className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Configure Webhook"}
                        </Button>
                    </div>
                </div>
            </section>

            <section className="p-8 bg-gradient-to-r from-blue-600/5 to-transparent border border-white/5 rounded-[32px] flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Github className="w-6 h-6 text-white/40" />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                            Advanced GitHub Synchronization
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-[0.1em]">PRO FEATURE</span>
                        </h4>
                        <p className="text-xs text-white/30 font-medium">Automatic repository scans on every push and pull request.</p>
                    </div>
                </div>
                <Button variant="ghost" className="text-xs font-bold text-blue-400 uppercase tracking-widest hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20">
                    Unlock Guardian Access
                </Button>
            </section>
        </div>
    );
};

const BillingTab = ({ profile, scansUsed, scanLimit }: any) => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 p-10 bg-[#0A0A0A] border border-white/5 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32" />

                <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
                    <div>
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">CURRENT INFRASTRUCTURE</div>
                        <h3 className="text-3xl font-extrabold text-white tracking-tight capitalize">{profile?.plan_tier || 'Free'} Plan</h3>
                        <p className="text-white/40 text-sm font-medium mt-2">Active since {new Date(profile?.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button className="h-14 px-10 bg-white text-black hover:bg-neutral-200 font-extrabold rounded-2xl transition-all shadow-xl shadow-white/5">
                        Upgrade Deployment
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white/60">Monthly Audit Consumption</span>
                        <span className="text-sm font-black text-white">{scansUsed} / {scanLimit}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
                            style={{ width: `${(scansUsed / scanLimit) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        <span>Limit Reached: {Math.round((scansUsed / scanLimit) * 100)}%</span>
                        <span>Resets in 11 Days</span>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex flex-col justify-center text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center self-center">
                    <CreditCard className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-white italic">Payment Orchestration</h4>
                    <p className="text-xs text-white/30 mt-2 font-medium">Manage invoices, payment methods, and billing cycles.</p>
                </div>
                <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all">
                    Open Billing Portal
                </Button>
            </div>
        </div>

        <section className="space-y-6">
            <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Recent Network Invoices</h3>
            <div className="space-y-3">
                {[
                    { date: "Feb 1, 2026", amount: "$9.00", status: "Paid", plan: "Sentinel" },
                    { date: "Jan 1, 2026", amount: "$9.00", status: "Paid", plan: "Sentinel" },
                ].map((inv, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white/20" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white italic">{inv.date}</div>
                                <div className="text-[10px] text-white/30 font-medium uppercase tracking-widest">{inv.plan} Deployment</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <span className="text-sm font-black text-white">{inv.amount}</span>
                            <div className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-[9px] font-black text-green-400 uppercase tracking-widest">
                                {inv.status}
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl group-hover:bg-white/5 transition-all">
                                <ExternalLink className="w-4 h-4 text-white/20" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </div>
);

// --- Main Page Component ---

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                setProfile(data);
            }
            setLoading(false);
        }
        loadProfile();
    }, []);

    const handleSave = async (updates: any) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id);

        if (!error) {
            setProfile({ ...profile, ...updates });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile & Account", icon: User },
        { id: "preferences", label: "Audit Preferences", icon: Shield },
        { id: "integrations", label: "Integrations", icon: Zap },
        { id: "billing", label: "Billing & Usage", icon: CreditCard },
    ];

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    // Logic for billing visuals
    const planTier = (profile?.plan_tier || "free") as "free" | "starter" | "professional" | "enterprise";
    const scanLimits = { free: 1, starter: 10, professional: 1000, enterprise: 5000 };
    const scanLimit = scanLimits[planTier];
    const scansRemaining = profile?.scans_remaining || 0;
    const scansUsed = Math.max(0, scanLimit - scansRemaining);

    return (
        <div className="space-y-12 max-w-[1200px] mx-auto pb-24 lg:pt-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 px-2">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">CONFIGURATION HUB</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">System Settings</h1>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest border border-white/5 bg-white/[0.02] px-4 py-2 rounded-full">
                    <span className="text-blue-400">Environment</span> US-EAST-1
                    <div className="w-[1px] h-3 bg-white/10" />
                    <span className="text-purple-400">Security</span> Level: {profile?.security_level || 'Intermediate'}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Navigation Sidebar */}
                <aside className="w-full lg:w-72 space-y-2 p-1 border-r border-white/5">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                activeTab === tab.id
                                    ? "bg-white/[0.03] border border-white/10 text-white shadow-xl"
                                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.01]"
                            )}
                        >
                            {activeTab === tab.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
                            )}
                            <tab.icon className={cn(
                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                activeTab === tab.id ? "text-blue-400" : "text-white/20"
                            )} />
                            <span className="text-sm font-bold tracking-tight">{tab.label}</span>
                            {activeTab === tab.id && (
                                <ChevronRight className="w-4 h-4 ml-auto text-white/20" />
                            )}
                        </button>
                    ))}

                    <div className="pt-10 px-5">
                        <div className="p-6 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <Lock className="w-4 h-4 text-blue-400" />
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">ENCRYPTION</span>
                            </div>
                            <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                                Account data is encrypted using military-grade AES-256 protocols.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-1 min-w-0">
                    <div className="p-2">
                        {activeTab === "profile" && <ProfileTab profile={profile} onSave={handleSave} />}
                        {activeTab === "preferences" && <PreferencesTab profile={profile} onSave={handleSave} />}
                        {activeTab === "integrations" && <IntegrationsTab profile={profile} onSave={handleSave} />}
                        {activeTab === "billing" && <BillingTab profile={profile} scansUsed={scansUsed} scanLimit={scanLimit} />}
                    </div>
                </main>

                {/* Toast Notification */}
                {showToast && (
                    <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-right-10 duration-500">
                        <div className="px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-2xl shadow-blue-500/20 flex items-center gap-4 border border-blue-400/50">
                            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                                <Shield className="w-3.5 h-3.5" />
                            </div>
                            <span>Operational parameters updated successfully.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Shield,
    Layers,
    Cpu,
    MessageSquare,
    History,
    Github,
    Eye,
    FileText,
    Activity,
    ArrowLeft,
    ChevronRight,
    CheckCircle,
    Zap,
    Brain,
    Lock,
    BarChart3,
    Users,
    Code,
    Database,
    Search,
    Settings
} from "lucide-react";
import { Footer } from "@/components/landing/footer";

const FeatureCard = ({
    icon: Icon,
    title,
    description,
    features,
    delay = 0,
    gradient = "from-indigo-500/10 to-purple-500/10",
    borderColor = "border-indigo-500/20"
}: {
    icon: any;
    title: string;
    description: string;
    features: string[];
    delay?: number;
    gradient?: string;
    borderColor?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        className={`relative p-8 rounded-2xl bg-gradient-to-br ${gradient} border ${borderColor} overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500`}
    >
        <div className="absolute top-0 right-0 p-4">
            <div className="flex gap-1">
                <div className="h-[1px] w-6 bg-purple-500/30" />
                <div className="h-[1px] w-2 bg-purple-500/50" />
            </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                <p className="text-sm text-white/70 leading-relaxed mt-1">{description}</p>
            </div>
        </div>

        <div className="space-y-3">
            {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/80 leading-relaxed">{feature}</span>
                </div>
            ))}
        </div>
    </motion.div>
);

const AgentShowcase = ({ agents, delay = 0 }: { agents: any[], delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-4">
            <Brain className="h-5 w-5 text-purple-400" />
        </div>

        <h3 className="text-xl font-bold text-white mb-6">7-Agent Orchestration System</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-4 rounded-lg bg-black/50 border border-white/5 hover:border-purple-500/30 transition-colors"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-white">{agent.name}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{agent.description}</p>
                </motion.div>
            ))}
        </div>
    </motion.div>
);

export default function FeaturesPage() {
    const mainFeatures = [
        {
            icon: Shield,
            title: "AI-Powered Security Scanning",
            description: "7-agent orchestration system for comprehensive vulnerability detection",
            features: [
                "Git Connect Agent - Repository structure analysis",
                "Reconnaissance Agent - Complete codebase mapping",
                "Security Scanner Agent - Deep vulnerability analysis",
                "Architecture Analyzer Agent - Design pattern review",
                "Code Quality Agent - Best practices validation",
                "Technical Debt Agent - TODO tracking and optimization",
                "AI-Specific Agent - AI-generated code pattern detection"
            ],
            gradient: "from-red-500/10 to-orange-500/10",
            borderColor: "border-red-500/20"
        },
        {
            icon: Eye,
            title: "Real-Time Scan Visualization",
            description: "Watch your security analysis unfold live with beautiful animations",
            features: [
                "Live agent activity monitoring",
                "File-by-file progress tracking",
                "Real-time status indicators",
                "Estimated completion times",
                "Interactive progress animations",
                "Agent status and activity feeds"
            ],
            gradient: "from-blue-500/10 to-cyan-500/10",
            borderColor: "border-blue-500/20"
        },
        {
            icon: FileText,
            title: "Comprehensive Security Reports",
            description: "Detailed audit manifests with actionable insights and export capabilities",
            features: [
                "Overall security score (0-100)",
                "Risk distribution by severity levels",
                "Executive AI-generated summaries",
                "Shareable PDF exports",
                "CWE/OWASP vulnerability mappings",
                "Copy-paste fix prompts for IDEs"
            ],
            gradient: "from-green-500/10 to-emerald-500/10",
            borderColor: "border-green-500/20"
        },
        {
            icon: MessageSquare,
            title: "Cortex Chat (AI Security Advisor)",
            description: "Intelligent codebase-aware conversations with your security expert",
            features: [
                "Complete codebase awareness after scanning",
                "Detailed vulnerability explanations",
                "Architectural advice and recommendations",
                "Fix prioritization guidance",
                "Business impact analysis",
                "Multi-modal context switching"
            ],
            gradient: "from-purple-500/10 to-indigo-500/10",
            borderColor: "border-purple-500/20"
        },
        {
            icon: History,
            title: "Scan History & Management",
            description: "Complete dashboard for tracking security posture over time",
            features: [
                "Chronological scan history",
                "Quick stats and score tracking",
                "Repository management",
                "Historical scan comparisons",
                "Progress trend analysis",
                "One-click report access"
            ],
            gradient: "from-yellow-500/10 to-orange-500/10",
            borderColor: "border-yellow-500/20"
        },
        {
            icon: Lock,
            title: "Authentication & User Management",
            description: "Enterprise-grade security with multiple authentication options",
            features: [
                "Email/password authentication",
                "Google OAuth integration",
                "GitHub OAuth for developers",
                "Secure session management",
                "Multi-device support",
                "Role-based access controls"
            ],
            gradient: "from-indigo-500/10 to-blue-500/10",
            borderColor: "border-indigo-500/20"
        },
        {
            icon: Github,
            title: "GitHub Integration",
            description: "Seamless repository analysis with enterprise-grade security",
            features: [
                "Direct GitHub URL scanning",
                "Automatic repository cloning",
                "Private repository support",
                "Dependency analysis",
                "Multi-language support",
                "Real-time sync capabilities"
            ],
            gradient: "from-gray-500/10 to-slate-500/10",
            borderColor: "border-gray-500/20"
        },
        {
            icon: Settings,
            title: "Professional UI/UX",
            description: "Developer-optimized interface with enterprise-grade design",
            features: [
                "Dark theme for developer comfort",
                "Fully responsive design",
                "Smooth animations and transitions",
                "Intuitive navigation",
                "Professional color palette",
                "Accessibility compliance"
            ],
            gradient: "from-pink-500/10 to-rose-500/10",
            borderColor: "border-pink-500/20"
        }
    ];

    const agents = [
        { name: "Git Connect", description: "Clones and analyzes repository structure" },
        { name: "Reconnaissance", description: "Maps entire codebase and tech stack" },
        { name: "Security Scanner", description: "Deep vulnerability analysis (SQLi, XSS, etc.)" },
        { name: "Architecture Analyzer", description: "Reviews design patterns and issues" },
        { name: "Code Quality", description: "Validates best practices and smells" },
        { name: "Technical Debt", description: "Tracks TODOs, deprecated code, duplications" },
        { name: "AI-Specific", description: "Detects AI-generated code patterns" }
    ];

    const capabilities = [
        { language: "JavaScript/TypeScript", support: "Full", features: ["ESLint rules", "Security patterns", "Performance analysis"] },
        { language: "Python", support: "Full", features: ["PEP compliance", "Security imports", "Async patterns"] },
        { language: "Go", support: "Full", features: ["Concurrency analysis", "Error handling", "Performance profiling"] },
        { language: "Java", support: "Full", features: ["Spring Boot analysis", "Security frameworks", "Code quality"] },
        { language: "Ruby", support: "Full", features: ["Rails security", "Gem analysis", "Performance monitoring"] },
        { language: "PHP", support: "Full", features: ["WordPress security", "Laravel analysis", "Composer audits"] }
    ];

    return (
        <main className="min-h-screen bg-black antialiased relative overflow-x-hidden">
            {/* Navigation Header */}
            <header className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4">
                <div className="bg-black/40 backdrop-blur-xl border border-white/[0.1] rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl shadow-2xl">
                    <Link href="/" className="flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="font-mono text-[10px] tracking-widest uppercase">Back to system</span>
                    </Link>
                    <div className="flex items-center gap-2 font-bold text-lg tracking-tighter text-white">
                        <img src="/assets/logo.png" alt="CortexEDR Logo" className="h-5 w-5" />
                        <span className="font-mono text-[11px] tracking-[0.3em] uppercase hidden md:inline">CORTEX_EDR</span>
                    </div>
                    <div className="w-24 hidden md:block" />
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.08),transparent_70%)]" />
                    <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-black to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 font-mono text-[10px] text-purple-400 tracking-[0.4em] uppercase"
                        >
                            <Shield className="h-3 w-3" />
                            Enterprise Security Platform
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85]"
                        >
                            Complete Feature<br />
                            <span className="text-purple-500">Breakdown</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-white/80 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-12"
                        >
                            Discover everything CortexEDR brings to your security arsenal. From AI-powered scanning
                            to intelligent reporting, explore the comprehensive capabilities that make us the
                            industry's most advanced security analysis platform.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/dashboard">
                                <button className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center gap-2">
                                    Start Scanning <ChevronRight className="h-4 w-4" />
                                </button>
                            </Link>
                            <Link href="/docs">
                                <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300">
                                    View Documentation
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 7-Agent Orchestration Showcase */}
            <section className="py-32 relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                                7-Agent <span className="text-purple-500">Orchestration</span>
                            </h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Our proprietary multi-agent system works together to provide comprehensive security analysis,
                                each agent specializing in different aspects of your codebase security.
                            </p>
                        </motion.div>

                        <AgentShowcase agents={agents} />
                    </div>
                </div>
            </section>

            {/* Main Features Grid */}
            <section className="py-32 bg-white/[0.02] border-y border-white/5 relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                                Core <span className="text-purple-500">Capabilities</span>
                            </h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Every feature designed with enterprise security in mind, providing comprehensive
                                protection and actionable insights for modern development teams.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {mainFeatures.map((feature, idx) => (
                                <FeatureCard key={idx} {...feature} delay={idx * 0.1} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Language Support */}
            <section className="py-32 relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                                Multi-Language <span className="text-purple-500">Support</span>
                            </h2>
                            <p className="text-white/70 text-lg">
                                Comprehensive security analysis across all major programming languages and frameworks.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {capabilities.map((lang, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-6 rounded-xl bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 border border-white/5 hover:border-purple-500/30 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white">{lang.language}</h3>
                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                            {lang.support} Support
                                        </span>
                                    </div>
                                    <ul className="space-y-2">
                                        {lang.features.map((feature, fidx) => (
                                            <li key={fidx} className="flex items-center gap-2 text-sm text-white/70">
                                                <CheckCircle className="h-3 w-3 text-green-400" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Standards */}
            <section className="py-32 bg-white/[0.02] border-y border-white/5 relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                                Security <span className="text-purple-500">Standards</span>
                            </h2>
                            <p className="text-white/70 text-lg">
                                Built with enterprise-grade security standards and compliance frameworks.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { name: "OWASP Top 10", icon: "🔒", description: "Latest security guidelines" },
                                { name: "CWE Database", icon: "📋", description: "Comprehensive vulnerability catalog" },
                                { name: "SOC 2 Type II", icon: "✅", description: "Security compliance certified" },
                                { name: "GDPR Ready", icon: "🇪🇺", description: "Privacy regulation compliant" },
                                { name: "AES-256", icon: "🔐", description: "Data encryption at rest" },
                                { name: "TLS 1.3", icon: "🔒", description: "Secure data transmission" },
                                { name: "ISO 27001", icon: "🏢", description: "Information security management" },
                                { name: "Zero Trust", icon: "🚫", description: "Never trust, always verify" }
                            ].map((standard, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    viewport={{ once: true }}
                                    className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 text-center hover:border-purple-500/30 transition-all"
                                >
                                    <div className="text-3xl mb-3">{standard.icon}</div>
                                    <h3 className="text-sm font-bold text-white mb-1">{standard.name}</h3>
                                    <p className="text-xs text-white/60">{standard.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-32 relative">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight uppercase">
                            Ready to secure your <span className="text-purple-500">codebase?</span>
                        </h2>
                        <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto">
                            Join thousands of developers and enterprises who trust CortexEDR to protect their most valuable assets.
                            Start your first security scan today and see the difference comprehensive AI-powered analysis makes.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth">
                                <button className="px-12 py-5 bg-white text-black font-bold rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center gap-2">
                                    Start Free Scan <Zap className="h-5 w-5" />
                                </button>
                            </Link>
                            <Link href="/pricing">
                                <button className="px-12 py-5 bg-transparent border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300">
                                    View Pricing
                                </button>
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Free for open source</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Enterprise support available</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

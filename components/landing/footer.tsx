"use client";
import React from "react";
import Link from "next/link";
import {
    ArrowUpRight,
} from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z" />
    </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Product",
            links: [
                { label: "Deep Scan", href: "#" },
                { label: "Security Protocol", href: "#" },
                { label: "Agent Orchestration", href: "#" },
                { label: "Pricing", href: "/pricing" },
                { label: "Enterprise", href: "#" },
            ]
        },
        {
            title: "Resources",
            links: [
                { label: "Documentation", href: "/docs" },
                { label: "API Reference", href: "#" },
                { label: "Security Audit", href: "#" },
                { label: "System Status", href: "/legal/status" },
                { label: "Community", href: "#" },
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", href: "/legal/privacy" },
                { label: "Terms of Service", href: "/legal/terms" },
                { label: "Refund Policy", href: "/legal/refund" },
                { label: "Cookie Policy", href: "/legal/cookies" },
                { label: "Compliance", href: "/legal/compliance" },
                { label: "Security Disclosure", href: "/legal/security" },
            ]
        }
    ];

    return (
        <footer className="relative bg-black border-t border-white/5 pt-24 pb-12 overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="absolute top-0 left-1/4 w-[1px] h-32 bg-gradient-to-b from-purple-500/20 to-transparent" />
            <div className="absolute top-0 right-1/4 w-[1px] h-32 bg-gradient-to-b from-blue-500/20 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <img src="/assets/logo.png" alt="Cortex EDR Logo" className="h-8 w-8" />
                            <span className="text-xl font-bold text-white tracking-tight">
                                Cortex<span className="text-purple-500">EDR</span>
                            </span>
                        </Link>
                        <p className="text-white/80 text-sm leading-relaxed max-w-sm mb-8 tracking-wide">
                            Advanced EDR platform built for deep-pass code intelligence, automated vulnerability synthesis, and neural architectural analysis.
                        </p>
                        <ul className="flex gap-4">
                            {[
                                { icon: GithubIcon, href: "#", label: "GitHub" },
                                { icon: XIcon, href: "#", label: "X" },
                                { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
                                { icon: InstagramIcon, href: "#", label: "Instagram" }
                            ].map((social, i) => (
                                <li key={i}>
                                    <Link
                                        href={social.href}
                                        aria-label={social.label}
                                        className="inline-flex p-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all duration-300"
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Navigation Columns */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-white font-bold text-sm mb-8">
                                {section.title}
                            </h3>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors"
                                        >
                                            {link.label}
                                            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Copyright/Legal Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <span className="text-white text-sm tracking-tight font-medium">
                            © {currentYear} Cortex EDR All Rights Reserved.
                        </span>
                        <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
                        <Link
                            href="https://github.com/hamza-hafeez82"
                            target="_blank"
                            className="text-xs font-mono tracking-widest text-white/40 hover:text-purple-400 transition-colors"
                        >
                            Developed By: <span className="text-white/80 font-bold">Hamza Hafeez</span>
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        <Link href="/legal/security" className="text-sm text-white/50 hover:text-white transition-colors">Security Disclosure</Link>
                        <Link href="/legal/status" className="text-sm text-white/50 hover:text-white transition-colors">Operational Status</Link>
                    </div>
                </div>
            </div>

            {/* Subtle Gradient Spotlights */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        </footer>
    );
};

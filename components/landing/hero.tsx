"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { MagicButton } from "@/components/ui/magic-button";
import { CyberGrid } from "@/components/ui/cyber-grid";
import { PixelFlipWords } from "@/components/ui/pixel-flip-words";
import { MarketingScroller } from "@/components/ui/marketing-scroller";
import { Terminal, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = ({ user }: { user: { email?: string } | null }) => {
    const words = ["Vulnerabilities", "Architecture", "Complexity", "Tech Debt", "Security"];

    return (
        <section className="min-h-screen relative flex items-center justify-center">
            <CyberGrid className="min-h-screen flex items-center justify-center">
                <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

                <div className="max-w-7xl mx-auto px-4 relative z-10 w-full pt-32 md:pt-40">
                    <div className="flex flex-col items-center justify-center text-center">

                        {/* Entrance Animation Wrap */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center"
                        >
                            {/* Status Indicator */}
                            <div className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-xs font-mono text-purple-400 mb-12 tracking-[0.2em] shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-purple-500 mr-3 animate-pulse"></span>
                                SYSTEM_INITIALIZED: SEC_PHASE_01
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white leading-[1.1] mb-8">
                                ERADICATE <br />
                                <span className="text-purple-500 min-w-[280px] md:min-w-[500px] inline-block">
                                    <PixelFlipWords words={words} className="text-purple-500" />
                                </span>
                                <br />
                                IN REAL-TIME.
                            </h1>

                            {/* Security Philosophy Text */}
                            <p className="max-w-2xl mx-auto font-mono text-xs md:text-sm text-neutral-400 leading-relaxed mb-12 px-4 uppercase tracking-[0.2em]">
                                Our philosophy: Security is not a feature, it&apos;s a foundation. <br />
                                Cortex EDR provides the intelligence to build indestructible systems. <br />
                                <span className="text-[10px] text-purple-500/50 block mt-4 tracking-[0.4em]">Engineered by Hamza Hafeez</span>
                            </p>

                            {/* Personalized Content / CTAs */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full">
                                {user ? (
                                    <div className="flex flex-col items-center gap-6 animate-fadeIn">
                                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                                            <User className="h-4 w-4 text-purple-400" />
                                            <span className="text-sm font-mono text-neutral-300">WELCOME_USER: {user.email}</span>
                                        </div>
                                        <Link href="/dashboard">
                                            <MagicButton
                                                title="ACCESS COMMAND CENTER"
                                                position="right"
                                                icon={<ChevronRight className="h-4 w-4" />}
                                                otherClasses="px-8 shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)]"
                                            />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-center gap-6 animate-fadeIn">
                                        <Link href="/auth">
                                            <MagicButton
                                                title="INITIATE PROTOCOL"
                                                position="right"
                                                icon={<Terminal className="h-4 w-4" />}
                                                otherClasses="px-10 shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)]"
                                            />
                                        </Link>
                                        <Link href="#features">
                                            <Button variant="ghost" className="text-neutral-500 hover:text-white hover:bg-white/5 font-mono text-[10px] tracking-[0.3em] uppercase px-8 border border-white/5 hover:border-purple-500/20 transition-all">
                                                SYS_CAPABILITIES
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Marketing Text */}
                            <div className="mt-16 w-full flex justify-center">
                                <MarketingScroller className="max-w-2xl" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </CyberGrid>

            {/* Hero Bottom Vignette Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent z-[5]"></div>
        </section>
    );
};

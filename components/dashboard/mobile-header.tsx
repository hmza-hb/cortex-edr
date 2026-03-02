"use client";

import React, { useState } from "react";
import { Menu, Search, HelpCircle, Link2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

interface MobileHeaderProps {
    onMenuClick: () => void;
    user: any;
}

export const MobileHeader = ({ onMenuClick, user }: MobileHeaderProps) => {
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [isConnectOpen, setIsConnectOpen] = useState(false);

    const closeAllDropdowns = () => {
        setIsSupportOpen(false);
        setIsConnectOpen(false);
    };

    return (
        <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/50">
            <div className="flex items-center justify-between px-4 h-14">
                {/* Left: Menu Button, Logo & Branding */}
                <div className="flex items-center gap-3 min-w-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMenuClick}
                        className="p-2 h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800/50 flex-shrink-0"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                            <img src="/assets/logo.png" alt="CortexEDR" className="h-5 w-5 object-contain" />
                        </div>
                        <span className="font-bold text-lg text-white truncate">CortexEDR</span>
                    </Link>
                </div>

                {/* Center: Search */}
                <div className="flex-1 max-w-xs mx-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 px-3 py-2 h-9 text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-zinc-700/50 rounded-xl"
                    >
                        <Search className="h-4 w-4" />
                        <span className="text-sm truncate">Search...</span>
                    </Button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1">
                    {/* Support Dropdown */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setIsSupportOpen(!isSupportOpen);
                                setIsConnectOpen(false);
                            }}
                            className={cn(
                                "p-2 h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                                isSupportOpen && "bg-zinc-800/50 text-white"
                            )}
                        >
                            <HelpCircle className="h-4 w-4" />
                        </Button>

                        <AnimatePresence>
                            {isSupportOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute right-0 top-full mt-2 w-56 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden z-50"
                                >
                                    <div className="p-2">
                                        <div className="px-3 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Support</div>
                                        <Link
                                            href="/support"
                                            onClick={() => setIsSupportOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200"
                                        >
                                            <HelpCircle className="h-4 w-4 text-zinc-500" />
                                            Help Center
                                        </Link>
                                        <Link
                                            href="/docs"
                                            onClick={() => setIsSupportOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200"
                                        >
                                            <HelpCircle className="h-4 w-4 text-zinc-500" />
                                            Documentation
                                        </Link>
                                        <button
                                            onClick={() => setIsSupportOpen(false)}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] text-sm text-zinc-200 text-left"
                                        >
                                            <HelpCircle className="h-4 w-4 text-zinc-500" />
                                            Contact Support
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Connect Dropdown */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setIsConnectOpen(!isConnectOpen);
                                setIsSupportOpen(false);
                            }}
                            className={cn(
                                "p-2 h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                                isConnectOpen && "bg-zinc-800/50 text-white"
                            )}
                        >
                            <Link2 className="h-4 w-4" />
                        </Button>

                        <AnimatePresence>
                            {isConnectOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute right-0 top-full mt-2 w-64 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden z-50"
                                >
                                    <div className="p-2">
                                        <div className="px-3 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Connect Integrations</div>
                                        {[
                                            { name: "GitHub", logo: "https://cdn-icons-png.flaticon.com/512/25/25231.png", color: "hover:bg-zinc-100/10" },
                                            { name: "Slack", logo: "https://cdn-icons-png.flaticon.com/512/2111/2111694.png", color: "hover:bg-[#E01E5A]/10" },
                                            { name: "Figma", logo: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png", color: "hover:bg-[#F24E1E]/10" }
                                        ].map((integration, idx) => (
                                            <motion.div
                                                key={integration.name}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + (idx * 0.05), duration: 0.3 }}
                                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] cursor-not-allowed"
                                            >
                                                <div className="w-6 h-6 flex items-center justify-center">
                                                    <img src={integration.logo} alt={integration.name} className={cn("w-5 h-5 object-contain", integration.name === "GitHub" && "filter brightness-0 invert")} />
                                                </div>
                                                <span className="text-sm text-zinc-400">{integration.name}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Account Dropdown - Clerk's UserButton */}
                    <div className="flex items-center">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-9 w-9",
                                    userButtonPopoverCard: "bg-zinc-950/95 backdrop-blur-xl border-zinc-800/80 shadow-2xl",
                                    userButtonPopoverActionButton: "hover:bg-white/[0.03] text-zinc-200",
                                    userButtonPopoverActionButtonText: "text-zinc-200",
                                    userButtonPopoverFooter: "border-zinc-800/80",
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Backdrop for closing dropdowns */}
            <AnimatePresence>
                {(isSupportOpen || isConnectOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-20"
                        onClick={closeAllDropdowns}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

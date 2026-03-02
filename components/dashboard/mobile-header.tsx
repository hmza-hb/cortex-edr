"use client";

import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MobileHeaderProps {
    onMenuClick: () => void;
    user: any;
}

export const MobileHeader = ({ onMenuClick, user }: MobileHeaderProps) => {
    return (
        <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/50">
            <div className="flex items-center justify-between px-4 h-14">
                {/* Left: Menu Button & Logo */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMenuClick}
                        className="p-2 h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                            <img src="/assets/logo.png" alt="CortexEDR" className="h-5 w-5 object-contain" />
                        </div>
                        <span className="font-bold text-lg text-white hidden sm:block">CortexEDR</span>
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Search Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    >
                        <Search className="h-4 w-4" />
                    </Button>

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800/50 relative"
                    >
                        <Bell className="h-4 w-4" />
                        {/* Notification Badge */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-zinc-950"></div>
                    </Button>

                    {/* User Avatar */}
                    <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <span className="text-xs font-semibold text-zinc-300">
                            {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

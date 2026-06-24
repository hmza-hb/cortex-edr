'use client';

import { useSession, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, Shield, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CortexUserButton() {
    const { data: session } = useSession();

    if (!session?.user) return null;

    const initials = session.user.name
        ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : session.user.email?.substring(0, 2).toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative focus:outline-none"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <Avatar className="h-9 w-9 border border-zinc-800 bg-zinc-900">
                        <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                        <AvatarFallback className="bg-zinc-950 text-white font-bold text-xs">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-zinc-950 border-zinc-800 text-zinc-400 p-2 rounded-2xl shadow-2xl" align="end" sideOffset={10}>
                <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold text-white leading-none uppercase italic tracking-tighter">
                            {session.user.name || 'Protocol User'}
                        </p>
                        <p className="text-xs leading-none text-zinc-500 font-mono">
                            {session.user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-900 mx-2" />
                <div className="p-1 space-y-1">
                    <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-zinc-900 focus:text-white cursor-pointer transition-colors">
                        <User className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Operational Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-zinc-900 focus:text-white cursor-pointer transition-colors">
                        <Settings className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Node Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-zinc-900 focus:text-white cursor-pointer transition-colors">
                        <Shield className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Security Access</span>
                    </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-zinc-900 mx-2" />
                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: 'https://cortex-edr.com' })}
                    className="flex items-center gap-3 p-3 rounded-xl focus:bg-red-950 focus:text-red-400 text-red-500 cursor-pointer transition-colors m-1"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Terminate Session</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

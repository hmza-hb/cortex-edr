import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="flex h-screen bg-[#020202] text-white overflow-hidden font-sans selection:bg-purple-500/30">
            {/* HUD Shared Sidebar */}
            <Sidebar user={user} />

            {/* Main Command Center Stage */}
            <main className="flex-1 relative overflow-y-auto overflow-x-hidden pt-6">
                {/* Top Navigation HUD Bar */}
                <div className="sticky top-0 z-50 px-8 py-4 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">SYSTEM_STATE: NOMINAL</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">AUTHORIZED_USER</span>
                            <span className="text-xs font-bold tracking-tight text-white/90">{user.email}</span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                            <span className="text-xs font-mono text-purple-400 font-bold">{user.email?.[0].toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}

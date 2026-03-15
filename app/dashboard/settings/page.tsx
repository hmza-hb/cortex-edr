import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { createClient } from "@supabase/supabase-js";
import { ProfileEditor } from "@/components/dashboard/settings/profile-editor";
import { redirect } from "next/navigation";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/auth");
    }

    // Fetch user from public.users
    const { data: user } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();

    // Fetch profile from public.profiles
    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("email", session.user.email)
        .single();

    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto">
            <ProfileEditor profile={profile} user={user} />
        </div>
    );
}

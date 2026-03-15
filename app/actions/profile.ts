'use server';

import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { revalidatePath } from 'next/cache';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function updateProfile(formData: {
    name: string;
    company: string;
    role: string;
    securityLevel: string;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { error: "Authentication required" };
    }

    try {
        const { name, company, role, securityLevel } = formData;

        // 1. Update public.users table (Name)
        const { error: userError } = await supabaseAdmin
            .from('users')
            .update({ name })
            .eq('email', session.user.email);

        if (userError) throw userError;

        // 2. Update public.profiles table (Metadata)
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
                full_name: name,
                company,
                role,
                security_level: securityLevel,
                updated_at: new Date().toISOString()
            })
            .eq('email', session.user.email);

        if (profileError) throw profileError;

        revalidatePath('/dashboard/settings');
        revalidatePath('/dashboard');

        return { success: true };
    } catch (error: any) {
        console.error("[ProfileAction] Update failed:", error);
        return { error: error.message || "Failed to synchronize profile data" };
    }
}

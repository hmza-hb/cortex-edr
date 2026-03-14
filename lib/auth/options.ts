import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin for Auth.js Adapter
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

import { resend, SYSTEM_EMAIL, templates } from "@/lib/email/resend";

export const authOptions: NextAuthOptions = {
    // @ts-ignore
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                // 1. Fetch user from Supabase 'users' table (created in 007 migration)
                const { data: user, error } = await supabaseAdmin
                    .from("users")
                    .select("*")
                    .eq("email", credentials.email)
                    .single();

                if (error || !user || !user.password) {
                    throw new Error("Invalid email or password");
                }

                // 2. Verify password
                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),
    ],
    pages: {
        signIn: "/auth",
        error: "/auth/error",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    events: {
        async createUser({ user }) {
            // Trigger welcome email
            if (user.email) {
                try {
                    const welcomeEmail = templates.welcome(user.name || 'User');
                    await resend.emails.send({
                        from: `Cortex EDR <${SYSTEM_EMAIL}>`,
                        to: user.email,
                        subject: welcomeEmail.subject,
                        html: welcomeEmail.html
                    });
                    console.log(`Welcome email sent to ${user.email}`);
                } catch (error) {
                    console.error('Error sending welcome email:', error);
                }
            }

            // Ensure profile exists (SupabaseAdapter might have already created it if schema is linked, 
            // but we'll be explicit to avoid issues with our specific 'profiles' table)
            try {
                await supabaseAdmin
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        email: user.email,
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'id' });
            } catch (error) {
                console.error('Error creating profile on createUser:', error);
            }
        },
        async signIn({ user }) {
            // Ensure profile exists on every sign in (sync check)
            try {
                await supabaseAdmin
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        email: user.email,
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'id' });
            } catch (error) {
                console.error('Error syncing profile on signIn:', error);
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

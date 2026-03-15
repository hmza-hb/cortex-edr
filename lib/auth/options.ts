import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin for Auth.js Adapter
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

import { resend, SYSTEM_EMAIL, templates } from "@/lib/email/resend";

export const authOptions: NextAuthOptions = {
    // No adapter needed - using JWT sessions with custom user management in public.users
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
        error: "/auth/auth-code-error",
    },
    callbacks: {
        async signIn({ user, account }) {
            console.log(`[Auth] signIn - provider: ${account?.provider}, email: ${user?.email}`);

            // For OAuth providers (Google, GitHub), upsert user into public.users
            if (account && account.provider !== 'credentials') {
                try {
                    const { data: existingUser } = await supabaseAdmin
                        .from('users')
                        .select('id')
                        .eq('email', user.email!)
                        .maybeSingle();

                    if (!existingUser) {
                        // New OAuth user — create them in public.users
                        const { data: newUser, error: createErr } = await supabaseAdmin
                            .from('users')
                            .insert({
                                email: user.email,
                                name: user.name,
                                image: user.image,
                            })
                            .select()
                            .single();

                        if (createErr) {
                            console.error('[Auth] Failed to create OAuth user in public.users:', createErr);
                            return false;
                        }

                        // Override user.id so JWT gets the correct DB id
                        user.id = newUser.id;

                        // Send welcome email
                        try {
                            const welcomeEmail = templates.welcome(user.name || 'User');
                            await resend.emails.send({
                                from: `Cortex EDR <${SYSTEM_EMAIL}>`,
                                to: user.email!,
                                subject: welcomeEmail.subject,
                                html: welcomeEmail.html,
                            });
                        } catch (emailErr) {
                            console.error('[Auth] Welcome email failed:', emailErr);
                        }
                    } else {
                        user.id = existingUser.id;
                    }

                    // Keep profile in sync
                    await supabaseAdmin
                        .from('profiles')
                        .upsert({ id: user.id, email: user.email, updated_at: new Date().toISOString() }, { onConflict: 'id' });

                } catch (err) {
                    console.error('[Auth] OAuth signIn error:', err);
                    return false;
                }
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
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
    secret: process.env.NEXTAUTH_SECRET,
};

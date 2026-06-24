import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import { resend, SYSTEM_EMAIL, templates } from "@/lib/email/resend";

// Always resolve to the app subdomain. This is critical so that OAuth callbacks
// from Google/GitHub land on app.cortex-edr.com/api/auth/callback/* not cortex-edr.com.
const APP_URL = 'https://app.cortex-edr.com';

// Supabase admin client for server-side operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
            authorization: { params: { prompt: "select_account" } },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: { params: { prompt: "select_account" } },
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

                const { data: user, error } = await supabaseAdmin
                    .from("users")
                    .select("*")
                    .eq("email", credentials.email)
                    .single();

                if (error || !user || !user.password) {
                    throw new Error("Invalid email or password");
                }

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
            // Logs removed for security/PCI/GDPR compliance

            // For OAuth providers, sync user to DB
            if (account && account.provider !== "credentials" && user.email) {
                try {
                    // Check for existing user by email
                    const { data: existingUser, error: fetchErr } = await supabaseAdmin
                        .from("users")
                        .select("id")
                        .eq("email", user.email)
                        .maybeSingle();

                    if (fetchErr) throw fetchErr;

                    let targetUserId = existingUser?.id;

                    if (!existingUser) {
                        // Create new user in public.users
                        const { data: newUser, error: createErr } = await supabaseAdmin
                            .from("users")
                            .insert({
                                email: user.email,
                                name: user.name,
                                image: user.image,
                            })
                            .select()
                            .single();

                        if (createErr) {
                            console.error("[Auth] Failed to create OAuth user:", createErr);
                            // Even if creation fails, we allow sign-in to avoid blocking the user
                        } else if (newUser) {
                            targetUserId = newUser.id;
                            user.id = newUser.id;

                            // Send welcome email (non-blocking after this point)
                            try {
                                const welcomeEmail = templates.welcome(user.name || "User");
                                await resend.emails.send({
                                    from: `Cortex EDR <${SYSTEM_EMAIL}>`,
                                    to: user.email,
                                    subject: welcomeEmail.subject,
                                    html: welcomeEmail.html,
                                });
                            } catch (emailErr) {
                                console.error("[Auth] Welcome email failed:", emailErr);
                            }
                        }
                    } else {
                        // Update NextAuth user object with our DB ID
                        user.id = existingUser.id;
                        targetUserId = existingUser.id;
                    }

                    // Sync/Update profile in profiles table
                    if (targetUserId) {
                        const { error: profileErr } = await supabaseAdmin
                            .from("profiles")
                            .upsert(
                                {
                                    id: targetUserId,
                                    email: user.email,
                                    updated_at: new Date().toISOString()
                                },
                                { onConflict: "id" }
                            );

                        if (profileErr) {
                            console.error("[Auth] Profile sync failed:", profileErr);
                        }
                    }

                } catch (err) {
                    console.error("[Auth] OAuth sync process failed:", err);
                    // Silently fail sync but return true to allow sign-in session
                }
            }

            // Always allow sign-in — never return false for authenticated OAuth
            return true;
        },

        async redirect({ url, baseUrl }) {
            // Guarantee all redirects resolve relative to app.cortex-edr.com,
            // not whatever baseUrl Vercel/NextAuth resolves from NEXTAUTH_URL.
            const resolvedBase = APP_URL;
            if (url.startsWith('/')) return `${resolvedBase}${url}`;
            if (url.startsWith(resolvedBase)) return url;
            // For external callbackUrls (e.g. passed from signIn()), allow them
            // only if they are on our app domain.
            try {
                const parsed = new URL(url);
                if (parsed.hostname === 'app.cortex-edr.com') return url;
            } catch {}
            return `${resolvedBase}/dashboard`;
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

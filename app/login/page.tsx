import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { ChevronLeft } from 'lucide-react'
import { MarketingScroller } from '@/components/ui/marketing-scroller'
import Image from 'next/image'

export default async function Login(props: {
    searchParams: Promise<{ message: string }>
}) {
    const searchParams = await props.searchParams

    const signIn = async (formData: FormData) => {
        'use server'

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const supabase = await createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return redirect('/login?message=Could not authenticate user')
        }

        return redirect('/dashboard')
    }

    const signUp = async (formData: FormData) => {
        'use server'

        const origin = (await headers()).get('origin')
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const supabase = await createClient()

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        })

        if (error) {
            return redirect('/login?message=Could not authenticate user')
        }

        return redirect('/login?message=Check email to continue sign in process')
    }

    const signInWithGithub = async () => {
        'use server'
        const supabase = await createClient()
        const origin = (await headers()).get('origin')
        const { data } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${origin}/auth/callback?next=/dashboard`,
            },
        })
        if (data.url) redirect(data.url)
    }

    const signInWithGoogle = async () => {
        'use server'
        const supabase = await createClient()
        const origin = (await headers()).get('origin')
        const { data } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${origin}/auth/callback?next=/dashboard`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
        if (data.url) redirect(data.url)
    }

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-black overflow-hidden relative">
            {/* Left Side: Cinematic Background */}
            <div className="hidden md:flex md:w-1/2 relative overflow-hidden group">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] scale-110 group-hover:scale-100"
                    style={{ backgroundImage: "url('/assets/bg-hero.png')" }}
                />
                {/* Vignette & Overlays */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60" />

                {/* Branding Overlay */}
                <div className="absolute bottom-12 left-12 z-20">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.5)] overflow-hidden">
                            <Image
                                src="/assets/logo.png"
                                alt="CortexEDR Logo"
                                width={48}
                                height={48}
                                className="h-full w-full object-cover scale-110"
                            />
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] font-outfit uppercase">
                            CORTEX<span className="text-white opacity-80">EDR</span>
                        </h2>
                    </div>
                    <div className="w-full text-left">
                        <MarketingScroller className="!justify-start !text-left" />
                    </div>
                </div>
            </div>

            {/* Right Side: Authentication Center */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 md:bg-[#050505] border-l border-white/10">
                {/* Background Grid Pattern (Subtle) */}
                <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px] pointer-events-none" />

                <Link
                    href="/"
                    className="absolute left-8 top-8 text-xs font-mono uppercase tracking-[0.2em] text-white hover:text-purple-300 transition-all flex items-center gap-2 group font-black underline decoration-white/20 underline-offset-4"
                >
                    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    BACK TO HOME
                </Link>

                <LoginForm
                    signIn={signIn}
                    signUp={signUp}
                    signInWithGithub={signInWithGithub}
                    signInWithGoogle={signInWithGoogle}
                    message={searchParams?.message}
                />

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-mono text-white/50 uppercase tracking-[0.4em] font-black">
                        SECURE ACCESS v2.4.0
                    </p>
                </div>
            </div>

            {/* Global Background Decorative Blobs (Mobile/Subtle) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none md:hidden"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none md:hidden"></div>
        </div>
    )
}

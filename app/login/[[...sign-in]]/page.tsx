import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { MarketingScroller } from '@/components/ui/marketing-scroller'
import Image from 'next/image'
import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function Login() {
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
                        <div className="relative h-12 w-12 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.5)] overflow-hidden">
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
                    className="absolute left-8 top-8 text-xs font-mono uppercase tracking-[0.2em] text-white hover:text-purple-300 transition-all flex items-center gap-2 group font-black underline decoration-white/20 underline-offset-4 z-50"
                >
                    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    BACK TO HOME
                </Link>

                <div className="relative z-50">
                    <SignIn
                        routing="path"
                        path="/login"
                        forceRedirectUrl="/dashboard"
                        signUpUrl="/sign-up"
                        appearance={{
                            baseTheme: dark,
                            elements: {
                                rootBox: "scale-110",
                                card: "bg-zinc-950 border border-zinc-800",
                                headerTitle: "font-outfit text-white",
                                headerSubtitle: "text-zinc-400 font-mono text-xs uppercase",
                                socialButtonsBlockButton: "border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white",
                                dividerText: "text-zinc-500",
                                dividerLine: "bg-zinc-800",
                                formFieldLabel: "text-zinc-300",
                                formFieldInput: "bg-zinc-900 border-zinc-800 text-white focus:border-indigo-500",
                                formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white h-10",
                                footerActionText: "text-zinc-400",
                                footerActionLink: "text-indigo-400 hover:text-indigo-300"
                            }
                        }}
                    />
                </div>

                <div className="mt-12 text-center absolute bottom-8">
                    <p className="text-[10px] font-mono text-white/50 uppercase tracking-[0.4em] font-black">
                        SECURE ACCESS v3.0.0
                    </p>
                </div>
            </div>

            {/* Global Background Decorative Blobs (Mobile/Subtle) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none md:hidden"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none md:hidden"></div>
        </div>
    )
}

import Link from 'next/link'
import { ChevronLeft, AlertTriangle } from 'lucide-react'

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black p-8">
            <div className="w-full max-w-md p-8 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white font-outfit">
                            Authentication Failed
                        </h1>
                        <p className="text-sm text-white/60 font-mono">
                            OAuth code exchange error
                        </p>
                    </div>
                </div>

                <p className="text-white/70 text-sm leading-relaxed mb-6 font-mono">
                    The authentication process could not be completed. This can happen if the
                    session expired, the redirect URL is misconfigured, or there was a
                    connection issue.
                </p>

                <div className="space-y-3">
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
                        Supabase Dashboard → Authentication → URL Configuration
                    </p>
                    <ul className="text-xs text-white/60 font-mono space-y-2 list-disc list-inside">
                        <li><strong className="text-white">Site URL</strong>: Your production URL (e.g. <code className="text-purple-400">https://cortex-edr.com</code>). Wrong value = redirects to localhost!</li>
                        <li><strong className="text-white">Redirect URLs</strong>: Add <code className="text-purple-400">https://cortex-edr.com/auth/callback/**</code> and <code className="text-purple-400">http://localhost:3000/auth/callback/**</code> (wildcards cover query params)</li>
                    </ul>
                </div>

                <Link
                    href="/login"
                    className="mt-8 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black hover:bg-neutral-200 font-mono uppercase tracking-[0.2em] text-xs font-bold rounded-lg transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

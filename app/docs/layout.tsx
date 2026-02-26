import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Shield, Brain, Github, Mail, Globe } from 'lucide-react'
import 'nextra-theme-docs/style.css'
import '@/app/globals.css'
import Link from 'next/link'

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
    const pageMap = await getPageMap('/docs')

    const customNavbar = (
        <Navbar
            logo={
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white group hover:opacity-80 transition-opacity">
                    <Shield className="h-6 w-6 text-indigo-500" />
                    <span className="font-sans uppercase tracking-[0.2em] text-sm hidden md:block">
                        Cortex<span className="text-indigo-500 font-black">EDR</span>
                    </span>
                    <span className="ml-2 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded border border-indigo-500/20 uppercase tracking-widest">
                        DOCS
                    </span>
                </div>
            }
            projectLink="https://github.com/hamza-hafeez82/cortex-edr"
            chatLink="https://discord.gg/cortex-edr"
        />
    )

    const customFooter = (
        <Footer className="border-t border-white/5 bg-zinc-950/50 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full py-8">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-bold text-white tracking-widest text-xs uppercase">
                        <Brain className="h-4 w-4 text-indigo-500" />
                        Cortex<span className="text-indigo-500">EDR</span> Protocol
                    </div>
                    <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">
                        Elite Codebase Defense & Intelligence
                    </p>
                </div>

                <div className="flex items-center gap-8">
                    <Link href="/" className="text-[10px] font-mono text-zinc-400 hover:text-white transition-colors tracking-widest uppercase">Platform</Link>
                    <Link href="/pricing" className="text-[10px] font-mono text-zinc-400 hover:text-white transition-colors tracking-widest uppercase">Upgrade</Link>
                    <Link href="/legal/security" className="text-[10px] font-mono text-zinc-400 hover:text-white transition-colors tracking-widest uppercase">Security</Link>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        Developed by <span className="text-white font-bold">Hamza Hafeez</span>
                    </div>
                    <div className="flex gap-4">
                        <Link href="https://github.com/hamza-hafeez82" className="text-zinc-500 hover:text-white transition-colors">
                            <Github className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="w-full text-center pb-8">
                <p className="text-[9px] font-mono text-zinc-700 tracking-[0.3em] uppercase">
                    © {new Date().getFullYear()} CortexEDR. Operational Intelligence Active.
                </p>
            </div>
        </Footer>
    )

    return (
        <Layout
            navbar={customNavbar}
            footer={customFooter}
            pageMap={pageMap}
            docsRepositoryBase="https://github.com/hamza-hafeez82/cortex-edr/tree/main"
            editLink="Edit this page on GitHub"
            sidebar={{
                defaultMenuCollapseLevel: 1,
                toggleButton: true,
            }}
            nextThemes={{
                defaultTheme: 'dark',
                forcedTheme: 'dark'
            }}
        >
            {children}
        </Layout>
    )
}

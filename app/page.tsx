import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/landing/hero'
import { Shield, Terminal, Activity } from 'lucide-react'
import { TerminalDemo } from '@/components/ui/terminal-demo'
import { AgentScanningVfx } from '@/components/landing/agent-scanning-vfx'
import { PricingSection } from '@/components/landing/pricing-section'
import { Footer } from '@/components/landing/footer'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-black antialiased relative overflow-x-hidden">
      {/* Navbar - Floating Glass */}
      <header className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/[0.1] rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl shadow-2xl shadow-purple-500/10">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
            <img src="/assets/logo.png" alt="CortexEDR Logo" className="h-8 w-8" />
            <span className="font-sans uppercase tracking-[0.2em] text-sm md:block hidden">Cortex<span className="text-purple-500">EDR</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest text-white/70">
            <Link href="/features" className="hover:text-white transition-all">Features</Link>
            <Link href="/pricing" className="hover:text-white transition-all">Pricing</Link>
            <Link href="/docs" className="hover:text-white transition-all">Docs</Link>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-[10px] font-mono tracking-widest text-white/50 hover:text-white transition-colors uppercase">
                  Sys_Control
                </Link>
                <Link href="/dashboard">
                  <Button size="sm" className="rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 text-[10px] font-mono tracking-[0.2em] uppercase px-6">
                    GO_DASHBOARD
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-[10px] font-mono tracking-widest text-white/50 hover:text-white transition-colors uppercase md:block hidden">
                  Auth_Login
                </Link>
                <Link href="/login">
                  <Button size="sm" className="rounded-full bg-white text-black hover:bg-neutral-200 text-[10px] font-mono tracking-widest uppercase px-8">
                    GET_STARTED
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Overhauled Hero Section */}
      <Hero user={user} />

      {/* Interactive Terminal Demo - Contextual Analysis */}
      <section className="py-32 relative bg-black overflow-hidden border-b border-white/5">
        {/* Background Visuals */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          {/* Subtle Grid */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-20 grid md:grid-cols-2 gap-10 items-end">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 font-mono text-[9px] text-purple-400 tracking-[0.3em] uppercase">
                  <Activity className="h-3 w-3" />
                  Semantic_Neural_Scan
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase leading-[0.9]">
                  DEEP <span className="text-purple-500">CONTEXTUAL</span><br />
                  ANALYSIS_
                </h2>
              </div>
              <div className="pb-2">
                <p className="text-neutral-500 font-mono text-[11px] leading-relaxed uppercase tracking-widest border-l-2 border-neutral-800 pl-6">
                  [SYSTEM_CORE_LOGS] Cortex engine understands intent, logic flows, and architectural boundaries—performing deep-pass intelligence that goes far beyond simple syntax matching.
                </p>
              </div>
            </div>

            <TerminalDemo />

            {/* Bottom Details */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "LOGIC_FLOW", val: "VERIFIED" },
                { label: "SEMANTIC_INTENT", val: "MAPPED" },
                { label: "AST_TRAVERSAL", val: "SUCCESS" },
                { label: "SEC_PROTOCOL", val: "ENFORCED" }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                  <div className="text-[8px] text-neutral-600 font-mono uppercase tracking-[0.2em] mb-1">{item.label}</div>
                  <div className="text-[10px] text-purple-400 font-mono font-bold tracking-widest">{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Agentic Scanning Visualization */}
      <section id="features" className="py-32 bg-black relative border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="mb-20">
            <h2 className="text-3xl md:text-6xl font-black text-center text-white tracking-tight uppercase">
              AGENTIC <span className="text-purple-500">PRODUCTION</span> SCAN
            </h2>
            <p className="mt-4 text-center text-neutral-500 font-mono text-xs tracking-[0.4em] uppercase">
              deep-pass intelligence across 7 specialized agents
            </p>
          </div>

          <AgentScanningVfx />
        </div>
      </section>

      <PricingSection />

      <Footer />
    </main>
  )
}

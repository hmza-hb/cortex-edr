import type { Metadata } from 'next'
import { Shield, Zap, BookOpen, Code, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Documentation',
    description: 'Cortex EDR documentation — getting started guides, API reference, security guides, and troubleshooting. Learn to integrate AI-powered security scanning into your workflow.',
    openGraph: {
        title: 'Documentation | Cortex EDR',
        description: 'Guides, API reference, and tutorials for Cortex EDR security scanning platform.',
        url: 'https://cortex-edr.com/docs',
    },
}

export default function DocsPage() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-3">CortexEDR Protocol Overview</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Welcome to the elite codebase defense and intelligence platform. CortexEDR isn&apos;t just a scanner — it&apos;s a <strong className="text-white">Neural Defense Grid</strong> for your polyglot applications.
                </p>
            </div>

            <h2 className="text-xl font-bold text-white mb-4">The Agentic Advantage</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
                Cortex utilizes a proprietary <strong className="text-white">7-Agent Synthesis Pipeline</strong> that mimics the workflow of a high-end security auditing firm. Each agent operates with specialized focus, handing off architectural context to the next phase of the audit.
            </p>

            <div className="overflow-x-auto mb-10">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left py-3 pr-4 text-zinc-300 font-semibold">Agent</th>
                            <th className="text-left py-3 pr-4 text-zinc-300 font-semibold">Focus</th>
                            <th className="text-left py-3 text-zinc-300 font-semibold">Objective</th>
                        </tr>
                    </thead>
                    <tbody className="text-zinc-400">
                        {[
                            ['0. Git Nexus', 'Connectivity', 'Seamless repository ingestion and change tracking.'],
                            ['1. Recon', 'Tech Stack', 'Identification of languages, frameworks, and hidden dependencies.'],
                            ['2. Security', 'Vulnerabilities', 'Deep-scan for OWASP Top 10, CWEs, and logic flaws.'],
                            ['3. Architecture', 'Structural Integrity', 'Mapping inter-service dependencies and design patterns.'],
                            ['4. Quality', 'Maintainability', 'Detecting debt, complexity, and structural decay.'],
                            ['5. Debt', 'Technical Risk', 'Quantifying risk and prioritizing remediation.'],
                            ['6. Synthesis', 'Unified Intelligence', 'Consolidating multi-agent findings into actionable truth.'],
                        ].map(([agent, focus, obj]) => (
                            <tr key={agent} className="border-b border-white/5">
                                <td className="py-2.5 pr-4 font-medium text-white">{agent}</td>
                                <td className="py-2.5 pr-4 text-indigo-400">{focus}</td>
                                <td className="py-2.5">{obj}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2 className="text-xl font-bold text-white mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {[
                    { icon: Zap, title: 'Getting Started', desc: 'Launch your first scan in under 60 seconds.', href: '/docs/getting-started/quickstart' },
                    { icon: Code, title: 'API Reference', desc: 'Integrate CortexEDR into your CI/CD pipeline.', href: '/docs/api/endpoints' },
                    { icon: BookOpen, title: 'Security Guides', desc: 'Learn to interpret and act on findings.', href: '/docs/guides/security/understanding-findings' },
                    { icon: HelpCircle, title: 'FAQ & Support', desc: 'Troubleshooting and escalation protocols.', href: '/docs/reference/support' },
                ].map((item) => (
                    <Link key={item.href} href={item.href} className="group p-5 rounded-lg border border-white/5 bg-zinc-900/50 hover:bg-zinc-900 hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <item.icon className="h-4 w-4 text-indigo-500" />
                            <h3 className="font-bold text-white text-sm">{item.title}</h3>
                        </div>
                        <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{item.desc}</p>
                    </Link>
                ))}
            </div>

            <h2 className="text-xl font-bold text-white mb-4">Security Philosophy</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
                We believe that security should be <strong className="text-white">invisible yet impenetrable</strong>. By integrating deeply into your development workflow, Cortex provides real-time feedback that helps developers build more secure software without sacrificing velocity.
            </p>
            <div className="p-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5">
                <p className="text-sm text-indigo-300">
                    <strong>Important:</strong> CortexEDR never stores your source code. We perform analysis on ephemeral environments and only persist encrypted security manifests.
                </p>
            </div>
        </>
    )
}

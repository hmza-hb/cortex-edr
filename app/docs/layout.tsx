import { Brain, Github, ChevronRight, ArrowLeft, Zap, Code, BookOpen, HelpCircle, Terminal, Shield, Users, FileText } from 'lucide-react'
import Link from 'next/link'

const docsNav = [
    {
        title: 'Getting Started',
        icon: Zap,
        items: [
            { title: 'Quickstart', href: '/docs/getting-started/quickstart' },
            { title: 'Scanning Repos', href: '/docs/getting-started/scanning-repos' },
            { title: 'Reading Reports', href: '/docs/getting-started/reading-reports' },
        ]
    },
    {
        title: 'API Reference',
        icon: Code,
        items: [
            { title: 'Endpoints', href: '/docs/api/endpoints' },
            { title: 'Authentication', href: '/docs/api/authentication' },
            { title: 'Webhooks', href: '/docs/api/webhooks' },
        ]
    },
    {
        title: 'Guides',
        icon: BookOpen,
        items: [
            { title: 'Best Practices', href: '/docs/guides/best-practices' },
            { title: 'Understanding Findings', href: '/docs/guides/security/understanding-findings' },
            { title: 'Fixing Vulnerabilities', href: '/docs/guides/security/fixing-vulnerabilities' },
        ]
    },
    {
        title: 'Reference',
        icon: HelpCircle,
        items: [
            { title: 'FAQ', href: '/docs/reference/faq' },
            { title: 'Support', href: '/docs/reference/support' },
            { title: 'Changelog', href: '/docs/reference/changelog' },
        ]
    },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Platform
                        </Link>
                        <Link href="/docs" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <img src="/assets/logo.png" alt="CortexEDR Logo" className="h-5 w-5" />
                            <span className="font-bold text-sm tracking-tight">
                                CortexEDR <span className="text-indigo-500 text-xs font-semibold ml-1 px-1.5 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20">DOCS</span>
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">Platform</Link>
                        <Link href="/pricing" className="text-xs text-zinc-400 hover:text-white transition-colors">Pricing</Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto flex">
                {/* Sidebar */}
                <aside className="hidden md:block w-72 shrink-0 border-r border-white/10 bg-black/50 backdrop-blur-sm py-8 pr-6 pl-8 sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden">
                    {/* Sidebar Header */}
                    <div className="mb-8">
                        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.15em] mb-2">Documentation</h2>
                        <div className="w-full h-[1px] bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
                    </div>

                    <nav className="space-y-2">
                        {docsNav.map((section, sectionIndex) => (
                            <div key={section.title} className="mb-6">
                                {/* Section Header */}
                                <div className="flex items-center gap-2 mb-3 px-3">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                                        <section.icon className="h-3 w-3 text-indigo-400" />
                                    </div>
                                    <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">{section.title}</h4>
                                </div>

                                {/* Section Items */}
                                <ul className="space-y-0.5 ml-8">
                                    {section.items.map((item, itemIndex) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="group flex items-center gap-3 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.02] px-3 py-2 rounded-lg transition-all duration-200 border border-transparent hover:border-white/5"
                                            >
                                                <ChevronRight className="h-3 w-3 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                                                <span className="font-medium">{item.title}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                {/* Section Divider (except for last section) */}
                                {sectionIndex < docsNav.length - 1 && (
                                    <div className="mt-6 ml-8 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="mt-12 pt-6 border-t border-white/10">
                        <div className="px-3">
                            <h5 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3">Need Help?</h5>
                            <Link
                                href="/docs/reference/support"
                                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-indigo-300 transition-colors group"
                            >
                                <HelpCircle className="h-3 w-3" />
                                <span>Contact Support</span>
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0 py-8 px-6 md:px-12">
                    <div className="prose prose-invert prose-indigo max-w-3xl
                        prose-headings:font-bold prose-headings:tracking-tight
                        prose-h1:text-3xl prose-h2:text-xl prose-h3:text-lg
                        prose-p:text-zinc-400 prose-p:leading-relaxed
                        prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300
                        prose-code:text-indigo-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-white/5
                        prose-table:border-collapse prose-th:text-left prose-th:text-zinc-300
                        prose-td:border-t prose-td:border-white/5 prose-td:py-2
                        prose-strong:text-white prose-li:text-zinc-400
                    ">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black/80 backdrop-blur-sm mt-16">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        {/* Company Section */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-3 mb-6">
                                <img src="/assets/logo.png" alt="CortexEDR Logo" className="h-8 w-8" />
                                <div>
                                    <span className="text-xl font-bold text-white tracking-tight">CortexEDR</span>
                                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Enterprise Documentation</div>
                                </div>
                            </Link>
                            <p className="text-white/70 text-sm leading-relaxed max-w-sm mb-6">
                                Advanced neural security platform for enterprise-grade codebase analysis, automated vulnerability synthesis, and AI-powered threat intelligence.
                            </p>
                            <div className="flex items-center gap-4">
                                <a href="https://github.com/hamza-hafeez82/cortex-edr" target="_blank" className="text-zinc-400 hover:text-white transition-colors">
                                    <Github className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                                    <Users className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">Product</h3>
                            <ul className="space-y-3">
                                <li><Link href="/" className="text-zinc-400 hover:text-white text-sm transition-colors">Platform</Link></li>
                                <li><Link href="/pricing" className="text-zinc-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
                                <li><Link href="/docs" className="text-zinc-400 hover:text-white text-sm transition-colors">Documentation</Link></li>
                                <li><Link href="/docs/api/endpoints" className="text-zinc-400 hover:text-white text-sm transition-colors">API Reference</Link></li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">Resources</h3>
                            <ul className="space-y-3">
                                <li><Link href="/docs/guides/best-practices" className="text-zinc-400 hover:text-white text-sm transition-colors">Best Practices</Link></li>
                                <li><Link href="/docs/reference/faq" className="text-zinc-400 hover:text-white text-sm transition-colors">FAQ</Link></li>
                                <li><Link href="/docs/reference/support" className="text-zinc-400 hover:text-white text-sm transition-colors">Support</Link></li>
                                <li><Link href="/docs/reference/changelog" className="text-zinc-400 hover:text-white text-sm transition-colors">Changelog</Link></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">Company</h3>
                            <ul className="space-y-3">
                                <li><a href="https://github.com/hamza-hafeez82" target="_blank" className="text-zinc-400 hover:text-white text-sm transition-colors">About</a></li>
                                <li><Link href="/legal/privacy" className="text-zinc-400 hover:text-white text-sm transition-colors">Privacy</Link></li>
                                <li><Link href="/legal/terms" className="text-zinc-400 hover:text-white text-sm transition-colors">Terms</Link></li>
                                <li><Link href="/legal/security" className="text-zinc-400 hover:text-white text-sm transition-colors">Security</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Terminal className="h-3.5 w-3.5 text-indigo-500" />
                                    <span className="font-medium">© {new Date().getFullYear()} CortexEDR. All rights reserved.</span>
                                </div>
                                <div className="hidden md:block w-[1px] h-4 bg-white/20"></div>
                                <div className="text-xs text-zinc-600">
                                    <span>Developed by </span>
                                    <a href="https://github.com/hamza-hafeez82" target="_blank" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                                        Hamza Hafeez
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-xs text-zinc-500">
                                <span className="flex items-center gap-1">
                                    <Shield className="h-3 w-3 text-green-500" />
                                    SOC 2 Type II Certified
                                </span>
                                <span>v4.0.2-EDGE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            </footer>
        </div>
    )
}

import { Shield, Brain, Github, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const docsNav = [
    {
        title: 'Getting Started', items: [
            { title: 'Quickstart', href: '/docs/getting-started/quickstart' },
            { title: 'Scanning Repos', href: '/docs/getting-started/scanning-repos' },
            { title: 'Reading Reports', href: '/docs/getting-started/reading-reports' },
        ]
    },
    {
        title: 'API Reference', items: [
            { title: 'Endpoints', href: '/docs/api/endpoints' },
            { title: 'Authentication', href: '/docs/api/authentication' },
            { title: 'Webhooks', href: '/docs/api/webhooks' },
        ]
    },
    {
        title: 'Guides', items: [
            { title: 'Best Practices', href: '/docs/guides/best-practices' },
            { title: 'Understanding Findings', href: '/docs/guides/security/understanding-findings' },
            { title: 'Fixing Vulnerabilities', href: '/docs/guides/security/fixing-vulnerabilities' },
        ]
    },
    {
        title: 'Reference', items: [
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
                    <Link href="/docs" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Shield className="h-5 w-5 text-indigo-500" />
                        <span className="font-bold text-sm tracking-tight">
                            CortexEDR <span className="text-indigo-500 text-xs font-semibold ml-1 px-1.5 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20">DOCS</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">Platform</Link>
                        <Link href="/pricing" className="text-xs text-zinc-400 hover:text-white transition-colors">Pricing</Link>
                        <a href="https://github.com/hamza-hafeez82/cortex-edr" target="_blank" className="text-zinc-400 hover:text-white transition-colors">
                            <Github className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto flex">
                {/* Sidebar */}
                <aside className="hidden md:block w-64 shrink-0 border-r border-white/5 py-8 pr-6 pl-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
                    <nav className="space-y-6">
                        {docsNav.map((section) => (
                            <div key={section.title}>
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">{section.title}</h4>
                                <ul className="space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-md transition-colors"
                                            >
                                                <ChevronRight className="h-3 w-3 text-zinc-600" />
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
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
            <footer className="border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Brain className="h-3.5 w-3.5 text-indigo-500" />
                        <span>© {new Date().getFullYear()} CortexEDR. Elite Codebase Defense.</span>
                    </div>
                    <div className="text-xs text-zinc-600">
                        Developed by <a href="https://github.com/hamza-hafeez82" target="_blank" className="text-zinc-400 hover:text-white transition-colors font-medium">Hamza Hafeez</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

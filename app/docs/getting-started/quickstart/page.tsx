import Link from "next/link";

export default function QuickstartPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Quickstart Guide</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Get started with CortexEDR in under 5 minutes. This guide will walk you through your first security scan and help you understand the platform fundamentals.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Step 1: Account Setup */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                                <span className="text-indigo-400 font-bold text-sm">1</span>
                            </div>
                            <h2 className="text-xl font-bold text-white">Create Your Account</h2>
                        </div>
                        <div className="space-y-4 text-zinc-300">
                            <p>Start by creating your CortexEDR account to access the platform.</p>
                            <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                                <h3 className="text-sm font-semibold text-white mb-2">Sign Up Process:</h3>
                                <ol className="list-decimal list-inside space-y-1 text-sm">
                                    <li>Navigate to <code className="bg-zinc-800 px-1 rounded">cortex-edr.com</code></li>
                                    <li>Click "Get Started" in the top navigation</li>
                                    <li>Choose your plan (Vibe Coder, Developer, Teams, or Enterprise)</li>
                                    <li>Complete authentication via email or social login</li>
                                    <li>Verify your email address</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: First Scan */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                                <span className="text-indigo-400 font-bold text-sm">2</span>
                            </div>
                            <h2 className="text-xl font-bold text-white">Run Your First Scan</h2>
                        </div>
                        <div className="space-y-4 text-zinc-300">
                            <p>Once logged in, you'll be taken to the dashboard. Let's scan your first repository.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                                    <h3 className="text-sm font-semibold text-white mb-2">GitHub Repository Scan:</h3>
                                    <ol className="list-decimal list-inside space-y-1 text-sm">
                                        <li>Click "New Scan" button</li>
                                        <li>Enter repository URL (e.g., <code className="bg-zinc-800 px-1 rounded">https://github.com/yourusername/yourrepo</code>)</li>
                                        <li>Ensure repository is public or provide access token</li>
                                        <li>Click "Start Scan"</li>
                                    </ol>
                                </div>

                                <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                                    <h3 className="text-sm font-semibold text-white mb-2">What Happens Next:</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Repository indexing begins</li>
                                        <li>7 specialized agents analyze your code</li>
                                        <li>Real-time progress updates</li>
                                        <li>Results available in 2-10 minutes</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Understand Results */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                                <span className="text-indigo-400 font-bold text-sm">3</span>
                            </div>
                            <h2 className="text-xl font-bold text-white">Review Your Results</h2>
                        </div>
                        <div className="space-y-4 text-zinc-300">
                            <p>CortexEDR provides comprehensive security analysis through multiple lenses.</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-red-400 text-xl">⚠️</span>
                                    </div>
                                    <h3 className="font-semibold text-white mb-1">Critical Issues</h3>
                                    <p className="text-xs text-zinc-400">Immediate security threats requiring urgent attention</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-yellow-400 text-xl">⚡</span>
                                    </div>
                                    <h3 className="font-semibold text-white mb-1">Best Practices</h3>
                                    <p className="text-xs text-zinc-400">Code quality improvements and optimization suggestions</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-blue-400 text-xl">🔧</span>
                                    </div>
                                    <h3 className="font-semibold text-white mb-1">Architecture</h3>
                                    <p className="text-xs text-zinc-400">Structural analysis and design pattern recommendations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Need Help?</h3>
                        <div className="space-y-2 text-sm text-zinc-400">
                            <p>💬 <Link href="/docs/reference/support" className="text-indigo-400 hover:text-indigo-300">Contact Support</Link></p>
                            <p>📖 <Link href="/docs/guides/best-practices" className="text-indigo-400 hover:text-indigo-300">Best Practices Guide</Link></p>
                            <p>🔧 <Link href="/docs/api/endpoints" className="text-indigo-400 hover:text-indigo-300">API Documentation</Link></p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Pro Tip</h3>
                        <p className="text-xs text-zinc-300">
                            Start with smaller repositories (under 50 files) for your first scans to get comfortable with the platform before moving to larger codebases.
                        </p>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">What's Next?</h3>
                        <div className="space-y-2">
                            <Link href="/docs/getting-started/scanning-repos" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Advanced Scanning Options
                            </Link>
                            <Link href="/docs/getting-started/reading-reports" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Understanding Reports
                            </Link>
                            <Link href="/docs/guides/security/understanding-findings" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Interpreting Security Findings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-white mb-2">Ready to Secure Your Code?</h2>
                <p className="text-zinc-400 mb-4">Join thousands of developers who trust CortexEDR for their security needs.</p>
                <Link href="/" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Start Your First Scan →
                </Link>
            </div>
        </div>
    )
}

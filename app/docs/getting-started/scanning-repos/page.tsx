export default function ScanningReposPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Scanning Repositories</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Learn how to configure and run scans on different types of repositories with various options and settings optimized for your specific use case.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Repository Types */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Supported Repository Types</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-400 text-lg">📦</span>
                                    </div>
                                    <h3 className="font-semibold text-white">GitHub Public</h3>
                                </div>
                                <p className="text-sm text-zinc-400 mb-3">Public repositories on GitHub</p>
                                <code className="text-xs bg-zinc-800 px-2 py-1 rounded">https://github.com/user/repo</code>
                            </div>

                            <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                                        <span className="text-green-400 text-lg">🔐</span>
                                    </div>
                                    <h3 className="font-semibold text-white">GitHub Private</h3>
                                </div>
                                <p className="text-sm text-zinc-400 mb-3">Private repositories with access token</p>
                                <code className="text-xs bg-zinc-800 px-2 py-1 rounded">Requires PAT token</code>
                            </div>
                        </div>
                    </div>

                    {/* Scan Configuration */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Scan Configuration Options</h2>
                        <div className="space-y-4">
                            <div className="border-l-2 border-indigo-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Depth Settings</h3>
                                <ul className="text-sm text-zinc-400 space-y-1">
                                    <li>• <strong>Shallow Scan:</strong> Quick analysis of critical files only</li>
                                    <li>• <strong>Standard Scan:</strong> Comprehensive analysis (recommended)</li>
                                    <li>• <strong>Deep Scan:</strong> Exhaustive analysis with advanced AI patterns</li>
                                </ul>
                            </div>

                            <div className="border-l-2 border-purple-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Language Focus</h3>
                                <ul className="text-sm text-zinc-400 space-y-1">
                                    <li>• <strong>Auto-detect:</strong> Automatically identifies all languages</li>
                                    <li>• <strong>Primary Language:</strong> Focus on specific technology stack</li>
                                    <li>• <strong>Multi-language:</strong> Comprehensive analysis across all languages</li>
                                </ul>
                            </div>

                            <div className="border-l-2 border-green-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Security Focus</h3>
                                <ul className="text-sm text-zinc-400 space-y-1">
                                    <li>• <strong>OWASP Top 10:</strong> Web application security standards</li>
                                    <li>• <strong>CWE Coverage:</strong> Common Weakness Enumeration</li>
                                    <li>• <strong>Custom Rules:</strong> Organization-specific security policies</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Advanced Scanning Options</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-white mb-2">Include/Exclude Patterns</h3>
                                    <div className="bg-black/50 rounded p-3 text-sm">
                                        <div className="text-zinc-400 mb-2">Include:</div>
                                        <code className="text-green-400">*.js,*.ts,*.py,*.java</code>
                                        <div className="text-zinc-400 mt-2 mb-2">Exclude:</div>
                                        <code className="text-red-400">node_modules/**,*.test.*</code>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-2">Branch Selection</h3>
                                    <div className="bg-black/50 rounded p-3 text-sm text-zinc-400">
                                        <div>• Default branch (main/master)</div>
                                        <div>• Specific branch name</div>
                                        <div>• Pull request branches</div>
                                        <div>• Tag-based scanning</div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <h3 className="font-semibold text-white mb-2">Integration Options</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    {['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'Webhook API', 'CLI Tool', 'REST API', 'GraphQL API'].map((integration) => (
                                        <div key={integration} className="bg-black/30 px-3 py-2 rounded text-center text-zinc-400">
                                            {integration}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Best Practices */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Scanning Best Practices</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-indigo-400 text-xs">✓</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Start Small</h3>
                                    <p className="text-sm text-zinc-400">Begin with smaller repositories to understand the scanning process and results format.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-indigo-400 text-xs">✓</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Regular Scanning</h3>
                                    <p className="text-sm text-zinc-400">Set up automated scans on every push to catch security issues early in development.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-indigo-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-indigo-400 text-xs">✓</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Focus on Critical Paths</h3>
                                    <p className="text-sm text-zinc-400">Prioritize scanning authentication, payment, and data handling components.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                            <a href="/" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Start New Scan
                            </a>
                            <a href="/dashboard" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → View Scan History
                            </a>
                            <a href="/docs/api/endpoints" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → API Integration
                            </a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Scan Performance</h3>
                        <div className="space-y-2 text-xs text-zinc-300">
                            <div className="flex justify-between">
                                <span>Small repo (&lt;50 files):</span>
                                <span className="text-green-400">2-3 minutes</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Medium repo (50-200 files):</span>
                                <span className="text-yellow-400">5-8 minutes</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Large repo (200+ files):</span>
                                <span className="text-orange-400">10-15 minutes</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Supported Languages</h3>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                            {['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'C++'].map((lang) => (
                                <div key={lang} className="text-zinc-400">{lang}</div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">What's Next?</h3>
                        <div className="space-y-2">
                            <a href="/docs/getting-started/reading-reports" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Understanding Reports
                            </a>
                            <a href="/docs/guides/best-practices" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Security Best Practices
                            </a>
                            <a href="/docs/api/authentication" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → API Authentication
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

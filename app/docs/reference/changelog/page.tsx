export default function ChangelogPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Changelog</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Stay updated with the latest features, improvements, and fixes in CortexEDR. We regularly release updates to enhance security detection, improve performance, and add new capabilities.
                </p>
                <div className="flex items-center gap-4 text-sm">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded">Latest: v4.0.2-EDGE</span>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded">Released: Feb 28, 2025</span>
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded">Status: Stable</span>
                </div>
            </div>

            {/* Current Version */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">v4.0.2-EDGE</h2>
                        <p className="text-zinc-400">February 28, 2025</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">Latest</span>
                </div>

                <div className="space-y-4">
                    <div className="border-l-2 border-green-500 pl-4">
                        <h3 className="font-semibold text-green-400 mb-2">🚀 Major Features</h3>
                        <ul className="space-y-1 text-sm text-zinc-300">
                            <li>• <strong>Enhanced AI Router:</strong> Improved agent model selection for better accuracy</li>
                            <li>• <strong>Real-time Webhooks:</strong> Instant notifications for scan events and critical findings</li>
                            <li>• <strong>Advanced Reporting:</strong> Export capabilities in PDF, JSON, and CSV formats</li>
                            <li>• <strong>Enterprise SSO:</strong> Single sign-on integration for enterprise customers</li>
                        </ul>
                    </div>

                    <div className="border-l-2 border-blue-500 pl-4">
                        <h3 className="font-semibold text-blue-400 mb-2">🔧 Improvements</h3>
                        <ul className="space-y-1 text-sm text-zinc-300">
                            <li>• Improved scan performance with 40% faster processing times</li>
                            <li>• Enhanced false positive detection and reduction</li>
                            <li>• Better support for monorepo structures</li>
                            <li>• Expanded language support for Rust and Swift</li>
                        </ul>
                    </div>

                    <div className="border-l-2 border-yellow-500 pl-4">
                        <h3 className="font-semibold text-yellow-400 mb-2">🐛 Bug Fixes</h3>
                        <ul className="space-y-1 text-sm text-zinc-300">
                            <li>• Fixed webhook signature verification for certain edge cases</li>
                            <li>• Resolved memory leak in long-running scan processes</li>
                            <li>• Corrected CWE classification for specific vulnerability types</li>
                            <li>• Fixed API pagination for large result sets</li>
                        </ul>
                    </div>

                    <div className="border-l-2 border-purple-500 pl-4">
                        <h3 className="font-semibold text-purple-400 mb-2">🔒 Security Updates</h3>
                        <ul className="space-y-1 text-sm text-zinc-300">
                            <li>• Updated dependency scanning for latest CVE database</li>
                            <li>• Enhanced input validation across all API endpoints</li>
                            <li>• Improved encryption for stored scan metadata</li>
                            <li>• Strengthened rate limiting and abuse prevention</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Previous Versions */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">📋 Previous Releases</h2>

                {/* v4.0.1 */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">v4.0.1</h2>
                            <p className="text-zinc-400">February 15, 2025</p>
                        </div>
                        <span className="px-3 py-1 bg-zinc-500/20 text-zinc-400 rounded-full text-sm font-medium">Previous</span>
                    </div>

                    <div className="space-y-4">
                        <div className="border-l-2 border-green-500 pl-4">
                            <h3 className="font-semibold text-green-400 mb-2">🚀 New Features</h3>
                            <ul className="space-y-1 text-sm text-zinc-300">
                                <li>• Multi-language repository support with automatic detection</li>
                                <li>• Custom security rules for enterprise customers</li>
                                <li>• Team collaboration features with role-based access</li>
                                <li>• Advanced filtering and search in scan results</li>
                            </ul>
                        </div>

                        <div className="border-l-2 border-blue-500 pl-4">
                            <h3 className="font-semibold text-blue-400 mb-2">🔧 Improvements</h3>
                            <ul className="space-y-1 text-sm text-zinc-300">
                                <li>• 25% improvement in scan accuracy across all languages</li>
                                <li>• Better handling of large codebases and monorepos</li>
                                <li>• Enhanced API documentation and SDK examples</li>
                                <li>• Improved dashboard loading times</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* v4.0.0 */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">v4.0.0</h2>
                            <p className="text-zinc-400">January 30, 2025</p>
                        </div>
                        <span className="px-3 py-1 bg-zinc-500/20 text-zinc-400 rounded-full text-sm font-medium">Major</span>
                    </div>

                    <div className="space-y-4">
                        <div className="border-l-2 border-green-500 pl-4">
                            <h3 className="font-semibold text-green-400 mb-2">🚀 Major Features</h3>
                            <ul className="space-y-1 text-sm text-zinc-300">
                                <li>• Complete platform redesign with new AI architecture</li>
                                <li>• 7-agent orchestration system for comprehensive analysis</li>
                                <li>• Real-time scanning with live progress updates</li>
                                <li>• Advanced reporting with actionable insights</li>
                                <li>• Enterprise-grade API with webhook support</li>
                            </ul>
                        </div>

                        <div className="border-l-2 border-red-500 pl-4">
                            <h3 className="font-semibold text-red-400 mb-2">⚠️ Breaking Changes</h3>
                            <ul className="space-y-1 text-sm text-zinc-300">
                                <li>• API v3 endpoints deprecated - migrate to v4</li>
                                <li>• Webhook payload structure updated</li>
                                <li>• Some legacy export formats removed</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* v3.2.1 */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">v3.2.1</h2>
                            <p className="text-zinc-400">December 15, 2024</p>
                        </div>
                        <span className="px-3 py-1 bg-zinc-500/20 text-zinc-400 rounded-full text-sm font-medium">Patch</span>
                    </div>

                    <div className="space-y-4">
                        <div className="border-l-2 border-yellow-500 pl-4">
                            <h3 className="font-semibold text-yellow-400 mb-2">🐛 Bug Fixes</h3>
                            <ul className="space-y-1 text-sm text-zinc-300">
                                <li>• Fixed memory leak in dependency analysis</li>
                                <li>• Resolved false positives in React component scanning</li>
                                <li>• Corrected severity scoring for certain CWE categories</li>
                                <li>• Fixed GitHub webhook integration timeout issues</li>
                            </ul>
                        </div>

                        <div className="border-l-2 border-blue-500 pl-4">
                            <h3 className="font-semibold text-blue-400 mb-2">🔧 Improvements</h3>
                            <ul className="space-y-1 text-sm text-zinc-300">
                                <li>• Improved performance for large repository scans</li>
                                <li>• Better error messages and troubleshooting guidance</li>
                                <li>• Enhanced support for private repository access</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* v3.2.0 */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">v3.2.0</h2>
                            <p className="text-zinc-400">November 28, 2024</p>
                        </div>
                        <span className="px-3 py-1 bg-zinc-500/20 text-zinc-400 rounded-full text-sm font-medium">Minor</span>
                    </div>

                    <div className="space-y-4">
                        <div className="border-l-2 border-green-500 pl-4">
                            <h3 className="font-semibold text-green-400 mb-2">🚀 New Features</h3>
                            <ul className="space-y-1 text-sm text-zinc-300">
                                <li>• GitHub Actions integration for automated scanning</li>
                                <li>• Custom severity thresholds for different teams</li>
                                <li>• Enhanced reporting with trend analysis</li>
                                <li>• Slack and Discord webhook integrations</li>
                            </ul>
                        </div>

                        <div className="border-l-2 border-blue-500 pl-4">
                            <h3 className="font-semibold text-blue-400 mb-2">🔧 Improvements</h3>
                            <ul className="space-y-1 text-sm text-zinc-300">
                                <li>• Faster scan times with optimized AI models</li>
                                <li>• Better accuracy in dependency vulnerability detection</li>
                                <li>• Improved user interface and navigation</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* v3.1.0 */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">v3.1.0</h2>
                            <p className="text-zinc-400">October 15, 2024</p>
                        </div>
                        <span className="px-3 py-1 bg-zinc-500/20 text-zinc-400 rounded-full text-sm font-medium">Minor</span>
                    </div>

                    <div className="space-y-4">
                        <div className="border-l-2 border-green-500 pl-4">
                            <h3 className="font-semibold text-green-400 mb-2">🚀 New Features</h3>
                            <ul className="space-y-1 text-sm text-zinc-300">
                                <li>• API access for programmatic scanning and reporting</li>
                                <li>• Team management and collaboration features</li>
                                <li>• Advanced filtering and search capabilities</li>
                                <li>• Integration with popular CI/CD platforms</li>
                            </ul>
                        </div>

                        <div className="border-l-2 border-purple-500 pl-4">
                            <h3 className="font-semibold text-purple-400 mb-2">🔒 Security Updates</h3>
                            <ul className="space-y-1 text-sm text-zinc-300">
                                <li>• Enhanced encryption for all stored data</li>
                                <li>• Improved access controls and permissions</li>
                                <li>• Regular security audits and penetration testing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Version History */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">📈 Version History Overview</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 pr-4 text-zinc-300 font-semibold">Version</th>
                                <th className="text-left py-3 pr-4 text-zinc-300 font-semibold">Date</th>
                                <th className="text-left py-3 pr-4 text-zinc-300 font-semibold">Type</th>
                                <th className="text-left py-3 text-zinc-300 font-semibold">Highlights</th>
                            </tr>
                        </thead>
                        <tbody className="text-zinc-400">
                            <tr className="border-b border-white/5">
                                <td className="py-2.5 pr-4 font-medium text-green-400">v4.0.2-EDGE</td>
                                <td className="py-2.5 pr-4">Feb 28, 2025</td>
                                <td className="py-2.5 pr-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Patch</span></td>
                                <td className="py-2.5">AI router improvements, webhooks, enterprise features</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-2.5 pr-4 font-medium text-white">v4.0.1</td>
                                <td className="py-2.5 pr-4">Feb 15, 2025</td>
                                <td className="py-2.5 pr-4"><span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Minor</span></td>
                                <td className="py-2.5">Multi-language support, custom rules, team features</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-2.5 pr-4 font-medium text-white">v4.0.0</td>
                                <td className="py-2.5 pr-4">Jan 30, 2025</td>
                                <td className="py-2.5 pr-4"><span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Major</span></td>
                                <td className="py-2.5">Complete platform redesign, 7-agent system</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-2.5 pr-4 font-medium text-white">v3.2.1</td>
                                <td className="py-2.5 pr-4">Dec 15, 2024</td>
                                <td className="py-2.5 pr-4"><span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Patch</span></td>
                                <td className="py-2.5">Bug fixes, performance improvements</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-2.5 pr-4 font-medium text-white">v3.2.0</td>
                                <td className="py-2.5 pr-4">Nov 28, 2024</td>
                                <td className="py-2.5 pr-4"><span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Minor</span></td>
                                <td className="py-2.5">CI/CD integrations, custom thresholds</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Future Roadmap */}
            <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">🔮 Upcoming Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-purple-400 mb-3">Q2 2025</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• Advanced IaC security scanning</li>
                            <li>• Container image vulnerability analysis</li>
                            <li>• Real-time collaborative editing</li>
                            <li>• Enhanced compliance reporting</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-indigo-400 mb-3">Q3 2025</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• AI-powered remediation suggestions</li>
                            <li>• Advanced threat intelligence integration</li>
                            <li>• Custom security policy frameworks</li>
                            <li>• Multi-cloud security posture management</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="fixed right-8 top-32 w-64 space-y-6 hidden xl:block">
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Version Info</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Current:</span>
                            <span className="text-green-400">v4.0.2-EDGE</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Released:</span>
                            <span className="text-zinc-300">Feb 28, 2025</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Status:</span>
                            <span className="text-green-400">Stable</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Release Types</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-zinc-300">Major - Breaking changes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-zinc-300">Minor - New features</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-zinc-300">Patch - Bug fixes</span>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Subscribe to Updates</h3>
                    <div className="space-y-2">
                        <a href="https://github.com/hamza-hafeez82/cortex-edr/releases" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                            → GitHub Releases
                        </a>
                        <a href="/docs/reference/support" className="block text-sm text-indigo-400 hover:text-indigo-300">
                            → Support Updates
                        </a>
                        <a href="mailto:updates@cortex-edr.com" className="block text-sm text-indigo-400 hover:text-indigo-300">
                            → Email Updates
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

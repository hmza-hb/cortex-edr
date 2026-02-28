export default function ReadingReportsPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Understanding Reports</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Learn how to interpret CortexEDR security reports, understand severity levels, and take actionable steps to improve your codebase security.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Report Overview */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Report Structure</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-white mb-3">Executive Summary</h3>
                                <ul className="space-y-2 text-sm text-zinc-400">
                                    <li>• Overall security score (0-100)</li>
                                    <li>• Total issues found</li>
                                    <li>• Critical/high priority items</li>
                                    <li>• Risk assessment level</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-white mb-3">Agent Breakdown</h3>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Security Scanner', icon: '🛡️', desc: 'Vulnerabilities & exploits' },
                                        { name: 'Architecture', icon: '🏗️', desc: 'Design patterns & structure' },
                                        { name: 'Code Quality', icon: '💻', desc: 'Best practices & standards' },
                                        { name: 'Technical Debt', icon: '📊', desc: 'Maintenance & complexity' }
                                    ].map((agent) => (
                                        <div key={agent.name} className="flex items-center gap-2 text-sm">
                                            <span>{agent.icon}</span>
                                            <div>
                                                <div className="text-white font-medium">{agent.name}</div>
                                                <div className="text-zinc-500">{agent.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Severity Levels */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Severity Classification</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    level: 'Critical',
                                    color: 'red',
                                    icon: '🚨',
                                    description: 'Immediate security threats requiring urgent attention',
                                    examples: ['SQL Injection', 'Remote Code Execution', 'Authentication Bypass']
                                },
                                {
                                    level: 'High',
                                    color: 'orange',
                                    icon: '⚠️',
                                    description: 'Significant security risks that should be addressed promptly',
                                    examples: ['Cross-Site Scripting', 'Insecure Dependencies', 'Weak Cryptography']
                                },
                                {
                                    level: 'Medium',
                                    color: 'yellow',
                                    icon: '⚡',
                                    description: 'Moderate security concerns that should be reviewed',
                                    examples: ['Information Disclosure', 'Weak Configurations', 'Deprecated APIs']
                                },
                                {
                                    level: 'Low',
                                    color: 'blue',
                                    icon: 'ℹ️',
                                    description: 'Minor security improvements and best practice violations',
                                    examples: ['Code Quality Issues', 'Performance Suggestions', 'Documentation Gaps']
                                }
                            ].map((severity) => (
                                <div key={severity.level} className={`border-l-4 border-${severity.color}-500 pl-4 bg-${severity.color}-500/5 rounded-r-lg p-4`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{severity.icon}</span>
                                        <h3 className={`text-lg font-bold text-${severity.color}-400`}>{severity.level}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs bg-${severity.color}-500/20 text-${severity.color}-300`}>
                                            Priority {severity.level === 'Critical' ? '1' : severity.level === 'High' ? '2' : severity.level === 'Medium' ? '3' : '4'}
                                        </span>
                                    </div>
                                    <p className="text-zinc-300 mb-3">{severity.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {severity.examples.map((example) => (
                                            <span key={example} className={`px-2 py-1 bg-${severity.color}-500/10 text-${severity.color}-300 rounded text-xs`}>
                                                {example}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Issue Details */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Reading Issue Details</h2>
                        <div className="space-y-6">
                            <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                                <h3 className="font-semibold text-white mb-3">Issue Anatomy</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-indigo-400 font-medium">Title</div>
                                            <div className="text-zinc-300">Clear, actionable description</div>
                                        </div>
                                        <div>
                                            <div className="text-indigo-400 font-medium">Severity</div>
                                            <div className="text-zinc-300">Critical → Low scale</div>
                                        </div>
                                        <div>
                                            <div className="text-indigo-400 font-medium">File & Line</div>
                                            <div className="text-zinc-300">Exact location in codebase</div>
                                        </div>
                                        <div>
                                            <div className="text-indigo-400 font-medium">CWE ID</div>
                                            <div className="text-zinc-300">Common Weakness Enumeration</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                                    <h4 className="font-semibold text-white mb-2">Description</h4>
                                    <p className="text-sm text-zinc-400">What the issue is and why it matters</p>
                                </div>

                                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                                    <h4 className="font-semibold text-white mb-2">Exploit Scenario</h4>
                                    <p className="text-sm text-zinc-400">How an attacker could leverage this vulnerability</p>
                                </div>

                                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                                    <h4 className="font-semibold text-white mb-2">Fix Recommendation</h4>
                                    <p className="text-sm text-zinc-400">Specific steps to resolve the issue</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actionable Insights */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Taking Action</h2>
                        <div className="space-y-4">
                            <div className="border-l-2 border-indigo-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Prioritization Strategy</h3>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-400">
                                    <li>Address all Critical issues immediately</li>
                                    <li>Review High priority items within 1 week</li>
                                    <li>Plan Medium issues for next sprint</li>
                                    <li>Consider Low priority items for technical debt cleanup</li>
                                </ol>
                            </div>

                            <div className="border-l-2 border-purple-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Common Patterns</h3>
                                <p className="text-sm text-zinc-400 mb-2">
                                    Many vulnerabilities share root causes. Fixing one pattern often resolves multiple issues:
                                </p>
                                <div className="bg-black/30 rounded p-3 text-sm">
                                    <div className="text-purple-300 mb-1">Example: Input Validation</div>
                                    <div className="text-zinc-400">Fixing input validation in one place prevents SQL injection, XSS, and command injection across your entire application.</div>
                                </div>
                            </div>

                            <div className="border-l-2 border-green-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Continuous Improvement</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
                                    <li>Set up automated scanning in CI/CD pipelines</li>
                                    <li>Establish security review processes for code changes</li>
                                    <li>Create security champions in development teams</li>
                                    <li>Regular security training and awareness programs</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Report Actions</h3>
                        <div className="space-y-2">
                            <a href="/dashboard" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → View Latest Reports
                            </a>
                            <a href="/docs/guides/security/understanding-findings" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Detailed Findings Guide
                            </a>
                            <a href="/docs/guides/security/fixing-vulnerabilities" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Vulnerability Fixes
                            </a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Critical Priority</h3>
                        <p className="text-xs text-zinc-300 mb-3">
                            These issues pose immediate security threats and should be addressed within 24 hours.
                        </p>
                        <div className="space-y-1 text-xs text-zinc-400">
                            <div>• Remote Code Execution</div>
                            <div>• SQL Injection</div>
                            <div>• Authentication Bypass</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Score Interpretation</h3>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-green-400">90-100:</span>
                                <span className="text-zinc-400">Excellent security posture</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-yellow-400">70-89:</span>
                                <span className="text-zinc-400">Good with room for improvement</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-orange-400">50-69:</span>
                                <span className="text-zinc-400">Needs attention</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-red-400">0-49:</span>
                                <span className="text-zinc-400">Critical security review required</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Export Options</h3>
                        <div className="space-y-2 text-sm">
                            <div className="text-zinc-400">📄 PDF Report</div>
                            <div className="text-zinc-400">📊 JSON Export</div>
                            <div className="text-zinc-400">🔗 Shareable Link</div>
                            <div className="text-zinc-400">📧 Email Summary</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Need Help?</h3>
                        <div className="space-y-2">
                            <a href="/docs/reference/support" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Contact Support
                            </a>
                            <a href="/docs/reference/faq" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → FAQ
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

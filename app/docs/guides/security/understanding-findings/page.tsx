export default function UnderstandingFindingsPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Understanding Security Findings</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Learn to interpret CortexEDR security findings effectively. Understand vulnerability patterns, risk assessment, and how to prioritize remediation efforts for maximum security impact.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Common Vulnerability Patterns */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🔍 Common Vulnerability Patterns</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Injection Attacks</h3>
                                    <div className="space-y-3">
                                        <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                                            <h4 className="text-red-400 font-medium text-sm mb-1">SQL Injection</h4>
                                            <p className="text-zinc-400 text-sm">Malicious SQL code execution through user input. Most common web vulnerability.</p>
                                            <div className="mt-2 text-xs text-zinc-500">
                                                <strong>Impact:</strong> Data theft, modification, deletion
                                            </div>
                                        </div>

                                        <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3">
                                            <h4 className="text-orange-400 font-medium text-sm mb-1">Command Injection</h4>
                                            <p className="text-zinc-400 text-sm">System command execution through unsanitized input.</p>
                                            <div className="mt-2 text-xs text-zinc-500">
                                                <strong>Impact:</strong> Server compromise, lateral movement
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">Authentication Issues</h3>
                                    <div className="space-y-3">
                                        <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                                            <h4 className="text-red-400 font-medium text-sm mb-1">Broken Authentication</h4>
                                            <p className="text-zinc-400 text-sm">Flawed session management or credential handling.</p>
                                            <div className="mt-2 text-xs text-zinc-500">
                                                <strong>Impact:</strong> Account takeover, data breach
                                            </div>
                                        </div>

                                        <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3">
                                            <h4 className="text-orange-400 font-medium text-sm mb-1">Weak Password Policies</h4>
                                            <p className="text-zinc-400 text-sm">Insufficient password requirements or enforcement.</p>
                                            <div className="mt-2 text-xs text-zinc-500">
                                                <strong>Impact:</strong> Brute force attacks, credential stuffing
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Severity Assessment Framework */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">📊 Severity Assessment Framework</h2>
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-3">Risk Scoring Methodology</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-400 mb-1">9.0-10.0</div>
                                        <div className="text-zinc-300 font-medium">Critical</div>
                                        <div className="text-zinc-500 text-xs">Immediate action required</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-400 mb-1">7.0-8.9</div>
                                        <div className="text-zinc-300 font-medium">High</div>
                                        <div className="text-zinc-500 text-xs">Fix within 30 days</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-400 mb-1">4.0-6.9</div>
                                        <div className="text-zinc-300 font-medium">Medium</div>
                                        <div className="text-zinc-500 text-xs">Fix within 90 days</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Impact Factors</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Data Exposure:</span>
                                            <span className="text-red-400">High Impact</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">System Compromise:</span>
                                            <span className="text-red-400">High Impact</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Service Disruption:</span>
                                            <span className="text-orange-400">Medium Impact</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Information Leakage:</span>
                                            <span className="text-yellow-400">Low Impact</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">Exploitability Factors</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Remote Code Execution:</span>
                                            <span className="text-red-400">High Risk</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">No Authentication Required:</span>
                                            <span className="text-red-400">High Risk</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Complex Attack Vector:</span>
                                            <span className="text-green-400">Low Risk</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Requires Special Access:</span>
                                            <span className="text-green-400">Low Risk</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Understanding CWE Classifications */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🏷️ CWE Classification System</h2>
                        <div className="space-y-4">
                            <p className="text-zinc-400">
                                Common Weakness Enumeration (CWE) provides a standardized way to categorize software weaknesses.
                                Understanding CWE IDs helps prioritize remediation based on industry standards.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Critical CWE Categories</h3>
                                    <div className="space-y-3">
                                        <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <code className="text-red-400 font-mono text-sm">CWE-79</code>
                                                <span className="text-xs text-red-400">Critical</span>
                                            </div>
                                            <div className="text-zinc-400 text-sm">Cross-site Scripting (XSS)</div>
                                        </div>

                                        <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <code className="text-red-400 font-mono text-sm">CWE-89</code>
                                                <span className="text-xs text-red-400">Critical</span>
                                            </div>
                                            <div className="text-zinc-400 text-sm">SQL Injection</div>
                                        </div>

                                        <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <code className="text-orange-400 font-mono text-sm">CWE-287</code>
                                                <span className="text-xs text-orange-400">High</span>
                                            </div>
                                            <div className="text-zinc-400 text-sm">Improper Authentication</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">Common CWE Patterns</h3>
                                    <div className="space-y-3">
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <code className="text-blue-400 font-mono text-sm">CWE-200</code>
                                                <span className="text-xs text-blue-400">Info Leak</span>
                                            </div>
                                            <div className="text-zinc-400 text-sm">Information Exposure</div>
                                        </div>

                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <code className="text-yellow-400 font-mono text-sm">CWE-400</code>
                                                <span className="text-xs text-yellow-400">DoS</span>
                                            </div>
                                            <div className="text-zinc-400 text-sm">Uncontrolled Resource Consumption</div>
                                        </div>

                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded p-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <code className="text-purple-400 font-mono text-sm">CWE-502</code>
                                                <span className="text-xs text-purple-400">Deserialization</span>
                                            </div>
                                            <div className="text-zinc-400 text-sm">Deserialization of Untrusted Data</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/50 rounded p-4 border border-white/10">
                                <h3 className="font-semibold text-white mb-2">CWE Research Resources</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    <a href="https://cwe.mitre.org/top25/" target="_blank" className="text-indigo-400 hover:text-indigo-300">
                                        CWE Top 25
                                    </a>
                                    <a href="https://cwe.mitre.org/data/" target="_blank" className="text-indigo-400 hover:text-indigo-300">
                                        CWE Database
                                    </a>
                                    <a href="https://cwe.mitre.org/data/xml/cwec_latest.xml.zip" target="_blank" className="text-indigo-400 hover:text-indigo-300">
                                        CWE XML
                                    </a>
                                    <a href="https://cwe.mitre.org/about/index.html" target="_blank" className="text-indigo-400 hover:text-indigo-300">
                                        About CWE
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* False Positives vs Real Issues */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🎯 Distinguishing Real Issues from False Positives</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-green-400 mb-3">✅ Likely Real Issues</h3>
                                    <div className="space-y-3">
                                        <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                            <h4 className="text-green-400 font-medium text-sm mb-1">Direct User Input</h4>
                                            <p className="text-zinc-400 text-sm">Code that directly uses unsanitized user input in SQL queries, HTML output, or system commands.</p>
                                        </div>

                                        <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                            <h4 className="text-green-400 font-medium text-sm mb-1">Known Vulnerable Patterns</h4>
                                            <p className="text-zinc-400 text-sm">Code that matches well-known vulnerable patterns from security databases.</p>
                                        </div>

                                        <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                            <h4 className="text-green-400 font-medium text-sm mb-1">Privilege Escalation</h4>
                                            <p className="text-zinc-400 text-sm">Code that allows unauthorized access to sensitive resources or functions.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-yellow-400 mb-3">⚠️ Potential False Positives</h3>
                                    <div className="space-y-3">
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                                            <h4 className="text-yellow-400 font-medium text-sm mb-1">Sanitized Input</h4>
                                            <p className="text-zinc-400 text-sm">Input that has been properly validated, escaped, or parameterized.</p>
                                        </div>

                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                                            <h4 className="text-yellow-400 font-medium text-sm mb-1">Internal/Trusted Data</h4>
                                            <p className="text-zinc-400 text-sm">Data from internal systems or trusted sources that cannot be manipulated by users.</p>
                                        </div>

                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                                            <h4 className="text-yellow-400 font-medium text-sm mb-1">Dead/Test Code</h4>
                                            <p className="text-zinc-400 text-sm">Code that is unreachable, in test files, or not deployed to production.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-2">Verification Checklist</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <h4 className="text-indigo-400 font-medium mb-2">For SQL Injection Findings:</h4>
                                        <ul className="text-zinc-400 space-y-1">
                                            <li>• Is input parameterized?</li>
                                            <li>• Are prepared statements used?</li>
                                            <li>• Is input properly escaped?</li>
                                            <li>• Is user input validated?</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-indigo-400 font-medium mb-2">For XSS Findings:</h4>
                                        <ul className="text-zinc-400 space-y-1">
                                            <li>• Is output properly escaped?</li>
                                            <li>• Is Content Security Policy set?</li>
                                            <li>• Is input sanitized?</li>
                                            <li>• Are templates secure?</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Remediation Prioritization */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🎯 Remediation Prioritization Strategy</h2>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-3">Priority Matrix</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left py-2 text-zinc-300">Impact</th>
                                                <th className="text-center py-2 text-zinc-300">High Exploitability</th>
                                                <th className="text-center py-2 text-zinc-300">Medium Exploitability</th>
                                                <th className="text-center py-2 text-zinc-300">Low Exploitability</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-center">
                                            <tr className="border-b border-white/5">
                                                <td className="text-left py-2 text-red-400 font-medium">Critical Impact</td>
                                                <td className="py-2 text-red-400 font-bold">P0 - Fix Immediately</td>
                                                <td className="py-2 text-red-400 font-bold">P0 - Fix Immediately</td>
                                                <td className="py-2 text-orange-400 font-bold">P1 - Fix This Sprint</td>
                                            </tr>
                                            <tr className="border-b border-white/5">
                                                <td className="text-left py-2 text-orange-400 font-medium">High Impact</td>
                                                <td className="py-2 text-orange-400 font-bold">P1 - Fix This Sprint</td>
                                                <td className="py-2 text-yellow-400 font-bold">P2 - Fix Next Sprint</td>
                                                <td className="py-2 text-blue-400 font-bold">P3 - Plan for Later</td>
                                            </tr>
                                            <tr>
                                                <td className="text-left py-2 text-yellow-400 font-medium">Medium Impact</td>
                                                <td className="py-2 text-yellow-400 font-bold">P2 - Fix Next Sprint</td>
                                                <td className="py-2 text-blue-400 font-bold">P3 - Plan for Later</td>
                                                <td className="py-2 text-zinc-400">P4 - Technical Debt</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-black/30 rounded p-3 border border-white/5">
                                    <h3 className="font-semibold text-red-400 mb-2">P0 - Critical</h3>
                                    <p className="text-sm text-zinc-400">Active exploitation possible. Fix immediately, potentially deploy out-of-band.</p>
                                </div>

                                <div className="bg-black/30 rounded p-3 border border-white/5">
                                    <h3 className="font-semibold text-orange-400 mb-2">P1 - High</h3>
                                    <p className="text-sm text-zinc-400">High risk vulnerabilities. Include in current sprint planning.</p>
                                </div>

                                <div className="bg-black/30 rounded p-3 border border-white/5">
                                    <h3 className="font-semibold text-yellow-400 mb-2">P2 - Medium</h3>
                                    <p className="text-sm text-zinc-400">Moderate risk issues. Plan for next sprint or release cycle.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Understanding Findings</h3>
                        <div className="space-y-2">
                            <a href="/docs/guides/security/fixing-vulnerabilities" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Fixing Vulnerabilities
                            </a>
                            <a href="/docs/getting-started/reading-reports" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Reading Security Reports
                            </a>
                            <a href="/docs/guides/best-practices" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Security Best Practices
                            </a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Risk Assessment</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-zinc-400">Likelihood:</span>
                                    <span className="text-orange-400">High</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-zinc-400">Impact:</span>
                                    <span className="text-red-400">Critical</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Overall Risk:</span>
                                    <span className="text-red-400 font-bold">Critical</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Common CWE IDs</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <code className="text-red-400">CWE-79</code>
                                <span className="text-zinc-400">XSS</span>
                            </div>
                            <div className="flex justify-between">
                                <code className="text-red-400">CWE-89</code>
                                <span className="text-zinc-400">SQL Injection</span>
                            </div>
                            <div className="flex justify-between">
                                <code className="text-orange-400">CWE-287</code>
                                <span className="text-zinc-400">Auth Issues</span>
                            </div>
                            <div className="flex justify-between">
                                <code className="text-yellow-400">CWE-200</code>
                                <span className="text-zinc-400">Info Leak</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Investigation Steps</h3>
                        <div className="space-y-2 text-sm text-zinc-400">
                            <div>1. Review the finding details</div>
                            <div>2. Understand the attack vector</div>
                            <div>3. Check for existing mitigations</div>
                            <div>4. Assess exploitability</div>
                            <div>5. Determine remediation priority</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Resources</h3>
                        <div className="space-y-2">
                            <a href="https://cwe.mitre.org/" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → CWE Database
                            </a>
                            <a href="https://owasp.org/" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → OWASP Resources
                            </a>
                            <a href="https://nvd.nist.gov/" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → NIST Vulnerability DB
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

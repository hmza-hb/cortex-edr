export default function BestPracticesPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Security Best Practices</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Comprehensive guide to implementing security best practices in your development workflow. Learn how to prevent vulnerabilities, maintain secure code, and integrate security into your development process.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Development Security */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🔒 Secure Development Practices</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Input Validation</h3>
                                    <div className="space-y-3">
                                        <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                            <h4 className="text-green-400 font-medium text-sm mb-1">✅ Always Validate Input</h4>
                                            <p className="text-zinc-400 text-sm">Validate all user inputs on both client and server side. Never trust user data.</p>
                                        </div>

                                        <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                            <h4 className="text-green-400 font-medium text-sm mb-1">✅ Use Whitelisting</h4>
                                            <p className="text-zinc-400 text-sm">Accept only known good values instead of rejecting bad ones.</p>
                                        </div>

                                        <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                            <h4 className="text-green-400 font-medium text-sm mb-1">✅ Sanitize Output</h4>
                                            <p className="text-zinc-400 text-sm">Escape special characters before displaying user data.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">Authentication & Authorization</h3>
                                    <div className="space-y-3">
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                                            <h4 className="text-blue-400 font-medium text-sm mb-1">🔐 Use Strong Passwords</h4>
                                            <p className="text-zinc-400 text-sm">Enforce minimum complexity and regular rotation.</p>
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                                            <h4 className="text-blue-400 font-medium text-sm mb-1">🎯 Implement MFA</h4>
                                            <p className="text-zinc-400 text-sm">Add multi-factor authentication for all user accounts.</p>
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                                            <h4 className="text-blue-400 font-medium text-sm mb-1">👥 Role-Based Access</h4>
                                            <p className="text-zinc-400 text-sm">Implement principle of least privilege.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Code Security */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">💻 Code Security Standards</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-black/30 rounded p-4 border border-white/5">
                                    <h3 className="font-semibold text-white mb-2">🔐 Secrets Management</h3>
                                    <ul className="text-sm text-zinc-400 space-y-1">
                                        <li>• Never hardcode secrets</li>
                                        <li>• Use environment variables</li>
                                        <li>• Rotate keys regularly</li>
                                        <li>• Use secret management services</li>
                                    </ul>
                                </div>

                                <div className="bg-black/30 rounded p-4 border border-white/5">
                                    <h3 className="font-semibold text-white mb-2">📦 Dependency Security</h3>
                                    <ul className="text-sm text-zinc-400 space-y-1">
                                        <li>• Audit dependencies regularly</li>
                                        <li>• Update to latest secure versions</li>
                                        <li>• Remove unused dependencies</li>
                                        <li>• Monitor for vulnerabilities</li>
                                    </ul>
                                </div>

                                <div className="bg-black/30 rounded p-4 border border-white/5">
                                    <h3 className="font-semibold text-white mb-2">🚀 Error Handling</h3>
                                    <ul className="text-sm text-zinc-400 space-y-1">
                                        <li>• Don't expose sensitive information</li>
                                        <li>• Use generic error messages</li>
                                        <li>• Log errors securely</li>
                                        <li>• Implement proper exception handling</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure Security */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🏗️ Infrastructure Security</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">🌐 Network Security</h3>
                                    <div className="space-y-3">
                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded p-3">
                                            <h4 className="text-purple-400 font-medium text-sm mb-1">Use HTTPS Everywhere</h4>
                                            <p className="text-zinc-400 text-sm">Implement SSL/TLS certificates and redirect all HTTP traffic.</p>
                                        </div>

                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded p-3">
                                            <h4 className="text-purple-400 font-medium text-sm mb-1">Configure Firewalls</h4>
                                            <p className="text-zinc-400 text-sm">Set up Web Application Firewalls (WAF) and network firewalls.</p>
                                        </div>

                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded p-3">
                                            <h4 className="text-purple-400 font-medium text-sm mb-1">Limit Exposure</h4>
                                            <p className="text-zinc-400 text-sm">Use minimal network ports and implement network segmentation.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">☁️ Cloud Security</h3>
                                    <div className="space-y-3">
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3">
                                            <h4 className="text-indigo-400 font-medium text-sm mb-1">Principle of Least Privilege</h4>
                                            <p className="text-zinc-400 text-sm">Grant minimal permissions required for each service.</p>
                                        </div>

                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3">
                                            <h4 className="text-indigo-400 font-medium text-sm mb-1">Enable Monitoring</h4>
                                            <p className="text-zinc-400 text-sm">Implement comprehensive logging and monitoring.</p>
                                        </div>

                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3">
                                            <h4 className="text-indigo-400 font-medium text-sm mb-1">Regular Backups</h4>
                                            <p className="text-zinc-400 text-sm">Automate backups with encryption and testing.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CI/CD Security */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🔄 CI/CD Pipeline Security</h2>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-2">🚨 Critical Security Gates</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <h4 className="text-orange-400 font-medium mb-2">Automated Security Scanning</h4>
                                        <ul className="text-zinc-400 space-y-1">
                                            <li>• Static Application Security Testing (SAST)</li>
                                            <li>• Software Composition Analysis (SCA)</li>
                                            <li>• Container image scanning</li>
                                            <li>• Dependency vulnerability checks</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-orange-400 font-medium mb-2">Quality Gates</h4>
                                        <ul className="text-zinc-400 space-y-1">
                                            <li>• Block builds with critical vulnerabilities</li>
                                            <li>• Require code review for security changes</li>
                                            <li>• Enforce security testing coverage</li>
                                            <li>• Automated security regression testing</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-black/30 rounded p-3 border border-white/5">
                                    <h3 className="font-semibold text-white mb-2">🔑 Secret Management</h3>
                                    <p className="text-sm text-zinc-400">Use dedicated secret management services instead of environment variables.</p>
                                </div>

                                <div className="bg-black/30 rounded p-3 border border-white/5">
                                    <h3 className="font-semibold text-white mb-2">📦 Artifact Security</h3>
                                    <p className="text-sm text-zinc-400">Sign and verify all build artifacts and container images.</p>
                                </div>

                                <div className="bg-black/30 rounded p-3 border border-white/5">
                                    <h3 className="font-semibold text-white mb-2">🚀 Deployment Security</h3>
                                    <p className="text-sm text-zinc-400">Implement canary deployments and automated rollback capabilities.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compliance & Standards */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">📋 Compliance & Standards</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">OWASP Top 10</h3>
                                    <div className="space-y-2 text-sm">
                                        {[
                                            'Injection',
                                            'Broken Authentication',
                                            'Sensitive Data Exposure',
                                            'XML External Entities',
                                            'Broken Access Control',
                                            'Security Misconfiguration',
                                            'Cross-Site Scripting',
                                            'Insecure Deserialization',
                                            'Vulnerable Components',
                                            'Insufficient Logging'
                                        ].map((item, index) => (
                                            <div key={item} className="flex items-center gap-2 text-zinc-400">
                                                <span className="text-zinc-600 font-mono text-xs">#{index + 1}</span>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">Industry Standards</h3>
                                    <div className="space-y-3">
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                                            <h4 className="text-blue-400 font-medium text-sm">SOC 2 Type II</h4>
                                            <p className="text-zinc-400 text-sm">Trust Services Criteria for security, availability, and confidentiality.</p>
                                        </div>

                                        <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                            <h4 className="text-green-400 font-medium text-sm">ISO 27001</h4>
                                            <p className="text-zinc-400 text-sm">Information security management systems standard.</p>
                                        </div>

                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded p-3">
                                            <h4 className="text-purple-400 font-medium text-sm">NIST Framework</h4>
                                            <p className="text-zinc-400 text-sm">Cybersecurity framework for identifying and managing risk.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monitoring & Response */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">📊 Security Monitoring & Incident Response</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Continuous Monitoring</h3>
                                    <div className="space-y-3">
                                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded p-3">
                                            <h4 className="text-cyan-400 font-medium text-sm mb-1">Log Everything</h4>
                                            <p className="text-zinc-400 text-sm">Implement comprehensive logging for security events.</p>
                                        </div>

                                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded p-3">
                                            <h4 className="text-cyan-400 font-medium text-sm mb-1">Real-time Alerts</h4>
                                            <p className="text-zinc-400 text-sm">Set up alerts for suspicious activities and anomalies.</p>
                                        </div>

                                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded p-3">
                                            <h4 className="text-cyan-400 font-medium text-sm mb-1">Automated Response</h4>
                                            <p className="text-zinc-400 text-sm">Implement automated responses for common security events.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">Incident Response Plan</h3>
                                    <div className="space-y-3 text-sm text-zinc-400">
                                        <div className="flex items-start gap-2">
                                            <span className="text-red-400 font-bold">1.</span>
                                            <div>Preparation - Establish incident response team and tools</div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-orange-400 font-bold">2.</span>
                                            <div>Identification - Detect and assess security incidents</div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-yellow-400 font-bold">3.</span>
                                            <div>Containment - Isolate affected systems and prevent spread</div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-blue-400 font-bold">4.</span>
                                            <div>Recovery - Restore systems and monitor for anomalies</div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-400 font-bold">5.</span>
                                            <div>Lessons Learned - Document and improve response procedures</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
                        <div className="space-y-2">
                            <a href="/docs/guides/security/understanding-findings" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Understanding Security Findings
                            </a>
                            <a href="/docs/guides/security/fixing-vulnerabilities" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Fixing Vulnerabilities
                            </a>
                            <a href="/docs/getting-started/reading-reports" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Reading Security Reports
                            </a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Security Score Goals</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-green-400">90-100:</span>
                                <span className="text-zinc-300">Excellent</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-yellow-400">70-89:</span>
                                <span className="text-zinc-300">Good</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-orange-400">50-69:</span>
                                <span className="text-zinc-300">Needs Attention</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-red-400">0-49:</span>
                                <span className="text-zinc-300">Critical Review</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Implementation Checklist</h3>
                        <div className="space-y-2 text-sm">
                            <label className="flex items-center gap-2 text-zinc-400">
                                <input type="checkbox" className="rounded" />
                                <span>Input validation implemented</span>
                            </label>
                            <label className="flex items-center gap-2 text-zinc-400">
                                <input type="checkbox" className="rounded" />
                                <span>Authentication secured</span>
                            </label>
                            <label className="flex items-center gap-2 text-zinc-400">
                                <input type="checkbox" className="rounded" />
                                <span>Dependencies audited</span>
                            </label>
                            <label className="flex items-center gap-2 text-zinc-400">
                                <input type="checkbox" className="rounded" />
                                <span>Secrets management configured</span>
                            </label>
                            <label className="flex items-center gap-2 text-zinc-400">
                                <input type="checkbox" className="rounded" />
                                <span>CI/CD security gates active</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Resources</h3>
                        <div className="space-y-2">
                            <a href="https://owasp.org/www-project-top-ten/" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → OWASP Top 10
                            </a>
                            <a href="https://nvd.nist.gov/" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → NIST Vulnerability Database
                            </a>
                            <a href="https://cwe.mitre.org/" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Common Weakness Enumeration
                            </a>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Need Expert Help?</h3>
                        <div className="space-y-2">
                            <a href="/docs/reference/support" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Security Consulting
                            </a>
                            <a href="/docs/reference/faq" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Security FAQ
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

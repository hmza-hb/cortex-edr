import React from "react";

export default function PrivacyPage() {
    const lastUpdated = "February 28, 2026";

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <section className="text-center pb-8 border-b border-white/10">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <img src="/assets/logo.png" alt="CortexEDR Logo" className="h-12 w-12" />
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Privacy Policy</h1>
                        <div className="text-sm font-mono text-white/60 uppercase tracking-widest">
                            CortexEDR Enterprise Security Platform
                        </div>
                    </div>
                </div>
                <div className="text-[10px] font-mono text-white/40 mb-6 uppercase tracking-[0.2em]">
                    Version 3.0 // Last Updated: {lastUpdated}
                </div>
                <p className="text-white/70 leading-relaxed text-lg max-w-3xl mx-auto">
                    At CortexEDR, we are committed to protecting your privacy and ensuring the security of your data.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered cybersecurity platform.
                </p>
            </section>

            {/* Table of Contents */}
            <section className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <a href="#information-collection" className="text-indigo-400 hover:text-indigo-300">1. Information We Collect</a>
                    <a href="#information-usage" className="text-indigo-400 hover:text-indigo-300">2. How We Use Your Information</a>
                    <a href="#information-sharing" className="text-indigo-400 hover:text-indigo-300">3. Information Sharing and Disclosure</a>
                    <a href="#data-security" className="text-indigo-400 hover:text-indigo-300">4. Data Security</a>
                    <a href="#data-retention" className="text-indigo-400 hover:text-indigo-300">5. Data Retention</a>
                    <a href="#international-transfers" className="text-indigo-400 hover:text-indigo-300">6. International Data Transfers</a>
                    <a href="#user-rights" className="text-indigo-400 hover:text-indigo-300">7. Your Rights and Choices</a>
                    <a href="#cookies" className="text-indigo-400 hover:text-indigo-300">8. Cookies and Tracking Technologies</a>
                    <a href="#third-party" className="text-indigo-400 hover:text-indigo-300">9. Third-Party Services</a>
                    <a href="#children" className="text-indigo-400 hover:text-indigo-300">10. Children's Privacy</a>
                    <a href="#updates" className="text-indigo-400 hover:text-indigo-300">11. Changes to This Privacy Policy</a>
                    <a href="#contact" className="text-indigo-400 hover:text-indigo-300">12. Contact Us</a>
                </div>
            </section>

            {/* Information Collection */}
            <section id="information-collection" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">1. Information We Collect</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">1.1 Information You Provide</h3>
                        <ul className="list-disc pl-6 space-y-2 text-white/70">
                            <li><strong>Account Information:</strong> Name, email address, company information, and billing details when you create an account</li>
                            <li><strong>Repository Data:</strong> GitHub repository URLs and access tokens you provide for scanning</li>
                            <li><strong>Communication:</strong> Messages, feedback, and support requests you send to us</li>
                            <li><strong>Profile Information:</strong> Professional information and preferences you choose to share</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">1.2 Information We Collect Automatically</h3>
                        <ul className="list-disc pl-6 space-y-2 text-white/70">
                            <li><strong>Usage Data:</strong> How you interact with our platform, features used, and scan configurations</li>
                            <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                            <li><strong>Log Data:</strong> System logs, error reports, and performance metrics</li>
                            <li><strong>Cookies and Tracking:</strong> Information collected through cookies and similar technologies</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">1.3 Source Code and Security Data</h3>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                            <h4 className="text-red-400 font-medium mb-2">⚠️ Critical Security Notice</h4>
                            <p className="text-white/70 mb-3">
                                <strong>We do NOT store your source code.</strong> During security scans, we temporarily analyze your code in ephemeral environments.
                                All source code is processed in memory only and is permanently deleted after analysis completion.
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-white/70">
                                <li>We extract security-relevant metadata only (vulnerability patterns, dependency information)</li>
                                <li>Source code is never persisted to disk or databases</li>
                                <li>Analysis results are encrypted and stored securely</li>
                                <li>You retain full ownership of your source code at all times</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Information Usage */}
            <section id="information-usage" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">2. How We Use Your Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Primary Purposes</h3>
                        <ul className="space-y-3 text-white/70">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>Provide, maintain, and improve our security scanning services</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>Process payments and manage your account</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>Send you important service updates and notifications</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>Provide customer support and technical assistance</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Secondary Purposes</h3>
                        <ul className="space-y-3 text-white/70">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Analyze usage patterns to improve our platform</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Develop new features and security capabilities</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Ensure platform security and prevent abuse</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Comply with legal obligations</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Information Sharing */}
            <section id="information-sharing" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">3. Information Sharing and Disclosure</h2>

                <div className="space-y-6">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h3 className="text-green-400 font-semibold mb-2">We Do NOT Sell Your Data</h3>
                        <p className="text-white/70">
                            CortexEDR does not sell, trade, or rent your personal information to third parties for marketing purposes.
                            We only share information as described in this policy and as required by law.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Permitted Disclosures</h3>
                        <ul className="space-y-3 text-white/70">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Service Providers:</strong> Trusted third-party services that help us operate (payment processors, cloud infrastructure)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Consent:</strong> With your explicit consent for specific purposes</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Data Security */}
            <section id="data-security" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">4. Data Security</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Technical Safeguards</h3>
                        <ul className="space-y-2 text-white/70">
                            <li>• AES-256 encryption for data at rest</li>
                            <li>• TLS 1.3 encryption for data in transit</li>
                            <li>• SOC 2 Type II compliant infrastructure</li>
                            <li>• Regular security audits and penetration testing</li>
                            <li>• Multi-factor authentication for all accounts</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Administrative Safeguards</h3>
                        <ul className="space-y-2 text-white/70">
                            <li>• Strict access controls and role-based permissions</li>
                            <li>• Regular security training for all employees</li>
                            <li>• Incident response procedures and breach notification</li>
                            <li>• Regular backup and disaster recovery testing</li>
                            <li>• Third-party security assessments</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Data Retention */}
            <section id="data-retention" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">5. Data Retention</h2>

                <div className="space-y-4">
                    <p className="text-white/70">
                        We retain your information only as long as necessary to provide our services and comply with legal obligations.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-800/50 rounded p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">Account Data</h3>
                            <p className="text-zinc-400 text-sm">Retained until account deletion, then permanently removed within 30 days</p>
                        </div>

                        <div className="bg-zinc-800/50 rounded p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">Scan Results</h3>
                            <p className="text-zinc-400 text-sm">Retained for the duration of your subscription plus 90 days grace period</p>
                        </div>

                        <div className="bg-zinc-800/50 rounded p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">Billing Information</h3>
                            <p className="text-zinc-400 text-sm">Retained for 7 years to comply with tax and accounting regulations</p>
                        </div>

                        <div className="bg-zinc-800/50 rounded p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">Log Data</h3>
                            <p className="text-zinc-400 text-sm">Anonymized and aggregated after 90 days, retained for analytics purposes</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* International Transfers */}
            <section id="international-transfers" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">6. International Data Transfers</h2>

                <div className="space-y-4">
                    <p className="text-white/70">
                        CortexEDR operates globally and may transfer your data to countries other than your own. We ensure appropriate safeguards are in place.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Legal Frameworks</h3>
                            <ul className="space-y-2 text-white/70">
                                <li>• Standard Contractual Clauses (SCCs)</li>
                                <li>• Adequacy decisions by relevant authorities</li>
                                <li>• Binding Corporate Rules (BCRs)</li>
                                <li>• Certification schemes and codes of conduct</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Data Processing Locations</h3>
                            <ul className="space-y-2 text-white/70">
                                <li>• Primary: United States (SOC 2 compliant)</li>
                                <li>• Backup: European Union (GDPR compliant)</li>
                                <li>• CDN: Global edge locations (encrypted)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* User Rights */}
            <section id="user-rights" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">7. Your Rights and Choices</h2>

                <div className="space-y-6">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6">
                        <h3 className="text-indigo-400 font-semibold mb-3">Your Privacy Rights</h3>
                        <p className="text-white/70 mb-4">
                            Depending on your location, you may have certain rights regarding your personal information:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-white font-medium mb-2">GDPR (EU Users)</h4>
                                <ul className="text-sm text-zinc-400 space-y-1">
                                    <li>• Right to access your data</li>
                                    <li>• Right to rectification</li>
                                    <li>• Right to erasure ("right to be forgotten")</li>
                                    <li>• Right to data portability</li>
                                    <li>• Right to object to processing</li>
                                    <li>• Right to restrict processing</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">CCPA (California Users)</h4>
                                <ul className="text-sm text-zinc-400 space-y-1">
                                    <li>• Right to know what data we collect</li>
                                    <li>• Right to delete personal information</li>
                                    <li>• Right to opt-out of data sales</li>
                                    <li>• Right to non-discrimination</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">How to Exercise Your Rights</h3>
                        <div className="bg-zinc-800/50 rounded p-4 border border-white/5">
                            <p className="text-white/70 mb-3">
                                To exercise any of these rights, please contact us using the information provided in the Contact Us section below.
                                We will respond to your request within 30 days and may require verification of your identity.
                            </p>
                            <div className="text-sm text-zinc-400">
                                <strong>Note:</strong> Some rights may not apply in all circumstances, and we may need to retain certain information for legal or legitimate business purposes.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cookies */}
            <section id="cookies" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">8. Cookies and Tracking Technologies</h2>

                <div className="space-y-4">
                    <p className="text-white/70">
                        We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized services.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-500/10 border border-green-500/20 rounded p-4">
                            <h3 className="text-green-400 font-medium mb-2">Essential Cookies</h3>
                            <p className="text-sm text-zinc-400">Required for basic platform functionality and security</p>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                            <h3 className="text-blue-400 font-medium mb-2">Analytics Cookies</h3>
                            <p className="text-sm text-zinc-400">Help us understand how users interact with our platform</p>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/20 rounded p-4">
                            <h3 className="text-purple-400 font-medium mb-2">Functional Cookies</h3>
                            <p className="text-sm text-zinc-400">Remember your preferences and settings</p>
                        </div>
                    </div>

                    <div className="bg-zinc-800/50 rounded p-4 border border-white/5">
                        <h3 className="text-white font-medium mb-2">Cookie Management</h3>
                        <p className="text-zinc-400 text-sm">
                            You can control cookie settings through your browser preferences. However, disabling certain cookies may affect platform functionality.
                            For more information about our cookie practices, please see our <a href="/legal/cookies" className="text-indigo-400 hover:text-indigo-300">Cookie Policy</a>.
                        </p>
                    </div>
                </div>
            </section>

            {/* Third-Party Services */}
            <section id="third-party" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">9. Third-Party Services</h2>

                <div className="space-y-4">
                    <p className="text-white/70">
                        We integrate with various third-party services to provide our platform. These services have their own privacy policies.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Infrastructure Providers</h3>
                            <ul className="space-y-2 text-white/70">
                                <li>• Amazon Web Services (hosting and data processing)</li>
                                <li>• Stripe (payment processing)</li>
                                <li>• GitHub (repository access)</li>
                                <li>• SendGrid (email communications)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Analytics & Security</h3>
                            <ul className="space-y-2 text-white/70">
                                <li>• Google Analytics (usage analytics)</li>
                                <li>• Sentry (error monitoring)</li>
                                <li>• Cloudflare (CDN and security)</li>
                                <li>• NextAuth (authentication)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Children's Privacy */}
            <section id="children" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">10. Children's Privacy</h2>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                    <p className="text-white/70">
                        CortexEDR is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                        If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
                        If you are a parent or guardian and you believe your child has provided us with personal information, please contact us immediately.
                    </p>
                </div>
            </section>

            {/* Updates */}
            <section id="updates" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">11. Changes to This Privacy Policy</h2>

                <div className="space-y-4">
                    <p className="text-white/70">
                        We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws.
                        We will notify you of any material changes by posting the updated policy on this page and updating the "Last Updated" date.
                    </p>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4">
                        <h3 className="text-yellow-400 font-medium mb-2">Notification of Changes</h3>
                        <ul className="text-sm text-zinc-400 space-y-1">
                            <li>• Major changes will be communicated via email</li>
                            <li>• Continued use of our services constitutes acceptance of updated policy</li>
                            <li>• Previous versions will be archived and available upon request</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">12. Contact Us</h2>

                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                    <p className="text-white/70 mb-4">
                        If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-white font-medium mb-2">Legal & Privacy Team</h3>
                            <div className="text-zinc-400 text-sm space-y-1">
                                <p>📧 legal@cortex-edr.com</p>
                                <p>📧 privacy@cortex-edr.com</p>
                                <p>📍 Lahore, Pakistan</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-medium mb-2">Response Times</h3>
                            <div className="text-zinc-400 text-sm space-y-1">
                                <p>• General inquiries: 24-48 hours</p>
                                <p>• Privacy rights requests: 30 days</p>
                                <p>• Security incidents: Immediate</p>
                                <p>• Business hours: UTC+5 (Pakistan Time)</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded">
                        <p className="text-indigo-300 text-sm">
                            <strong>Data Protection Officer:</strong> Hamza Hafeez Bhatti - Founder & CEO<br />
                            <strong>Certification:</strong> SOC 2 Type II Compliant | GDPR Ready | CCPA Compliant
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function FAQPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Frequently Asked Questions</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Common questions and answers about CortexEDR, security scanning, and platform features. Can't find what you're looking for? <a href="/docs/reference/support" className="text-indigo-400 hover:text-indigo-300">Contact our support team</a>.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Getting Started */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🚀 Getting Started</h2>
                        <div className="space-y-4">
                            <div className="border-l-2 border-indigo-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">How do I get started with CortexEDR?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Simply sign up for a free account at <a href="/" className="text-indigo-400 hover:text-indigo-300">cortex-edr.com</a>,
                                    connect your GitHub repository, and run your first scan. Our getting started guide will walk you through the entire process.
                                </p>
                            </div>

                            <div className="border-l-2 border-purple-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">What types of repositories does CortexEDR support?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    We support public and private GitHub repositories. For private repositories, you'll need to provide appropriate access tokens.
                                    We scan repositories up to 50MB in size and support all major programming languages and frameworks.
                                </p>
                            </div>

                            <div className="border-l-2 border-green-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">How long does a typical scan take?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Scan times vary by repository size: small repos (&lt;50 files) take 2-3 minutes, medium repos (50-200 files) take 5-8 minutes,
                                    and large repos (200+ files) can take 10-15 minutes. You'll receive real-time progress updates during the scan.
                                </p>
                            </div>

                            <div className="border-l-2 border-blue-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Do you store my source code?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    <strong>No, we do not store your source code.</strong> We perform analysis on ephemeral environments and only persist
                                    encrypted security manifests and metadata. Your code is never retained after analysis.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Plans */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">💰 Pricing & Plans</h2>
                        <div className="space-y-4">
                            <div className="border-l-2 border-indigo-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">What's included in the free plan?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    The free Vibe Coder plan includes 5 scans per month, basic security analysis, PDF reports, and email support.
                                    It's perfect for individual developers and small projects.
                                </p>
                            </div>

                            <div className="border-l-2 border-purple-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">How do I upgrade my plan?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    You can upgrade your plan anytime from the dashboard. Visit your account settings, click "Upgrade Plan",
                                    and select your preferred tier. Changes take effect immediately, and you'll be prorated for any unused time.
                                </p>
                            </div>

                            <div className="border-l-2 border-green-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Do you offer refunds?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service,
                                    contact our support team within 30 days of purchase for a full refund.
                                </p>
                            </div>

                            <div className="border-l-2 border-blue-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Are there enterprise discounts?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Yes, we offer custom enterprise pricing for teams of 50+ developers. Contact our sales team at
                                    <a href="mailto:enterprise@cortex-edr.com" className="text-indigo-400 hover:text-indigo-300"> enterprise@cortex-edr.com</a> for a quote.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Security & Technical */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🛡️ Security & Technical Questions</h2>
                        <div className="space-y-4">
                            <div className="border-l-2 border-red-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">How accurate are your security findings?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Our AI-powered analysis achieves 95%+ accuracy for known vulnerability patterns. We use multiple detection
                                    methods including static analysis, pattern matching, and machine learning. All findings include confidence
                                    scores and detailed explanations.
                                </p>
                            </div>

                            <div className="border-l-2 border-orange-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">What if I get false positives?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    False positives can occur. Each finding includes verification guidance to help you determine if it's a real issue.
                                    You can mark findings as "false positive" in your dashboard, which helps us improve our detection algorithms.
                                </p>
                            </div>

                            <div className="border-l-2 border-yellow-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">How do you handle sensitive data?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    We implement multiple layers of security: end-to-end encryption, SOC 2 Type II compliance, regular security audits,
                                    and strict data retention policies. No sensitive data from your codebase is ever stored permanently.
                                </p>
                            </div>

                            <div className="border-l-2 border-green-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">What languages and frameworks do you support?</h3>
                                <div className="text-zinc-400 text-sm">
                                    <p className="mb-2">We support all major languages and frameworks:</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                        {['JavaScript/TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'C++', 'Node.js', 'React', 'Vue.js', 'Angular', 'Express', 'Django', 'Spring', 'ASP.NET', 'Laravel'].map((tech) => (
                                            <span key={tech} className="bg-black/30 px-2 py-1 rounded text-zinc-300">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Integration & API */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🔗 Integration & API</h2>
                        <div className="space-y-4">
                            <div className="border-l-2 border-indigo-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">How do I integrate CortexEDR into my CI/CD pipeline?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    We provide native integrations for GitHub Actions, GitLab CI, Jenkins, CircleCI, and more. Our API supports
                                    webhook notifications and programmatic scanning. Check our <a href="/docs/api/webhooks" className="text-indigo-400 hover:text-indigo-300">webhooks documentation</a> for setup instructions.
                                </p>
                            </div>

                            <div className="border-l-2 border-purple-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Can I export scan results?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Yes, you can export results in multiple formats: PDF reports, JSON data, CSV summaries, and shareable links.
                                    Enterprise plans also include custom report templates and API access for programmatic exports.
                                </p>
                            </div>

                            <div className="border-l-2 border-green-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Do you support custom security rules?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Enterprise customers can define custom security rules and policies. Our team can help implement organization-specific
                                    security requirements and compliance frameworks.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account & Billing */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">👤 Account & Billing</h2>
                        <div className="space-y-4">
                            <div className="border-l-2 border-indigo-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">How do I change my billing information?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Visit your account settings, click on "Billing & Payments", and update your payment method or billing address.
                                    Changes take effect on your next billing cycle.
                                </p>
                            </div>

                            <div className="border-l-2 border-purple-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Can I cancel my subscription anytime?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Yes, you can cancel your subscription at any time from your account settings. You'll retain access to your
                                    scans and reports until the end of your current billing period.
                                </p>
                            </div>

                            <div className="border-l-2 border-green-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Do you offer team accounts?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Yes, our Developer and Enterprise plans support team accounts with role-based access control,
                                    shared repositories, and team analytics.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Still Need Help? */}
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6 text-center">
                        <h2 className="text-xl font-bold text-white mb-2">Still Need Help?</h2>
                        <p className="text-zinc-400 mb-4">Can't find the answer you're looking for? Our support team is here to help.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/docs/reference/support" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                Contact Support →
                            </a>
                            <a href="mailto:support@cortex-edr.com" className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                Email Us
                            </a>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">FAQ Categories</h3>
                        <div className="space-y-2">
                            <a href="#getting-started" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Getting Started
                            </a>
                            <a href="#pricing" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Pricing & Plans
                            </a>
                            <a href="#security" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Security & Technical
                            </a>
                            <a href="#integration" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Integration & API
                            </a>
                            <a href="#account" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Account & Billing
                            </a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Quick Actions</h3>
                        <div className="space-y-2 text-sm">
                            <a href="/" className="block text-indigo-400 hover:text-indigo-300">
                                Start Free Scan
                            </a>
                            <a href="/pricing" className="block text-indigo-400 hover:text-indigo-300">
                                View Pricing
                            </a>
                            <a href="/docs" className="block text-indigo-400 hover:text-indigo-300">
                                Browse Docs
                            </a>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Popular Topics</h3>
                        <div className="space-y-2 text-sm text-zinc-400">
                            <div>• How scanning works</div>
                            <div>• Understanding reports</div>
                            <div>• API rate limits</div>
                            <div>• Security compliance</div>
                            <div>• Integration guides</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Community</h3>
                        <div className="space-y-2">
                            <a href="https://github.com/hamza-hafeez82/cortex-edr" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → GitHub Repository
                            </a>
                            <a href="https://github.com/hamza-hafeez82/cortex-edr/discussions" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Community Discussions
                            </a>
                            <a href="https://github.com/hamza-hafeez82/cortex-edr/issues" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Report Issues
                            </a>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Contact Information</h3>
                        <div className="space-y-2 text-sm text-zinc-400">
                            <div>📧 support@cortex-edr.com</div>
                            <div>💬 Live chat (dashboard)</div>
                            <div>📞 Enterprise: +1 (555) 123-4567</div>
                            <div>⏰ Response: &lt; 24 hours</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

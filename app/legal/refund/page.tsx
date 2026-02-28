import React from "react";

export default function RefundPage() {
    const lastUpdated = "February 28, 2026";

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <section className="text-center pb-8 border-b border-white/10">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <img src="/assets/logo.png" alt="CortexEDR Logo" className="h-12 w-12" />
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Refund Policy</h1>
                        <div className="text-sm font-mono text-white/60 uppercase tracking-widest">
                            CortexEDR Enterprise Security Platform
                        </div>
                    </div>
                </div>
                <div className="text-[10px] font-mono text-white/40 mb-6 uppercase tracking-[0.2em]">
                    Version 2.0 // Last Updated: {lastUpdated}
                </div>
                <p className="text-white/70 leading-relaxed text-lg max-w-3xl mx-auto">
                    At CortexEDR, customer satisfaction is our priority. This Refund Policy outlines the conditions under which
                    refunds may be issued for our AI-powered cybersecurity platform services.
                </p>
            </section>

            {/* Overview */}
            <section className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Refund Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <div className="text-center mb-3">
                            <div className="text-3xl mb-2">💰</div>
                            <h3 className="text-green-400 font-medium">30-Day Guarantee</h3>
                        </div>
                        <p className="text-sm text-zinc-400">Full refund within 30 days of purchase for paid plans</p>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="text-center mb-3">
                            <div className="text-3xl mb-2">⚡</div>
                            <h3 className="text-blue-400 font-medium">Fast Processing</h3>
                        </div>
                        <p className="text-sm text-zinc-400">Refunds processed within 5-7 business days</p>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <div className="text-center mb-3">
                            <div className="text-3xl mb-2">🎯</div>
                            <h3 className="text-purple-400 font-medium">Case-by-Case</h3>
                        </div>
                        <p className="text-sm text-zinc-400">Each refund request evaluated individually</p>
                    </div>
                </div>
            </section>

            {/* Eligibility Criteria */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">1. Refund Eligibility</h2>

                <div className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                        <h3 className="text-green-400 font-semibold mb-3">✅ Eligible for Full Refund</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-white font-medium mb-2">Within 30 Days of Purchase</h4>
                                <ul className="list-disc pl-6 space-y-1 text-sm text-zinc-400">
                                    <li>Service not meeting basic functionality expectations</li>
                                    <li>Platform is completely inaccessible due to our technical issues</li>
                                    <li>Account setup issues preventing any usage</li>
                                    <li>Billing errors or duplicate charges</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">Technical Service Issues</h4>
                                <ul className="list-disc pl-6 space-y-1 text-sm text-zinc-400">
                                    <li>Verified platform outages lasting more than 24 consecutive hours</li>
                                    <li>Critical security features not functioning as documented</li>
                                    <li>API endpoints completely unavailable for more than 12 hours</li>
                                    <li>Data corruption or loss due to platform issues</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                        <h3 className="text-yellow-400 font-semibold mb-3">⚠️ Eligible for Partial Refund</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-white font-medium mb-2">After 30 Days (Annual Plans)</h4>
                                <ul className="list-disc pl-6 space-y-1 text-sm text-zinc-400">
                                    <li>Pro-rated refund for unused portion of annual subscription</li>
                                    <li>Extended service outages (more than 10% of billing period)</li>
                                    <li>Significant degradation of service quality</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">Change of Circumstances</h4>
                                <ul className="list-disc pl-6 space-y-1 text-sm text-zinc-400">
                                    <li>Company restructuring or project cancellation</li>
                                    <li>Budget constraints (case-by-case basis)</li>
                                    <li>Technology stack changes incompatible with our platform</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                        <h3 className="text-red-400 font-semibold mb-3">🚫 Not Eligible for Refund</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-white font-medium mb-2">Usage-Based Items</h4>
                                <ul className="list-disc pl-6 space-y-1 text-sm text-zinc-400">
                                    <li>Consumed scan credits or API calls</li>
                                    <li>Completed security assessments</li>
                                    <li>Custom integrations or configurations</li>
                                    <li>Consultation services already provided</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">Policy Violations</h4>
                                <ul className="list-disc pl-6 space-y-1 text-sm text-zinc-400">
                                    <li>Terms of Service violations</li>
                                    <li>Abusive or fraudulent usage</li>
                                    <li>Account sharing in violation of license</li>
                                    <li>Reverse engineering attempts</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subscription Types */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">2. Subscription Types & Refund Terms</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-800/50 rounded-lg p-6 border border-white/5">
                        <div className="text-center mb-4">
                            <h3 className="text-indigo-400 font-bold text-lg mb-1">Vibe Coder</h3>
                            <div className="text-zinc-400 text-sm">Free Plan</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-green-400 text-sm font-medium">No Refunds Required</div>
                            <div className="text-zinc-400 text-xs">
                                Free plan with no charges. No refund requests applicable.
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-500/10 rounded-lg p-6 border border-indigo-500/20">
                        <div className="text-center mb-4">
                            <h3 className="text-indigo-400 font-bold text-lg mb-1">Developer</h3>
                            <div className="text-zinc-400 text-sm">$29/month</div>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-indigo-500/20 rounded p-2 text-center mb-2">
                                <div className="text-indigo-300 text-sm font-medium">30-Day Full Refund</div>
                            </div>
                            <div className="text-zinc-400 text-xs">
                                • Full refund within 30 days<br/>
                                • Prorated after 30 days<br/>
                                • Monthly billing cycle
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/20">
                        <div className="text-center mb-4">
                            <h3 className="text-purple-400 font-bold text-lg mb-1">Enterprise</h3>
                            <div className="text-zinc-400 text-sm">Custom Pricing</div>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-purple-500/20 rounded p-2 text-center mb-2">
                                <div className="text-purple-300 text-sm font-medium">Custom Terms</div>
                            </div>
                            <div className="text-zinc-400 text-xs">
                                • Negotiated refund terms<br/>
                                • SLA-based guarantees<br/>
                                • Dedicated account management
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Refund Process */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">3. Refund Request Process</h2>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">How to Request a Refund</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-500/20 rounded-full text-indigo-400 font-bold text-sm">1</div>
                                    <div>
                                        <h4 className="text-white font-medium mb-1">Contact Support</h4>
                                        <p className="text-zinc-400 text-sm">Email support@cortex-edr.com with your request details</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-500/20 rounded-full text-indigo-400 font-bold text-sm">2</div>
                                    <div>
                                        <h4 className="text-white font-medium mb-1">Provide Details</h4>
                                        <p className="text-zinc-400 text-sm">Include account ID, reason for refund, and relevant dates</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-500/20 rounded-full text-indigo-400 font-bold text-sm">3</div>
                                    <div>
                                        <h4 className="text-white font-medium mb-1">Review Process</h4>
                                        <p className="text-zinc-400 text-sm">Our team reviews your request within 2 business days</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-500/20 rounded-full text-indigo-400 font-bold text-sm">4</div>
                                    <div>
                                        <h4 className="text-white font-medium mb-1">Refund Processing</h4>
                                        <p className="text-zinc-400 text-sm">Approved refunds processed within 5-7 business days</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Required Information</h3>
                            <div className="bg-zinc-800/50 rounded p-4 border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-300 text-sm">Account Email:</span>
                                    <span className="text-indigo-400 text-sm">Required</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-300 text-sm">Subscription ID:</span>
                                    <span className="text-indigo-400 text-sm">Required</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-300 text-sm">Purchase Date:</span>
                                    <span className="text-indigo-400 text-sm">Required</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-300 text-sm">Refund Reason:</span>
                                    <span className="text-indigo-400 text-sm">Required</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-300 text-sm">Preferred Payment Method:</span>
                                    <span className="text-yellow-400 text-sm">Optional</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-300 text-sm">Screenshots/Evidence:</span>
                                    <span className="text-yellow-400 text-sm">Optional</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                        <h3 className="text-blue-400 font-semibold mb-3">💬 Communication & Updates</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h4 className="text-white font-medium mb-2">Initial Response</h4>
                                <p className="text-zinc-400">Within 24 hours acknowledging receipt of your request</p>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-2">Review Timeline</h4>
                                <p className="text-zinc-400">2 business days for complete review and decision</p>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-2">Processing Time</h4>
                                <p className="text-zinc-400">5-7 business days for approved refund completion</p>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-2">Status Updates</h4>
                                <p className="text-zinc-400">Regular updates throughout the process</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cancellation vs Refund */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">4. Cancellation vs. Refund</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-zinc-800/50 rounded p-6 border border-white/5">
                        <h3 className="text-indigo-400 font-semibold mb-4">🚪 Account Cancellation</h3>
                        <div className="space-y-3 text-sm text-zinc-400">
                            <div>• <strong>When:</strong> You want to stop using the service</div>
                            <div>• <strong>Effect:</strong> Stops future billing immediately</div>
                            <div>• <strong>Access:</strong> Continues until end of billing period</div>
                            <div>• <strong>Data:</strong> Retained according to privacy policy</div>
                            <div>• <strong>Refund:</strong> Not automatically included (separate request)</div>
                        </div>
                        <div className="mt-4 p-3 bg-indigo-500/10 rounded">
                            <p className="text-indigo-300 text-xs">Cancellation doesn't automatically trigger a refund. Submit separate refund request if applicable.</p>
                        </div>
                    </div>

                    <div className="bg-zinc-800/50 rounded p-6 border border-white/5">
                        <h3 className="text-green-400 font-semibold mb-4">💰 Refund Request</h3>
                        <div className="space-y-3 text-sm text-zinc-400">
                            <div>• <strong>When:</strong> Service doesn't meet expectations</div>
                            <div>• <strong>Effect:</strong> Return of payment for unused service</div>
                            <div>• <strong>Access:</strong> May be terminated immediately</div>
                            <div>• <strong>Data:</strong> Subject to deletion per privacy policy</div>
                            <div>• <strong>Eligibility:</strong> Based on timing and circumstances</div>
                        </div>
                        <div className="mt-4 p-3 bg-green-500/10 rounded">
                            <p className="text-green-300 text-xs">Refunds are evaluated case-by-case based on eligibility criteria and timing.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Methods */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">5. Refund Payment Methods</h2>

                <div className="space-y-4">
                    <div className="bg-zinc-800/50 rounded p-6 border border-white/5">
                        <h3 className="text-white font-medium mb-4">Original Payment Method</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-2xl mb-2">💳</div>
                                <div className="text-indigo-400 font-medium">Credit Card</div>
                                <div className="text-zinc-500">3-5 business days</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl mb-2">🏦</div>
                                <div className="text-indigo-400 font-medium">Bank Transfer</div>
                                <div className="text-zinc-500">5-7 business days</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl mb-2">📱</div>
                                <div className="text-indigo-400 font-medium">Digital Wallet</div>
                                <div className="text-zinc-500">1-3 business days</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl mb-2">💰</div>
                                <div className="text-indigo-400 font-medium">PayPal</div>
                                <div className="text-zinc-500">1-2 business days</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                        <h3 className="text-yellow-400 font-semibold mb-3">⚠️ Refund Processing Notes</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• Refunds are processed to the original payment method whenever possible</li>
                            <li>• Alternative payment methods may be offered if the original is unavailable</li>
                            <li>• Processing times vary by payment method and financial institution</li>
                            <li>• You will receive email confirmation when refund is initiated</li>
                            <li>• Additional confirmation may be required for high-value refunds</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Special Circumstances */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">6. Special Circumstances</h2>

                <div className="space-y-6">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                        <h3 className="text-red-400 font-semibold mb-3">🚨 Service Disruptions</h3>
                        <p className="text-white/70 mb-4">
                            In cases of extended service outages or critical functionality failures, we may offer
                            account credits or refunds as compensation beyond our standard refund policy.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-red-500/20 rounded p-3">
                                <h4 className="text-red-300 font-medium mb-1">Extended Outage</h4>
                                <p className="text-zinc-400">Service unavailable for 24+ consecutive hours</p>
                            </div>
                            <div className="bg-red-500/20 rounded p-3">
                                <h4 className="text-red-300 font-medium mb-1">Data Loss</h4>
                                <p className="text-zinc-400">Critical data loss due to platform issues</p>
                            </div>
                            <div className="bg-red-500/20 rounded p-3">
                                <h4 className="text-red-300 font-medium mb-1">Security Breach</h4>
                                <p className="text-zinc-400">Platform security incident affecting your data</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                        <h3 className="text-blue-400 font-semibold mb-3">🎓 Educational & Nonprofit Organizations</h3>
                        <p className="text-white/70 mb-4">
                            Qualified educational institutions and registered nonprofit organizations may be eligible
                            for special refund considerations or extended trial periods.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-white font-medium mb-2">Required Documentation</h4>
                                <ul className="text-sm text-zinc-400 space-y-1">
                                    <li>• University/college enrollment verification</li>
                                    <li>• Nonprofit organization registration</li>
                                    <li>• Tax-exempt status documentation</li>
                                    <li>• Institutional email address</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-2">Available Options</h4>
                                <ul className="text-sm text-zinc-400 space-y-1">
                                    <li>• Extended 60-day refund period</li>
                                    <li>• Partial refunds for unused portions</li>
                                    <li>• Discounted enterprise pricing</li>
                                    <li>• Custom payment terms</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">7. Contact Information</h2>

                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                    <p className="text-white/70 mb-6">
                        For refund requests or questions about this policy, please contact our support team:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-white font-medium mb-3">📧 Email Support</h3>
                            <div className="space-y-2 text-sm text-zinc-400">
                                <p><strong>General Support:</strong><br/>support@cortex-edr.com</p>
                                <p><strong>Refund Requests:</strong><br/>refunds@cortex-edr.com</p>
                                <p><strong>Enterprise:</strong><br/>enterprise@cortex-edr.com</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-medium mb-3">⏰ Response Times</h3>
                            <div className="space-y-2 text-sm text-zinc-400">
                                <p><strong>Email:</strong> Within 24 hours</p>
                                <p><strong>Review:</strong> 2 business days</p>
                                <p><strong>Processing:</strong> 5-7 business days</p>
                                <p><strong>Enterprise:</strong> Priority handling</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-medium mb-3">📍 Business Hours</h3>
                            <div className="space-y-2 text-sm text-zinc-400">
                                <p><strong>Monday-Friday:</strong><br/>UTC+5 (Pakistan Time)</p>
                                <p><strong>Emergency Support:</strong><br/>24/7 availability</p>
                                <p><strong>Holidays:</strong><br/>Limited support</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded">
                        <h3 className="text-indigo-400 font-medium mb-2">📋 Required Information for Refund Requests</h3>
                        <div className="text-sm text-zinc-400">
                            <p className="mb-2">Please include the following in your refund request:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Full account email address</li>
                                <li>Subscription or invoice ID</li>
                                <li>Purchase date and amount</li>
                                <li>Detailed reason for the refund request</li>
                                <li>Any relevant screenshots or evidence</li>
                                <li>Preferred refund payment method</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Notes */}
            <section className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-white mb-2">Questions About Refunds?</h2>
                <p className="text-zinc-400 mb-4">
                    Our support team is here to help. We review every refund request carefully to ensure fair resolution.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="mailto:support@cortex-edr.com" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        Contact Support →
                    </a>
                    <a href="/docs/reference/faq" className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        View FAQ
                    </a>
                </div>
            </section>
        </div>
    );
}

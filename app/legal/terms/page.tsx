import React from "react";

export default function TermsPage() {
    const lastUpdated = "February 28, 2026";

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <section className="text-center pb-8 border-b border-white/10">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <img src="/assets/logo.png" alt="CortexEDR Logo" className="h-12 w-12" />
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Terms of Service</h1>
                        <div className="text-sm font-mono text-white/60 uppercase tracking-widest">
                            CortexEDR Enterprise Security Platform
                        </div>
                    </div>
                </div>
                <div className="text-[10px] font-mono text-white/40 mb-6 uppercase tracking-[0.2em]">
                    Version 4.0 // Last Updated: {lastUpdated}
                </div>
                <p className="text-white/70 leading-relaxed text-lg max-w-3xl mx-auto">
                    These Terms of Service ("Terms") govern your use of CortexEDR, our AI-powered cybersecurity platform.
                    By accessing or using our services, you agree to be bound by these Terms.
                </p>
            </section>

            {/* Table of Contents */}
            <section className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <a href="#acceptance" className="text-indigo-400 hover:text-indigo-300">1. Acceptance of Terms</a>
                    <a href="#description" className="text-indigo-400 hover:text-indigo-300">2. Service Description</a>
                    <a href="#eligibility" className="text-indigo-400 hover:text-indigo-300">3. User Eligibility</a>
                    <a href="#accounts" className="text-indigo-400 hover:text-indigo-300">4. Account Registration</a>
                    <a href="#usage" className="text-indigo-400 hover:text-indigo-300">5. Acceptable Use</a>
                    <a href="#subscription" className="text-indigo-400 hover:text-indigo-300">6. Subscription and Billing</a>
                    <a href="#intellectual-property" className="text-indigo-400 hover:text-indigo-300">7. Intellectual Property</a>
                    <a href="#data-privacy" className="text-indigo-400 hover:text-indigo-300">8. Data Privacy</a>
                    <a href="#termination" className="text-indigo-400 hover:text-indigo-300">9. Termination</a>
                    <a href="#disclaimer" className="text-indigo-400 hover:text-indigo-300">10. Disclaimer of Warranties</a>
                    <a href="#limitation" className="text-indigo-400 hover:text-indigo-300">11. Limitation of Liability</a>
                    <a href="#indemnification" className="text-indigo-400 hover:text-indigo-300">12. Indemnification</a>
                    <a href="#governing-law" className="text-indigo-400 hover:text-indigo-300">13. Governing Law</a>
                    <a href="#changes" className="text-indigo-400 hover:text-indigo-300">14. Changes to Terms</a>
                    <a href="#contact" className="text-indigo-400 hover:text-indigo-300">15. Contact Information</a>
                </div>
            </section>

            {/* 1. Acceptance of Terms */}
            <section id="acceptance" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">1. Acceptance of Terms</h2>
                <div className="space-y-4">
                    <p className="text-white/70 leading-relaxed">
                        By accessing, browsing, or using CortexEDR ("the Service"), you acknowledge that you have read, understood,
                        and agree to be bound by these Terms of Service and our Privacy Policy, which is incorporated herein by reference.
                    </p>
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                        <h3 className="text-indigo-400 font-medium mb-2">📋 Agreement Formation</h3>
                        <ul className="text-sm text-zinc-400 space-y-1">
                            <li>• These Terms constitute a legally binding agreement between you and CortexEDR</li>
                            <li>• Your continued use of the Service constitutes acceptance of these Terms</li>
                            <li>• If you do not agree to these Terms, you must discontinue use of the Service</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 2. Service Description */}
            <section id="description" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">2. Service Description</h2>
                <div className="space-y-4">
                    <p className="text-white/70 leading-relaxed">
                        CortexEDR provides AI-powered security scanning and analysis services for software repositories and applications.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-800/50 rounded p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">Core Features</h3>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Automated vulnerability scanning</li>
                                <li>• AI-powered threat analysis</li>
                                <li>• Security report generation</li>
                                <li>• Real-time monitoring</li>
                                <li>• Integration APIs</li>
                            </ul>
                        </div>

                        <div className="bg-zinc-800/50 rounded p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">Supported Technologies</h3>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Multiple programming languages</li>
                                <li>• Popular frameworks and libraries</li>
                                <li>• Cloud platforms and services</li>
                                <li>• CI/CD pipeline integration</li>
                                <li>• Container and infrastructure scanning</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. User Eligibility */}
            <section id="eligibility" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">3. User Eligibility</h2>
                <div className="space-y-4">
                    <p className="text-white/70 leading-relaxed">
                        To use CortexEDR, you must meet the following eligibility requirements:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Individual Users</h3>
                            <ul className="space-y-2 text-white/70">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Be at least 18 years of age</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Have legal capacity to enter into contracts</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Not be prohibited from using the Service</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Organizations</h3>
                            <ul className="space-y-2 text-white/70">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Authorized representative must be 18+</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Legal authority to bind the organization</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Compliance with applicable laws</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Account Registration */}
            <section id="accounts" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">4. Account Registration</h2>
                <div className="space-y-4">
                    <div className="bg-zinc-800/50 rounded p-4 border border-white/5">
                        <h3 className="text-white font-medium mb-2">Account Creation</h3>
                        <p className="text-zinc-400 text-sm mb-3">
                            To access certain features of the Service, you must register for an account by providing accurate,
                            current, and complete information about yourself or your organization.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="text-indigo-400 font-medium mb-2">Required Information</h4>
                                <ul className="text-zinc-400 space-y-1">
                                    <li>• Valid email address</li>
                                    <li>• Account password</li>
                                    <li>• Organization details (if applicable)</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-indigo-400 font-medium mb-2">Account Security</h4>
                                <ul className="text-zinc-400 space-y-1">
                                    <li>• Use strong, unique passwords</li>
                                    <li>• Enable two-factor authentication</li>
                                    <li>• Keep contact information current</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <h3 className="text-yellow-400 font-medium mb-2">Account Responsibilities</h3>
                        <ul className="text-sm text-zinc-400 space-y-1">
                            <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
                            <li>• You are responsible for all activities that occur under your account</li>
                            <li>• You must immediately notify us of any unauthorized use of your account</li>
                            <li>• We reserve the right to suspend or terminate accounts that violate these Terms</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 5. Acceptable Use */}
            <section id="usage" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">5. Acceptable Use</h2>
                <div className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h3 className="text-green-400 font-medium mb-2">✅ Permitted Uses</h3>
                        <ul className="text-sm text-zinc-400 space-y-1">
                            <li>• Security scanning and analysis of your own code and systems</li>
                            <li>• Integration with your development and deployment workflows</li>
                            <li>• Sharing scan results with authorized team members</li>
                            <li>• Using the Service for legitimate security research and testing</li>
                            <li>• Accessing and using our APIs within rate limits</li>
                        </ul>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <h3 className="text-red-400 font-medium mb-2">🚫 Prohibited Activities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="text-red-300 font-medium mb-2">Security Violations</h4>
                                <ul className="text-zinc-400 space-y-1">
                                    <li>• Attempting to gain unauthorized access</li>
                                    <li>• Circumventing security measures</li>
                                    <li>• Exploiting vulnerabilities in our systems</li>
                                    <li>• Conducting security assessments without permission</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-red-300 font-medium mb-2">Abuse & Misuse</h4>
                                <ul className="text-zinc-400 space-y-1">
                                    <li>• Sharing account credentials</li>
                                    <li>• Excessive API usage or abuse</li>
                                    <li>• Reverse engineering the Service</li>
                                    <li>• Using the Service for illegal activities</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Subscription and Billing */}
            <section id="subscription" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">6. Subscription and Billing</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Subscription Plans</h3>
                            <div className="space-y-3">
                                <div className="bg-zinc-800/50 rounded p-3 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-indigo-400 font-medium">Vibe Coder</span>
                                        <span className="text-zinc-400 text-sm">Free</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm">Basic scanning for individual developers</p>
                                </div>

                                <div className="bg-zinc-800/50 rounded p-3 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-indigo-400 font-medium">Developer</span>
                                        <span className="text-zinc-400 text-sm">$29/month</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm">Advanced features for growing teams</p>
                                </div>

                                <div className="bg-zinc-800/50 rounded p-3 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-indigo-400 font-medium">Enterprise</span>
                                        <span className="text-zinc-400 text-sm">Custom</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm">Full platform access with dedicated support</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Billing Terms</h3>
                            <ul className="space-y-2 text-white/70">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Subscriptions automatically renew unless cancelled</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Payment is due at the beginning of each billing cycle</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Failed payments may result in service suspension</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Price changes will be communicated 30 days in advance</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Intellectual Property */}
            <section id="intellectual-property" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">7. Intellectual Property</h2>
                <div className="space-y-4">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                        <h3 className="text-indigo-400 font-medium mb-2">CortexEDR Ownership</h3>
                        <p className="text-white/70">
                            The Service and its original content, features, and functionality are and will remain the exclusive property of CortexEDR and its licensors.
                            The Service is protected by copyright, trademark, and other laws.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Your Content</h3>
                            <ul className="space-y-2 text-white/70">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>You retain ownership of your source code and data</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>You grant us a license to process your content for analysis</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Analysis results and reports belong to you</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Our Content</h3>
                            <ul className="space-y-2 text-white/70">
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-400 mt-1">•</span>
                                    <span>AI models and algorithms are proprietary</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-400 mt-1">•</span>
                                    <span>Security research and methodologies are confidential</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-400 mt-1">•</span>
                                    <span>You may not reverse engineer or copy our technology</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. Data Privacy */}
            <section id="data-privacy" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">8. Data Privacy</h2>
                <div className="space-y-4">
                    <p className="text-white/70">
                        Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy,
                        which is incorporated into these Terms by reference.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-800/50 rounded p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">Data Processing</h3>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• We process data only for legitimate business purposes</li>
                                <li>• Data is handled in accordance with applicable privacy laws</li>
                                <li>• We implement appropriate technical and organizational measures</li>
                                <li>• Data minimization principles are applied</li>
                            </ul>
                        </div>

                        <div className="bg-zinc-800/50 rounded p-4 border border-white/5">
                            <h3 className="text-white font-medium mb-2">Your Rights</h3>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Access to your personal information</li>
                                <li>• Correction of inaccurate data</li>
                                <li>• Deletion of your data ("right to be forgotten")</li>
                                <li>• Data portability between services</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Termination */}
            <section id="termination" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">9. Termination</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">By You</h3>
                            <ul className="space-y-2 text-white/70">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>You may terminate your account at any time</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Termination takes effect at the end of current billing cycle</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>You remain responsible for charges incurred until termination</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">By Us</h3>
                            <ul className="space-y-2 text-white/70">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>We may terminate accounts that violate these Terms</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Immediate termination for serious violations</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Notice provided when possible</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <h3 className="text-yellow-400 font-medium mb-2">Effect of Termination</h3>
                        <ul className="text-sm text-zinc-400 space-y-1">
                            <li>• Your access to the Service immediately ceases</li>
                            <li>• We may delete your account data after a grace period</li>
                            <li>• Some obligations survive termination (indemnification, payment)</li>
                            <li>• Your license to use the Service terminates</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 10. Disclaimer of Warranties */}
            <section id="disclaimer" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">10. Disclaimer of Warranties</h2>
                <div className="bg-zinc-800/50 rounded p-6 border border-white/5">
                    <p className="text-white/70 leading-relaxed">
                        THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. CORTEXEDR AND ITS SUPPLIERS AND LICENSORS HEREBY
                        DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO
                        ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.
                    </p>
                    <p className="text-white/70 leading-relaxed mt-4">
                        CORTEXEDR DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED,
                        OR THAT THE SERVICE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
                    </p>
                </div>
            </section>

            {/* 11. Limitation of Liability */}
            <section id="limitation" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">11. Limitation of Liability</h2>
                <div className="bg-zinc-800/50 rounded p-6 border border-white/5">
                    <p className="text-white/70 leading-relaxed mb-4">
                        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL CORTEXEDR OR ITS SUPPLIERS BE LIABLE FOR ANY
                        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
                        DATA, USE, OR OTHER INTANGIBLE LOSSES.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="text-indigo-400 font-medium mb-2">Liability Cap</h4>
                            <p className="text-zinc-400">Total liability limited to amounts paid by you in the 12 months preceding the claim</p>
                        </div>
                        <div>
                            <h4 className="text-indigo-400 font-medium mb-2">Excluded Damages</h4>
                            <p className="text-zinc-400">No liability for business interruption, data loss, or security incidents</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 12. Indemnification */}
            <section id="indemnification" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">12. Indemnification</h2>
                <div className="bg-zinc-800/50 rounded p-6 border border-white/5">
                    <p className="text-white/70 leading-relaxed">
                        You agree to defend, indemnify, and hold harmless CortexEDR and its officers, directors, employees, agents,
                        licensors, and suppliers from and against all claims, demands, actions, or suits, including but not limited to
                        reasonable legal and accounting fees, arising out of or related to your violation of these Terms or your use of the Service.
                    </p>
                </div>
            </section>

            {/* 13. Governing Law */}
            <section id="governing-law" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">13. Governing Law</h2>
                <div className="space-y-4">
                    <p className="text-white/70">
                        These Terms shall be governed by and construed in accordance with the laws of Pakistan, without regard to its
                        conflict of law provisions. Any disputes arising from these Terms shall be resolved through binding arbitration
                        in Lahore, Pakistan.
                    </p>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                        <h3 className="text-blue-400 font-medium mb-2">Dispute Resolution</h3>
                        <ul className="text-sm text-zinc-400 space-y-1">
                            <li>• Arbitration will be conducted by a neutral arbitrator</li>
                            <li>• Arbitration will take place in Lahore, Pakistan</li>
                            <li>• The arbitration shall be conducted in English</li>
                            <li>• Each party bears its own costs and expenses</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 14. Changes to Terms */}
            <section id="changes" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">14. Changes to Terms</h2>
                <div className="space-y-4">
                    <p className="text-white/70">
                        We reserve the right to modify these Terms at any time. We will notify users of material changes via email or
                        prominent notice on the Service. Your continued use of the Service after such modifications constitutes acceptance
                        of the updated Terms.
                    </p>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4">
                        <h3 className="text-yellow-400 font-medium mb-2">Notification Process</h3>
                        <ul className="text-sm text-zinc-400 space-y-1">
                            <li>• Email notification sent to registered address</li>
                            <li>• Notice posted on the Service for 30 days</li>
                            <li>• Previous versions archived for reference</li>
                            <li>• Significant changes require explicit consent</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 15. Contact Information */}
            <section id="contact" className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">15. Contact Information</h2>
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                    <p className="text-white/70 mb-4">
                        If you have any questions about these Terms of Service, please contact us:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-white font-medium mb-2">Legal Team</h3>
                            <div className="text-zinc-400 text-sm space-y-1">
                                <p>📧 legal@cortex-edr.com</p>
                                <p>📧 terms@cortex-edr.com</p>
                                <p>📍 Lahore, Pakistan</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-medium mb-2">Business Hours</h3>
                            <div className="text-zinc-400 text-sm space-y-1">
                                <p>• Support: 24/7 for critical issues</p>
                                <p>• Business inquiries: UTC+5 business hours</p>
                                <p>• Legal matters: Response within 5 business days</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded">
                        <p className="text-indigo-300 text-sm">
                            <strong>Last Updated:</strong> {lastUpdated}<br/>
                            <strong>Effective Date:</strong> February 28, 2026<br/>
                            <strong>Legal Entity:</strong> CortexEDR (Hamza Hafeez Bhatti - Sole Proprietor)
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

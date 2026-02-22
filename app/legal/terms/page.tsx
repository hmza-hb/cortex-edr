import React from "react";

export default function TermsPage() {
    const lastUpdated = "February 16, 2026";

    return (
        <div className="space-y-12">
            <section>
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
                <div className="text-[10px] font-mono text-white/40 mb-12 uppercase tracking-[0.2em]">
                    Version 2.0 // Last Updated: {lastUpdated}
                </div>
                <p className="text-white/70 leading-relaxed text-base">
                    By accessing or using the CortexEDR platform, you agree to be bound by these Terms of Service. Please review these terms carefully before initializing any system nodes.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">1. Scope of License</h2>
                <p className="text-white/70 leading-relaxed">
                    Subject to compliance with these Terms, CortexEDR grants you a limited, non-exclusive, non-transferable license to access the platform for the sole purpose of security auditing and internal codebase analysis.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">2. Acceptable Use and Prohibitions</h2>
                <p className="text-white/70 leading-relaxed">
                    You agree not to utilize the platform for any illicit activities. Prohibited behavior includes:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>Circumventing technical measures designed to protect the platform.</li>
                    <li>Using automated systems (excluding official APIs) to scrape or query the platform.</li>
                    <li>Reverse engineering, decompiling, or attempting to derive the source code of the Cortex Neural Engine.</li>
                    <li>Attempting to access unauthorized organizational nodes.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">3. Intellectual Property Rights</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR and its original content, features, and functionality remain the exclusive property of the Company. Analysis reports and metadata generated through your use of the platform belong to you, provided you maintain a valid subscription.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">4. Limitation of Liability</h2>
                <p className="text-white/70 leading-relaxed">
                    To the maximum extent permitted by law, CortexEDR shall not be liable for any indirect, incidental, special, or consequential damages, including loss of profits, data, or system integrity, resulting from your use of the platform. The platform is provided "as-is" without warranty of any kind.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">5. Indemnification</h2>
                <p className="text-white/70 leading-relaxed">
                    You agree to indemnify and hold harmless CortexEDR and its affiliates from any claims, damages, or expenses (including legal fees) arising from your breach of these Terms or your use of the platform in violation of any law.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">6. Termination and Severability</h2>
                <p className="text-white/70 leading-relaxed">
                    We reserve the right to suspend or terminate access for any account found in violation of These Terms. If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">7. Governing Law and Jurisdiction</h2>
                <p className="text-white/70 leading-relaxed">
                    These Terms are governed by the laws of the jurisdiction of the Company's incorporation. Any disputes arising from these Terms shall be resolved exclusively through binding arbitration in said jurisdiction.
                </p>
            </section>
        </div>
    );
}

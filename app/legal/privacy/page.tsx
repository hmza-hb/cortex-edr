import React from "react";

export default function PrivacyPage() {
    const lastUpdated = "February 16, 2026";

    return (
        <div className="space-y-12">
            <section>
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
                <div className="text-[10px] font-mono text-white/40 mb-12 uppercase tracking-[0.2em]">
                    Version 2.0 // Last Updated: {lastUpdated}
                </div>
                <p className="text-white/70 leading-relaxed text-base">
                    CortexEDR ("the Company", "we", "us", "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and handle your data when you use our cybersecurity platform and services.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">1. Data Collection Protocols</h2>
                <p className="text-white/70 leading-relaxed">
                    We collect information necessary to provide our endpoint detection and response services. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li><strong>Technical Metadata</strong>: System logs, kernel-level activity traces, and process execution identifiers required for threat analysis.</li>
                    <li><strong>Identity Data</strong>: Full name, professional email address, and organizational affiliation provided during account initialization.</li>
                    <li><strong>Operational Data</strong>: Query history within the terminal demo, scan parameters, and configuration settings.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">2. Processing and Analysis</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR processes data to identify security vulnerabilities and architectural debt. All processing occurs within secure, encrypted environments. We do not sell your data to third-party advertisers. Processing is strictly limited to:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>Heuristic threat detection and anomaly mapping.</li>
                    <li>System performance optimization and debt quantification.</li>
                    <li>Platform maintenance and security auditing.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">3. Data Retention and Security</h2>
                <p className="text-white/70 leading-relaxed">
                    Data is retained only as long as necessary to fulfill the operational requirements of your tier configuration. We employ industry-standard encryption (AES-256) for all data at rest and TLS 1.3 for data in transit.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">4. Compliance and Your Rights</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR complies with major data protection frameworks, including GDPR and CCPA. Users maintain the right to:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>Request access to collected telemetry and identity data.</li>
                    <li>Request rectification of inaccurate information.</li>
                    <li>Exercise the right to erasure ("right to be forgotten") subject to lawful retention requirements.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">5. Contact Information</h2>
                <p className="text-white/70 leading-relaxed">
                    For legal inquiries regarding data privacy protocols, contact our Data Protection Officer at <strong>legal@cortex-edr.sys</strong>.
                </p>
            </section>
        </div>
    );
}

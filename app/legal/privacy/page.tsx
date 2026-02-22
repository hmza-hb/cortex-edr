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
                    CortexEDR collects only the data necessary to provide and improve our cybersecurity services. We operate under the principle of data minimization and purpose limitation.
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li><strong>Technical Telemetry</strong>: System logs, process execution traces, and kernel-level event data required for real-time threat detection.</li>
                    <li><strong>Identity & Access</strong>: Account credentials, professional email addresses, and organizational identifiers processed via secure authentication providers.</li>
                    <li><strong>Operational Metadata</strong>: Terminal command history (anonymized), scan configuration parameters, and system health metrics.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">2. Processing, Analysis, and AI Training</h2>
                <p className="text-white/70 leading-relaxed">
                    Data is processed to identify vulnerabilities and predict architectural risks. We employ neural mapping models; however, we do not use sensitive customer-specific organizational data for global model training without explicit, tiered consent. We do not sell personal data to third parties.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">3. Third-Party Sub-Processors</h2>
                <p className="text-white/70 leading-relaxed">
                    We engage a limited number of sub-processors to assist in providing our services, including cloud infrastructure providers and communication tools. All sub-processors are vetted for compliance with industry-standard security frameworks (SOC2, ISO 27001).
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">4. International Data Transfers</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR may store and process data in various jurisdictions. Where data is transferred across international borders, we utilize Standard Contractual Clauses (SCCs) and other approved transfer mechanisms to ensure comparable levels of protection.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">5. Data Retention and Security Architecture</h2>
                <p className="text-white/70 leading-relaxed">
                    Telemetry data is retained for the duration of the subscription tier's look-back window. We employ AES-256 encryption at rest and TLS 1.3 for all data in transit. Identity data is purged within 30 days of account termination, subject to lawful retention requirements.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">6. Your Rights and DSAR Management</h2>
                <p className="text-white/70 leading-relaxed">
                    In accordance with GDPR, CCPA, and global privacy standards, you maintain the right to:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>Submit a Data Subject Access Request (DSAR) to receive a copy of your personal data.</li>
                    <li>Request rectification of inaccurate account information.</li>
                    <li>Request the deletion of your personal data ("Right to be Forgotten").</li>
                    <li>Object to or restrict specific processing activities.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">7. Legal Contact</h2>
                <p className="text-white/70 leading-relaxed">
                    For inquiries regarding our privacy posture or to exercise your rights, please contact our Legal & Privacy team at <strong>legal@cortex-edr.sys</strong>.
                </p>
            </section>
        </div>
    );
}

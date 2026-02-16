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
                <h2 className="text-xl font-bold text-white">1. Acceptable Use Policy</h2>
                <p className="text-white/70 leading-relaxed">
                    Users are granted a limited license to utilize CortexEDR for legitimate security auditing and codebase analysis. Prohibited activities include:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>Interfering with the operational integrity of the platform architecture.</li>
                    <li>Reverse engineering proprietary detection heuristic modules.</li>
                    <li>Using the platform to facilitate unauthorized access to third-party systems.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">2. Intellectual Property</h2>
                <p className="text-white/70 leading-relaxed">
                    All platform components, including but not limited to neural mapping algorithms, HUD interfaces, and telemetry protocols, are the exclusive property of CortexEDR. Software analysis reports generated for users are owned by the respective user, subject to our underlying IP rights.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">3. Liability and Warranty</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR provides advanced security intelligence on an "as-is" basis. While we strive for absolute precision in threat detection, we do not guarantee that the platform will identify 100% of all vulnerabilities. The Company is not liable for indirect or consequential damages resulting from system intrusions.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">4. Subscription and Termination</h2>
                <p className="text-white/70 leading-relaxed">
                    Standard operational tiers (Core, Executor, Cluster) are billed according to the configured cycle. CortexEDR reserves the right to terminate access for nodes found in breach of the Acceptable Use Policy without notice.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">5. Governing Law</h2>
                <p className="text-white/70 leading-relaxed">
                    These terms are governed by the laws of the jurisdiction in which the Company is incorporated, without regard to conflict of law principles.
                </p>
            </section>
        </div>
    );
}

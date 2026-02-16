import React from "react";

export default function CookiePage() {
    const lastUpdated = "February 16, 2026";

    return (
        <div className="space-y-12">
            <section>
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Cookie Policy</h1>
                <div className="text-[10px] font-mono text-white/40 mb-12 uppercase tracking-[0.2em]">
                    Version 2.0 // Last Updated: {lastUpdated}
                </div>
                <p className="text-white/70 leading-relaxed text-base">
                    CortexEDR utilizes cookies and similar tracking technologies to enhance platform performance and maintain secure session states.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">1. Necessary Cookies</h2>
                <p className="text-white/70 leading-relaxed">
                    These cookies are essential for the fundamental operation of the CortexEDR HUD and terminal interfaces. They enable:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>Authentication and session preservation across nodes.</li>
                    <li>Security protocols for preventing cross-site request forgery.</li>
                    <li>Basic preference persistence (e.g., terminal theme selection).</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">2. Performance and Analytics</h2>
                <p className="text-white/70 leading-relaxed">
                    We use anonymized telemetry to understand system load and optimize response times. These technologies track:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>Scan execution durations and error rates.</li>
                    <li>User engagement with intelligence layer modules.</li>
                    <li>Regional system latency metrics.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">3. Consent Management</h2>
                <p className="text-white/70 leading-relaxed">
                    Users may control cookie preferences through their browser settings. However, disabling strictly necessary cookies may prevent the platform from functioning correctly.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">4. Updates to this Policy</h2>
                <p className="text-white/70 leading-relaxed">
                    We may update the Cookie Policy to reflect changes in tracking technology or regulatory requirements. Continued use of the platform constitutes acknowledgment of the current policy.
                </p>
            </section>
        </div>
    );
}

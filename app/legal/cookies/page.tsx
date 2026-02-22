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
                <h2 className="text-xl font-bold text-white">1. Cookie Taxonomy</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR categorizes cookies into functional clusters to ensure transparency and user control.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-white/10 rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-white/5 font-mono text-[10px] uppercase text-white/40 tracking-widest">
                                <th className="p-4 border-b border-white/10">Type</th>
                                <th className="p-4 border-b border-white/10">Purpose</th>
                                <th className="p-4 border-b border-white/10">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-white/60">
                            <tr>
                                <td className="p-4 border-b border-white/5 font-bold text-white">Session (First-Party)</td>
                                <td className="p-4 border-b border-white/5">Authentication state and terminal session preservation.</td>
                                <td className="p-4 border-b border-white/5">Session duration</td>
                            </tr>
                            <tr>
                                <td className="p-4 border-b border-white/5 font-bold text-white">Security (First-Party)</td>
                                <td className="p-4 border-b border-white/5">CSRF protection and intrusion prevention tokens.</td>
                                <td className="p-4 border-b border-white/5">24 Hours</td>
                            </tr>
                            <tr>
                                <td className="p-4 border-b border-white/5 font-bold text-white">Analytics (Third-Party)</td>
                                <td className="p-4 border-b border-white/5">Aggregated performance telemetry and system load analysis.</td>
                                <td className="p-4 border-b border-white/5">Up to 2 Years</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">2. Necessary Cookies</h2>
                <p className="text-white/70 leading-relaxed">
                    These are strictly necessary for the platform to function. They enable Core EDR operations, including user authentication and secure navigation between system nodes.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">3. Third-Party Integration</h2>
                <p className="text-white/70 leading-relaxed">
                    We use third-party analytics (e.g., Vercel Analytics) to monitor system health. These partners may place cookies to track anonymized engagement metrics. CortexEDR does not allow these partners to use your data for their own advertising purposes.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">4. User Agency and Control</h2>
                <p className="text-white/70 leading-relaxed">
                    You can manage cookie preferences directly through your browser's security settings. Please note that restricting First-Party security cookies will prevent you from accessing the platform's authenticated features.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">5. Evolution of Tracking</h2>
                <p className="text-white/70 leading-relaxed">
                    As we introduce new architectural features, our cookie usage may evolve. We recommend periodic review of this policy for continued awareness of our data handling practices.
                </p>
            </section>
        </div>
    );
}

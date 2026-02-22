import React from "react";

export default function RefundPage() {
    const lastUpdated = "February 22, 2026";

    return (
        <div className="space-y-12">
            <section>
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Refund Policy</h1>
                <div className="text-[10px] font-mono text-white/40 mb-12 uppercase tracking-[0.2em]">
                    Version 1.0 // Last Updated: {lastUpdated}
                </div>
                <p className="text-white/70 leading-relaxed text-base">
                    At CortexEDR, we strive to provide the highest quality cybersecurity platform. We understand that circumstances may change, and we have established this Refund Policy to outline the conditions under which refunds may be issued.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">1. Refund Eligibility</h2>
                <p className="text-white/70 leading-relaxed">
                    Refund requests are evaluated on a case-by-case basis. To be eligible for a refund, you must meet the following criteria:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li><strong>Initial Purchase</strong>: Requests must be submitted within 14 days of the initial subscription start date.</li>
                    <li><strong>Technical Issues</strong>: If the platform is non-functional due to verified technical errors on our end that we are unable to resolve within a reasonable timeframe.</li>
                    <li><strong>Billing Errors</strong>: Verified duplicate charges or incorrect billing amounts.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">2. Subscription Cycles</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR operates on both monthly and annual subscription cycles.
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li><strong>Monthly Subscriptions</strong>: Refunds are not typically provided for partial months. If you cancel, you will maintain access until the end of the current billing period.</li>
                    <li><strong>Annual Subscriptions</strong>: Pro-rated refunds may be considered for annual plans within the first 30 days of the subscription period, subject to a processing fee.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">3. Cancellation Process</h2>
                <p className="text-white/70 leading-relaxed">
                    You can cancel your subscription at any time through your dashboard settings. Cancellation stops future billing but does not automatically trigger a refund for previously paid amounts unless explicitly requested and approved under Section 1.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">4. Non-Refundable Items</h2>
                <p className="text-white/70 leading-relaxed">
                    The following are non-refundable:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>Add-on services or one-time architectural audits already performed.</li>
                    <li>Accounts terminated due to violations of our Terms of Service.</li>
                    <li>Usage-based charges incurred during the billing period.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">5. Contact and Resolution</h2>
                <p className="text-white/70 leading-relaxed">
                    To initiate a refund request, please contact our support team at <strong>support@cortex-edr.sys</strong> with your account details and the reason for the request. We aim to process all requests within 5-7 business days.
                </p>
            </section>
        </div>
    );
}

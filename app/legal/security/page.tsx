import React from "react";
import { Bug, ShieldAlert, Cpu, Lock } from "lucide-react";

export default function SecurityPage() {
    return (
        <div className="space-y-12">
            <section>
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Security Disclosure</h1>
                <div className="text-[10px] font-mono text-white/40 mb-12 uppercase tracking-[0.2em]">
                    Vulnerability Disclosure Policy // VDP 1.0
                </div>
                <p className="text-white/70 leading-relaxed text-base">
                    CortexEDR values the contribution of the security research community. If you have discovered a potential security vulnerability, we invite you to report it through our disclosure process.
                </p>
            </section>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-3xl p-8 my-12">
                <div className="flex items-center gap-4 mb-6">
                    <ShieldAlert className="h-6 w-6 text-purple-500" />
                    <h2 className="text-xl font-bold text-white">Guidelines for Researchers</h2>
                </div>
                <p className="text-white/70 leading-relaxed mb-6">
                    To maintain a collaborative and responsible disclosure environment, we request that researchers:
                </p>
                <ul className="space-y-4">
                    {[
                        "Notify us immediately upon discovery of a potential vulnerability.",
                        "Provide detailed reproduction steps to facilitate rapid triage and mitigation.",
                        "Avoid any action that could degrade platform performance or result in data exfiltration.",
                        "Maintain confidentiality until a fix has been deployed and validated."
                    ].map((item, i) => (
                        <li key={i} className="flex gap-4 text-sm text-white/70">
                            <span className="text-purple-500 font-mono">0{i + 1}.</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Reporting Process</h2>
                <p className="text-white/70 leading-relaxed">
                    Please submit all security findings to **security@cortex-edr.sys**. To facilitate rapid triage, your report should include:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>Impacted system node, API endpoint, or architectural component.</li>
                    <li>Technical classification (e.g., RCE, SQLi, Auth Bypass, IDOR).</li>
                    <li>Deterministic reproduction steps and a Proof-of-Concept (PoC).</li>
                    <li>Potential impact assessment on platform integrity or user data.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Operational Service Level Objectives (SLOs)</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR maintains a high-priority incident response pipeline for security disclosures:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { label: "Acknowledge", time: "< 12 Hours" },
                        { label: "Technical Triage", time: "< 48 Hours" },
                        { label: "Resolution Goal", time: "SLA Dependent" }
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <div className="text-[10px] font-mono text-white/40 uppercase mb-1">{item.label}</div>
                            <div className="text-white font-bold">{item.time}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Researcher Safe Harbor</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR will not pursue legal action against researchers who comply with this policy. We consider activities conducted under these guidelines to be "authorized" access under the Computer Fraud and Abuse Act (CFAA) and other relevant anti-hacking laws.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Express Exclusions</h2>
                <p className="text-white/70 leading-relaxed">
                    The following activities are strictly prohibited and fall outside the scope of Safe Harbor:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>Destructive testing or Denial of Service (DoS/DDoS) attempts.</li>
                    <li>Social engineering, phishing, or physical security breaches.</li>
                    <li>Accessing, modifying, or retaining any data that does not belong to you.</li>
                </ul>
            </section>
        </div>
    );
}

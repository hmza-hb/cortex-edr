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
                    Please submit all security findings to **security@cortex-edr.sys**. Include the following technical identifiers:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>System node or endpoint affected.</li>
                    <li>Type of vulnerability (e.g., Remote Code Execution, Auth Bypass).</li>
                    <li>Detailed proof-of-concept (PoC).</li>
                </ul>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Response Timelines</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR is committed to rapid incident response.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { label: "Initial Triage", time: "< 24 Hours" },
                        { label: "Technical Validation", time: "< 72 Hours" },
                        { label: "Patch Deployment", time: "Priority-based" }
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <div className="text-[10px] font-mono text-white/40 uppercase mb-1">{item.label}</div>
                            <div className="text-white font-bold">{item.time}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Exclusions</h2>
                <p className="text-white/70 leading-relaxed">
                    The following activities are expressly excluded from this policy:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-white/70">
                    <li>Social engineering or phishing against Company employees.</li>
                    <li>Physical security attacks on data centers or office locations.</li>
                    <li>Distributed Denial of Service (DDoS) attempts.</li>
                </ul>
            </section>
        </div>
    );
}

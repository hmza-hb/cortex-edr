import React from "react";
import { ShieldCheck, Lock, FileCheck, Globe } from "lucide-react";

export default function CompliancePage() {
    return (
        <div className="space-y-12">
            <section>
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">System Compliance</h1>
                <div className="text-[10px] font-mono text-white/40 mb-12 uppercase tracking-[0.2em]">
                    Technical Benchmarks // Certification Framework
                </div>
                <p className="text-white/70 leading-relaxed text-base">
                    CortexEDR maintains a rigorous posture toward industry-standard compliance and regulatory benchmarks, ensuring your code remains secure and your organization stays audit-ready.
                </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8 my-16">
                {[
                    { icon: ShieldCheck, name: "SOC2 Type II", status: "Certified", desc: "Full audit of security, availability, and confidentiality controls." },
                    { icon: Lock, name: "HIPAA Alignment", status: "Compliant", desc: "Rigorous standards for processing sensitive healthcare-related code assets." },
                    { icon: FileCheck, name: "ISO 27001", status: "In-Progress", desc: "Global benchmark for information security management systems." },
                    { icon: Globe, name: "GDPR / CCPA", status: "Compliant", desc: "Strict adherence to data sovereignty and user privacy rights." }
                ].map((item, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 rounded-lg bg-white/5 text-purple-500">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm tracking-tight">{item.name}</h3>
                                <span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">{item.status}</span>
                            </div>
                        </div>
                        <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">System Sovereignty and Resurrection</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR allows for granular regional data residency configuration within the **Cluster** and **Fortress** tiers. This ensures compliance with local sovereignty laws (e.g., EU data residency) and organizational internal governance models.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Encryption and Vault Protocols</h2>
                <p className="text-white/70 leading-relaxed">
                    Our platform architecture utilizes FIPS 140-2 validated cryptographic modules for all sensitive operations. Telemetry streams are secured via TLS 1.3 with Perfect Forward Secrecy (PFS), and data at rest is protected using AES-256-GCM with automated, hardware-backed key rotation.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Continuous Posture Monitoring</h2>
                <p className="text-white/70 leading-relaxed">
                    Compliance is maintained through real-time heuristic monitoring of our internal infrastructure. We conduct regular penetration tests (internal and third-party) and provide "Compliance-as-Code" artifacts for Enterprise clients to facilitate their own internal audit cycles.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Audit Support and Documentation</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR provides dedicated compliance support for organizations undergoing external audits. We provide comprehensive documentation regarding our control environment and operational efficacy upon request for eligible subscription tiers.
                </p>
            </section>
        </div>
    );
}

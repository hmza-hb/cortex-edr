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
                <h2 className="text-xl font-bold text-white">Data Sovereignty</h2>
                <p className="text-white/70 leading-relaxed">
                    CortexEDR allows for regional data residency configuration within the **Cluster** tier, ensuring compliance with local laws and organizational internal policies regarding data storage.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Encryption Standards</h2>
                <p className="text-white/70 leading-relaxed">
                    We utilize FIPS 140-2 validated cryptographic modules. All communications are secured via TLS 1.3, and data at rest is protected using AES-256 with rotation-based key management.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Continuous Monitoring</h2>
                <p className="text-white/70 leading-relaxed">
                    Compliance is not a static state. CortexEDR employs real-time auditing of our own infrastructure, with automated alerts for any deviation from established security baselines.
                </p>
            </section>
        </div>
    );
}

import React from "react";
import { Activity, Server, Cpu, Globe, CheckCircle2 } from "lucide-react";

export default function StatusPage() {
    const lastCheck = new Date().toLocaleTimeString();

    const services = [
        { name: "API Gateway", status: "Operational", uptime: "99.99%", icon: Globe },
        { name: "Neural Engine", status: "Operational", uptime: "99.95%", icon: Cpu },
        { name: "Terminal Interface", status: "Operational", uptime: "100%", icon: Activity },
        { name: "Database Cluster", status: "Operational", uptime: "99.99%", icon: Server },
    ];

    return (
        <div className="space-y-12">
            <section>
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Operational Status</h1>
                <div className="text-[10px] font-mono text-white/40 mb-12 uppercase tracking-[0.2em]">
                    Real-Time Infrastructure Monitoring // Last Check: {lastCheck}
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 mb-12 flex items-center gap-6">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">All Systems Operational</h2>
                        <p className="text-white/50 text-sm">No active incidents or scheduled maintenance at this time.</p>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-xl font-bold text-white">Core Service Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-white/5 text-purple-500">
                                    <service.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm tracking-tight">{service.name}</h3>
                                    <span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">{service.status}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-mono text-white/30 uppercase mb-1">Uptime</div>
                                <div className="text-white font-bold text-sm">{service.uptime}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Incident History</h2>
                <p className="text-white/70 leading-relaxed italic">
                    Infrastructure stability is our primary objective. Below is the historical performance data for the past 90 days.
                </p>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex justify-between items-center">
                        <span className="text-white/60 text-sm">February 20, 2026 // Scheduled Maintenance</span>
                        <span className="text-[10px] font-mono text-white/30 uppercase">Completed</span>
                    </div>
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex justify-between items-center">
                        <span className="text-white/60 text-sm">January 12, 2026 // API Latency Spike</span>
                        <span className="text-[10px] font-mono text-white/30 uppercase">Resolved in 42m</span>
                    </div>
                </div>
            </section>
        </div>
    );
}

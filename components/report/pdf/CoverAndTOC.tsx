import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { ExecutiveReport } from '@/types/report';
import { styles, C, severityColor } from './pdfStyles';

interface CoverProps {
    scan: any;
    enterpriseReport?: ExecutiveReport;
    date: string;
    issueCount: number;
}

// ── Shared Page Header (used in all inner pages) ───────────────────────────────
export const PH = ({ date, section }: { date: string; section: string }) => (
    <View style={styles.pageHeader}>
        <View>
            <Text style={styles.brand}>CORTEX EDR</Text>
            <Text style={styles.brandTag}>Security Audit Report</Text>
        </View>
        <View style={styles.headerRight}>
            <Text style={styles.headerMeta}>{date}</Text>
            <Text style={styles.headerMeta}>{section}</Text>
        </View>
    </View>
);

// ── Shared Page Footer ─────────────────────────────────────────────────────────
export const PF = ({ label }: { label: string }) => (
    <View style={styles.footer} fixed>
        <Text style={styles.footerText}>Cortex EDR  ·  Confidential  ·  app.cortex-edr.com</Text>
        <Text style={styles.footerText}>{label}</Text>
    </View>
);

// ── Cover Page ─────────────────────────────────────────────────────────────────
export const CoverPage: React.FC<CoverProps> = ({ scan, enterpriseReport, date, issueCount }) => {
    const score = scan?.score ?? 0;
    const risk = enterpriseReport?.riskLevel || 'High';
    const repo = scan?.repo_url || 'Repository';

    const scoreColor =
        score >= 80 ? C.green :
        score >= 60 ? C.amber :
        score >= 40 ? C.orange : C.red;

    const ib = (enterpriseReport?.issueBreakdown as any) || { critical: 0, high: 0, medium: 0, low: 0 };

    return (
        <Page size="A4" style={styles.coverPage}>

            {/* Left accent stripe */}
            <View style={{
                position: 'absolute', top: 0, left: 0, width: 6, bottom: 0,
                backgroundColor: C.blue,
            }} />

            {/* Top-right ghost block */}
            <View style={{
                position: 'absolute', top: 0, right: 0, width: 280, height: 280,
                backgroundColor: C.blue, opacity: 0.06,
            }} />

            {/* Content */}
            <View style={{ flex: 1, paddingTop: 70, paddingBottom: 70, paddingLeft: 72, paddingRight: 64 }}>

                {/* ── Brand ─────────────────────────────────────── */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 64 }}>
                    {/* Logo mark */}
                    <View style={{
                        width: 52, height: 52, backgroundColor: C.blue, borderRadius: 10,
                        justifyContent: 'center', alignItems: 'center',
                    }}>
                        <View style={{
                            width: 28, height: 28,
                            borderWidth: 3, borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.9)',
                            borderRadius: 5, position: 'absolute',
                        }} />
                        <View style={{
                            width: 18, height: 18,
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderRadius: 3,
                        }} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 26, fontFamily: 'Helvetica-Bold', color: C.white, letterSpacing: 5 }}>
                            CORTEX EDR
                        </Text>
                        <Text style={{ fontSize: 9, color: C.blueLight, letterSpacing: 3, marginTop: 3 }}>
                            Security Intelligence Platform
                        </Text>
                    </View>
                </View>

                {/* ── Title ─────────────────────────────────────── */}
                <View style={{ marginBottom: 52 }}>
                    <Text style={{
                        fontSize: 11, fontFamily: 'Helvetica-Bold',
                        color: C.blueLight, letterSpacing: 3, marginBottom: 14,
                    }}>
                        SECURITY AUDIT REPORT
                    </Text>
                    <Text style={{
                        fontSize: 34, fontFamily: 'Helvetica-Bold',
                        color: C.white, lineHeight: 1.2, marginBottom: 20,
                    }}>
                        Application{'\n'}Security Assessment
                    </Text>
                    <View style={{ height: 3, width: 60, backgroundColor: C.blue }} />
                </View>

                {/* ── Score ring + stats ─────────────────────────── */}
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 48 }}>
                    <View style={{
                        width: 110, height: 110, borderRadius: 55,
                        borderWidth: 5, borderStyle: 'solid', borderColor: scoreColor,
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        justifyContent: 'center', alignItems: 'center',
                    }}>
                        <Text style={{ fontSize: 32, fontFamily: 'Helvetica-Bold', color: C.white }}>{score}</Text>
                        <Text style={{ fontSize: 9, color: C.mutedLight, letterSpacing: 1 }}>/ 100</Text>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', gap: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View style={{
                                paddingHorizontal: 10, paddingVertical: 5,
                                backgroundColor: risk === 'Low' ? C.green : risk === 'Medium' ? C.amber : C.red,
                                borderRadius: 5,
                            }}>
                                <Text style={{ fontSize: 9, color: C.white, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5 }}>
                                    {risk.toUpperCase()} RISK
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            {[
                                { label: 'Critical', count: ib.critical || 0, color: '#DC2626' },
                                { label: 'High',     count: ib.high || 0,     color: '#EA580C' },
                                { label: 'Medium',   count: ib.medium || 0,   color: '#D97706' },
                                { label: 'Low',      count: ib.low || 0,      color: '#2563EB' },
                            ].map(s => (
                                <View key={s.label} style={{ alignItems: 'center', gap: 2 }}>
                                    <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: s.color }}>{s.count}</Text>
                                    <Text style={{ fontSize: 7, color: '#64748B', fontFamily: 'Helvetica-Bold', letterSpacing: 1 }}>
                                        {s.label.toUpperCase()}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* ── Metadata grid ─────────────────────────────── */}
                <View style={{
                    paddingVertical: 20, paddingHorizontal: 24,
                    borderRadius: 10,
                    borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.08)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                }}>
                    {[
                        { label: 'TARGET REPOSITORY',  value: repo },
                        { label: 'DATE OF ASSESSMENT', value: date },
                        { label: 'TOTAL FINDINGS',     value: `${issueCount} issues identified` },
                        { label: 'PREPARED BY',        value: 'Cortex EDR Automated Security Platform' },
                    ].map((m, i) => (
                        <View key={i} style={{
                            flexDirection: 'row', alignItems: 'flex-start', gap: 16,
                            marginBottom: i < 3 ? 12 : 0,
                        }}>
                            <Text style={{ width: 140, fontSize: 8, color: C.blueLight, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5 }}>
                                {m.label}
                            </Text>
                            <Text style={{ flex: 1, fontSize: 9, color: 'rgba(255,255,255,0.85)' }}>
                                {m.value}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* ── Cover footer ──────────────────────────────────── */}
            <View style={{
                position: 'absolute', bottom: 36, left: 72, right: 64,
                flexDirection: 'row', justifyContent: 'space-between',
                borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'rgba(255,255,255,0.08)',
                paddingTop: 14,
            }}>
                <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5 }}>
                    CORTEX EDR  ·  ENTERPRISE SECURITY AUDIT
                </Text>
                <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>
                    CONFIDENTIAL  ·  DO NOT DISTRIBUTE
                </Text>
            </View>
        </Page>
    );
};

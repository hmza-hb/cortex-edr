import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { ExecutiveReport } from '@/types/report';
import { Issue } from '@/types/agent';
import { styles, C, severityColor } from './pdfStyles';

// ─── Shared Page Header / Footer ─────────────────────────────────────────────
const PH = ({ date, section }: { date: string; section: string }) => (
    <>
        <View style={styles.header}>
            <View>
                <Text style={styles.brand}>CortexEDR</Text>
                <Text style={styles.brandTag}>Enterprise Security Audit</Text>
            </View>
            <View style={styles.headerRight}>
                <Text style={styles.headerMeta}>{date}</Text>
                <Text style={styles.headerMeta}>{section}</Text>
            </View>
        </View>
    </>
);

const PF = ({ label }: { label: string }) => (
    <View style={styles.footer} fixed>
        <Text style={styles.footerText}>CortexEDR  ·  Confidential  ·  Enterprise Security Audit</Text>
        <Text style={styles.footerText}>{label}</Text>
    </View>
);

// ─── Bullet list ─────────────────────────────────────────────────────────────
const Bullets = ({ items }: { items: string[] }) => (
    <>
        {items.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
            </View>
        ))}
    </>
);

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 2: Executive Summary
// ═════════════════════════════════════════════════════════════════════════════
interface ExecProps { scan: any; issues: Issue[]; enterpriseReport?: ExecutiveReport; date: string; }

export const ExecSummaryPage: React.FC<ExecProps> = ({ scan, issues, enterpriseReport, date }) => {
    const es = enterpriseReport?.executiveSummary;
    const ib = enterpriseReport?.issueBreakdown || {
        critical: issues.filter(i => i.severity === 'critical').length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
    };

    const severityBoxes = [
        { label: 'Critical', count: ib.critical, color: '#DC2626', bg: '#FEF2F2' },
        { label: 'High', count: ib.high, color: '#EA580C', bg: '#FFF7ED' },
        { label: 'Medium', count: ib.medium, color: '#D97706', bg: '#FFFBEB' },
        { label: 'Low', count: ib.low, color: '#2563EB', bg: '#EFF6FF' },
    ];

    return (
        <Page size="A4" style={styles.page}>
            <PH date={date} section="Executive Summary" />

            <Text style={styles.sectionHeading}>01  Executive Summary</Text>
            <Text style={styles.sectionSub}>FOR C-LEVEL EXECUTIVES, BOARD & INVESTORS</Text>

            {/* Overall posture banner */}
            <View style={{
                padding: '12 16', backgroundColor: C.navy, borderRadius: 8, marginBottom: 16,
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <View>
                    <Text style={{ fontSize: 8, color: '#93C5FD', fontFamily: 'Helvetica-Bold', letterSpacing: 1 }}>OVERALL SECURITY POSTURE</Text>
                    <Text style={{ fontSize: 18, color: C.white, fontFamily: 'Helvetica-Bold', marginTop: 4 }}>
                        {es?.securityPostureRating || enterpriseReport?.riskLevel || 'High Risk'}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 8, color: '#93C5FD', fontFamily: 'Helvetica-Bold' }}>HEALTH SCORE</Text>
                    <Text style={{ fontSize: 26, color: C.white, fontFamily: 'Helvetica-Bold' }}>{scan?.score || 0}<Text style={{ fontSize: 12 }}>/100</Text></Text>
                </View>
            </View>

            {/* Severity Counts */}
            <View style={styles.scoreGrid}>
                {severityBoxes.map(sb => (
                    <View key={sb.label} style={[styles.scoreBox, { backgroundColor: sb.bg, borderColor: sb.color + '40' }]}>
                        <Text style={[styles.scoreMain, { color: sb.color, fontSize: 24 }]}>{sb.count}</Text>
                        <Text style={[styles.scoreLabel, { color: sb.color }]}>{sb.label.toUpperCase()}</Text>
                    </View>
                ))}
            </View>

            {/* Overview */}
            {es?.overview && (
                <View style={{ marginBottom: 14 }}>
                    <Text style={styles.subSubHeading}>Overview</Text>
                    <Text style={styles.bodyText}>{es.overview}</Text>
                </View>
            )}

            {/* Top 5 Business Risks */}
            {es?.top5BusinessRisks && es.top5BusinessRisks.length > 0 && (
                <View style={{ marginBottom: 14 }}>
                    <Text style={styles.subSubHeading}>Top 5 Business Risks</Text>
                    {es.top5BusinessRisks.slice(0, 5).map((risk, i) => (
                        <View key={i} style={[styles.bulletRow, { marginBottom: 6 }]}>
                            <Text style={{ fontSize: 9, color: C.red, fontFamily: 'Helvetica-Bold', width: 16 }}>{i + 1}.</Text>
                            <Text style={styles.bulletText}>{risk}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Regulatory + Financial */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                {es?.regulatoryExposure && es.regulatoryExposure.length > 0 && (
                    <View style={[styles.alertBox, { flex: 1, margin: 0 }]}>
                        <Text style={styles.alertTitle}>Regulatory Exposure</Text>
                        <Text style={styles.alertText}>{es.regulatoryExposure.join('  ·  ')}</Text>
                    </View>
                )}
                {es?.estimatedFinancialImpact && (
                    <View style={[styles.warnBox, { flex: 1, margin: 0 }]}>
                        <Text style={styles.warnTitle}>Estimated Financial Impact</Text>
                        <Text style={[styles.alertText, { color: C.slateLight }]}>{es.estimatedFinancialImpact}</Text>
                    </View>
                )}
            </View>

            {/* Breach Likelihood */}
            {es?.breachLikelihood && (
                <View style={{ marginBottom: 14 }}>
                    <Text style={styles.subSubHeading}>Breach Likelihood Assessment</Text>
                    <Text style={styles.bodyText}>{es.breachLikelihood}</Text>
                </View>
            )}

            {/* Remediation Timeline */}
            {es?.remediationTimeline && (
                <View style={{ marginBottom: 14 }}>
                    <Text style={styles.subSubHeading}>High-Level Remediation Timeline</Text>
                    <Text style={styles.bodyText}>{es.remediationTimeline}</Text>
                </View>
            )}

            {/* Key Findings */}
            {es?.keyFindings && es.keyFindings.length > 0 && (
                <View style={{ marginBottom: 14 }}>
                    <Text style={styles.subSubHeading}>Key Findings</Text>
                    <Bullets items={es.keyFindings.map(f => String(f))} />
                </View>
            )}

            {/* Recommended Actions */}
            {es?.recommendedActions && es.recommendedActions.length > 0 && (
                <View style={{ marginBottom: 14 }}>
                    <Text style={styles.subSubHeading}>Immediate Recommended Actions</Text>
                    {es.recommendedActions.slice(0, 5).map((a, i) => (
                        <View key={i} style={[styles.warnBox, { marginBottom: 6 }]}>
                            <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.red }}>ACTION {String(i + 1).padStart(2, '0')}</Text>
                            <Text style={[styles.alertText, { color: C.slateLight }]}>{String(a)}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Business Impact */}
            {es?.businessImpact && (
                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.subSubHeading}>Business Impact</Text>
                    <Text style={styles.bodyText}>{String(es.businessImpact)}</Text>
                </View>
            )}

            <PF label="Section 01 — Executive Summary" />
        </Page>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 3: Engagement Overview
// ═════════════════════════════════════════════════════════════════════════════
export const EngagementPage: React.FC<{ enterpriseReport?: ExecutiveReport; date: string; scan: any }> = ({ enterpriseReport, date, scan }) => {
    const scope = enterpriseReport?.scope;

    const objectives = [
        'Assess application security posture against modern threat vectors',
        'Identify vulnerabilities in source code through static and dynamic analysis',
        'Evaluate architectural security design and trust boundaries',
        'Review compliance alignment with GDPR, SOC 2, HIPAA, and PCI-DSS',
        'Map findings to OWASP Top 10, NIST CSF, and MITRE ATT&CK frameworks',
    ];

    const methodology = [
        { name: 'SAST', desc: 'Secure Code Review — automated and manual static analysis of source code' },
        { name: 'DAST', desc: 'Dynamic Testing — runtime testing of exposed application endpoints' },
        { name: 'SCA', desc: 'Dependency Analysis — third-party and open-source component risk review' },
        { name: 'Threat Modeling', desc: 'STRIDE-based decomposition of trust boundaries and data flows' },
        { name: 'Penetration Testing', desc: 'Manual attempted exploitation of identified weaknesses' },
        { name: 'Config Review', desc: 'Infrastructure, IAM, and secrets configuration inspection' },
    ];

    const standards = ['OWASP Top 10 (2021)', 'NIST Cybersecurity Framework', 'MITRE ATT&CK', 'CWE/SANS Top 25', 'ISO 27001', 'PCI-DSS v4.0'];

    return (
        <Page size="A4" style={styles.page}>
            <PH date={date} section="Engagement Overview" />

            <Text style={styles.sectionHeading}>02  Engagement Overview</Text>
            <Text style={styles.sectionSub}>SCOPE, OBJECTIVES & METHODOLOGY</Text>

            {/* 3.1 Objectives */}
            <Text style={styles.subHeading}>3.1  Objectives</Text>
            <Bullets items={objectives} />

            {/* 3.2 Scope */}
            <Text style={styles.subHeading}>3.2  Scope</Text>
            <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Target Repository:</Text>
                    <Text style={styles.infoValue}>{scan?.repo_url || 'N/A'}</Text>
                </View>
                {scope?.applicationsAssessed && scope.applicationsAssessed.length > 0 && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Applications:</Text>
                        <Text style={styles.infoValue}>{scope.applicationsAssessed.join(', ')}</Text>
                    </View>
                )}
                {scope?.apis && scope.apis.length > 0 && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>APIs:</Text>
                        <Text style={styles.infoValue}>{scope.apis.join(', ')}</Text>
                    </View>
                )}
                {scope?.cloudEnvironments && scope.cloudEnvironments.length > 0 && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Cloud:</Text>
                        <Text style={styles.infoValue}>{scope.cloudEnvironments.join(', ')}</Text>
                    </View>
                )}
                {scope?.exclusions && scope.exclusions.length > 0 && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Exclusions:</Text>
                        <Text style={styles.infoValue}>{scope.exclusions.join(', ')}</Text>
                    </View>
                )}
            </View>

            {/* 3.3 Methodology */}
            <Text style={styles.subHeading}>3.3  Methodology</Text>
            <View style={styles.table}>
                <View style={styles.tableHead}>
                    <Text style={[styles.tableHeadCell, { flex: 0.5 }]}>Method</Text>
                    <Text style={[styles.tableHeadCell, { flex: 1.5 }]}>Description</Text>
                </View>
                {methodology.map((m, i) => (
                    <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                        <Text style={[styles.tableCell, { flex: 0.5, fontFamily: 'Helvetica-Bold', color: C.blue }]}>{m.name}</Text>
                        <Text style={[styles.tableCell, { flex: 1.5 }]}>{m.desc}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.subSubHeading}>Reference Standards</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {standards.map((s, i) => (
                    <View key={i} style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#EFF6FF', borderRadius: 4, border: `1 solid ${C.blue}30` }}>
                        <Text style={{ fontSize: 8, color: C.blue, fontFamily: 'Helvetica-Bold' }}>{s}</Text>
                    </View>
                ))}
            </View>

            <PF label="Section 02 — Engagement Overview" />
        </Page>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 4: Security Posture Overview
// ═════════════════════════════════════════════════════════════════════════════
export const PosturePage: React.FC<{ issues: Issue[]; enterpriseReport?: ExecutiveReport; date: string }> = ({ issues, enterpriseReport, date }) => {
    const ib = enterpriseReport?.issueBreakdown || {
        critical: issues.filter(i => i.severity === 'critical').length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
        informational: 0,
    };
    const total = (ib.critical || 0) + (ib.high || 0) + (ib.medium || 0) + (ib.low || 0);
    const as_ = enterpriseReport?.attackSurface;

    const heatmap = [
        { impact: 'Critical', likelihood: 'High', level: 'CRITICAL', color: '#DC2626', bg: '#FEF2F2' },
        { impact: 'Critical', likelihood: 'Medium', level: 'HIGH', color: '#EA580C', bg: '#FFF7ED' },
        { impact: 'High', likelihood: 'High', level: 'HIGH', color: '#EA580C', bg: '#FFF7ED' },
        { impact: 'High', likelihood: 'Medium', level: 'MEDIUM', color: '#D97706', bg: '#FFFBEB' },
        { impact: 'Medium', likelihood: 'Low', level: 'LOW', color: '#2563EB', bg: '#EFF6FF' },
    ];

    return (
        <Page size="A4" style={styles.page}>
            <PH date={date} section="Security Posture Overview" />

            <Text style={styles.sectionHeading}>03  Security Posture Overview</Text>
            <Text style={styles.sectionSub}>RISK HEATMAP, VULNERABILITY DISTRIBUTION & ATTACK SURFACE</Text>

            {/* 4.1 Risk Heatmap */}
            <Text style={styles.subHeading}>3.1  Risk Heatmap</Text>
            <View style={styles.table}>
                <View style={styles.tableHead}>
                    <Text style={styles.tableHeadCell}>Impact Level</Text>
                    <Text style={styles.tableHeadCell}>Likelihood</Text>
                    <Text style={styles.tableHeadCell}>Overall Risk</Text>
                </View>
                {heatmap.map((row, i) => (
                    <View key={i} style={[styles.tableRow, { backgroundColor: row.bg }]}>
                        <Text style={[styles.tableCell, { fontFamily: 'Helvetica-Bold', color: row.color }]}>{row.impact}</Text>
                        <Text style={styles.tableCell}>{row.likelihood}</Text>
                        <View style={{ flex: 1 }}>
                            <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: row.color, borderRadius: 3, alignSelf: 'flex-start' }}>
                                <Text style={{ fontSize: 7, color: C.white, fontFamily: 'Helvetica-Bold' }}>{row.level}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* 4.2 Vulnerability Distribution */}
            <Text style={styles.subHeading}>3.2  Vulnerability Distribution</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                {[
                    { label: 'Critical', count: ib.critical, color: '#DC2626', bg: '#FEF2F2' },
                    { label: 'High', count: ib.high, color: '#EA580C', bg: '#FFF7ED' },
                    { label: 'Medium', count: ib.medium, color: '#D97706', bg: '#FFFBEB' },
                    { label: 'Low', count: ib.low, color: '#2563EB', bg: '#EFF6FF' },
                    { label: 'Info', count: ib.informational || 0, color: '#64748B', bg: '#F8FAFC' },
                ].map(s => (
                    <View key={s.label} style={[styles.scoreBox, { backgroundColor: s.bg, borderColor: s.color + '50', alignItems: 'center', padding: 10 }]}>
                        <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: s.color }}>{s.count || 0}</Text>
                        <Text style={{ fontSize: 7, color: s.color, fontFamily: 'Helvetica-Bold', marginTop: 3 }}>{s.label.toUpperCase()}</Text>
                        <Text style={{ fontSize: 7, color: C.muted, marginTop: 2 }}>
                            {total > 0 ? Math.round(((s.count || 0) / total) * 100) : 0}%
                        </Text>
                    </View>
                ))}
            </View>

            {/* 4.3 Attack Surface */}
            <Text style={styles.subHeading}>3.3  Attack Surface Summary</Text>
            {as_ ? (
                <View style={styles.table}>
                    <View style={styles.tableHead}>
                        <Text style={styles.tableHeadCell}>Attack Vector</Text>
                        <Text style={styles.tableHeadCell}>Details</Text>
                    </View>
                    {[
                        { label: 'Public Endpoints', items: as_.publicEndpoints },
                        { label: 'Admin Panels', items: as_.adminPanels },
                        { label: 'External Integrations', items: as_.externalIntegrations },
                        { label: 'Third-Party Deps', items: as_.thirdPartyDependencies },
                        { label: 'Open Ports', items: as_.openPorts },
                        { label: 'Secrets Exposure', items: as_.secretsExposure },
                    ].filter(r => r.items && r.items.length > 0).map((r, i) => (
                        <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                            <Text style={[styles.tableCell, { fontFamily: 'Helvetica-Bold' }]}>{r.label}</Text>
                            <Text style={styles.tableCell}>{r.items!.join(', ')}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.alertBox}>
                    <Text style={styles.alertText}>Attack surface data is generated from the scan analysis. Review detailed findings for specific exposure points.</Text>
                </View>
            )}

            <PF label="Section 03 — Security Posture Overview" />
        </Page>
    );
};

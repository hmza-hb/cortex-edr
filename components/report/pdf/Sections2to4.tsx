import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { ExecutiveReport } from '@/types/report';
import { Issue } from '@/types/agent';
import { styles, C, severityColor, severityBg } from './pdfStyles';
import { PH, PF } from './CoverAndTOC';

interface Props {
    scan: any;
    issues: Issue[];
    enterpriseReport?: ExecutiveReport;
    date: string;
}

const Bullet = ({ text, color = C.blue }: { text: string; color?: string }) => (
    <View style={styles.bulletRow}>
        <Text style={[styles.bullet, { color }]}>›</Text>
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

// ═════════════════════════════════════════════════════════════════════════════
// EXECUTIVE SUMMARY PAGE
// ═════════════════════════════════════════════════════════════════════════════
export const ExecSummaryPage: React.FC<Props> = ({ scan, issues, enterpriseReport, date }) => {
    const es = enterpriseReport?.executiveSummary;
    const ib = (enterpriseReport?.issueBreakdown as any) || {
        critical: issues.filter(i => i.severity === 'critical').length,
        high:     issues.filter(i => i.severity === 'high').length,
        medium:   issues.filter(i => i.severity === 'medium').length,
        low:      issues.filter(i => i.severity === 'low').length,
    };
    const total = (ib.critical || 0) + (ib.high || 0) + (ib.medium || 0) + (ib.low || 0);
    const score = scan?.score ?? 0;
    const risk = enterpriseReport?.riskLevel || 'High';

    const scoreColor =
        score >= 80 ? C.green :
        score >= 60 ? C.amber :
        score >= 40 ? C.orange : C.red;

    const topPriorities = (enterpriseReport?.topPriorities || []) as any[];
    const redFlags = topPriorities.filter((p: any) => p.launchStatus === 'RED_FLAG');
    const prodSafe = redFlags.length === 0;

    return (
        <Page size="A4" style={styles.page}>
            <PH date={date} section="Executive Summary" />

            <Text style={styles.sectionHeading}>Executive Summary</Text>
            <Text style={styles.sectionSubtitle}>WHAT WAS FOUND  ·  WHAT IT MEANS  ·  WHAT TO DO FIRST</Text>

            {/* ── Score + Verdict row ────────────────────────────────── */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 22 }}>
                {/* Score ring */}
                <View style={{
                    paddingVertical: 16, paddingHorizontal: 20,
                    borderRadius: 8, backgroundColor: C.navy,
                    alignItems: 'center', justifyContent: 'center', minWidth: 90,
                }}>
                    <Text style={{ fontSize: 36, fontFamily: 'Helvetica-Bold', color: scoreColor }}>{score}</Text>
                    <Text style={{ fontSize: 8, color: '#93C5FD', letterSpacing: 1, marginTop: 2 }}>/ 100</Text>
                    <Text style={{ fontSize: 7, color: '#64748B', letterSpacing: 1, marginTop: 4, fontFamily: 'Helvetica-Bold' }}>
                        HEALTH SCORE
                    </Text>
                </View>

                {/* Verdict */}
                <View style={{ flex: 1 }}>
                    <View style={{
                        paddingVertical: 12, paddingHorizontal: 16,
                        borderRadius: 8, flex: 1,
                        backgroundColor: prodSafe ? '#F0FDF4' : '#FEF2F2',
                        borderWidth: 1.5, borderStyle: 'solid',
                        borderColor: prodSafe ? C.green : C.red,
                    }}>
                        <Text style={{
                            fontSize: 11, fontFamily: 'Helvetica-Bold',
                            color: prodSafe ? C.green : C.red, marginBottom: 5,
                        }}>
                            {prodSafe
                                ? '✓  Conditionally ready for production'
                                : '✗  Not recommended for production'}
                        </Text>
                        <Text style={{ fontSize: 9, color: C.slateLight, lineHeight: 1.6 }}>
                            {prodSafe
                                ? 'No critical red-flag issues found. Address remaining medium/low findings before next release.'
                                : `${redFlags.length} red-flag ${redFlags.length === 1 ? 'issue' : 'issues'} must be resolved before deploying to production.`}
                        </Text>
                    </View>
                </View>
            </View>

            {/* ── Severity Breakdown ────────────────────────────────── */}
            <Text style={styles.subHeading}>Findings Breakdown</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                {[
                    { label: 'Critical', count: ib.critical || 0, color: '#DC2626', bg: '#FEF2F2' },
                    { label: 'High',     count: ib.high || 0,     color: '#EA580C', bg: '#FFF7ED' },
                    { label: 'Medium',   count: ib.medium || 0,   color: '#D97706', bg: '#FFFBEB' },
                    { label: 'Low',      count: ib.low || 0,      color: '#2563EB', bg: '#EFF6FF' },
                ].map(s => (
                    <View key={s.label} style={[
                        styles.scoreBox,
                        { backgroundColor: s.bg, borderColor: s.color + '40' },
                    ]}>
                        <Text style={[styles.scoreMain, { color: s.color, fontSize: 26 }]}>{s.count}</Text>
                        <Text style={[styles.scoreLabel, { color: s.color }]}>{s.label.toUpperCase()}</Text>
                        {/* Mini bar */}
                        <View style={{ height: 4, marginTop: 8, width: '100%' }}>
                            <View style={{
                                height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden',
                            }}>
                                <View style={{
                                    height: 4, borderRadius: 2, backgroundColor: s.color,
                                    width: total > 0 ? `${Math.round((s.count / total) * 100)}%` : '0%',
                                }} />
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* ── Application Context ────────────────────────────────── */}
            {(enterpriseReport?.applicationStory || scan?.application_story) && (
                <>
                    <Text style={styles.subHeading}>About This Application</Text>
                    <Text style={styles.body}>
                        {String(enterpriseReport?.applicationStory || scan?.application_story || '')}
                    </Text>
                </>
            )}

            {/* ── Key Findings ────────────────────────────────────────── */}
            {es?.keyFindings && es.keyFindings.length > 0 && (
                <>
                    <Text style={styles.subHeading}>Key Findings</Text>
                    {es.keyFindings.slice(0, 5).map((f, i) => (
                        <Bullet key={i} text={String(f)} color={C.red} />
                    ))}
                </>
            )}

            {/* ── Top Actions ─────────────────────────────────────────── */}
            {es?.recommendedActions && es.recommendedActions.length > 0 && (
                <>
                    <Text style={styles.subHeading}>Top Actions — Take These First</Text>
                    {es.recommendedActions.slice(0, 3).map((a, i) => (
                        <View key={i} style={[styles.warnBox, { marginBottom: 8 }]}>
                            <Text style={[styles.boxTitle, { color: C.red }]}>
                                ACTION {String(i + 1).padStart(2, '0')}
                            </Text>
                            <Text style={styles.boxText}>{String(a)}</Text>
                        </View>
                    ))}
                </>
            )}

            {/* ── Strengths ────────────────────────────────────────────── */}
            {((enterpriseReport as any)?.strengths || scan?.strengths) && (
                <>
                    <Text style={styles.subHeading}>Codebase Strengths</Text>
                    <View style={[styles.successBox, { marginBottom: 0 }]}>
                        {((enterpriseReport as any)?.strengths || scan?.strengths || [])
                            .slice(0, 3).map((s: string, i: number) => (
                                <Bullet key={i} text={String(s)} color={C.green} />
                            ))}
                    </View>
                </>
            )}

            <PF label="Executive Summary" />
        </Page>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// REMEDIATION ROADMAP + CONCLUSION
// ═════════════════════════════════════════════════════════════════════════════
export const RoadmapAndConclusionPage: React.FC<{
    scan: any;
    enterpriseReport?: ExecutiveReport;
    issues: Issue[];
    date: string;
}> = ({ scan, enterpriseReport, issues, date }) => {
    const roadmap = (enterpriseReport?.remediationRoadmap || []) as any[];
    const con = enterpriseReport?.conclusion;
    const riskLevel = enterpriseReport?.riskLevel || 'High';
    const prodSafe = con?.productionSafe ?? (riskLevel === 'Low' || riskLevel === 'Medium');

    const windows: Array<{
        key: 'immediate' | 'short' | 'mid';
        label: string; range: string; color: string; bg: string;
    }> = [
        { key: 'immediate', label: 'Immediate',  range: '0 – 30 days',  color: C.red,    bg: '#FEF2F2' },
        { key: 'short',     label: 'Short Term', range: '1 – 3 months', color: C.orange, bg: '#FFF7ED' },
        { key: 'mid',       label: 'Mid Term',   range: '3 – 6 months', color: C.amber,  bg: '#FFFBEB' },
    ];

    const fallbackItems: Record<string, string[]> = {
        immediate: [
            'Remediate all critical and high severity vulnerabilities immediately',
            'Rotate any credentials or API keys found to be exposed',
            'Enable authentication on all unprotected endpoints',
        ],
        short: [
            'Address all medium severity findings before next release',
            'Integrate security scanning into the CI/CD pipeline',
            'Implement rate limiting on all public-facing API routes',
        ],
        mid: [
            'Conduct a full dependency audit and update cycle',
            'Implement a secrets vault — remove hardcoded configuration values',
            'Add comprehensive error handling and structured logging throughout',
        ],
    };

    return (
        <Page size="A4" style={styles.page}>
            <PH date={date} section="Roadmap & Conclusion" />

            <Text style={styles.sectionHeading}>Remediation Roadmap</Text>
            <Text style={styles.sectionSubtitle}>PHASED PLAN — PRIORITIZED BY BUSINESS RISK</Text>

            {windows.map(w => {
                const items = roadmap.filter((r: any) => r.dueWindow === w.key);
                const fallback = fallbackItems[w.key] || [];
                return (
                    <View key={w.key} style={{ marginBottom: 14 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <View style={{
                                paddingHorizontal: 10, paddingVertical: 4,
                                backgroundColor: w.color, borderRadius: 4,
                            }}>
                                <Text style={{ fontSize: 8, color: C.white, fontFamily: 'Helvetica-Bold', letterSpacing: 1 }}>
                                    {w.label.toUpperCase()}
                                </Text>
                            </View>
                            <Text style={{ fontSize: 9, color: C.muted, fontFamily: 'Helvetica-Bold' }}>{w.range}</Text>
                        </View>
                        <View style={{
                            backgroundColor: w.bg, borderRadius: 6,
                            paddingVertical: 10, paddingHorizontal: 14,
                            borderWidth: 1, borderStyle: 'solid', borderColor: w.color + '30',
                        }}>
                            {items.length > 0 ? items.map((item: any, i: number) => (
                                <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
                                    <View style={{
                                        paddingHorizontal: 6, paddingVertical: 2,
                                        backgroundColor: w.color + '25', borderRadius: 3,
                                        alignSelf: 'flex-start',
                                    }}>
                                        <Text style={{ fontSize: 7, color: w.color, fontFamily: 'Helvetica-Bold' }}>
                                            {(item.severity || 'MED').toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.slate, marginBottom: 2 }}>
                                            {item.title}
                                        </Text>
                                        {item.description && (
                                            <Text style={{ fontSize: 9, color: C.muted, lineHeight: 1.5 }}>{item.description}</Text>
                                        )}
                                    </View>
                                </View>
                            )) : fallback.map((item, i) => (
                                <View key={i} style={styles.bulletRow}>
                                    <Text style={[styles.bullet, { color: w.color }]}>›</Text>
                                    <Text style={[styles.bulletText, { color: C.slate }]}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            })}

            {/* ── Conclusion ───────────────────────────────────────── */}
            <View style={styles.divider} />
            <Text style={styles.sectionHeading}>Conclusion</Text>

            <View style={{
                paddingVertical: 14, paddingHorizontal: 18,
                borderRadius: 8, marginBottom: 18,
                backgroundColor: prodSafe ? '#F0FDF4' : '#FEF2F2',
                borderWidth: 2, borderStyle: 'solid',
                borderColor: prodSafe ? C.green : C.red,
            }}>
                <Text style={{
                    fontSize: 12, fontFamily: 'Helvetica-Bold',
                    color: prodSafe ? C.green : C.red, marginBottom: 6,
                }}>
                    {prodSafe
                        ? '✓  Conditionally Production Safe'
                        : '✗  Not Recommended for Production'}
                </Text>
                <Text style={{ fontSize: 10, color: C.slateLight, lineHeight: 1.7 }}>
                    {con?.overallStatement ||
                        `This assessment of ${scan?.repo_url || 'the target repository'} identified ${enterpriseReport?.totalIssues || 'multiple'} findings with an overall ${riskLevel} risk rating. ${prodSafe ? 'The codebase may proceed to production after resolving medium findings.' : 'Critical and high severity issues must be resolved before deployment.'}`}
                </Text>
            </View>

            {con?.immediateRedFlags && con.immediateRedFlags.length > 0 && (
                <View style={[styles.warnBox, { marginBottom: 14 }]}>
                    <Text style={[styles.boxTitle, { color: C.red }]}>Red Flags — Fix Before Any Release</Text>
                    {con.immediateRedFlags.map((f: string, i: number) => (
                        <View key={i} style={styles.bulletRow}>
                            <Text style={[styles.bullet, { color: C.red }]}>⚠</Text>
                            <Text style={[styles.bulletText, { color: C.slateLight }]}>{f}</Text>
                        </View>
                    ))}
                </View>
            )}

            {(con?.strategicRecommendations || []).slice(0, 3).map((r: string, i: number) => (
                <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bullet}>›</Text>
                    <Text style={styles.bulletText}>{String(r)}</Text>
                </View>
            ))}

            {/* Attestation */}
            <View style={{
                marginTop: 20, paddingTop: 16,
                borderTopWidth: 0.5, borderTopStyle: 'solid', borderTopColor: C.border,
            }}>
                <Text style={{ fontSize: 8, color: C.muted, marginBottom: 6, fontFamily: 'Helvetica-Bold', letterSpacing: 1 }}>
                    ANALYST ATTESTATION
                </Text>
                <Text style={[styles.bodySmall, { fontStyle: 'italic' }]}>
                    {enterpriseReport?.attestation ||
                        'This report was prepared by the Cortex EDR automated security analysis platform using multi-agent static analysis and AI-powered vulnerability detection. All findings should be reviewed by a qualified security professional before acting on critical remediation decisions.'}
                </Text>
                <View style={{ flexDirection: 'row', gap: 40, marginTop: 14 }}>
                    {[
                        { label: 'PREPARED BY', value: 'Cortex EDR Platform' },
                        { label: 'DATE',        value: date },
                        { label: 'VERSION',     value: (enterpriseReport?.reportVersion as string) || 'v1.0' },
                    ].map((m, i) => (
                        <View key={i}>
                            <Text style={{ fontSize: 8, color: C.muted, fontFamily: 'Helvetica-Bold', letterSpacing: 1 }}>
                                {m.label}
                            </Text>
                            <Text style={{ fontSize: 9, color: C.slate, marginTop: 4 }}>{m.value}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <PF label="Roadmap & Conclusion" />
        </Page>
    );
};

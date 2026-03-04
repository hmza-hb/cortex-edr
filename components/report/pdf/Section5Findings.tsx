import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { Issue } from '@/types/agent';
import { EnterpriseIssue } from '@/types/report';
import { styles, C, severityColor } from './pdfStyles';

const PF = ({ label }: { label: string }) => (
    <View style={styles.footer} fixed>
        <Text style={styles.footerText}>CORTEX EDR  ·  CONFIDENTIAL  ·  Enterprise Security Audit</Text>
        <Text style={styles.footerText}>{label}</Text>
    </View>
);

// ─── Finding Page ─────────────────────────────────────────────────────────────
export const FindingPage: React.FC<{
    issue: Issue & Partial<EnterpriseIssue>;
    idx: number;
    total: number;
    date: string;
    showWatermark?: boolean;
}> = ({ issue, idx, total, date, showWatermark }) => {
    const sevColor = severityColor(issue.severity);
    const findingId = (issue as any).findingId || `SEC-${String(idx + 1).padStart(3, '0')}`;

    return (
        <Page size="A4" style={styles.page} wrap>
            {showWatermark && (
                <View style={styles.watermark} fixed>
                    <Text style={styles.watermarkText}>CORTEX FREE TIER</Text>
                </View>
            )}

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.brand}>CORTEX EDR</Text>
                    <Text style={styles.brandTag}>SECTION 04 — DETAILED FINDINGS</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.headerMeta}>{date}</Text>
                    <Text style={styles.headerMeta}>Finding {idx + 1} of {total}</Text>
                </View>
            </View>

            {/* Finding Header Card */}
            <View style={[styles.findingCard, { marginBottom: 14 }]}>
                <View style={styles.findingHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.findingId}>{findingId}</Text>
                        <Text style={styles.findingTitle}>{String(issue.title || 'Security Finding')}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                        <View style={[styles.badge, { backgroundColor: sevColor }]}>
                            <Text style={{ fontSize: 8, color: C.white, fontFamily: 'Helvetica-Bold' }}>
                                {String(issue.severity || 'low').toUpperCase()}
                            </Text>
                        </View>
                        {(issue as any).cvssScore && (
                            <Text style={{ fontSize: 8, color: '#93C5FD' }}>CVSS {(issue as any).cvssScore}</Text>
                        )}
                    </View>
                </View>

                {/* Standards row */}
                <View style={{ flexDirection: 'row', gap: 6, padding: '6 14', backgroundColor: '#F8FAFC', borderBottom: `1 solid ${C.border}` }}>
                    {(issue as any).owaspCategory && (
                        <View style={{ paddingHorizontal: 6, paddingVertical: 3, backgroundColor: '#EFF6FF', borderRadius: 3 }}>
                            <Text style={{ fontSize: 7, color: C.blue, fontFamily: 'Helvetica-Bold' }}>OWASP: {(issue as any).owaspCategory}</Text>
                        </View>
                    )}
                    {(issue as any).cweId && (
                        <View style={{ paddingHorizontal: 6, paddingVertical: 3, backgroundColor: '#FFFBEB', borderRadius: 3 }}>
                            <Text style={{ fontSize: 7, color: C.amber, fontFamily: 'Helvetica-Bold' }}>{(issue as any).cweId}</Text>
                        </View>
                    )}
                    {issue.category && (
                        <View style={{ paddingHorizontal: 6, paddingVertical: 3, backgroundColor: '#F0FDF4', borderRadius: 3 }}>
                            <Text style={{ fontSize: 7, color: C.green, fontFamily: 'Helvetica-Bold' }}>{String(issue.category).replace('_', ' ').toUpperCase()}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* 5.1 Description */}
            <Text style={styles.subSubHeading}>5.1  Description</Text>
            <Text style={[styles.bodyText, { marginBottom: 10 }]}>
                {String(issue.description || (issue as any).whatWeFound || (issue as any).what_we_found || 'No description provided.')}
            </Text>

            {/* 5.2 Affected Components */}
            <Text style={styles.subSubHeading}>5.2  Affected Components</Text>
            <View style={styles.infoGrid}>
                {(issue as any).file_path || issue.file ? (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>File:</Text>
                        <Text style={[styles.infoValue, { fontFamily: 'Courier', fontSize: 8 }]}>
                            {String((issue as any).file_path || issue.file || 'N/A')}
                        </Text>
                    </View>
                ) : null}
                {(issue.line_number || issue.line) ? (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Line:</Text>
                        <Text style={styles.infoValue}>{String(issue.line_number || issue.line)}</Text>
                    </View>
                ) : null}
                {(issue as any).functionName && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Function:</Text>
                        <Text style={[styles.infoValue, { fontFamily: 'Courier', fontSize: 8 }]}>{String((issue as any).functionName)}</Text>
                    </View>
                )}
                {(issue as any).endpoint && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Endpoint:</Text>
                        <Text style={[styles.infoValue, { fontFamily: 'Courier', fontSize: 8 }]}>{String((issue as any).endpoint)}</Text>
                    </View>
                )}
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Scanner Agent:</Text>
                    <Text style={styles.infoValue}>{String((issue as any).agentName || issue.category || 'Security Scanner')}</Text>
                </View>
            </View>

            {/* 5.3 Evidence / Code Snippet */}
            {((issue as any).codeSnippet || (issue as any).code_snippet) && (
                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.subSubHeading}>5.3  Evidence</Text>
                    <View style={styles.codeBlock}>
                        <Text style={styles.code}>
                            {String((issue as any).codeSnippet || (issue as any).code_snippet || '').substring(0, 400)}
                        </Text>
                    </View>
                </View>
            )}

            {/* 5.4 Impact */}
            {(issue as any).impact && (
                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.subSubHeading}>5.4  Impact Analysis</Text>
                    {['definite', 'likely', 'reported', 'possible'].map(type => {
                        const items = (issue as any).impact?.[type];
                        if (!items || items.length === 0) return null;
                        const label = type === 'definite' ? 'Will Definitely Cause' : type === 'likely' ? 'Will Likely Cause' : type === 'reported' ? 'Commonly Reported' : 'May Cause';
                        return (
                            <View key={type} style={{ marginBottom: 6 }}>
                                <Text style={{ fontSize: 7, color: C.red, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>{label.toUpperCase()}</Text>
                                {items.slice(0, 3).map((it: string, i: number) => (
                                    <View key={i} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>›</Text>
                                        <Text style={styles.bulletText}>{it}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>
            )}

            {/* 5.5 Exploitation Scenario */}
            {(issue as any).exploitationScenario && (
                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.subSubHeading}>5.5  Exploitation Scenario</Text>
                    <View style={styles.warnBox}>
                        <Text style={[styles.alertText, { color: C.slateLight }]}>{String((issue as any).exploitationScenario)}</Text>
                    </View>
                </View>
            )}

            {/* 5.6 Likelihood */}
            {(issue as any).likelihood && (
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                    <Text style={styles.subSubHeading}>5.6  Likelihood  </Text>
                    {(issue as any).likelihood.publicExposure !== undefined && (
                        <View style={{ paddingHorizontal: 7, paddingVertical: 3, backgroundColor: '#FEF2F2', borderRadius: 3 }}>
                            <Text style={{ fontSize: 7, color: C.red }}>Public: {(issue as any).likelihood.publicExposure ? 'YES' : 'NO'}</Text>
                        </View>
                    )}
                    {(issue as any).likelihood.authRequired !== undefined && (
                        <View style={{ paddingHorizontal: 7, paddingVertical: 3, backgroundColor: '#FFFBEB', borderRadius: 3 }}>
                            <Text style={{ fontSize: 7, color: C.amber }}>Auth: {(issue as any).likelihood.authRequired ? 'Required' : 'Not Required'}</Text>
                        </View>
                    )}
                    {(issue as any).likelihood.skillLevel && (
                        <View style={{ paddingHorizontal: 7, paddingVertical: 3, backgroundColor: '#EFF6FF', borderRadius: 3 }}>
                            <Text style={{ fontSize: 7, color: C.blue }}>Skill: {(issue as any).likelihood.skillLevel}</Text>
                        </View>
                    )}
                </View>
            )}

            {/* 5.7 Business Impact */}
            {(issue as any).businessImpact && (
                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.subSubHeading}>5.7  Business Impact</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        {(issue as any).businessImpact.revenueRisk && (
                            <View style={[styles.alertBox, { flex: 1, margin: 0 }]}>
                                <Text style={styles.alertTitle}>Revenue Risk</Text>
                                <Text style={styles.alertText}>{(issue as any).businessImpact.revenueRisk}</Text>
                            </View>
                        )}
                        {(issue as any).businessImpact.reputationDamage && (
                            <View style={[styles.warnBox, { flex: 1, margin: 0 }]}>
                                <Text style={styles.warnTitle}>Reputation</Text>
                                <Text style={[styles.alertText, { color: C.slateLight }]}>{(issue as any).businessImpact.reputationDamage}</Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {/* 5.8 Root Cause */}
            {(issue as any).rootCause && (
                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.subSubHeading}>5.8  Root Cause</Text>
                    <Text style={styles.bodyText}>{String((issue as any).rootCause)}</Text>
                </View>
            )}

            {/* 5.9 Remediation */}
            {(issue as any).solution && (
                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.subSubHeading}>5.9  Remediation</Text>
                    {['must', 'should', 'goodToHave'].map(level => {
                        const items = (issue as any).solution?.[level];
                        if (!items || items.length === 0) return null;
                        const label = level === 'must' ? '🚨 MUST DO' : level === 'should' ? '⚡ SHOULD DO' : '💡 GOOD TO HAVE';
                        return (
                            <View key={level} style={[styles.successBox, { marginBottom: 6 }]}>
                                <Text style={{ fontSize: 7, color: C.green, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>{label}</Text>
                                {items.slice(0, 3).map((item: any, i: number) => (
                                    <View key={i} style={{ marginBottom: 4 }}>
                                        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.slate }}>{i + 1}. {item.action}</Text>
                                        <Text style={{ fontSize: 7, color: C.muted, marginTop: 1 }}>WHY: {item.reason}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>
            )}

            {/* 5.10 References */}
            {((issue as any).cveIds?.length > 0 || (issue as any).references?.length > 0 || (issue as any).metadata?.owasp) && (
                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.subSubHeading}>5.10  References</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                        {(issue as any).cveIds?.map((cve: string, i: number) => (
                            <View key={i} style={{ paddingHorizontal: 6, paddingVertical: 3, backgroundColor: '#FEF2F2', borderRadius: 3 }}>
                                <Text style={{ fontSize: 7, color: C.red, fontFamily: 'Helvetica-Bold' }}>{cve}</Text>
                            </View>
                        ))}
                        {(issue as any).metadata?.owasp && (
                            <View style={{ paddingHorizontal: 6, paddingVertical: 3, backgroundColor: '#EFF6FF', borderRadius: 3 }}>
                                <Text style={{ fontSize: 7, color: C.blue, fontFamily: 'Helvetica-Bold' }}>OWASP: {(issue as any).metadata.owasp}</Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {/* Economics row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: '8 12', backgroundColor: '#F0FDF4', borderRadius: 6, border: `1 solid #DCFCE7` }}>
                <View>
                    <Text style={{ fontSize: 7, color: C.green, fontFamily: 'Helvetica-Bold' }}>ROI OF FIXING</Text>
                    <Text style={{ fontSize: 9, color: '#14532D', fontFamily: 'Helvetica-Bold' }}>{String((issue as any).roi || 'High Resilience')}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 7, color: C.green, fontFamily: 'Helvetica-Bold' }}>EST. TIME TO FIX</Text>
                    <Text style={{ fontSize: 9, color: '#14532D', fontFamily: 'Helvetica-Bold' }}>{String((issue as any).estimatedTimeToFix || '2–4 hours')}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 7, color: C.red, fontFamily: 'Helvetica-Bold' }}>PRIORITY</Text>
                    <Text style={{ fontSize: 9, color: '#991B1B', fontFamily: 'Helvetica-Bold' }}>{String(issue.severity || 'medium').toUpperCase()} RESPONSE</Text>
                </View>
            </View>

            <PF label={`Finding ${idx + 1} of ${total}  —  ${findingId}`} />
        </Page>
    );
};

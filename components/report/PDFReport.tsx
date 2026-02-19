import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Path, Rect } from '@react-pdf/renderer';
import { Issue } from '@/types/agent';
import { ExecutiveReport } from '@/types/report';

// --------------------------------------------------------------------------------
// PROFESSIONAL SVG ICONS (Cortex-native)
// --------------------------------------------------------------------------------

const Icons = {
    Location: () => (
        <Svg width="12" height="12" viewBox="0 0 24 24">
            <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke="#64748b" strokeWidth="2" />
            <Path d="M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="none" stroke="#64748b" strokeWidth="2" />
        </Svg>
    ),
    Analysis: () => (
        <Svg width="12" height="12" viewBox="0 0 24 24">
            <Path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        </Svg>
    ),
    Risk: () => (
        <Svg width="12" height="12" viewBox="0 0 24 24">
            <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            <Path d="M12 9v4m0 4h.01" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        </Svg>
    ),
    Check: () => (
        <Svg width="10" height="10" viewBox="0 0 24 24">
            <Path d="M20 6L9 17l-5-5" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),
    Impact: () => (
        <Svg width="10" height="10" viewBox="0 0 24 24">
            <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    ),
    Solution: () => (
        <Svg width="12" height="12" viewBox="0 0 24 24">
            <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
            <Path d="M22 4L12 14.01l-3-3" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        </Svg>
    ),
    Robot: () => (
        <Svg width="12" height="12" viewBox="0 0 24 24">
            <Rect x="3" y="11" width="18" height="10" rx="2" fill="none" stroke="#8b5cf6" strokeWidth="2" />
            <Path d="M12 8V4m0 0H8m4 0h4M9 16v1m6-1v1" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
        </Svg>
    ),
    Economics: () => (
        <Svg width="12" height="12" viewBox="0 0 24 24">
            <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        </Svg>
    )
};

// --------------------------------------------------------------------------------
// STYLESHEET
// --------------------------------------------------------------------------------

const styles = StyleSheet.create({
    page: {
        padding: 50,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
    },
    // Header & Brand
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #0f172a',
        paddingBottom: 25,
        marginBottom: 30,
    },
    brand: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0f172a',
        letterSpacing: 2,
    },
    brandTag: {
        fontSize: 8,
        color: '#3b82f6',
        marginTop: 4,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerMeta: {
        textAlign: 'right',
    },
    metaText: {
        fontSize: 9,
        color: '#64748b',
        marginBottom: 2,
        textTransform: 'uppercase',
    },

    // Executive Overview Section
    execSection: {
        marginBottom: 40,
    },
    auditHeadline: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 10,
    },
    auditSubheadline: {
        fontSize: 10,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 30,
    },
    scoreGrid: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 40,
    },
    scoreBox: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8fafc',
        border: '1pt solid #e2e8f0',
        borderRadius: 12,
    },
    scoreMain: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    scoreLabel: {
        fontSize: 8,
        color: '#64748b',
        textTransform: 'uppercase',
        marginTop: 6,
        fontWeight: 'bold',
    },

    // Summary Blocks
    summaryBlock: {
        marginBottom: 25,
    },
    summaryTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#3b82f6',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        borderBottom: '1pt solid #f1f5f9',
        paddingBottom: 6,
    },
    summaryText: {
        fontSize: 10,
        lineHeight: 1.6,
        color: '#334155',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        borderLeft: '3pt solid #ef4444',
    },
    actionNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ef4444',
    },
    actionDescription: {
        fontSize: 9,
        color: '#7f1d1d',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },

    // ISSUE MANIFEST STYLES
    manifestHeader: {
        padding: '12 15',
        backgroundColor: '#0f172a',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    manifestTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    manifestSeverity: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#dc2626',
        padding: '3 10',
        borderRadius: 4,
    },

    // Subsection Containers
    subsection: {
        marginBottom: 20,
        paddingLeft: 10,
    },
    subsectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    subsectionTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // Details
    detailGrid: {
        paddingLeft: 18,
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    detailLabel: {
        width: 80,
        fontSize: 9,
        color: '#94a3b8',
    },
    detailValue: {
        flex: 1,
        fontSize: 9,
        color: '#334155',
        fontFamily: 'Courier',
    },

    // Analysis Content
    contentBox: {
        paddingLeft: 18,
        fontSize: 10,
        lineHeight: 1.5,
        color: '#1e293b',
    },

    // Impact Category
    impactCategory: {
        marginBottom: 15,
    },
    impactLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#ef4444',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    impactList: {
        paddingLeft: 18,
    },
    impactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    impactText: {
        fontSize: 9,
        color: '#475569',
    },

    // Solution Styles
    solutionBox: {
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        border: '1pt solid #e2e8f0',
        marginBottom: 10,
    },
    solutionLevel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#2563eb',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    solutionItem: {
        marginBottom: 6,
    },
    solutionAction: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    solutionReason: {
        fontSize: 8,
        color: '#64748b',
        marginTop: 2,
    },

    // AI Prompt Styles
    promptTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#7c3aed',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    promptBox: {
        marginBottom: 8,
        padding: 10,
        border: '1pt solid #ddd6fe',
        backgroundColor: '#f5f3ff',
        borderRadius: 6,
    },
    promptLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#7c3aed',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    promptText: {
        fontSize: 8,
        fontFamily: 'Courier',
        color: '#4c1d95',
        lineHeight: 1.4,
    },

    // Economic Footer
    ecoFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '12 15',
        backgroundColor: '#f0fdf4',
        border: '1pt solid #dcfce7',
        borderRadius: 8,
        marginTop: 10,
    },
    ecoItem: {
        flex: 1,
    },
    ecoLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#166534',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    ecoValue: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#14532d',
    },

    // Global Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        borderTop: '1pt solid #e2e8f0',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 8,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

// --------------------------------------------------------------------------------
// UTILS
// --------------------------------------------------------------------------------

const getSummaryText = (enterpriseReport?: ExecutiveReport, scan?: any) => {
    if (typeof enterpriseReport?.executiveSummary?.overview === 'string' && enterpriseReport.executiveSummary.overview.length > 0) {
        return enterpriseReport.executiveSummary.overview;
    }
    const summary = scan?.summary;
    if (typeof summary === 'string') return summary;
    if (summary && typeof summary === 'object') {
        return summary.overview || summary.summary || JSON.stringify(summary).substring(0, 500);
    }
    return "Executing deep-scan synthesis for architectural integrity and security posture...";
};

const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
        case 'critical': return '#dc2626';
        case 'high': return '#ea580c';
        case 'medium': return '#d97706';
        case 'low': return '#2563eb';
        default: return '#64748b';
    }
};

// --------------------------------------------------------------------------------
// COMPONENT
// --------------------------------------------------------------------------------

interface PDFReportProps {
    scan: any;
    issues: Issue[];
    enterpriseReport?: ExecutiveReport;
}

export const PDFReport: React.FC<PDFReportProps> = ({ scan, issues, enterpriseReport }) => {
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const summaryText = getSummaryText(enterpriseReport, scan);

    return (
        <Document title={`Cortex Audit - ${scan?.id}`}>
            {/* PAGE 1: EXECUTIVE STRATEGY */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brand}>CORTEX EDR</Text>
                        <Text style={styles.brandTag}>Enterprise Security Audit</Text>
                    </View>
                    <View style={styles.headerMeta}>
                        <Text style={styles.metaText}>{date}</Text>
                        <Text style={styles.metaText}>Manifest ID: {scan?.id || 'ALPHA-001'}</Text>
                    </View>
                </View>

                <View style={styles.execSection}>
                    <Text style={styles.auditHeadline}>Audit Manifest</Text>
                    <Text style={styles.auditSubheadline}>Target: {String(scan?.repo_url || 'Internal Repository')}</Text>

                    <View style={styles.scoreGrid}>
                        <View style={styles.scoreBox}>
                            <Text style={styles.scoreMain}>{scan?.score || 0}%</Text>
                            <Text style={styles.scoreLabel}>Security Health Score</Text>
                        </View>
                        <View style={[styles.scoreBox, { backgroundColor: '#fef2f2', borderColor: '#fee2e2' }]}>
                            <Text style={[styles.scoreMain, { color: '#dc2626' }]}>{issues.filter(i => i.severity === 'critical').length}</Text>
                            <Text style={[styles.scoreLabel, { color: '#dc2626' }]}>Critical Alerts</Text>
                        </View>
                        <View style={[styles.scoreBox, { backgroundColor: '#fff7ed', borderColor: '#ffedd5' }]}>
                            <Text style={[styles.scoreMain, { color: '#ea580c' }]}>{issues.filter(i => i.severity === 'high').length}</Text>
                            <Text style={[styles.scoreLabel, { color: '#ea580c' }]}>High Risk Findings</Text>
                        </View>
                    </View>

                    <View style={styles.summaryBlock}>
                        <Text style={styles.summaryTitle}>Executive Synthesis</Text>
                        <Text style={styles.summaryText}>{summaryText}</Text>
                    </View>

                    {enterpriseReport?.executiveSummary?.keyFindings && (
                        <View style={styles.summaryBlock}>
                            <Text style={styles.summaryTitle}>Strategic Observations</Text>
                            {enterpriseReport.executiveSummary.keyFindings.map((finding, i) => (
                                <View key={i} style={{ flexDirection: 'row', marginBottom: 8, gap: 8 }}>
                                    <Text style={{ fontSize: 10, color: '#3b82f6' }}>•</Text>
                                    <Text style={styles.summaryText}>{String(finding)}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {enterpriseReport?.executiveSummary?.recommendedActions && (
                        <View style={styles.summaryBlock}>
                            <Text style={styles.summaryTitle}>Immediate Remediation Matrix</Text>
                            {enterpriseReport.executiveSummary.recommendedActions.slice(0, 3).map((action, i) => (
                                <View key={i} style={styles.actionItem}>
                                    <Text style={styles.actionNumber}>0{i + 1}</Text>
                                    <Text style={styles.actionDescription}>{String(action)}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {enterpriseReport?.executiveSummary?.businessImpact && (
                        <View style={styles.summaryBlock}>
                            <Text style={styles.summaryTitle}>Business Impact Analysis</Text>
                            <Text style={styles.summaryText}>{String(enterpriseReport.executiveSummary.businessImpact)}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Highly Confidential - Board Level Disclosure</Text>
                    <Text style={styles.footerText}>Page 01</Text>
                </View>
            </Page>

            {/* MANIFEST PAGES */}
            {issues.map((issue, idx) => (
                <Page key={idx} size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.brand}>CORTEX EDR</Text>
                        </View>
                        <View style={styles.headerMeta}>
                            <Text style={styles.metaText}>Technical Breakdown</Text>
                            <Text style={styles.metaText}>Issue {idx + 1} of {issues.length}</Text>
                        </View>
                    </View>

                    <View style={styles.manifestHeader}>
                        <Text style={styles.manifestTitle}>{String(issue.title || 'Untitled Security Detection')}</Text>
                        <Text style={[styles.manifestSeverity, { backgroundColor: getSeverityColor(issue.severity) }]}>
                            {String(issue.severity || 'low').toUpperCase()}
                        </Text>
                    </View>

                    {/* 1. LOCATION */}
                    <View style={styles.subsection}>
                        <View style={styles.subsectionHeader}>
                            <Icons.Location />
                            <Text style={styles.subsectionTitle}>Location Details</Text>
                        </View>
                        <View style={styles.detailGrid}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>File Path:</Text>
                                <Text style={styles.detailValue}>{String(issue.file_path || 'unknown')}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Line Index:</Text>
                                <Text style={styles.detailValue}>{issue.line_number || 'N/A'}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Agent:</Text>
                                <Text style={styles.detailValue}>{String(issue.category || 'security').replace('_', ' ')} Scanner</Text>
                            </View>
                            {(issue as any).searchingFor && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Discovered while:</Text>
                                    <Text style={styles.detailValue}>{String((issue as any).searchingFor)}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* 2. FINDING */}
                    <View style={styles.subsection}>
                        <View style={styles.subsectionHeader}>
                            <Icons.Analysis />
                            <Text style={styles.subsectionTitle}>What we found</Text>
                        </View>
                        <Text style={styles.contentBox}>
                            {String(issue.description || 'System anomaly detected during deep structural analysis.')}
                        </Text>
                    </View>

                    {/* 3. IMPACT (Synthesized) */}
                    {(issue as any).impact && (
                        <View style={styles.subsection}>
                            <View style={styles.subsectionHeader}>
                                <Icons.Risk />
                                <Text style={styles.subsectionTitle}>Impact Analysis</Text>
                            </View>
                            <View style={{ paddingLeft: 10 }}>
                                {['definite', 'likely', 'reported', 'possible'].map(type => {
                                    const items = (issue as any).impact[type];
                                    if (!items || items.length === 0) return null;
                                    return (
                                        <View key={type} style={styles.impactCategory}>
                                            <Text style={styles.impactLabel}>
                                                {type === 'definite' ? '✓ Will Definitely Cause:' :
                                                    type === 'likely' ? '⚡ Probably Will Cause:' :
                                                        type === 'reported' ? '📊 Commonly Reported:' : '🤔 Might Cause:'}
                                            </Text>
                                            <View style={styles.impactList}>
                                                {items.map((it: string, i: number) => (
                                                    <View key={i} style={styles.impactItem}>
                                                        <Icons.Check />
                                                        <Text style={styles.impactText}>{it}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* 4. SOLUTION */}
                    {(issue as any).solution && (
                        <View style={styles.subsection}>
                            <View style={styles.subsectionHeader}>
                                <Icons.Solution />
                                <Text style={styles.subsectionTitle}>The Solution Matrix</Text>
                            </View>
                            <View style={{ paddingLeft: 10 }}>
                                {['must', 'should', 'goodToHave', 'niceToHave'].map(level => {
                                    const items = (issue as any).solution[level];
                                    if (!items || items.length === 0) return null;
                                    return (
                                        <View key={level} style={styles.solutionBox}>
                                            <Text style={styles.solutionLevel}>
                                                {level === 'must' ? '🚨 Must Do:' :
                                                    level === 'should' ? '⚡ Should Do:' :
                                                        level === 'goodToHave' ? '💡 Good to Have:' : '✨ Nice to Have:'}
                                            </Text>
                                            {items.map((item: any, i: number) => (
                                                <View key={i} style={styles.solutionItem}>
                                                    <Text style={styles.solutionAction}>{i + 1}. {item.action}</Text>
                                                    <Text style={styles.solutionReason}>WHY: {item.reason}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* 5. AI PROMPTS */}
                    {(issue as any).aiPrompts && (
                        <View style={styles.subsection}>
                            <View style={styles.subsectionHeader}>
                                <Icons.Robot />
                                <Text style={styles.subsectionTitle}>AI Remediation Protocols</Text>
                            </View>
                            <View style={{ paddingLeft: 10 }}>
                                {['cursor', 'chatgpt', 'claude'].map(tool => {
                                    const prompt = (issue as any).aiPrompts[tool];
                                    if (!prompt) return null;
                                    return (
                                        <View key={tool} style={styles.promptBox}>
                                            <Text style={styles.promptLabel}>FOR {tool.toUpperCase()}:</Text>
                                            <Text style={styles.promptText}>{prompt}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* 6. ECONOMICS */}
                    <View style={styles.ecoFooter}>
                        <View style={styles.ecoItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Icons.Economics />
                                <Text style={styles.ecoLabel}>Economic Impact</Text>
                            </View>
                            <Text style={styles.ecoValue}>ROI: {(issue as any).roi || 'High Resilience'}</Text>
                        </View>
                        <View style={styles.ecoItem}>
                            <Text style={styles.ecoLabel}>Estimation</Text>
                            <Text style={styles.ecoValue}>Time: {(issue as any).estimatedTimeToFix || '30m - 1h'}</Text>
                        </View>
                        <View style={styles.ecoItem}>
                            <Text style={[styles.ecoLabel, { color: '#b91c1c' }]}>Priority</Text>
                            <Text style={[styles.ecoValue, { color: '#b91c1c' }]}>{(issue as any).severity?.toUpperCase()} RESPONSE</Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Cortex EDR Technical Scan</Text>
                        <Text style={styles.footerText}>Vulnerability Manifest v4.0</Text>
                    </View>
                </Page>
            ))}
        </Document>
    );
};

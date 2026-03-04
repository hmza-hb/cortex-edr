import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import { ExecutiveReport } from '@/types/report';
import { styles, C } from './pdfStyles';

interface Props {
    scan: any;
    enterpriseReport?: ExecutiveReport;
    date: string;
    issueCount: number;
}

export const CoverPage: React.FC<Props> = ({ scan, enterpriseReport, date, issueCount }) => {
    const eng = enterpriseReport?.engagement;
    const classification = eng?.classification || 'Confidential';
    const classColor = classification === 'Confidential' ? C.red :
        classification === 'Restricted' ? C.amber : C.blue;

    return (
        <Page size="A4" style={styles.coverPage}>
            {/* Solid Navy Background without chaotic intersecting lines */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: C.navy }} />

            {/* Subtle Gradient / Accent Bar on the left edge for enterprise feel */}
            <View style={{ position: 'absolute', top: 0, left: 0, width: 8, bottom: 0, backgroundColor: C.blue }} />

            <View style={{ flex: 1, padding: '80 60', justifyContent: 'center' }}>

                {/* 1. Header: Logo and Org Name perfectly aligned */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 60 }}>
                    <Image src="/assets/logo.png" style={{ width: 64, height: 64, marginRight: 20 }} />
                    <View>
                        <Text style={{ fontSize: 36, fontFamily: 'Helvetica-Bold', color: C.white, letterSpacing: 4, marginBottom: 4 }}>
                            CortexEDR
                        </Text>
                        <Text style={{ fontSize: 11, color: '#93C5FD', letterSpacing: 3, fontFamily: 'Helvetica-Bold' }}>
                            ENTERPRISE SECURITY PLATFORM
                        </Text>
                    </View>
                </View>

                {/* 2. Main Title */}
                <View style={{ marginBottom: 50 }}>
                    <Text style={{ fontSize: 32, fontFamily: 'Helvetica-Bold', color: C.white, lineHeight: 1.2, marginBottom: 20 }}>
                        {eng?.title || 'Enterprise Application\nSecurity Assessment'}
                    </Text>
                    <View style={{ height: 4, width: 80, backgroundColor: C.blue }} />
                </View>

                {/* 3. Metadata Grid (Clean 2-column layout) */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 50 }}>
                    <View style={{ width: '45%', marginBottom: 12 }}>
                        <Text style={{ fontSize: 9, color: '#60A5FA', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4 }}>TARGET REPOSITORY</Text>
                        <Text style={{ fontSize: 11, color: C.white }}>{scan?.repo_url || 'Internal Repository'}</Text>
                    </View>
                    <View style={{ width: '45%', marginBottom: 12 }}>
                        <Text style={{ fontSize: 9, color: '#60A5FA', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4 }}>DATE OF ASSESSMENT</Text>
                        <Text style={{ fontSize: 11, color: C.white }}>{date}</Text>
                    </View>
                    <View style={{ width: '45%', marginBottom: 12 }}>
                        <Text style={{ fontSize: 9, color: '#60A5FA', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4 }}>REPORT VERSION</Text>
                        <Text style={{ fontSize: 11, color: C.white }}>{eng?.version || enterpriseReport?.reportVersion || 'v1.0'}</Text>
                    </View>
                    <View style={{ width: '45%', marginBottom: 12 }}>
                        <Text style={{ fontSize: 9, color: '#60A5FA', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4 }}>PREPARED BY</Text>
                        <Text style={{ fontSize: 11, color: C.white }}>{eng?.preparedBy || 'CortexEDR Security Team'}</Text>
                    </View>
                </View>

                {/* 4. Score & Classification */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1 solid rgba(255,255,255,0.1)' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <View style={{ width: 80, height: 80, borderRadius: 40, border: `4 solid ${C.blue}`, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(37,99,235,0.1)' }}>
                            <Text style={{ fontSize: 28, fontFamily: 'Helvetica-Bold', color: C.white }}>{scan?.score || 0}</Text>
                            <Text style={{ fontSize: 9, color: '#93C5FD', marginTop: 2 }}>/ 100</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 14, color: C.white, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>Security Health Score</Text>
                            <Text style={{ fontSize: 10, color: '#93C5FD', marginBottom: 6 }}>CortexEDR Posture Rating</Text>
                            <Text style={{ fontSize: 12, color: enterpriseReport?.riskLevel === 'Low' ? C.green : enterpriseReport?.riskLevel === 'Medium' ? C.amber : C.red, fontFamily: 'Helvetica-Bold' }}>
                                {enterpriseReport?.executiveSummary?.securityPostureRating || enterpriseReport?.riskLevel || 'High Risk'}
                            </Text>
                        </View>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 9, color: '#60A5FA', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 8 }}>CLASSIFICATION</Text>
                        <View style={{ padding: '8 16', backgroundColor: classColor, borderRadius: 6 }}>
                            <Text style={{ fontSize: 10, color: C.white, fontFamily: 'Helvetica-Bold', letterSpacing: 1 }}>{classification.toUpperCase()}</Text>
                        </View>
                    </View>
                </View>

            </View>

            {/* Footer */}
            <View style={{ position: 'absolute', bottom: 40, left: 60, right: 60, borderTop: '1 solid rgba(255,255,255,0.1)', paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5 }}>CORTEXEDR  ·  ENTERPRISE SECURITY AUDIT</Text>
                <Text style={{ fontSize: 9, color: classColor, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5 }}>{classification.toUpperCase()}  ·  DO NOT DISTRIBUTE</Text>
            </View>
        </Page>
    );
};

const TOC_ENTRIES = [
    { num: '01', label: 'Executive Summary', indent: false },
    { num: '02', label: 'Engagement Overview', indent: false },
    { num: '02.1', label: 'Objectives', indent: true },
    { num: '02.2', label: 'Scope', indent: true },
    { num: '02.3', label: 'Methodology', indent: true },
    { num: '03', label: 'Security Posture Overview', indent: false },
    { num: '03.1', label: 'Risk Heatmap', indent: true },
    { num: '03.2', label: 'Vulnerability Distribution', indent: true },
    { num: '03.3', label: 'Attack Surface Summary', indent: true },
    { num: '04', label: 'Detailed Findings', indent: false },
    { num: '05', label: 'Codebase Analysis Summary', indent: false },
    { num: '06', label: 'Infrastructure & DevSecOps Review', indent: false },
    { num: '07', label: 'Threat Modeling & Attack Scenarios', indent: false },
    { num: '08', label: 'Compliance & Regulatory Gap Analysis', indent: false },
    { num: '09', label: 'Risk Prioritization & Remediation Roadmap', indent: false },
    { num: '10', label: 'Security Maturity Assessment', indent: false },
    { num: '11', label: 'Conclusion', indent: false },
    { num: '12', label: 'Appendices', indent: false },
];

export const TOCPage: React.FC<{ date: string }> = ({ date }) => (
    <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
            <View>
                <Text style={styles.brand}>CortexEDR</Text>
                <Text style={styles.brandTag}>Enterprise Security Audit</Text>
            </View>
            <View style={styles.headerRight}>
                <Text style={styles.headerMeta}>{date}</Text>
                <Text style={styles.headerMeta}>Table of Contents</Text>
            </View>
        </View>

        <Text style={styles.tocTitle}>Table of Contents</Text>
        <Text style={styles.tocSubtitle}>ENTERPRISE SECURITY AUDIT REPORT</Text>

        {TOC_ENTRIES.map((entry, i) => (
            <View key={i} style={[styles.tocItem, { paddingLeft: entry.indent ? 24 : 0 }]}>
                <View style={styles.tocItemMain}>
                    <Text style={[styles.tocNum, entry.indent ? { color: C.muted, fontSize: 8 } : {}]}>{entry.num}</Text>
                    <Text style={[styles.tocLabel, entry.indent ? { fontSize: 10, color: C.slate } : {}]}>{entry.label}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ flex: 1, borderBottom: '1 dashed #CBD5E1', width: 60 }} />
                </View>
            </View>
        ))}

        <View style={styles.footer}>
            <Text style={styles.footerText}>CortexEDR  ·  Confidential</Text>
            <Text style={styles.footerText}>Table of Contents</Text>
        </View>
    </Page>
);

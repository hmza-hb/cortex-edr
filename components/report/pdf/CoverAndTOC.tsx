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
    const classColor = classification === 'Confidential' ? '#991B1B' :
        classification === 'Restricted' ? '#92400E' : '#1E3A5F';

    return (
        <Page size="A4" style={styles.coverPage}>
            {/* Dark blue background gradient stripes */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: C.navy }} />
            <View style={{ position: 'absolute', top: 0, right: 0, width: 180, bottom: 0, backgroundColor: '#0D1F3C' }} />
            <View style={{ position: 'absolute', top: 0, right: 0, width: 6, bottom: 0, backgroundColor: C.blue }} />
            <View style={{ position: 'absolute', top: 280, left: 60, right: 200, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />

            <View style={styles.coverContent}>
                {/* Logo + Org Name */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                    <Image src="/assets/logo.png" style={{ width: 52, height: 52 }} />
                    <View>
                        <Text style={styles.coverOrgName}>CORTEX EDR</Text>
                        <Text style={styles.coverTagline}>ENTERPRISE SECURITY PLATFORM</Text>
                    </View>
                </View>

                <View style={{ height: 60 }} />

                {/* Engagement Title */}
                <Text style={styles.coverEngTitle}>
                    {eng?.title || 'Enterprise Application\nSecurity Assessment'}
                </Text>
                <View style={styles.coverDivider} />

                {/* Meta block */}
                <View style={styles.coverMetaRow}>
                    <Text style={styles.coverMetaLabel}>Target:</Text>
                    <Text style={styles.coverMetaValue}>{scan?.repo_url || 'Internal Repository'}</Text>
                </View>
                <View style={styles.coverMetaRow}>
                    <Text style={styles.coverMetaLabel}>Report Version:</Text>
                    <Text style={styles.coverMetaValue}>{eng?.version || enterpriseReport?.reportVersion || 'v1.0'}</Text>
                </View>
                <View style={styles.coverMetaRow}>
                    <Text style={styles.coverMetaLabel}>Classification:</Text>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: classColor, borderRadius: 3, alignSelf: 'flex-start' }}>
                        <Text style={{ fontSize: 8, color: C.white, fontFamily: 'Helvetica-Bold' }}>{classification.toUpperCase()}</Text>
                    </View>
                </View>
                <View style={styles.coverMetaRow}>
                    <Text style={styles.coverMetaLabel}>Prepared By:</Text>
                    <Text style={styles.coverMetaValue}>{eng?.preparedBy || 'CortexEDR Security Team'}</Text>
                </View>
                <View style={styles.coverMetaRow}>
                    <Text style={styles.coverMetaLabel}>Date:</Text>
                    <Text style={styles.coverMetaValue}>{date}</Text>
                </View>
                <View style={styles.coverMetaRow}>
                    <Text style={styles.coverMetaLabel}>Total Issues:</Text>
                    <Text style={styles.coverMetaValue}>{issueCount}</Text>
                </View>
                <View style={styles.coverMetaRow}>
                    <Text style={styles.coverMetaLabel}>Risk Level:</Text>
                    <Text style={[styles.coverMetaValue, { color: '#FCA5A5', fontFamily: 'Helvetica-Bold' }]}>
                        {enterpriseReport?.riskLevel || 'High Risk'}
                    </Text>
                </View>

                <View style={{ height: 40 }} />

                {/* Security score circle */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{
                        width: 70, height: 70, borderRadius: 35,
                        border: `3 solid ${C.blue}`,
                        justifyContent: 'center', alignItems: 'center',
                        backgroundColor: 'rgba(37,99,235,0.1)',
                    }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: C.white }}>{scan?.score || 0}</Text>
                        <Text style={{ fontSize: 7, color: '#93C5FD' }}>/ 100</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 11, color: C.white, fontFamily: 'Helvetica-Bold' }}>Security Health Score</Text>
                        <Text style={{ fontSize: 8, color: '#93C5FD', marginTop: 3 }}>CortexEDR Posture Rating</Text>
                        <Text style={{ fontSize: 9, color: '#FCA5A5', marginTop: 6, fontFamily: 'Helvetica-Bold' }}>
                            {enterpriseReport?.executiveSummary?.securityPostureRating || enterpriseReport?.riskLevel || 'Under Assessment'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.coverFooter}>
                <Text style={styles.coverFooterText}>CORTEX EDR  ·  ENTERPRISE SECURITY AUDIT</Text>
                <Text style={styles.coverFooterText}>{classification.toUpperCase()}  ·  DO NOT DISTRIBUTE</Text>
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
                <Text style={styles.brand}>CORTEX EDR</Text>
                <Text style={styles.brandTag}>ENTERPRISE SECURITY AUDIT</Text>
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
                    <Text style={[styles.tocLabel, entry.indent ? { fontSize: 9, color: C.muted } : {}]}>{entry.label}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ flex: 1, borderBottom: '1 dashed #CBD5E1', width: 60 }} />
                </View>
            </View>
        ))}

        <View style={styles.footer}>
            <Text style={styles.footerText}>CORTEX EDR  ·  CONFIDENTIAL</Text>
            <Text style={styles.footerText}>Table of Contents</Text>
        </View>
    </Page>
);

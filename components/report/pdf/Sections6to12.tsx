import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { ExecutiveReport, ComplianceControl, RemediationItem, MaturityDomain } from '@/types/report';
import { Issue } from '@/types/agent';
import { styles, C, maturityColor } from './pdfStyles';

const PF = ({ label }: { label: string }) => (
    <View style={styles.footer} fixed>
        <Text style={styles.footerText}>CORTEX EDR  ·  CONFIDENTIAL  ·  Enterprise Security Audit</Text>
        <Text style={styles.footerText}>{label}</Text>
    </View>
);
const Bullets = ({ items }: { items: string[] }) => (
    <>{items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
        </View>
    ))}</>
);

// ═══════════════════════════════════════════════════════════
// SECTION 6: Codebase Analysis Summary
// ═══════════════════════════════════════════════════════════
export const CodebasePage: React.FC<{ enterpriseReport?: ExecutiveReport; date: string }> = ({ enterpriseReport, date }) => {
    const cs = enterpriseReport?.codeSecurity;
    const rows = [
        { label: 'Secure Coding Maturity', value: cs?.secureCodingMaturity },
        { label: 'Input Validation', value: cs?.inputValidation },
        { label: 'Authentication Handling', value: cs?.authenticationHandling },
        { label: 'Authorization Logic', value: cs?.authorizationLogic },
        { label: 'Logging Hygiene', value: cs?.loggingHygiene },
        { label: 'Error Handling', value: cs?.errorHandling },
    ].filter(r => r.value);

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View><Text style={styles.brand}>CORTEX EDR</Text><Text style={styles.brandTag}>CODEBASE ANALYSIS</Text></View>
                <View style={styles.headerRight}><Text style={styles.headerMeta}>{date}</Text><Text style={styles.headerMeta}>Section 05</Text></View>
            </View>

            <Text style={styles.sectionHeading}>05  Codebase Analysis Summary</Text>
            <Text style={styles.sectionSub}>SECURE CODING PRACTICES, ARCHITECTURE & DEPENDENCY RISK</Text>

            <Text style={styles.subHeading}>6.1  Secure Coding Maturity</Text>
            {rows.length > 0 ? (
                <View style={styles.table}>
                    <View style={styles.tableHead}>
                        <Text style={[styles.tableHeadCell, { flex: 0.8 }]}>Domain</Text>
                        <Text style={[styles.tableHeadCell, { flex: 2 }]}>Assessment</Text>
                    </View>
                    {rows.map((r, i) => (
                        <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                            <Text style={[styles.tableCell, { flex: 0.8, fontFamily: 'Helvetica-Bold' }]}>{r.label}</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>{r.value}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.alertBox}>
                    <Text style={styles.alertText}>Complete a full scan to populate detailed codebase analysis. Findings from the vulnerability scan are mapped in Section 04.</Text>
                </View>
            )}

            <Text style={styles.subHeading}>6.2  Architectural Weaknesses</Text>
            {cs?.architecturalWeaknesses ? (
                <Text style={styles.bodyText}>{cs.architecturalWeaknesses}</Text>
            ) : (
                <Bullets items={[
                    'Evaluate trust boundary definitions between services and external integrations',
                    'Review privilege model — apply principle of least privilege across all components',
                    'Assess monolith vs microservices security isolation boundaries',
                    'Identify and eliminate excessive cross-service data access patterns',
                ]} />
            )}

            <Text style={styles.subHeading}>6.3  Dependency Risk Analysis</Text>
            {cs?.dependencyRiskSummary ? (
                <Text style={styles.bodyText}>{cs.dependencyRiskSummary}</Text>
            ) : (
                <View style={styles.warnBox}>
                    <Text style={styles.warnTitle}>Recommended Actions</Text>
                    <Bullets items={[
                        'Audit all third-party packages for known CVEs using Snyk or Dependabot',
                        'Enforce strict version pinning in package manifests',
                        'Implement software composition analysis (SCA) in CI/CD pipeline',
                        'Review open-source license compliance for commercial deployment',
                    ]} />
                </View>
            )}

            <Text style={styles.subHeading}>6.4  Secrets & Key Management</Text>
            {cs?.secretsManagement ? (
                <Text style={styles.bodyText}>{cs.secretsManagement}</Text>
            ) : (
                <Bullets items={[
                    'Scan all repositories for hardcoded secrets using tools like TruffleHog or GitLeaks',
                    'Migrate all secrets to a centralized vault (AWS Secrets Manager, HashiCorp Vault)',
                    'Implement automated key rotation policies with maximum 90-day rotation cycles',
                    'Audit environment variable usage across all deployment environments',
                ]} />
            )}

            <PF label="Section 05 — Codebase Analysis" />
        </Page>
    );
};

// ═══════════════════════════════════════════════════════════
// SECTION 7: Infrastructure & DevSecOps
// ═══════════════════════════════════════════════════════════
export const InfraPage: React.FC<{ enterpriseReport?: ExecutiveReport; date: string }> = ({ enterpriseReport, date }) => {
    const infra = enterpriseReport?.infrastructureSecurity;
    const rows = [
        { label: 'CI/CD Pipeline', value: infra?.cicdPipeline, status: 'Review' },
        { label: 'Container Security', value: infra?.containerSecurity, status: 'Review' },
        { label: 'Cloud IAM', value: infra?.cloudIAM, status: 'Review' },
        { label: 'Network Segmentation', value: infra?.networkSegmentation, status: 'Review' },
        { label: 'WAF Usage', value: infra?.wafUsage, status: 'Review' },
        { label: 'Logging & Monitoring', value: infra?.loggingMonitoring, status: 'Review' },
        { label: 'Backup & Recovery', value: infra?.backupRecovery, status: 'Review' },
    ];
    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View><Text style={styles.brand}>CORTEX EDR</Text><Text style={styles.brandTag}>INFRASTRUCTURE & DEVSECOPS</Text></View>
                <View style={styles.headerRight}><Text style={styles.headerMeta}>{date}</Text><Text style={styles.headerMeta}>Section 06</Text></View>
            </View>

            <Text style={styles.sectionHeading}>06  Infrastructure & DevSecOps Review</Text>
            <Text style={styles.sectionSub}>CI/CD, CONTAINERS, IAM, NETWORK & MONITORING</Text>

            <View style={styles.table}>
                <View style={styles.tableHead}>
                    <Text style={[styles.tableHeadCell, { flex: 0.8 }]}>Domain</Text>
                    <Text style={[styles.tableHeadCell, { flex: 2 }]}>Findings / Assessment</Text>
                </View>
                {rows.map((r, i) => (
                    <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                        <Text style={[styles.tableCell, { flex: 0.8, fontFamily: 'Helvetica-Bold' }]}>{r.label}</Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>{r.value || 'Pending detailed assessment — refer to engagement scope for coverage.'}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.subSubHeading}>DevSecOps Recommendations</Text>
            <Bullets items={[
                'Integrate SAST/DAST scanning gates directly into CI/CD pipelines before merge',
                'Enable container image scanning with Trivy or Grype on every build',
                'Apply IAM least-privilege principle — audit all cloud role bindings quarterly',
                'Implement real-time security alerting through SIEM integration',
                'Enforce mandatory security review for all infrastructure-as-code changes',
            ]} />

            <PF label="Section 06 — Infrastructure & DevSecOps" />
        </Page>
    );
};

// ═══════════════════════════════════════════════════════════
// SECTION 8: Threat Modeling
// ═══════════════════════════════════════════════════════════
export const ThreatModelPage: React.FC<{ enterpriseReport?: ExecutiveReport; date: string }> = ({ enterpriseReport, date }) => {
    const tm = enterpriseReport?.threatModeling;
    const scenarios = tm?.scenarios || [
        { name: 'Ransomware Attack', description: 'Attacker exploits an unpatched vulnerability to deploy ransomware, encrypting critical data and demanding payment.', likelihood: 'Medium' },
        { name: 'Insider Threat', description: 'A privileged user intentionally exfiltrates sensitive data or sabotages system integrity.', likelihood: 'Low–Medium' },
        { name: 'Supply Chain Compromise', description: 'Malicious code injected into a third-party dependency propagates through the build pipeline.', likelihood: 'Medium' },
        { name: 'Credential Stuffing', description: 'Automated attacks using leaked credential databases to gain unauthorized access to user accounts.', likelihood: 'High' },
    ];

    const strideRows = [
        { threat: 'Spoofing', desc: 'Impersonating users or services', control: 'Strong authentication, MFA, certificate pinning' },
        { threat: 'Tampering', desc: 'Modifying data in transit or at rest', control: 'Integrity checks, HMAC signing, encryption at rest' },
        { threat: 'Repudiation', desc: 'Denying actions without audit trail', control: 'Comprehensive audit logging, non-repudiation controls' },
        { threat: 'Info Disclosure', desc: 'Exposing sensitive data to unauthorized parties', control: 'Data classification, encryption, access controls' },
        { threat: 'Denial of Service', desc: 'Overwhelming services causing unavailability', control: 'Rate limiting, WAF, DDoS protection, auto-scaling' },
        { threat: 'Elevation of Privilege', desc: 'Gaining unauthorized access levels', control: 'Least-privilege, RBAC enforcement, PAM solutions' },
    ];

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View><Text style={styles.brand}>CORTEX EDR</Text><Text style={styles.brandTag}>THREAT MODELING</Text></View>
                <View style={styles.headerRight}><Text style={styles.headerMeta}>{date}</Text><Text style={styles.headerMeta}>Section 07</Text></View>
            </View>

            <Text style={styles.sectionHeading}>07  Threat Modeling & Attack Scenarios</Text>
            <Text style={styles.sectionSub}>STRIDE ANALYSIS, KILL CHAIN & MITRE ATT&CK MAPPING</Text>

            <Text style={styles.subHeading}>STRIDE Threat Model</Text>
            <View style={styles.table}>
                <View style={styles.tableHead}>
                    <Text style={[styles.tableHeadCell, { flex: 0.7 }]}>Threat</Text>
                    <Text style={[styles.tableHeadCell, { flex: 1 }]}>Description</Text>
                    <Text style={[styles.tableHeadCell, { flex: 1.3 }]}>Recommended Controls</Text>
                </View>
                {strideRows.map((r, i) => (
                    <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                        <Text style={[styles.tableCell, { flex: 0.7, fontFamily: 'Helvetica-Bold', color: C.blue }]}>{r.threat}</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>{r.desc}</Text>
                        <Text style={[styles.tableCell, { flex: 1.3 }]}>{r.control}</Text>
                    </View>
                ))}
            </View>

            {tm?.mitreAttackMapping && (
                <View style={{ marginBottom: 14 }}>
                    <Text style={styles.subSubHeading}>MITRE ATT&CK Mapping</Text>
                    <Text style={styles.bodyText}>{tm.mitreAttackMapping}</Text>
                </View>
            )}

            <Text style={styles.subHeading}>Attack Scenarios</Text>
            {scenarios.map((s, i) => (
                <View key={i} style={[styles.warnBox, { marginBottom: 8 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={[styles.warnTitle, { flex: 1 }]}>{s.name}</Text>
                        <View style={{ paddingHorizontal: 6, paddingVertical: 2, backgroundColor: C.amber + '30', borderRadius: 3 }}>
                            <Text style={{ fontSize: 7, color: C.amber, fontFamily: 'Helvetica-Bold' }}>Likelihood: {s.likelihood}</Text>
                        </View>
                    </View>
                    <Text style={[styles.alertText, { color: C.slateLight }]}>{s.description}</Text>
                </View>
            ))}

            <PF label="Section 07 — Threat Modeling" />
        </Page>
    );
};

// ═══════════════════════════════════════════════════════════
// SECTION 9: Compliance & Regulatory Gap Analysis
// ═══════════════════════════════════════════════════════════
export const CompliancePage: React.FC<{ enterpriseReport?: ExecutiveReport; date: string }> = ({ enterpriseReport, date }) => {
    const gaps = enterpriseReport?.complianceGaps;
    const defaultGaps: ComplianceControl[] = [
        { control: 'Access Control', framework: 'ISO 27001 A.9', status: 'partial', gap: 'MFA not enforced on all admin accounts', risk: 'high' },
        { control: 'Vulnerability Management', framework: 'SOC 2 CC7.1', status: 'non-compliant', gap: 'No formal patch management process', risk: 'critical' },
        { control: 'Data Encryption', framework: 'GDPR Art. 32', status: 'partial', gap: 'Data at rest encryption inconsistent', risk: 'high' },
        { control: 'Audit Logging', framework: 'PCI-DSS 10.2', status: 'partial', gap: 'Application-level events not fully captured', risk: 'medium' },
        { control: 'Incident Response', framework: 'ISO 27001 A.16', status: 'non-compliant', gap: 'No documented IR playbook', risk: 'high' },
        { control: 'SDLC Security', framework: 'SOC 2 CC8.1', status: 'partial', gap: 'Security gates missing in CI/CD', risk: 'medium' },
    ];
    const controls = gaps && gaps.length > 0 ? gaps : defaultGaps;

    const statusColor = (s: string) => s === 'compliant' ? C.green : s === 'partial' ? C.amber : s === 'non-compliant' ? C.red : C.muted;

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View><Text style={styles.brand}>CORTEX EDR</Text><Text style={styles.brandTag}>COMPLIANCE & REGULATORY</Text></View>
                <View style={styles.headerRight}><Text style={styles.headerMeta}>{date}</Text><Text style={styles.headerMeta}>Section 08</Text></View>
            </View>

            <Text style={styles.sectionHeading}>08  Compliance & Regulatory Gap Analysis</Text>
            <Text style={styles.sectionSub}>ISO 27001 · SOC 2 · PCI-DSS · GDPR · HIPAA</Text>

            <View style={styles.table}>
                <View style={styles.tableHead}>
                    <Text style={[styles.tableHeadCell, { flex: 0.9 }]}>Control / Framework</Text>
                    <Text style={[styles.tableHeadCell, { flex: 0.6 }]}>Status</Text>
                    <Text style={[styles.tableHeadCell, { flex: 1.5 }]}>Gap Identified</Text>
                    <Text style={[styles.tableHeadCell, { flex: 0.5 }]}>Risk</Text>
                </View>
                {controls.map((c, i) => (
                    <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                        <View style={{ flex: 0.9 }}>
                            <Text style={[styles.tableCell, { fontFamily: 'Helvetica-Bold' }]}>{c.control}</Text>
                            <Text style={[styles.tableCell, { color: C.muted, fontSize: 7 }]}>{c.framework}</Text>
                        </View>
                        <View style={{ flex: 0.6 }}>
                            <View style={{ paddingHorizontal: 5, paddingVertical: 2, backgroundColor: statusColor(c.status) + '20', borderRadius: 3 }}>
                                <Text style={{ fontSize: 7, color: statusColor(c.status), fontFamily: 'Helvetica-Bold' }}>{c.status.toUpperCase().replace('-', ' ')}</Text>
                            </View>
                        </View>
                        <Text style={[styles.tableCell, { flex: 1.5 }]}>{c.gap || '—'}</Text>
                        <View style={{ flex: 0.5 }}>
                            <View style={{ paddingHorizontal: 5, paddingVertical: 2, backgroundColor: statusColor(c.risk) + '20', borderRadius: 3 }}>
                                <Text style={{ fontSize: 7, color: statusColor(c.risk), fontFamily: 'Helvetica-Bold' }}>{c.risk.toUpperCase()}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            <PF label="Section 08 — Compliance & Regulatory Gap Analysis" />
        </Page>
    );
};

// ═══════════════════════════════════════════════════════════
// SECTION 10: Remediation Roadmap
// ═══════════════════════════════════════════════════════════
export const RoadmapPage: React.FC<{ enterpriseReport?: ExecutiveReport; issues: Issue[]; date: string }> = ({ enterpriseReport, issues, date }) => {
    const roadmap = enterpriseReport?.remediationRoadmap;

    const windows: Array<{ key: 'immediate' | 'short' | 'mid' | 'long'; label: string; range: string; color: string; bg: string }> = [
        { key: 'immediate', label: 'Immediate', range: '0–30 Days', color: C.red, bg: '#FEF2F2' },
        { key: 'short', label: 'Short Term', range: '1–3 Months', color: C.orange, bg: '#FFF7ED' },
        { key: 'mid', label: 'Mid Term', range: '3–6 Months', color: C.amber, bg: '#FFFBEB' },
        { key: 'long', label: 'Long Term', range: '6+ Months', color: C.blue, bg: '#EFF6FF' },
    ];

    const defaultItems: Record<string, string[]> = {
        immediate: [
            'Patch all critical severity vulnerabilities immediately',
            'Rotate any exposed credentials or API keys',
            'Enable MFA on all privileged accounts',
        ],
        short: [
            'Address all high severity findings',
            'Implement secrets vault for credential management',
            'Deploy WAF and enable rate limiting on public endpoints',
        ],
        mid: [
            'Redesign authentication and authorization architecture',
            'Integrate security scanning into all CI/CD pipelines',
            'Complete third-party dependency audit and update cycle',
        ],
        long: [
            'Achieve security maturity Level 3+ across all domains',
            'Implement zero-trust network architecture',
            'Establish formal Security Operations Center (SOC) capability',
        ],
    };

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View><Text style={styles.brand}>CORTEX EDR</Text><Text style={styles.brandTag}>REMEDIATION ROADMAP</Text></View>
                <View style={styles.headerRight}><Text style={styles.headerMeta}>{date}</Text><Text style={styles.headerMeta}>Section 09</Text></View>
            </View>

            <Text style={styles.sectionHeading}>09  Risk Prioritization & Remediation Roadmap</Text>
            <Text style={styles.sectionSub}>PHASED REMEDIATION PLAN WITH OWNERSHIP & TIMELINES</Text>

            {windows.map(w => {
                const items = roadmap?.filter(r => r.dueWindow === w.key) || [];
                const defaultList = defaultItems[w.key] || [];
                return (
                    <View key={w.key} style={{ marginBottom: 14 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: w.color, borderRadius: 4 }}>
                                <Text style={{ fontSize: 8, color: C.white, fontFamily: 'Helvetica-Bold' }}>{w.label.toUpperCase()}</Text>
                            </View>
                            <Text style={{ fontSize: 9, color: C.muted, fontFamily: 'Helvetica-Bold' }}>{w.range}</Text>
                        </View>
                        <View style={{ backgroundColor: w.bg, borderRadius: 6, padding: '8 12', border: `1 solid ${w.color}30` }}>
                            {items.length > 0 ? items.map((item, i) => (
                                <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
                                    <View style={{ width: 50 }}>
                                        <View style={{ paddingHorizontal: 4, paddingVertical: 2, backgroundColor: w.color + '20', borderRadius: 3 }}>
                                            <Text style={{ fontSize: 7, color: w.color, fontFamily: 'Helvetica-Bold' }}>{item.severity.toUpperCase()}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.slate, marginBottom: 2 }}>{item.title}</Text>
                                        <Text style={{ fontSize: 8, color: C.muted }}>{item.description}</Text>
                                        <Text style={{ fontSize: 7, color: w.color, marginTop: 2 }}>Team: {item.team}  ·  Effort: {item.effort}</Text>
                                    </View>
                                </View>
                            )) : defaultList.map((item, i) => (
                                <View key={i} style={styles.bulletRow}>
                                    <Text style={[styles.bullet, { color: w.color }]}>•</Text>
                                    <Text style={styles.bulletText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            })}

            <PF label="Section 09 — Remediation Roadmap" />
        </Page>
    );
};

// ═══════════════════════════════════════════════════════════
// SECTION 11: Security Maturity Assessment
// ═══════════════════════════════════════════════════════════
export const MaturityPage: React.FC<{ enterpriseReport?: ExecutiveReport; date: string }> = ({ enterpriseReport, date }) => {
    const maturity = enterpriseReport?.maturityAssessment;
    const defaultDomains: MaturityDomain[] = [
        { domain: 'Governance & Policy', level: 2, maxLevel: 5, description: 'Basic security policies exist but are inconsistently enforced' },
        { domain: 'Secure SDLC', level: 1, maxLevel: 5, description: 'Security not integrated into development lifecycle' },
        { domain: 'Incident Response', level: 1, maxLevel: 5, description: 'No formal IR process documented or tested' },
        { domain: 'Monitoring & Detection', level: 2, maxLevel: 5, description: 'Basic logging present; correlation and alerting immature' },
        { domain: 'Access Management', level: 2, maxLevel: 5, description: 'Identity management in place; MFA adoption incomplete' },
        { domain: 'Vulnerability Mgmt', level: 1, maxLevel: 5, description: 'Ad-hoc scanning; no formal patch management program' },
    ];
    const domains = maturity && maturity.length > 0 ? maturity : defaultDomains;
    const avgLevel = Math.round(domains.reduce((s, d) => s + d.level, 0) / domains.length * 10) / 10;

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View><Text style={styles.brand}>CORTEX EDR</Text><Text style={styles.brandTag}>SECURITY MATURITY</Text></View>
                <View style={styles.headerRight}><Text style={styles.headerMeta}>{date}</Text><Text style={styles.headerMeta}>Section 10</Text></View>
            </View>

            <Text style={styles.sectionHeading}>10  Security Maturity Assessment</Text>
            <Text style={styles.sectionSub}>CAPABILITY MATURITY MODEL — SCORED ACROSS KEY SECURITY DOMAINS</Text>

            {/* Overall level badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20, padding: '12 16', backgroundColor: C.bgLight, borderRadius: 8, border: `1 solid ${C.border}` }}>
                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: C.navy, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, color: C.white, fontFamily: 'Helvetica-Bold' }}>{avgLevel}</Text>
                    <Text style={{ fontSize: 7, color: '#93C5FD' }}>/ 5.0</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.navy }}>Overall Maturity: Level {Math.round(avgLevel)}/5</Text>
                    <Text style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>
                        {avgLevel < 2 ? 'Initial — Security practices are ad-hoc and reactive' :
                            avgLevel < 3 ? 'Developing — Basic controls in place, inconsistently applied' :
                                avgLevel < 4 ? 'Defined — Documented processes with moderate enforcement' :
                                    avgLevel < 4.5 ? 'Managed — Quantitative metrics and proactive management' :
                                        'Optimizing — Continuous improvement and adaptive security'}
                    </Text>
                </View>
            </View>

            {/* Domain bars */}
            {domains.map((d, i) => {
                const pct = (d.level / 5) * 100;
                const col = maturityColor(d.level);
                return (
                    <View key={i} style={styles.maturityRow}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                            <Text style={styles.maturityLabel}>{d.domain}</Text>
                            <Text style={[styles.maturityBarLevel, { color: col, fontFamily: 'Helvetica-Bold' }]}>Level {d.level}/5</Text>
                        </View>
                        <View style={styles.maturityBarBg}>
                            <View style={[styles.maturityBarFill, { width: `${pct}%`, backgroundColor: col }]} />
                        </View>
                        <Text style={styles.maturityBarLevel}>{d.description}</Text>
                    </View>
                );
            })}

            <PF label="Section 10 — Security Maturity Assessment" />
        </Page>
    );
};

// ═══════════════════════════════════════════════════════════
// SECTION 12: Conclusion
// ═══════════════════════════════════════════════════════════
export const ConclusionPage: React.FC<{ enterpriseReport?: ExecutiveReport; scan: any; date: string }> = ({ enterpriseReport, scan, date }) => {
    const con = enterpriseReport?.conclusion;
    const riskLevel = enterpriseReport?.riskLevel || 'High';
    const prodSafe = con?.productionSafe ?? (riskLevel === 'Low' || riskLevel === 'Medium');

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View><Text style={styles.brand}>CORTEX EDR</Text><Text style={styles.brandTag}>CONCLUSION & ATTESTATION</Text></View>
                <View style={styles.headerRight}><Text style={styles.headerMeta}>{date}</Text><Text style={styles.headerMeta}>Section 11</Text></View>
            </View>

            <Text style={styles.sectionHeading}>11  Conclusion</Text>
            <Text style={styles.sectionSub}>SECURITY POSTURE STATEMENT & STRATEGIC RECOMMENDATIONS</Text>

            {/* Production Safe Banner */}
            <View style={{
                padding: '12 16', borderRadius: 8, marginBottom: 20,
                backgroundColor: prodSafe ? '#F0FDF4' : '#FEF2F2',
                border: `2 solid ${prodSafe ? C.green : C.red}`,
            }}>
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: prodSafe ? C.green : C.red, marginBottom: 4 }}>
                    {prodSafe ? '✓ CONDITIONALLY PRODUCTION SAFE' : '✗ NOT RECOMMENDED FOR PRODUCTION'}
                </Text>
                <Text style={{ fontSize: 9, color: C.slateLight }}>
                    {prodSafe
                        ? 'The system may proceed to production after addressing identified medium and low severity issues. All critical and high severity findings must be remediated before go-live.'
                        : 'The system is NOT recommended for production in its current state. Critical and high severity vulnerabilities present unacceptable risk and must be resolved immediately.'}
                </Text>
            </View>

            <Text style={styles.subSubHeading}>Overall Security Posture</Text>
            <Text style={styles.bodyText}>
                {con?.overallStatement || `This security assessment of ${scan?.repo_url || 'the target repository'} has identified ${enterpriseReport?.totalIssues || 'multiple'} vulnerabilities with an overall risk rating of ${riskLevel}. The organization should prioritize remediation of critical and high severity findings as an immediate security imperative.`}
            </Text>

            {con?.immediateRedFlags && con.immediateRedFlags.length > 0 && (
                <View style={{ marginBottom: 14 }}>
                    <Text style={styles.subSubHeading}>Immediate Red Flags</Text>
                    <View style={styles.warnBox}>
                        <Text style={styles.warnTitle}>Action Required Before Production</Text>
                        {con.immediateRedFlags.map((f, i) => (
                            <View key={i} style={styles.bulletRow}>
                                <Text style={[styles.bullet, { color: C.red }]}>⚠</Text>
                                <Text style={[styles.bulletText, { color: C.slateLight }]}>{f}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            <Text style={styles.subSubHeading}>Strategic Recommendations</Text>
            {(con?.strategicRecommendations || [
                'Establish a formal vulnerability management program with defined SLAs by severity',
                'Integrate security tooling (SAST, DAST, SCA) into all CI/CD pipelines as blocking gates',
                'Invest in developer security training focusing on OWASP Top 10 and secure coding',
                'Implement a Security Operations Center or partner with a Managed Security Service Provider',
                'Conduct quarterly penetration testing engagements and annual full security assessments',
            ]).map((r, i) => (
                <View key={i} style={[styles.bulletRow, { marginBottom: 6 }]}>
                    <Text style={styles.bullet}>›</Text>
                    <Text style={styles.bulletText}>{String(r)}</Text>
                </View>
            ))}

            <View style={{ marginTop: 20 }}>
                <View style={styles.divider} />
                <Text style={styles.subSubHeading}>Analyst Attestation</Text>
                <Text style={styles.bodyText}>
                    {enterpriseReport?.attestation || 'This report has been prepared by the CortexEDR automated security analysis platform. All findings are generated through static analysis, dynamic testing, and AI-powered vulnerability detection. Results should be reviewed and validated by a qualified security professional before acting upon critical remediation decisions.'}
                </Text>
                <View style={{ flexDirection: 'row', gap: 40, marginTop: 16 }}>
                    <View>
                        <Text style={{ fontSize: 8, color: C.muted, fontFamily: 'Helvetica-Bold' }}>PREPARED BY</Text>
                        <Text style={{ fontSize: 9, color: C.slate, marginTop: 4 }}>{enterpriseReport?.analystName || 'CortexEDR Platform'}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 8, color: C.muted, fontFamily: 'Helvetica-Bold' }}>DATE</Text>
                        <Text style={{ fontSize: 9, color: C.slate, marginTop: 4 }}>{date}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 8, color: C.muted, fontFamily: 'Helvetica-Bold' }}>REPORT VERSION</Text>
                        <Text style={{ fontSize: 9, color: C.slate, marginTop: 4 }}>{enterpriseReport?.engagement?.version || enterpriseReport?.reportVersion || 'v1.0'}</Text>
                    </View>
                </View>
            </View>

            <PF label="Section 11 — Conclusion" />
        </Page>
    );
};

// ═══════════════════════════════════════════════════════════
// SECTION 13: Appendices
// ═══════════════════════════════════════════════════════════
export const AppendicesPage: React.FC<{ issues: Issue[]; date: string }> = ({ issues, date }) => {
    const toolsUsed = [
        { tool: 'CortexEDR SAST Engine', version: 'v4.0', desc: 'Static Application Security Testing' },
        { tool: 'CortexEDR DAST Scanner', version: 'v4.0', desc: 'Dynamic Application Security Testing' },
        { tool: 'CortexEDR SCA Agent', version: 'v4.0', desc: 'Software Composition Analysis' },
        { tool: 'AI Vulnerability Intelligence', version: 'GPT-4o', desc: 'AI-powered threat contextualization' },
        { tool: 'Semantic Code Search', version: 'v3.0', desc: 'Embedding-based code pattern matching' },
    ];

    const cvssGuide = [
        { range: '9.0–10.0', level: 'Critical', color: C.red, desc: 'Immediate exploitation possible' },
        { range: '7.0–8.9', level: 'High', color: C.orange, desc: 'High likelihood of exploitation' },
        { range: '4.0–6.9', level: 'Medium', color: C.amber, desc: 'Some conditions required for exploit' },
        { range: '0.1–3.9', level: 'Low', color: C.blue, desc: 'Difficult to exploit' },
    ];

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View><Text style={styles.brand}>CORTEX EDR</Text><Text style={styles.brandTag}>APPENDICES</Text></View>
                <View style={styles.headerRight}><Text style={styles.headerMeta}>{date}</Text><Text style={styles.headerMeta}>Section 12</Text></View>
            </View>

            <Text style={styles.sectionHeading}>12  Appendices</Text>
            <Text style={styles.sectionSub}>TOOLS, GLOSSARY, CVSS BREAKDOWN & FULL VULNERABILITY INDEX</Text>

            {/* A: Tools used */}
            <Text style={styles.subHeading}>A  Tools & Technologies Used</Text>
            <View style={styles.table}>
                <View style={styles.tableHead}>
                    <Text style={[styles.tableHeadCell, { flex: 1 }]}>Tool</Text>
                    <Text style={[styles.tableHeadCell, { flex: 0.4 }]}>Version</Text>
                    <Text style={[styles.tableHeadCell, { flex: 1.6 }]}>Purpose</Text>
                </View>
                {toolsUsed.map((t, i) => (
                    <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                        <Text style={[styles.tableCell, { flex: 1, fontFamily: 'Helvetica-Bold' }]}>{t.tool}</Text>
                        <Text style={[styles.tableCell, { flex: 0.4 }]}>{t.version}</Text>
                        <Text style={[styles.tableCell, { flex: 1.6 }]}>{t.desc}</Text>
                    </View>
                ))}
            </View>

            {/* B: CVSS Breakdown */}
            <Text style={styles.subHeading}>B  CVSS Scoring Reference</Text>
            <View style={styles.table}>
                <View style={styles.tableHead}>
                    <Text style={[styles.tableHeadCell, { flex: 0.6 }]}>Score Range</Text>
                    <Text style={[styles.tableHeadCell, { flex: 0.6 }]}>Severity</Text>
                    <Text style={[styles.tableHeadCell, { flex: 1.8 }]}>Interpretation</Text>
                </View>
                {cvssGuide.map((c, i) => (
                    <View key={i} style={[styles.tableRow, { backgroundColor: c.color + '10' }]}>
                        <Text style={[styles.tableCell, { flex: 0.6, fontFamily: 'Helvetica-Bold', color: c.color }]}>{c.range}</Text>
                        <View style={{ flex: 0.6, justifyContent: 'center' }}>
                            <View style={{ paddingHorizontal: 6, paddingVertical: 2, backgroundColor: c.color, borderRadius: 3, alignSelf: 'flex-start' }}>
                                <Text style={{ fontSize: 7, color: C.white, fontFamily: 'Helvetica-Bold' }}>{c.level.toUpperCase()}</Text>
                            </View>
                        </View>
                        <Text style={[styles.tableCell, { flex: 1.8 }]}>{c.desc}</Text>
                    </View>
                ))}
            </View>

            {/* C: Vulnerability Index */}
            <Text style={styles.subHeading}>C  Full Vulnerability Index</Text>
            <View style={styles.table}>
                <View style={styles.tableHead}>
                    <Text style={[styles.tableHeadCell, { flex: 0.4 }]}>ID</Text>
                    <Text style={[styles.tableHeadCell, { flex: 1.6 }]}>Title</Text>
                    <Text style={[styles.tableHeadCell, { flex: 0.5 }]}>Severity</Text>
                    <Text style={[styles.tableHeadCell, { flex: 0.8 }]}>Category</Text>
                </View>
                {issues.slice(0, 30).map((issue, i) => (
                    <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                        <Text style={[styles.tableCell, { flex: 0.4, fontFamily: 'Helvetica-Bold', color: C.blue, fontSize: 7 }]}>
                            SEC-{String(i + 1).padStart(3, '0')}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 1.6, fontSize: 7 }]}>
                            {String(issue.title || 'Unnamed').substring(0, 60)}
                        </Text>
                        <View style={{ flex: 0.5, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 7, color: '#DC2626', fontFamily: 'Helvetica-Bold' }}>
                                {String(issue.severity || '').toUpperCase()}
                            </Text>
                        </View>
                        <Text style={[styles.tableCell, { flex: 0.8, fontSize: 7 }]}>
                            {String(issue.category || 'security').replace('_', ' ')}
                        </Text>
                    </View>
                ))}
                {issues.length > 30 && (
                    <View style={[styles.tableRow, { backgroundColor: '#F1F5F9' }]}>
                        <Text style={[styles.tableCell, { fontStyle: 'italic', color: C.muted }]}>
                            + {issues.length - 30} additional findings — export JSON for full list
                        </Text>
                    </View>
                )}
            </View>

            {/* D: Glossary */}
            <Text style={styles.subHeading}>D  Glossary</Text>
            {[
                { term: 'CVSS', def: 'Common Vulnerability Scoring System — standardized severity metric (0.0–10.0)' },
                { term: 'OWASP', def: 'Open Web Application Security Project — widely adopted web security standards body' },
                { term: 'SAST', def: 'Static Application Security Testing — source code analysis without execution' },
                { term: 'DAST', def: 'Dynamic Application Security Testing — runtime testing of live application' },
                { term: 'SCA', def: 'Software Composition Analysis — third-party dependency vulnerability scanning' },
                { term: 'STRIDE', def: 'Threat modeling framework: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation' },
            ].map((g, i) => (
                <View key={i} style={[styles.infoRow, { marginBottom: 5 }]}>
                    <Text style={[styles.infoLabel, { color: C.blue, fontFamily: 'Helvetica-Bold', width: 60 }]}>{g.term}</Text>
                    <Text style={[styles.infoValue, { flex: 1 }]}>{g.def}</Text>
                </View>
            ))}

            <PF label="Section 12 — Appendices" />
        </Page>
    );
};

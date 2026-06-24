import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { Issue } from '@/types/agent';
import { EnterpriseIssue } from '@/types/report';
import { styles, C, severityColor, severityBg, launchStatusColor, launchStatusBg } from './pdfStyles';
import { PH, PF } from './CoverAndTOC';

const Bullet = ({ text, color = C.blue }: { text: string; color?: string }) => (
    <View style={styles.bulletRow}>
        <Text style={[styles.bullet, { color }]}>›</Text>
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

// ─── Finding Page — one per confirmed issue ────────────────────────────────────
export const FindingPage: React.FC<{
    issue: Issue & Partial<EnterpriseIssue>;
    idx: number;
    total: number;
    date: string;
    showWatermark?: boolean;
}> = ({ issue, idx, total, date, showWatermark }) => {
    const sevColor = severityColor(issue.severity);
    const findingId = (issue as any).findingId || `FND-${String(idx + 1).padStart(3, '0')}`;
    const launchStatus = (issue as any).launchStatus as string | undefined;

    const description  = String((issue as any).whatWeFound || issue.description || '').trim();
    const fixText      = String((issue as any).fixSuggestion || issue.fix_suggestion || '').trim();
    const codeSnippet  = String((issue as any).codeSnippet || issue.code_snippet || '').trim().substring(0, 600);
    const cursorPrompt = String(
        (issue as any).vibeInstructions?.cursor ||
        (issue as any).aiPrompts?.cursor ||
        (issue as any).ai_prompt || ''
    ).trim();
    const filePath = (issue as any).file_path || (issue as any).file || '';
    const lineNo   = (issue as any).line_number || (issue as any).line || 0;

    return (
        <Page size="A4" style={styles.page} wrap>

            {/* Watermark for free tier */}
            {showWatermark && (
                <View style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    justifyContent: 'center', alignItems: 'center', opacity: 0.04,
                }}>
                    <Text style={{ fontSize: 80, color: C.navy, fontFamily: 'Helvetica-Bold' }}>
                        FREE TIER
                    </Text>
                </View>
            )}

            <PH date={date} section={`Finding ${idx + 1} of ${total}`} />

            {/* ── Header card ───────────────────────────────────────── */}
            <View style={styles.findingCard}>
                <View style={styles.findingHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.findingId}>{findingId}</Text>
                        <Text style={styles.findingTitle}>{String(issue.title || 'Security Finding')}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                        <View style={[styles.badge, { backgroundColor: sevColor }]}>
                            <Text style={{ fontSize: 8, color: C.white, fontFamily: 'Helvetica-Bold', letterSpacing: 1 }}>
                                {String(issue.severity || 'MEDIUM').toUpperCase()}
                            </Text>
                        </View>
                        {launchStatus && (
                            <View style={{
                                paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
                                backgroundColor: launchStatusBg(launchStatus),
                            }}>
                                <Text style={{
                                    fontSize: 7, fontFamily: 'Helvetica-Bold',
                                    color: launchStatusColor(launchStatus), letterSpacing: 1,
                                }}>
                                    {launchStatus === 'RED_FLAG' ? '🚨 RED FLAG' : '✓ LAUNCH ANYWAY'}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Metadata tags */}
                <View style={{
                    flexDirection: 'row', gap: 8, flexWrap: 'wrap',
                    paddingVertical: 7, paddingHorizontal: 16,
                    backgroundColor: '#F8FAFC',
                    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: C.border,
                }}>
                    {issue.category && (
                        <View style={{ paddingHorizontal: 7, paddingVertical: 3, backgroundColor: '#EFF6FF', borderRadius: 3 }}>
                            <Text style={{ fontSize: 7, color: C.blue, fontFamily: 'Helvetica-Bold' }}>
                                {String(issue.category).replace('_', ' ').toUpperCase()}
                            </Text>
                        </View>
                    )}
                    {(issue as any).metadata?.owasp && (
                        <View style={{ paddingHorizontal: 7, paddingVertical: 3, backgroundColor: '#FFFBEB', borderRadius: 3 }}>
                            <Text style={{ fontSize: 7, color: C.amber, fontFamily: 'Helvetica-Bold' }}>
                                {(issue as any).metadata.owasp}
                            </Text>
                        </View>
                    )}
                    {(issue as any).metadata?.cwe && (
                        <View style={{ paddingHorizontal: 7, paddingVertical: 3, backgroundColor: '#FEF2F2', borderRadius: 3 }}>
                            <Text style={{ fontSize: 7, color: C.red, fontFamily: 'Helvetica-Bold' }}>
                                {(issue as any).metadata.cwe}
                            </Text>
                        </View>
                    )}
                    {(issue as any).estimatedTimeToFix && (
                        <View style={{
                            paddingHorizontal: 7, paddingVertical: 3, backgroundColor: '#F8FAFC', borderRadius: 3,
                            borderWidth: 0.5, borderStyle: 'solid', borderColor: C.border,
                        }}>
                            <Text style={{ fontSize: 7, color: C.muted, fontFamily: 'Helvetica-Bold' }}>
                                ⏱ {(issue as any).estimatedTimeToFix}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* ── File Location ─────────────────────────────────────── */}
            {filePath && (
                <View style={[styles.infoRow, { marginBottom: 14 }]}>
                    <Text style={styles.infoLabel}>File</Text>
                    <Text style={[styles.infoValue, { fontFamily: 'Courier', color: C.navy, fontSize: 9 }]}>
                        {filePath}{lineNo ? `:${lineNo}` : ''}
                    </Text>
                </View>
            )}

            {/* ── What Was Found ────────────────────────────────────── */}
            <Text style={[styles.label, { color: C.navy, fontSize: 9, marginBottom: 6 }]}>WHAT WAS FOUND</Text>
            <Text style={[styles.body, { marginBottom: 16 }]}>
                {description || 'No additional description provided.'}
            </Text>

            {/* ── Code Snippet ─────────────────────────────────────── */}
            {codeSnippet && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={[styles.label, { color: C.navy, fontSize: 9, marginBottom: 6 }]}>VULNERABLE CODE</Text>
                    <View style={styles.codeBlock}>
                        <Text style={styles.codeText}>{codeSnippet}</Text>
                    </View>
                </View>
            )}

            {/* ── Impact ───────────────────────────────────────────── */}
            {(issue as any).impact && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={[styles.label, { color: C.navy, fontSize: 9, marginBottom: 8 }]}>IMPACT</Text>
                    {(['definite', 'likely', 'possible'] as const).map(type => {
                        const items: string[] = (issue as any).impact?.[type];
                        if (!items || items.length === 0) return null;
                        const labelMap = { definite: 'Will happen', likely: 'Likely to happen', possible: 'Could happen' };
                        const colorMap = { definite: C.red, likely: C.orange, possible: C.amber };
                        const col = colorMap[type];
                        return (
                            <View key={type} style={{ marginBottom: 6 }}>
                                <Text style={{ fontSize: 8, color: col, fontFamily: 'Helvetica-Bold', marginBottom: 3, letterSpacing: 0.5 }}>
                                    {labelMap[type].toUpperCase()}
                                </Text>
                                {items.slice(0, 2).map((it, i) => (
                                    <Bullet key={i} text={it} color={col} />
                                ))}
                            </View>
                        );
                    })}
                </View>
            )}

            {/* ── How To Fix ───────────────────────────────────────── */}
            {fixText && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={[styles.label, { color: C.navy, fontSize: 9, marginBottom: 6 }]}>HOW TO FIX IT</Text>
                    <View style={[styles.successBox, { marginBottom: 0 }]}>
                        <Text style={[styles.boxText, { color: '#166534', fontSize: 10 }]}>{fixText}</Text>
                    </View>
                </View>
            )}

            {/* ── Solution Steps ────────────────────────────────────── */}
            {(issue as any).solution?.must && (issue as any).solution.must.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={[styles.label, { color: C.navy, fontSize: 9, marginBottom: 8 }]}>REMEDIATION STEPS</Text>
                    {(['must', 'should'] as const).map(level => {
                        const items: Array<{ action: string; reason: string }> = (issue as any).solution?.[level];
                        if (!items || items.length === 0) return null;
                        const levelColor = level === 'must' ? C.red : C.amber;
                        const levelLabel = level === 'must' ? 'MUST DO' : 'SHOULD DO';
                        return (
                            <View key={level} style={{ marginBottom: 8 }}>
                                <Text style={{ fontSize: 8, color: levelColor, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginBottom: 5 }}>
                                    {levelLabel}
                                </Text>
                                {items.slice(0, 3).map((item, i) => (
                                    <View key={i} style={{ marginBottom: 5 }}>
                                        <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.slate }}>
                                            {i + 1}.  {item.action}
                                        </Text>
                                        {item.reason && (
                                            <Text style={{ fontSize: 9, color: C.muted, marginTop: 2, marginLeft: 16 }}>
                                                {item.reason}
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>
            )}

            {/* ── Cursor Prompt ─────────────────────────────────────── */}
            {cursorPrompt && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={[styles.label, { color: C.navy, fontSize: 9, marginBottom: 6 }]}>
                        CURSOR / AI PROMPT — COPY & PASTE TO FIX
                    </Text>
                    <View style={styles.cursorBox}>
                        <View style={styles.cursorHeader}>
                            <View style={[styles.cursorDot, { backgroundColor: '#FF5F56' }]} />
                            <View style={[styles.cursorDot, { backgroundColor: '#FFBD2E' }]} />
                            <View style={[styles.cursorDot, { backgroundColor: '#27C93F' }]} />
                            <Text style={styles.cursorLabel}>CURSOR PROMPT</Text>
                        </View>
                        <View style={styles.cursorBody}>
                            <Text style={styles.cursorText}>{cursorPrompt}</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* ── Economics footer ─────────────────────────────────── */}
            <View style={{
                marginTop: 8,
                flexDirection: 'row', justifyContent: 'space-between',
                paddingVertical: 10, paddingHorizontal: 16,
                backgroundColor: C.bgLight, borderRadius: 6,
                borderWidth: 1, borderStyle: 'solid', borderColor: C.border,
            }}>
                {[
                    { label: 'SEVERITY',    value: String(issue.severity || 'Medium').toUpperCase(), color: sevColor },
                    { label: 'TIME TO FIX', value: String((issue as any).estimatedTimeToFix || '1–2 hours'), color: C.slate },
                    { label: 'ROI',         value: String((issue as any).roi || 'Risk elimination'),  color: C.green },
                    { label: 'AGENT',       value: String((issue as any).agentName || issue.category || 'Security'), color: C.blue },
                ].map((m, i) => (
                    <View key={i} style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 7, color: C.muted, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3 }}>
                            {m.label}
                        </Text>
                        <Text style={{ fontSize: 9, color: m.color, fontFamily: 'Helvetica-Bold' }}>{m.value}</Text>
                    </View>
                ))}
            </View>

            <PF label={`Finding ${idx + 1} of ${total}  ·  ${findingId}`} />
        </Page>
    );
};

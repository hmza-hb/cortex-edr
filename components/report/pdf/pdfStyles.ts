import { StyleSheet } from '@react-pdf/renderer';

export const C = {
    navy: '#0A1628',
    navyMid: '#0f2040',
    blue: '#2563EB',
    blueSoft: '#3b82f6',
    purple: '#7C3AED',
    red: '#DC2626',
    orange: '#EA580C',
    amber: '#D97706',
    green: '#16A34A',
    slate: '#1E293B',
    slateLight: '#334155',
    muted: '#64748B',
    mutedLight: '#94A3B8',
    border: '#E2E8F0',
    bgLight: '#F8FAFC',
    bgAlt: '#F1F5F9',
    white: '#FFFFFF',
    black: '#000000',
};

export const styles = StyleSheet.create({
    // ── Pages ──────────────────────────────────────────────
    coverPage: { backgroundColor: C.navy, padding: 0, position: 'relative' },
    page: { padding: '40 50', backgroundColor: C.white, fontFamily: 'Helvetica', fontSize: 9 },

    // ── Watermark ──────────────────────────────────────────
    watermark: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center', opacity: 0.04,
    },
    watermarkText: {
        fontSize: 90, color: C.navy, fontFamily: 'Helvetica-Bold',
        transform: 'rotate(-45deg)',
    },

    // ── Cover ───────────────────────────────────────────────
    coverBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    coverAccent: {
        position: 'absolute', top: 0, right: 0, width: 200, bottom: 0,
        backgroundColor: C.blue, opacity: 0.12,
    },
    coverContent: { padding: '70 60', flex: 1 },
    coverLogo: { width: 60, height: 60, marginBottom: 10 },
    coverOrgName: {
        fontSize: 28, fontFamily: 'Helvetica-Bold', color: C.white,
        letterSpacing: 3, marginBottom: 4,
    },
    coverTagline: { fontSize: 10, color: '#93C5FD', letterSpacing: 2, marginBottom: 80 },
    coverEngTitle: {
        fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.white,
        marginBottom: 16, lineHeight: 1.3,
    },
    coverDivider: { height: 3, width: 60, backgroundColor: C.blue, marginBottom: 40 },
    coverMetaRow: { flexDirection: 'row', marginBottom: 10, gap: 12 },
    coverMetaLabel: { fontSize: 8, color: '#60A5FA', letterSpacing: 1, width: 100, fontFamily: 'Helvetica-Bold' },
    coverMetaValue: { fontSize: 9, color: C.white, flex: 1 },
    coverClassBadge: {
        marginTop: 60, alignSelf: 'flex-start',
        paddingHorizontal: 14, paddingVertical: 6,
        backgroundColor: '#991B1B', borderRadius: 4,
    },
    coverClassText: { fontSize: 10, color: C.white, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
    coverFooter: {
        position: 'absolute', bottom: 30, left: 60, right: 60,
        borderTop: `1 solid rgba(255,255,255,0.15)`, paddingTop: 12,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    coverFooterText: { fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },

    // ── TOC ─────────────────────────────────────────────────
    tocTitle: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.navy, marginBottom: 4 },
    tocSubtitle: { fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 32 },
    tocItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 9, borderBottom: `0.5 solid ${C.border}`,
    },
    tocItemMain: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    tocNum: { fontSize: 9, color: C.blue, fontFamily: 'Helvetica-Bold', width: 24 },
    tocLabel: { fontSize: 10, color: C.slate, flex: 1 },
    tocPage: { fontSize: 9, color: C.muted },
    tocSection: {
        marginTop: 18, marginBottom: 4, paddingBottom: 6,
        borderBottom: `1.5 solid ${C.navy}`,
    },
    tocSectionLabel: { fontSize: 8, color: C.muted, letterSpacing: 2, fontFamily: 'Helvetica-Bold' },

    // ── Page Header ─────────────────────────────────────────
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `2 solid ${C.navy}`, paddingBottom: 14, marginBottom: 24,
    },
    brand: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.navy, letterSpacing: 2 },
    brandTag: { fontSize: 7, color: C.blue, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginTop: 2 },
    headerRight: { textAlign: 'right' },
    headerMeta: { fontSize: 8, color: C.muted, marginBottom: 2 },

    // ── Section Headings ────────────────────────────────────
    sectionHeading: {
        fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.navy,
        marginBottom: 4,
    },
    sectionSub: { fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 20 },
    subHeading: {
        fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.slate,
        marginTop: 18, marginBottom: 8, paddingBottom: 4,
        borderBottom: `0.5 solid ${C.border}`,
    },
    subSubHeading: {
        fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.blue,
        textTransform: 'uppercase', letterSpacing: 1,
        marginTop: 12, marginBottom: 6,
    },

    // ── Score / Stat Boxes ───────────────────────────────────
    scoreGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    scoreBox: {
        flex: 1, padding: 14, backgroundColor: C.bgLight,
        border: `1 solid ${C.border}`, borderRadius: 8,
    },
    scoreMain: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: C.navy },
    scoreLabel: { fontSize: 7, color: C.muted, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginTop: 4 },

    // ── Severity Badges ─────────────────────────────────────
    badge: {
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
        fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.white,
    },

    // ── Body Text ───────────────────────────────────────────
    bodyText: { fontSize: 9, color: C.slateLight, lineHeight: 1.6, marginBottom: 6 },
    bulletRow: { flexDirection: 'row', gap: 6, marginBottom: 5 },
    bullet: { fontSize: 9, color: C.blue, width: 10 },
    bulletText: { fontSize: 9, color: C.slateLight, flex: 1, lineHeight: 1.5 },

    // ── Tables ──────────────────────────────────────────────
    table: { marginBottom: 16 },
    tableHead: {
        flexDirection: 'row', backgroundColor: C.navy,
        padding: '7 10',
    },
    tableHeadCell: { fontSize: 8, color: C.white, fontFamily: 'Helvetica-Bold', flex: 1 },
    tableRow: {
        flexDirection: 'row', padding: '6 10', borderBottom: `0.5 solid ${C.border}`,
    },
    tableRowAlt: { backgroundColor: C.bgLight },
    tableCell: { fontSize: 8, color: C.slate, flex: 1 },

    // ── Info Row (label: value) ──────────────────────────────
    infoGrid: { marginBottom: 12 },
    infoRow: { flexDirection: 'row', marginBottom: 5 },
    infoLabel: { width: 110, fontSize: 8, color: C.muted, fontFamily: 'Helvetica-Bold' },
    infoValue: { flex: 1, fontSize: 8, color: C.slate },

    // ── Finding Card ────────────────────────────────────────
    findingCard: {
        border: `1 solid ${C.border}`, borderRadius: 6, marginBottom: 0,
        overflow: 'hidden',
    },
    findingHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: '10 14', backgroundColor: C.navy,
    },
    findingId: { fontSize: 8, color: '#93C5FD', fontFamily: 'Helvetica-Bold', marginBottom: 3 },
    findingTitle: { fontSize: 12, color: C.white, fontFamily: 'Helvetica-Bold', flex: 1 },
    findingBody: { padding: '12 14' },

    // ── Code Block ──────────────────────────────────────────
    codeBlock: {
        backgroundColor: '#0F172A', padding: 10, borderRadius: 4, marginBottom: 8,
    },
    code: { fontSize: 7, color: '#38BDF8', fontFamily: 'Courier', lineHeight: 1.5 },

    // ── Alert / Highlight Boxes ──────────────────────────────
    alertBox: {
        padding: 10, borderRadius: 6, marginBottom: 10, borderLeft: `3 solid ${C.blue}`,
        backgroundColor: '#EFF6FF',
    },
    alertTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.blue, marginBottom: 4 },
    alertText: { fontSize: 8, color: C.slateLight, lineHeight: 1.5 },

    warnBox: {
        padding: 10, borderRadius: 6, marginBottom: 10, borderLeft: `3 solid ${C.red}`,
        backgroundColor: '#FEF2F2',
    },
    warnTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.red, marginBottom: 4 },

    successBox: {
        padding: 10, borderRadius: 6, marginBottom: 10, borderLeft: `3 solid ${C.green}`,
        backgroundColor: '#F0FDF4',
    },

    // ── Maturity bar ────────────────────────────────────────
    maturityRow: { marginBottom: 12 },
    maturityLabel: { fontSize: 9, color: C.slate, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
    maturityBarBg: {
        height: 8, backgroundColor: C.bgAlt, borderRadius: 4,
        marginBottom: 2, overflow: 'hidden',
    },
    maturityBarFill: { height: 8, backgroundColor: C.blue, borderRadius: 4 },
    maturityBarLevel: { fontSize: 7, color: C.muted },

    // ── Footer ──────────────────────────────────────────────
    footer: {
        position: 'absolute', bottom: 24, left: 50, right: 50,
        borderTop: `0.5 solid ${C.border}`, paddingTop: 8,
        flexDirection: 'row', justifyContent: 'space-between',
    },
    footerText: { fontSize: 7, color: C.mutedLight, letterSpacing: 1 },

    // ── Misc ────────────────────────────────────────────────
    divider: { borderBottom: `1 solid ${C.border}`, marginVertical: 16 },
    spacer: { marginBottom: 16 },
    row: { flexDirection: 'row', gap: 10 },
    col: { flex: 1 },
});

export const severityColor = (s?: string) => {
    switch (s?.toLowerCase()) {
        case 'critical': return '#DC2626';
        case 'high': return '#EA580C';
        case 'medium': return '#D97706';
        case 'low': return '#2563EB';
        default: return '#64748B';
    }
};

export const maturityColor = (level: number) => {
    if (level <= 1) return '#DC2626';
    if (level <= 2) return '#D97706';
    if (level <= 3) return '#2563EB';
    if (level <= 4) return '#059669';
    return '#7C3AED';
};

import { StyleSheet } from '@react-pdf/renderer';

// ── Brand Palette ────────────────────────────────────────────────────────────
export const C = {
    navy:        '#0A1628',
    navyMid:     '#0F2040',
    navyLight:   '#142850',
    blue:        '#2563EB',
    blueBright:  '#3B82F6',
    blueLight:   '#60A5FA',
    blueGhost:   '#EFF6FF',
    purple:      '#7C3AED',
    purpleLight: '#A78BFA',
    red:         '#DC2626',
    redLight:    '#FEF2F2',
    orange:      '#EA580C',
    amber:       '#D97706',
    amberLight:  '#FFFBEB',
    green:       '#16A34A',
    greenLight:  '#F0FDF4',
    slate:       '#1E293B',
    slateLight:  '#334155',
    muted:       '#64748B',
    mutedLight:  '#94A3B8',
    border:      '#E2E8F0',
    bgLight:     '#F8FAFC',
    bgAlt:       '#F1F5F9',
    white:       '#FFFFFF',
    codeBlack:   '#0D1117',
    codeFg:      '#79C0FF',
    codeGreen:   '#3FB950',
    codeAmber:   '#F2CC60',
};

// NOTE: @react-pdf/renderer does NOT support CSS shorthand syntax.
// ✗ border: '1 solid #000'          → use borderWidth + borderStyle + borderColor
// ✗ borderLeft: '3 solid #000'      → use borderLeftWidth + borderLeftStyle + borderLeftColor
// ✗ padding: '8 12'                 → use paddingVertical + paddingHorizontal
// ✗ borderRadius: '4 4 0 0'         → use a single number or individual corner props

export const styles = StyleSheet.create({

    // ── Pages ─────────────────────────────────────────────────────────────────
    coverPage: {
        backgroundColor: C.navy,
        padding: 0,
        position: 'relative',
    },
    page: {
        paddingTop: 44,
        paddingBottom: 44,
        paddingLeft: 52,
        paddingRight: 52,
        backgroundColor: C.white,
        fontFamily: 'Helvetica',
        fontSize: 10,
    },

    // ── Page Header / Footer ──────────────────────────────────────────────────
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomStyle: 'solid',
        borderBottomColor: C.navy,
        paddingBottom: 12,
        marginBottom: 24,
    },
    brand: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: C.navy,
        letterSpacing: 2,
    },
    brandTag: {
        fontSize: 7,
        color: C.blue,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1.5,
        marginTop: 2,
    },
    headerRight: { textAlign: 'right' },
    headerMeta: {
        fontSize: 8,
        color: C.muted,
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    footer: {
        position: 'absolute',
        bottom: 22,
        left: 52,
        right: 52,
        borderTopWidth: 0.5,
        borderTopStyle: 'solid',
        borderTopColor: C.border,
        paddingTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 7,
        color: C.mutedLight,
        letterSpacing: 1,
    },

    // ── Section Typography ────────────────────────────────────────────────────
    sectionHeading: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: C.navy,
        marginBottom: 3,
        letterSpacing: 0.5,
    },
    sectionSubtitle: {
        fontSize: 8,
        color: C.muted,
        letterSpacing: 2,
        marginBottom: 22,
        fontFamily: 'Helvetica-Bold',
    },
    subHeading: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: C.slate,
        marginTop: 20,
        marginBottom: 8,
        paddingBottom: 5,
        borderBottomWidth: 0.5,
        borderBottomStyle: 'solid',
        borderBottomColor: C.border,
    },
    label: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: C.muted,
        letterSpacing: 1.5,
        marginBottom: 4,
    },

    // ── Body Text ─────────────────────────────────────────────────────────────
    body: {
        fontSize: 10,
        color: C.slateLight,
        lineHeight: 1.7,
        marginBottom: 8,
    },
    bodySmall: {
        fontSize: 9,
        color: C.muted,
        lineHeight: 1.6,
    },

    // ── Bullet Lists ──────────────────────────────────────────────────────────
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    bullet: {
        fontSize: 10,
        color: C.blue,
        width: 12,
        lineHeight: 1.7,
        marginRight: 8,
    },
    bulletText: {
        fontSize: 10,
        color: C.slateLight,
        flex: 1,
        lineHeight: 1.7,
    },

    // ── Severity Badges ───────────────────────────────────────────────────────
    badge: {
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 4,
        fontFamily: 'Helvetica-Bold',
        fontSize: 8,
        color: C.white,
        letterSpacing: 1,
    },

    // ── Score Boxes ───────────────────────────────────────────────────────────
    scoreGrid: { flexDirection: 'row', marginBottom: 22 },
    scoreBox: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 14,
        backgroundColor: C.bgLight,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: C.border,
        borderRadius: 8,
        alignItems: 'center',
    },
    scoreMain: {
        fontSize: 28,
        fontFamily: 'Helvetica-Bold',
        color: C.navy,
    },
    scoreLabel: {
        fontSize: 7,
        color: C.muted,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1.5,
        marginTop: 4,
    },

    // ── Tables ────────────────────────────────────────────────────────────────
    table: { marginBottom: 18 },
    tableHead: {
        flexDirection: 'row',
        backgroundColor: C.navy,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    tableHeadCell: {
        fontSize: 8,
        color: C.white,
        fontFamily: 'Helvetica-Bold',
        flex: 1,
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderBottomStyle: 'solid',
        borderBottomColor: C.border,
    },
    tableRowAlt: { backgroundColor: C.bgLight },
    tableCell: {
        fontSize: 9,
        color: C.slate,
        flex: 1,
        lineHeight: 1.5,
    },

    // ── Code Block ────────────────────────────────────────────────────────────
    codeBlock: {
        backgroundColor: C.codeBlack,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 6,
        marginBottom: 10,
    },
    codeText: {
        fontSize: 8,
        color: C.codeFg,
        fontFamily: 'Courier',
        lineHeight: 1.6,
    },

    // ── Alert / Callout Boxes ─────────────────────────────────────────────────
    infoBox: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftStyle: 'solid',
        borderLeftColor: C.blue,
        backgroundColor: C.blueGhost,
        marginBottom: 10,
    },
    warnBox: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftStyle: 'solid',
        borderLeftColor: C.red,
        backgroundColor: C.redLight,
        marginBottom: 10,
    },
    successBox: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftStyle: 'solid',
        borderLeftColor: C.green,
        backgroundColor: C.greenLight,
        marginBottom: 10,
    },
    boxTitle: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1,
        marginBottom: 5,
    },
    boxText: {
        fontSize: 9,
        color: C.slateLight,
        lineHeight: 1.6,
    },

    // ── Cursor Prompt Box ─────────────────────────────────────────────────────
    cursorBox: {
        backgroundColor: '#0D1117',
        borderRadius: 6,
        marginBottom: 10,
        overflow: 'hidden',
    },
    cursorHeader: {
        backgroundColor: '#161B22',
        paddingVertical: 6,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '#21262D',
    },
    cursorDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    cursorLabel: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: '#58A6FF',
        letterSpacing: 1.5,
    },
    cursorBody: {
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    cursorText: {
        fontSize: 8,
        color: '#E6EDF3',
        fontFamily: 'Courier',
        lineHeight: 1.7,
    },

    // ── Finding Card ──────────────────────────────────────────────────────────
    findingCard: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: C.border,
        borderRadius: 8,
        marginBottom: 18,
        overflow: 'hidden',
    },
    findingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: C.navy,
    },
    findingId: {
        fontSize: 8,
        color: C.blueLight,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1,
        marginBottom: 4,
    },
    findingTitle: {
        fontSize: 13,
        color: C.white,
        fontFamily: 'Helvetica-Bold',
        flex: 1,
        lineHeight: 1.3,
    },
    findingBody: {
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    // ── Maturity Bars ─────────────────────────────────────────────────────────
    maturityRow: { marginBottom: 12 },
    maturityLabel: {
        fontSize: 9,
        color: C.slate,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 4,
    },
    maturityBarBg: {
        height: 7,
        backgroundColor: C.bgAlt,
        borderRadius: 4,
        marginBottom: 3,
        overflow: 'hidden',
    },
    maturityBarFill: {
        height: 7,
        backgroundColor: C.blue,
        borderRadius: 4,
    },

    // ── Info Rows ─────────────────────────────────────────────────────────────
    infoRow: {
        flexDirection: 'row',
        marginBottom: 6,
        alignItems: 'flex-start',
    },
    infoLabel: {
        width: 120,
        fontSize: 8,
        color: C.muted,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 0.5,
        paddingTop: 1,
    },
    infoValue: {
        flex: 1,
        fontSize: 9,
        color: C.slate,
        lineHeight: 1.5,
    },

    // ── Dividers ──────────────────────────────────────────────────────────────
    divider: {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: C.border,
        marginTop: 18,
        marginBottom: 18,
    },
    thinDivider: {
        borderBottomWidth: 0.5,
        borderBottomStyle: 'solid',
        borderBottomColor: C.border,
        marginTop: 10,
        marginBottom: 10,
    },

    row: { flexDirection: 'row' },
    col: { flex: 1 },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
export const severityColor = (s?: string): string => {
    switch ((s || '').toLowerCase()) {
        case 'critical': return '#DC2626';
        case 'high':     return '#EA580C';
        case 'medium':   return '#D97706';
        case 'low':      return '#2563EB';
        default:         return '#64748B';
    }
};

export const severityBg = (s?: string): string => {
    switch ((s || '').toLowerCase()) {
        case 'critical': return '#FEF2F2';
        case 'high':     return '#FFF7ED';
        case 'medium':   return '#FFFBEB';
        case 'low':      return '#EFF6FF';
        default:         return '#F8FAFC';
    }
};

export const launchStatusColor = (status?: string): string =>
    status === 'RED_FLAG' ? '#DC2626' : '#16A34A';

export const launchStatusBg = (status?: string): string =>
    status === 'RED_FLAG' ? '#FEF2F2' : '#F0FDF4';

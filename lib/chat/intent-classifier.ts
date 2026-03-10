// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INTENT CLASSIFIER — Zero-LLM-call pattern matching
// Determines what kind of question the user is asking
// so the orchestrator knows what context to retrieve.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ChatIntent =
    | 'vulnerability_detail'
    | 'fix_guidance'
    | 'repo_overview'
    | 'architecture_advice'
    | 'security_education'
    | 'founder_info'
    | 'product_question'
    | 'greeting'
    | 'followup';

interface IntentResult {
    intent: ChatIntent;
    confidence: number;          // 0-1
    extractedKeywords: string[]; // keywords that matched or are useful for context retrieval
    scanSpecific: boolean;       // does this intent need scan/repo data?
}

// ── Pattern definitions ─────────────────────────────

const PATTERNS: Record<ChatIntent, RegExp[]> = {
    vulnerability_detail: [
        /\b(vulnerabilit|vuln|cve|exploit|injection|xss|csrf|ssrf|sqli|rce|lfi|rfi|idor|xxe)\b/i,
        /\b(security\s*(issue|finding|bug|flaw|risk|hole|concern|problem))\b/i,
        /\b(attack\s*(vector|surface|scenario))\b/i,
        /\b(critical|high)\s*(issue|finding|risk|severity)\b/i,
        /what\s*(is|are)\s*(the|my|this)\s*(vuln|issue|finding|risk|problem)/i,
        /\b(owasp|top\s*10)\b/i,
        /tell\s*me\s*(about|more)\s*(the|my|this)?\s*(vuln|issue|finding|risk)/i,
        /\bwhat\s*(did|does)\s*(the|your|my)\s*scan\s*(find|show|reveal|detect)/i,
    ],

    fix_guidance: [
        /\b(how\s*(to|do\s*i|can\s*i|should\s*i)\s*(fix|resolve|patch|remediat|mitigat|address|solve))\b/i,
        /\b(fix|patch|remediat|resolv|mitigat)\s*(this|the|it|that|my)\b/i,
        /\b(suggest|recommend|give)\s*(a|me)?\s*(fix|solution|patch|remedy)\b/i,
        /\b(code\s*fix|secure\s*alternative|safe\s*version)\b/i,
        /\b(what\s*should\s*i\s*(change|update|modify|replace))\b/i,
        /\b(how\s*do\s*i\s*(secure|harden|protect))\b/i,
        /\b(can\s*you\s*(fix|help\s*fix|show\s*me\s*how\s*to\s*fix))\b/i,
    ],

    repo_overview: [
        /\b(overview|summary|status|posture|health|report|dashboard)\b/i,
        /\b(how\s*(is|does)\s*(my|the|this)\s*(repo|repository|codebase|project|code)\s*(doing|look))\b/i,
        /\b(scan\s*(result|summary|report|overview|status))\b/i,
        /\b(security\s*(score|rating|grade|posture|status))\b/i,
        /\b(total|how\s*many)\s*(issue|vuln|finding|problem)/i,
        /\b(give\s*me\s*(a|an|the)\s*(overview|summary|report|status))\b/i,
        /\bshow\s*(me)?\s*(my|the)?\s*(result|report|finding|scan)/i,
    ],

    architecture_advice: [
        /\b(architect|design\s*pattern|structure|separation\s*of\s*concerns)\b/i,
        /\b(solid|dry|kiss|yagni|clean\s*code|clean\s*architect)\b/i,
        /\b(coupling|cohesion|modularity|scalab|maintainab)\b/i,
        /\b(refactor|restructur|reorganiz)\b/i,
        /\b(system\s*design|component\s*design|module\s*design)\b/i,
        /\b(folder\s*structure|project\s*structure|code\s*organization)\b/i,
    ],

    security_education: [
        /\bwhat\s*(is|are)\s*(a\s*)?(sql\s*injection|xss|csrf|ssrf|rce|buffer\s*overflow|privilege\s*escalation)\b/i,
        /\b(explain|teach|educate|learn)\s*(me)?\s*(about)?\s*(security|encryption|auth|hashing|token)\b/i,
        /\b(best\s*practice|security\s*practice|secure\s*coding)\b/i,
        /\b(how\s*does|what\s*does)\s*(encryption|hashing|jwt|oauth|cors|csp|ssl|tls)\s*(work)?\b/i,
        /\b(difference\s*between)\b/i,
        /\b(in\s*general|generally\s*speaking|as\s*a\s*concept)\b/i,
    ],

    founder_info: [
        /\b(who\s*(made|created|built|designed|developed)\s*(you|cortex|this))\b/i,
        /\b(hamza|hafeez|bhatti|founder|creator|author)\b/i,
        /\b(project\s*cortex|cortex\s*paper|research\s*paper|agi\s*paper)\b/i,
        /\b(your\s*(origin|creator|maker|architect|builder|designer))\b/i,
        /\b(who\s*(are|is)\s*(you|behind\s*(this|cortex)))\b/i,
        /\b(about\s*(you|cortex|the\s*company|the\s*team))\b/i,
    ],

    product_question: [
        /\b(pricing|price|cost|plan|tier|subscription|billing|payment)\b/i,
        /\b(free\s*(tier|plan|version)|trial)\b/i,
        /\b(feature|capability|what\s*can\s*(you|cortex)\s*do)\b/i,
        /\b(how\s*does\s*(cortex|the\s*platform|the\s*tool|it)\s*work)\b/i,
        /\b(scout|sentinel|guardian|fortress)\b/i,
        /\b(enterprise|teams?\s*plan|upgrade)\b/i,
        /\b(api\s*access|integration|github\s*app)\b/i,
    ],

    greeting: [
        /^(hi|hello|hey|howdy|sup|yo|good\s*(morning|afternoon|evening|day))\s*[!.]?\s*$/i,
        /^(what'?s\s*up|how\s*are\s*you|greetings)\s*[!?.]?\s*$/i,
        /^(thanks?|thank\s*you|thx|ty)\s*[!.]?\s*$/i,
    ],

    followup: [], // detected by message length + no other intent match
};

// ── Scoring weights ─────────────────────────────────

const INTENT_PRIORITY: Record<ChatIntent, number> = {
    fix_guidance: 10,           // highest — user wants action
    vulnerability_detail: 9,
    repo_overview: 7,
    architecture_advice: 6,
    security_education: 5,
    founder_info: 8,            // very specific — if matched, it's correct
    product_question: 8,
    greeting: 4,
    followup: 1,                // fallback
};

// ── Keyword extractor ───────────────────────────────

const SECURITY_KEYWORDS = [
    'sql injection', 'xss', 'cross-site scripting', 'csrf', 'ssrf', 'rce',
    'remote code execution', 'buffer overflow', 'privilege escalation',
    'authentication', 'authorization', 'encryption', 'hashing', 'jwt',
    'oauth', 'cors', 'csp', 'ssl', 'tls', 'certificate', 'api key',
    'secret', 'token', 'password', 'credentials', 'input validation',
    'sanitization', 'parameterized', 'prepared statement', 'rate limiting',
    'brute force', 'dos', 'ddos', 'man in the middle', 'mitm',
    'dependency', 'package', 'npm', 'supply chain',
    'hardcoded', 'exposed', 'leaked', 'insecure', 'vulnerable',
];

function extractKeywords(message: string): string[] {
    const lower = message.toLowerCase();
    const found: string[] = [];

    for (const kw of SECURITY_KEYWORDS) {
        if (lower.includes(kw)) {
            found.push(kw);
        }
    }

    // Also extract file paths mentioned in the message
    const filePathMatch = lower.match(/[\w\-./]+\.(ts|tsx|js|jsx|py|java|go|rs|rb|php|c|cpp|h|sql|yaml|yml|json|xml|html|css)/g);
    if (filePathMatch) {
        found.push(...filePathMatch);
    }

    return found;
}

// ── Main classifier ─────────────────────────────────

export function classifyIntent(
    message: string,
    history: Array<{ role: string; content: string }> = []
): IntentResult {
    const trimmed = message.trim();

    // Short messages with history are likely follow-ups
    if (trimmed.length < 15 && history.length > 0) {
        const lastAssistant = [...history].reverse().find(m => m.role === 'assistant');
        if (lastAssistant) {
            // Try to infer intent from the last assistant message + current short query
            const combined = `${lastAssistant.content.slice(0, 200)} ${trimmed}`;
            const inferredResult = scoreIntents(combined);
            if (inferredResult.intent !== 'followup') {
                return {
                    ...inferredResult,
                    intent: inferredResult.intent,
                    confidence: inferredResult.confidence * 0.8, // slightly lower confidence for inferred
                };
            }
        }
        return {
            intent: 'followup',
            confidence: 0.6,
            extractedKeywords: extractKeywords(trimmed),
            scanSpecific: true, // follow-ups often reference scan data
        };
    }

    return scoreIntents(trimmed);
}

function scoreIntents(message: string): IntentResult {
    const scores: Partial<Record<ChatIntent, number>> = {};

    for (const [intent, patterns] of Object.entries(PATTERNS) as [ChatIntent, RegExp[]][]) {
        let matchCount = 0;
        for (const pattern of patterns) {
            if (pattern.test(message)) {
                matchCount++;
            }
        }
        if (matchCount > 0) {
            scores[intent] = matchCount * INTENT_PRIORITY[intent];
        }
    }

    // If no patterns matched, classify as followup (or greeting if very short)
    const entries = Object.entries(scores) as [ChatIntent, number][];
    if (entries.length === 0) {
        const isShort = message.trim().length < 20;
        return {
            intent: isShort ? 'greeting' : 'followup',
            confidence: 0.3,
            extractedKeywords: extractKeywords(message),
            scanSpecific: !isShort,
        };
    }

    // Sort by score descending
    entries.sort((a, b) => b[1] - a[1]);
    const [topIntent, topScore] = entries[0];
    const totalScore = entries.reduce((sum, [, s]) => sum + s, 0);

    // Handle ambiguity: if fix_guidance + vulnerability_detail both match,
    // prefer fix_guidance (user wants actionable help)
    if (
        scores.fix_guidance && scores.vulnerability_detail &&
        scores.fix_guidance >= scores.vulnerability_detail * 0.7
    ) {
        return {
            intent: 'fix_guidance',
            confidence: Math.min(0.95, topScore / totalScore + 0.2),
            extractedKeywords: extractKeywords(message),
            scanSpecific: true,
        };
    }

    // Handle ambiguity: security_education vs vulnerability_detail
    // If message contains "in my repo/code/project", it's about THEIR code
    if (
        scores.security_education && scores.vulnerability_detail &&
        /\b(my|our|this)\s*(repo|code|project|app|codebase)\b/i.test(message)
    ) {
        return {
            intent: 'vulnerability_detail',
            confidence: 0.8,
            extractedKeywords: extractKeywords(message),
            scanSpecific: true,
        };
    }

    const SCAN_SPECIFIC_INTENTS: ChatIntent[] = [
        'vulnerability_detail', 'fix_guidance', 'repo_overview', 'architecture_advice', 'followup'
    ];

    return {
        intent: topIntent,
        confidence: Math.min(0.95, topScore / totalScore + 0.1),
        extractedKeywords: extractKeywords(message),
        scanSpecific: SCAN_SPECIFIC_INTENTS.includes(topIntent),
    };
}

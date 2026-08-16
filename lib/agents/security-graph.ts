// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECURITY GRAPH BUILDER — v1
// Regex-based structural extraction. No AST required.
// Produces a security model the LLM uses to reason about
// cross-file attack paths rather than isolated snippets.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import path from 'path';

// ─── Types ──────────────────────────────────────────────
export interface SecurityEndpoint {
    method: string;
    route: string;
    file: string;
    line: number;
    middlewareHints: string[];
}

export interface DbQuery {
    type: string;
    table?: string;
    raw: string;
    file: string;
    line: number;
    suspiciousConcat: boolean; // string interpolation into query
}

export interface RlsPolicy {
    table: string;
    name: string;
    command: string;
    using?: string;
    withCheck?: string;
    file: string;
    line: number;
    hasAuthCheck: boolean;
}

export interface SecurityDefinerFn {
    name: string;
    file: string;
    line: number;
    hasSearchPath: boolean;
}

export interface SecurityGraph {
    endpoints: SecurityEndpoint[];
    dbQueries: DbQuery[];
    rlsPolicies: RlsPolicy[];
    securityDefinerFns: SecurityDefinerFn[];
    serviceRoleInClient: Array<{ file: string; line: number }>;
    execCalls: Array<{ raw: string; file: string; line: number; hasUserInput: boolean }>;
    goroutineSpawns: Array<{ context: string; file: string; line: number }>;
    envVarsUsed: string[];
    techContext: {
        hasSupabase: boolean;
        hasGo: boolean;
        hasNextjs: boolean;
        hasPrisma: boolean;
        hasGorm: boolean;
    };
    textSummary: string;
}

// ─── Helpers ─────────────────────────────────────────────
function readFileSafe(p: string): string {
    try { return fs.readFileSync(p, 'utf-8'); } catch { return ''; }
}

function relPath(filePath: string, repoPath: string): string {
    return filePath.startsWith(repoPath) ? filePath.slice(repoPath.length) : filePath;
}

// ─── Main Builder ─────────────────────────────────────────
export function buildSecurityGraph(repoPath: string, fileTree: string[]): SecurityGraph {
    const graph: SecurityGraph = {
        endpoints: [],
        dbQueries: [],
        rlsPolicies: [],
        securityDefinerFns: [],
        serviceRoleInClient: [],
        execCalls: [],
        goroutineSpawns: [],
        envVarsUsed: [],
        techContext: { hasSupabase: false, hasGo: false, hasNextjs: false, hasPrisma: false, hasGorm: false },
        textSummary: '',
    };

    // Only process physically-downloaded files
    const downloadedFiles = fileTree.filter(f => {
        try { fs.accessSync(f); return true; } catch { return false; }
    });

    for (const filePath of downloadedFiles) {
        const rel = relPath(filePath, repoPath);
        const ext = path.extname(filePath).toLowerCase();
        const code = readFileSafe(filePath);
        if (!code) continue;
        const lines = code.split('\n');

        // Tech context detection
        if (code.includes('@supabase/supabase-js') || code.includes('createClient') && code.includes('supabase')) graph.techContext.hasSupabase = true;
        if (ext === '.go') graph.techContext.hasGo = true;
        if (code.includes('next/') || code.includes('"next"')) graph.techContext.hasNextjs = true;
        if (code.includes('@prisma/client') || code.includes('prisma.')) graph.techContext.hasPrisma = true;
        if (code.includes('gorm.io') || code.includes('.Find(') || code.includes('.First(')) graph.techContext.hasGorm = true;

        // ── Endpoints ──
        extractEndpoints(lines, rel, graph.endpoints);

        // ── DB Queries ──
        extractDbQueries(lines, rel, graph.dbQueries);

        // ── RLS Policies (from .sql files) ──
        if (ext === '.sql') extractRlsPolicies(lines, rel, graph.rlsPolicies, graph.securityDefinerFns);

        // ── service_role key used in non-service files ──
        if (!rel.includes('service') && !rel.includes('admin') && !rel.includes('server')) {
            lines.forEach((line, i) => {
                if (/SERVICE_ROLE|service_role/i.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('#')) {
                    graph.serviceRoleInClient.push({ file: rel, line: i + 1 });
                }
            });
        }

        // ── exec / shell calls ──
        if (ext === '.go' || ext === '.ts' || ext === '.js') {
            lines.forEach((line, i) => {
                if (/exec\.Command|os\.Execute|child_process\.(exec|spawn|execSync)|\.exec\(|\.spawn\(/i.test(line)) {
                    const hasUserInput = /req\.|params\.|query\.|body\.|args\[|os\.Args|r\.Form/i.test(line);
                    graph.execCalls.push({ raw: line.trim().substring(0, 120), file: rel, line: i + 1, hasUserInput });
                }
            });
        }

        // ── Go goroutine spawns ──
        if (ext === '.go') {
            lines.forEach((line, i) => {
                if (/^\s*go\s+(func|\w+)\s*[({]/.test(line)) {
                    graph.goroutineSpawns.push({ context: line.trim().substring(0, 100), file: rel, line: i + 1 });
                }
            });
        }

        // ── Environment variable references ──
        const envMatches = code.matchAll(/process\.env\.([A-Z_][A-Z0-9_]+)|os\.Getenv\(["'`]([A-Z_][A-Z0-9_]+)/g);
        for (const m of envMatches) {
            const varName = m[1] || m[2];
            if (varName && !graph.envVarsUsed.includes(varName)) graph.envVarsUsed.push(varName);
        }
    }

    graph.textSummary = buildTextSummary(graph);
    return graph;
}

// ─── Extractors ───────────────────────────────────────────

function extractEndpoints(lines: string[], file: string, out: SecurityEndpoint[]) {
    const middlewareKeywords = ['auth', 'require', 'verify', 'protect', 'guard', 'check', 'session', 'jwt', 'token'];

    lines.forEach((line, i) => {
        const trimmed = line.trim();

        // Next.js app router: export async function GET/POST/etc
        const nextMatch = trimmed.match(/^export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s*\(/);
        if (nextMatch) {
            // Look at surrounding lines for middleware hints
            const ctx = lines.slice(Math.max(0, i - 5), i + 5).join(' ');
            const hints = middlewareKeywords.filter(k => new RegExp(k, 'i').test(ctx));
            out.push({ method: nextMatch[1], route: file, file, line: i + 1, middlewareHints: hints });
            return;
        }

        // Express/Fastify: router.get('/path', ...)
        const expressMatch = trimmed.match(/(?:router|app|server)\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/i);
        if (expressMatch) {
            const ctx = lines.slice(Math.max(0, i - 3), i + 8).join(' ');
            const hints = middlewareKeywords.filter(k => new RegExp(k, 'i').test(ctx));
            out.push({ method: expressMatch[1].toUpperCase(), route: expressMatch[2], file, line: i + 1, middlewareHints: hints });
            return;
        }

        // Go net/http: mux.HandleFunc("/path", handler)
        const goMatch = trimmed.match(/(?:mux|r|router|http)\.HandleFunc\s*\(\s*["'`]([^"'`]+)["'`]/);
        if (goMatch) {
            const ctx = lines.slice(Math.max(0, i - 3), i + 8).join(' ');
            const hints = middlewareKeywords.filter(k => new RegExp(k, 'i').test(ctx));
            out.push({ method: 'ANY', route: goMatch[1], file, line: i + 1, middlewareHints: hints });
        }
    });
}

function extractDbQueries(lines: string[], file: string, out: DbQuery[]) {
    lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('#')) return;

        // Supabase .from('table')
        const supaFrom = trimmed.match(/\.from\(['"`]([^'"`]+)['"`]\)/);
        if (supaFrom) {
            const op = /\.insert|\.upsert/.test(trimmed) ? 'INSERT'
                : /\.update/.test(trimmed) ? 'UPDATE'
                : /\.delete/.test(trimmed) ? 'DELETE'
                : 'SELECT';
            const suspiciousConcat = /\$\{|["']\s*\+\s*[a-zA-Z]|\+\s*["']/.test(trimmed);
            out.push({ type: op, table: supaFrom[1], raw: trimmed.substring(0, 150), file, line: i + 1, suspiciousConcat });
            return;
        }

        // Raw SQL patterns
        const rawSql = trimmed.match(/\b(SELECT|INSERT|UPDATE|DELETE)\b/i);
        if (rawSql) {
            const tableMatch = trimmed.match(/(?:FROM|INTO|UPDATE)\s+["'`]?(\w+)["'`]?/i);
            const suspiciousConcat = /\$\{|["']\s*\+\s*[a-zA-Z]|\+\s*["']|Sprintf|fmt\.Sprintf/.test(trimmed);
            out.push({ type: rawSql[1].toUpperCase(), table: tableMatch?.[1], raw: trimmed.substring(0, 150), file, line: i + 1, suspiciousConcat });
        }
    });
}

function extractRlsPolicies(lines: string[], file: string, policiesOut: RlsPolicy[], definerOut: SecurityDefinerFn[]) {
    let currentPolicy: Partial<RlsPolicy> | null = null;

    lines.forEach((line, i) => {
        const upper = line.toUpperCase();

        // CREATE POLICY
        const policyMatch = line.match(/CREATE\s+POLICY\s+["'`]?(\w+)["'`]?\s+ON\s+["'`]?(\w+)["'`]/i);
        if (policyMatch) {
            currentPolicy = {
                name: policyMatch[1],
                table: policyMatch[2],
                file,
                line: i + 1,
                command: /FOR\s+(SELECT|INSERT|UPDATE|DELETE|ALL)/i.exec(line)?.[1]?.toUpperCase() || 'ALL',
                hasAuthCheck: false,
            };
        }

        if (currentPolicy) {
            if (/USING\s*\((.+)/i.test(line)) {
                const m = /USING\s*\((.+)/i.exec(line);
                currentPolicy.using = m?.[1]?.substring(0, 200);
                if (/auth\.uid\(\)|auth\.jwt\(\)|current_user/i.test(line)) currentPolicy.hasAuthCheck = true;
            }
            if (/WITH\s+CHECK\s*\((.+)/i.test(line)) {
                const m = /WITH\s+CHECK\s*\((.+)/i.exec(line);
                currentPolicy.withCheck = m?.[1]?.substring(0, 200);
                if (/auth\.uid\(\)|auth\.jwt\(\)|current_user/i.test(line)) currentPolicy.hasAuthCheck = true;
            }
            // End of policy block
            if (line.trim().endsWith(';') && currentPolicy.table) {
                policiesOut.push(currentPolicy as RlsPolicy);
                currentPolicy = null;
            }
        }

        // SECURITY DEFINER
        if (/SECURITY\s+DEFINER/i.test(line)) {
            const fnMatch = lines.slice(Math.max(0, i - 5), i).join(' ').match(/(?:FUNCTION|PROCEDURE)\s+["'`]?(\w+)/i);
            const hasSearchPath = lines.slice(i, i + 5).some(l => /SET\s+search_path/i.test(l));
            definerOut.push({ name: fnMatch?.[1] || 'unknown', file, line: i + 1, hasSearchPath });
        }
    });
}

// ─── Text Summary for LLM ─────────────────────────────────
function buildTextSummary(graph: SecurityGraph): string {
    const lines: string[] = ['=== CODEBASE SECURITY GRAPH ===', ''];

    const tech = graph.techContext;
    lines.push(`TECH: ${[
        tech.hasNextjs && 'Next.js', tech.hasSupabase && 'Supabase/PostgreSQL',
        tech.hasGo && 'Go', tech.hasPrisma && 'Prisma', tech.hasGorm && 'GORM'
    ].filter(Boolean).join(', ') || 'Unknown'}`);
    lines.push('');

    if (graph.endpoints.length > 0) {
        lines.push('HTTP ENDPOINTS:');
        graph.endpoints.slice(0, 20).forEach(e => {
            const guard = e.middlewareHints.length ? `← [${e.middlewareHints.join(', ')}]` : '← ⚠ NO AUTH HINTS';
            lines.push(`  ${e.method} ${e.route} [${e.file}:${e.line}] ${guard}`);
        });
        lines.push('');
    }

    const suspiciousQueries = graph.dbQueries.filter(q => q.suspiciousConcat);
    if (suspiciousQueries.length > 0) {
        lines.push('⚠ SUSPICIOUS DB QUERIES (possible injection — string concat detected):');
        suspiciousQueries.slice(0, 10).forEach(q => {
            lines.push(`  ${q.type} ${q.table || '?'} [${q.file}:${q.line}] → ${q.raw.substring(0, 100)}`);
        });
        lines.push('');
    }

    if (graph.rlsPolicies.length > 0) {
        lines.push('RLS POLICIES:');
        graph.rlsPolicies.forEach(p => {
            const authStatus = p.hasAuthCheck ? '✓ auth.uid()' : '⚠ NO auth.uid() CHECK';
            lines.push(`  ${p.table}.${p.command}: "${p.name}" [${p.file}:${p.line}] ${authStatus}`);
            if (p.using) lines.push(`    USING: ${p.using.substring(0, 100)}`);
        });
        lines.push('');
    }

    if (graph.securityDefinerFns.length > 0) {
        lines.push('SECURITY DEFINER FUNCTIONS:');
        graph.securityDefinerFns.forEach(f => {
            const sp = f.hasSearchPath ? '✓ search_path set' : '⚠ NO search_path — schema hijack risk';
            lines.push(`  ${f.name}() [${f.file}:${f.line}] — ${sp}`);
        });
        lines.push('');
    }

    if (graph.serviceRoleInClient.length > 0) {
        lines.push('⚠ SERVICE_ROLE KEY USED IN CLIENT-SIDE/NON-SERVICE CODE:');
        graph.serviceRoleInClient.forEach(s => lines.push(`  [${s.file}:${s.line}]`));
        lines.push('');
    }

    if (graph.execCalls.length > 0) {
        lines.push('EXEC/SHELL CALLS:');
        graph.execCalls.forEach(e => {
            const risk = e.hasUserInput ? '⚠ POSSIBLY USER-CONTROLLED INPUT' : '';
            lines.push(`  [${e.file}:${e.line}] ${e.raw.substring(0, 80)} ${risk}`);
        });
        lines.push('');
    }

    if (graph.goroutineSpawns.length > 0) {
        lines.push(`GOROUTINE SPAWNS: ${graph.goroutineSpawns.length} detected`);
        graph.goroutineSpawns.slice(0, 5).forEach(g => lines.push(`  [${g.file}:${g.line}] ${g.context.substring(0, 80)}`));
        lines.push('');
    }

    lines.push('SECURITY INVARIANTS TO TEST:');
    lines.push('  USER_ISOLATION: No user should access another user\'s resources');
    lines.push('  TENANT_ISOLATION: No tenant should read/write another tenant\'s data');
    lines.push('  PRIVILEGE: Normal users must not invoke admin capabilities');
    lines.push('  DATABASE: App authorization must not be bypassable via DB functions');
    lines.push('  SECRETS: Client-controlled data must never become a credential or capability');

    return lines.join('\n');
}

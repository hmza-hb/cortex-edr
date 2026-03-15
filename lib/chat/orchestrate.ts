// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORCHESTRATE — Main entry point for the chat engine
// Wires together intent classification, context retrieval,
// compression, memory management, and prompt assembly.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { classifyIntent } from './intent-classifier';
import { retrieveContext } from './context-retriever';
import { compressContext } from './context-compressor';
import { manageMemory } from './memory-manager';
import { buildPrompt, type AssembledPrompt } from './prompt-builder';

export interface OrchestrateParams {
    userId: string;
    message: string;
    scanId?: string | null;
    history: Array<{ role: string; content: string }>;
    email?: string;
    name?: string;
    threadSummary?: string | null;
}

export interface OrchestrateResult {
    systemPrompt: string;
    userPrompt: string;
    repoUrl: string | null;
    debug: {
        intent: string;
        confidence: number;
        scanSpecific: boolean;
        extractedKeywords: string[];
        contextEmpty: boolean;
        tokenEstimate: {
            system: number;
            user: number;
            total: number;
        };
    };
}

export async function orchestrate(params: OrchestrateParams): Promise<OrchestrateResult> {
    const { userId, message, scanId, history, email, threadSummary } = params;

    // ─── Stage 1: Intent Classification ─────────────
    const intentResult = classifyIntent(message, history);

    console.log(
        `[Orchestrator] Intent: ${intentResult.intent} (confidence: ${intentResult.confidence.toFixed(2)})`,
        `| Keywords: [${intentResult.extractedKeywords.join(', ')}]`,
        `| Scan-specific: ${intentResult.scanSpecific}`
    );

    // ─── Stage 2: Context Retrieval ─────────────────
    const context = await retrieveContext(
        intentResult.intent,
        intentResult.extractedKeywords,
        { userId, scanId, email }
    );

    console.log(
        `[Orchestrator] Context retrieved:`,
        `empty=${context.isEmpty}`,
        `issues=${context.issues?.length ?? 0}`,
        `hasScanMeta=${!!context.scanMeta}`,
        `hasStats=${!!context.scanStats}`,
        `hasArchReport=${!!context.architectureReport}`
    );

    // ─── Stage 3: Context Compression ───────────────
    const compressed = compressContext(context, intentResult.intent);

    // ─── Stage 4: Memory Management ─────────────────
    const memory = manageMemory(history, threadSummary);

    // ─── Stage 5: Prompt Assembly ───────────────────
    const assembled: AssembledPrompt = buildPrompt({
        intent: intentResult.intent,
        compressedContext: compressed,
        memory,
        message,
    });

    console.log(
        `[Orchestrator] Prompt assembled:`,
        `system=${assembled.tokenEstimate.system} tokens`,
        `user=${assembled.tokenEstimate.user} tokens`,
        `total=${assembled.tokenEstimate.total} tokens`
    );

    return {
        systemPrompt: assembled.systemPrompt,
        userPrompt: assembled.userPrompt,
        repoUrl: context.scanMeta?.repoUrl || null,
        debug: {
            intent: intentResult.intent,
            confidence: intentResult.confidence,
            scanSpecific: intentResult.scanSpecific,
            extractedKeywords: intentResult.extractedKeywords,
            contextEmpty: context.isEmpty,
            tokenEstimate: assembled.tokenEstimate,
        },
    };
}

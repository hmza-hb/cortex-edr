// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI INTERACTION LOGGER
// Logs every Gemini call for full observability.
// Writes to /tmp during scan, saves to Supabase at end.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import { SupabaseClient } from '@supabase/supabase-js';

interface AIInteraction {
    timestamp: string;
    agentId: number;
    agentName: string;
    promptType: 'system' | 'user';
    prompt: string;
    response: string;
    responseLength: number;
    promptTokens: number;
    responseTokens: number;
    durationMs: number;
    [key: string]: any;
}

interface AILog {
    scanId: string;
    started: string;
    interactions: AIInteraction[];
}

export class AILogger {
    private scanId: string;
    private logFile: string;

    constructor(scanId: string) {
        this.scanId = scanId;
        this.logFile = `/tmp/cortex-ai-log-${scanId}.json`;
        this.initialize();
    }

    private initialize() {
        const log: AILog = {
            scanId: this.scanId,
            started: new Date().toISOString(),
            interactions: []
        };
        fs.writeFileSync(this.logFile, JSON.stringify(log, null, 2));
    }

    async logInteraction(
        agentId: number,
        agentName: string,
        prompt: string,
        response: string,
        durationMs: number,
        metadata: Record<string, any> = {}
    ) {
        try {
            const log: AILog = JSON.parse(fs.readFileSync(this.logFile, 'utf-8'));

            const interaction: AIInteraction = {
                timestamp: new Date().toISOString(),
                agentId,
                agentName,
                promptType: 'user',
                prompt: prompt.substring(0, 3000) + (prompt.length > 3000 ? '...[truncated]' : ''),
                response: response.substring(0, 5000) + (response.length > 5000 ? '...[truncated]' : ''),
                responseLength: response.length,
                promptTokens: Math.ceil(prompt.length / 4),
                responseTokens: Math.ceil(response.length / 4),
                durationMs,
                ...metadata
            };

            log.interactions.push(interaction);
            fs.writeFileSync(this.logFile, JSON.stringify(log, null, 2));

            // Console log for real-time server visibility
            console.log(`\n${'='.repeat(70)}`);
            console.log(`[AI] ${agentName} (Agent ${agentId}) - ${durationMs}ms`);
            console.log(`${'='.repeat(70)}`);
            console.log(`[AI] PROMPT (${interaction.promptTokens} tokens): ${prompt.substring(0, 200)}...`);
            console.log(`[AI] RESPONSE (${interaction.responseTokens} tokens): ${response.substring(0, 300)}...`);
            console.log(`${'='.repeat(70)}\n`);
        } catch (error) {
            console.error('[AILogger] Failed to log interaction:', error);
        }
    }

    async getFullLog(): Promise<AILog> {
        try {
            return JSON.parse(fs.readFileSync(this.logFile, 'utf-8'));
        } catch {
            return { scanId: this.scanId, started: '', interactions: [] };
        }
    }

    async saveToSupabase(supabase: SupabaseClient) {
        try {
            const log = await this.getFullLog();
            await supabase.from('ai_interaction_logs').insert({
                scan_id: this.scanId,
                log_data: log,
                created_at: new Date().toISOString()
            });
            console.log(`[AILogger] Saved ${log.interactions.length} interactions to Supabase`);
        } catch (error) {
            console.error('[AILogger] Failed to save to Supabase:', error);
        }
    }
}

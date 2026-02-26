export const OPENROUTER_MODELS: Record<string, Record<string, string>> = {
    vibe_coder: {
        recon: 'liquid/lfm-2-8b-a1b',           // $0.01/M - Fast
        security: 'qwen/qwq-32b-preview',       // $0.20/M - Good reasoning
        architecture: 'liquid/lfm-2-8b-a1b',    // $0.01/M - Fast
        quality: 'liquid/lfm-2-8b-a1b',         // $0.01/M - Fast
        debt: 'liquid/lfm-2-8b-a1b',            // $0.01/M - Fast
        ai_specific: 'liquid/lfm-2-8b-a1b',      // $0.01/M - Fast
        synthesis: 'qwen/qwen-2.5-72b'         // $0.40/M - Synthesis
    },
    developer: {
        recon: 'liquid/lfm-2-8b-a1b',           // $0.01/M
        security: 'deepseek/deepseek-r1',       // $0.55/M - Best reasoning
        architecture: 'qwen/qwen-2.5-72b',      // $0.40/M
        quality: 'liquid/lfm-2-8b-a1b',         // $0.01/M
        debt: 'liquid/lfm-2-8b-a1b',            // $0.01/M
        ai_specific: 'deepseek/deepseek-r1',     // $0.55/M
        synthesis: 'deepseek/deepseek-r1'      // $0.55/M - Best synthesis
    },
    teams: {
        recon: 'qwen/qwen-2.5-coder-32b',       // $0.20/M
        security: 'deepseek/deepseek-r1',       // $0.55/M
        architecture: '01-ai/yi-large',         // $0.30/M - Huge context
        quality: 'qwen/qwen-2.5-72b',           // $0.40/M
        debt: 'qwen/qwen-2.5-coder-32b',        // $0.20/M
        ai_specific: 'deepseek/deepseek-r1',     // $0.55/M
        synthesis: 'minimax/minimax-m2'         // $0.255/M - Great synthesis
    },
    enterprise: {
        recon: 'qwen/qwen-2.5-coder-32b',       // $0.20/M
        security: 'anthropic/claude-3.5-haiku', // $1.00/M - Best security
        architecture: '01-ai/yi-large',         // $0.30/M
        quality: 'qwen/qwen-2.5-72b',           // $0.40/M
        debt: 'qwen/qwen-2.5-coder-32b',        // $0.20/M
        ai_specific: 'deepseek/deepseek-r1',     // $0.55/M
        synthesis: 'anthropic/claude-3.5-haiku' // $1.00/M - Best reports
    }
};

export const FALLBACK_MODELS = [
    'liquid/lfm-2-8b-a1b',
    'qwen/qwen-2.5-72b',
    'mistralai/mistral-7b-instruct'
];

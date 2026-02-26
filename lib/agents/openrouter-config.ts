export const OPENROUTER_MODELS: Record<string, Record<string, string>> = {
    vibe_coder: {
        recon: 'liquid/lfm-2-8b-a1b',           // $0.01/M - Fast & Cheap
        security: 'mistralai/mistral-7b-instruct', // Free tier available
        architecture: 'liquid/lfm-2-8b-a1b',    // $0.01/M - Fast
        quality: 'liquid/lfm-2-8b-a1b',         // $0.01/M - Fast
        debt: 'liquid/lfm-2-8b-a1b',            // $0.01/M - Fast
        ai_specific: 'liquid/lfm-2-8b-a1b',      // $0.01/M - Fast
        synthesis: 'huggingfaceh4/zephyr-7b-beta' // Free tier available
    },
    developer: {
        recon: 'liquid/lfm-2-8b-a1b',           // $0.01/M
        security: 'mistralai/mistral-7b-instruct', // Free tier + good reasoning
        architecture: 'liquid/lfm-2-8b-a1b',      // $0.01/M
        quality: 'liquid/lfm-2-8b-a1b',         // $0.01/M
        debt: 'liquid/lfm-2-8b-a1b',            // $0.01/M
        ai_specific: 'mistralai/mistral-7b-instruct', // Free tier
        synthesis: 'liquid/lfm-2-8b-a1b'        // $0.01/M - Cost effective
    },
    teams: {
        recon: 'qwen/qwen-2.5-coder-32b',       // $0.20/M
        security: 'deepseek/deepseek-r1',       // $0.55/M - Best reasoning
        architecture: 'liquid/lfm-2-8b-a1b',    // $0.01/M - Cost effective
        quality: 'liquid/lfm-2-8b-a1b',         // $0.01/M
        debt: 'liquid/lfm-2-8b-a1b',            // $0.01/M
        ai_specific: 'mistralai/mistral-7b-instruct', // Free tier
        synthesis: 'qwen/qwen-2.5-72b'         // $0.40/M - Good synthesis
    },
    enterprise: {
        recon: 'qwen/qwen-2.5-coder-32b',       // $0.20/M
        security: 'deepseek/deepseek-r1',       // $0.55/M - Best security
        architecture: 'liquid/lfm-2-8b-a1b',    // $0.01/M - Cost effective
        quality: 'qwen/qwen-2.5-72b',           // $0.40/M
        debt: 'liquid/lfm-2-8b-a1b',            // $0.01/M
        ai_specific: 'deepseek/deepseek-r1',     // $0.55/M
        synthesis: 'anthropic/claude-3.5-haiku' // $1.00/M - Best reports
    }
};

export const FALLBACK_MODELS = [
    'liquid/lfm-2-8b-a1b',           // Super cheap at $0.01/M
    'mistralai/mistral-7b-instruct',  // Often has free tier
    'huggingfaceh4/zephyr-7b-beta',   // Free tier available
    'microsoft/wizardlm-2-8x22b',    // Good performance, low cost
    'openchat/openchat-7b'            // Free tier option
];

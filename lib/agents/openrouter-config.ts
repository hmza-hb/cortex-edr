export const OPENROUTER_MODELS: Record<string, Record<string, string>> = {
    vibe_coder: {
        recon: 'gpt-4o-mini',
        security: 'gpt-4o-mini',
        architecture: 'gpt-4o-mini',
        quality: 'gpt-4o-mini',
        debt: 'gpt-4o-mini',
        ai_specific: 'gpt-4o-mini',
        synthesis: 'gpt-4o-mini'
    },
    developer: {
        recon: 'gpt-4o-mini',
        security: 'gpt-4o-mini',
        architecture: 'gpt-4o-mini',
        quality: 'gpt-4o-mini',
        debt: 'gpt-4o-mini',
        ai_specific: 'gpt-4o-mini',
        synthesis: 'gpt-4o-mini'
    },
    teams: {
        recon: 'gpt-4o-mini',
        security: 'gpt-4o',
        architecture: 'gpt-4o-mini',
        quality: 'gpt-4o-mini',
        debt: 'gpt-4o-mini',
        ai_specific: 'gpt-4o',
        synthesis: 'gpt-4o'
    },
    enterprise: {
        recon: 'gpt-4o',
        security: 'gpt-4o',
        architecture: 'gpt-4o',
        quality: 'gpt-4o',
        debt: 'gpt-4o',
        ai_specific: 'gpt-4o',
        synthesis: 'gpt-4o'
    }
};

export const FALLBACK_MODELS = [
    'gpt-4o-mini',
    'gpt-4o',
    'liquid/lfm-2-8b-a1b',
    'mistralai/mistral-7b-instruct'
];

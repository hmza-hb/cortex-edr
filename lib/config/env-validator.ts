/**
 * env-validator.ts
 * Startup-time environment variable validation.
 * Call `validateEnv()` in any server entry point to fail fast on misconfiguration.
 */

interface EnvSpec {
    key: string;
    required: boolean;
    minLength?: number;
    description: string;
}

const ENV_SPECS: EnvSpec[] = [
    { key: 'NEXTAUTH_SECRET', required: true, minLength: 32, description: 'NextAuth JWT signing secret' },
    { key: 'NEXT_PUBLIC_SUPABASE_URL', required: true, description: 'Supabase project URL' },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', required: true, minLength: 100, description: 'Supabase service role key' },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true, minLength: 100, description: 'Supabase anon key' },
    { key: 'NEXTAUTH_URL', required: true, description: 'Canonical application URL' },
    { key: 'GITHUB_ID', required: false, description: 'GitHub OAuth client ID' },
    { key: 'GITHUB_SECRET', required: false, description: 'GitHub OAuth client secret' },
    { key: 'GOOGLE_CLIENT_ID', required: false, description: 'Google OAuth client ID' },
    { key: 'GOOGLE_CLIENT_SECRET', required: false, description: 'Google OAuth client secret' },
    { key: 'RESEND_API_KEY', required: false, description: 'Resend email API key' },
    { key: 'PADDLE_API_KEY', required: false, description: 'Paddle payments API key' },
    { key: 'PADDLE_WEBHOOK_SECRET', required: false, description: 'Paddle webhook signing secret' },
];

export function validateEnv(): void {
    if (process.env.NODE_ENV === 'test') return;

    const errors: string[] = [];

    for (const spec of ENV_SPECS) {
        const value = process.env[spec.key];

        if (spec.required && !value) {
            errors.push(`[ENV] MISSING REQUIRED: ${spec.key} — ${spec.description}`);
            continue;
        }

        if (value && spec.minLength && value.length < spec.minLength) {
            errors.push(
                `[ENV] INSUFFICIENT ENTROPY: ${spec.key} is ${value.length} chars (min: ${spec.minLength}) — ${spec.description}`
            );
        }
    }

    if (errors.length > 0) {
        const message = [
            '════════════════════════════════════════',
            '  STARTUP FAILED — Environment Invalid  ',
            '════════════════════════════════════════',
            ...errors,
            '════════════════════════════════════════',
        ].join('\n');

        console.error(message);
        throw new Error(`Configuration error: ${errors.length} environment variable(s) invalid. See logs.`);
    }
}

/**
 * Returns a redacted view of all environment variables for safe audit logging.
 */
export function getRedactedEnvSummary(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const spec of ENV_SPECS) {
        const value = process.env[spec.key];
        if (!value) {
            result[spec.key] = '[NOT SET]';
        } else if (value.length > 8) {
            result[spec.key] = `${value.slice(0, 4)}...${value.slice(-4)} (len=${value.length})`;
        } else {
            result[spec.key] = '[SET]';
        }
    }
    return result;
}

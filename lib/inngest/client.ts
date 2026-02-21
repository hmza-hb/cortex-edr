import { Inngest } from 'inngest';

// Force the environment to use the base environment instead of Vercel branch environments 
// which are causing "404 Branch environment does not exist" errors.
// We aggressively delete the Vercel branch variable so the SDK's internal checks fail
// and it falls back to the explicitly defined env string.
if (typeof process !== 'undefined' && process.env) {
    delete process.env.VERCEL_GIT_COMMIT_REF;
    delete process.env.INNGEST_BRANCH;
}

export const inngest = new Inngest({
    id: 'cortex-edr',
    env: process.env.INNGEST_ENV || 'production'
});

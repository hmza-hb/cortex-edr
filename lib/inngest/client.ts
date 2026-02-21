import { Inngest } from 'inngest';

// Explicitly set the environment to production to bypass Vercel branch preview environments.
// We also use a vercel.json file to strip "VERCEL_GIT_COMMIT_REF" during build/runtime.
export const inngest = new Inngest({
    id: 'cortex-edr',
    env: process.env.INNGEST_ENV || 'production'
});

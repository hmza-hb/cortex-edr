import { Inngest } from 'inngest';

// Force the environment to use the base environment instead of Vercel branch environments 
// which are causing "404 Branch environment does not exist" errors.
export const inngest = new Inngest({
    id: 'cortex-edr',
    env: process.env.INNGEST_ENV || 'production'
});

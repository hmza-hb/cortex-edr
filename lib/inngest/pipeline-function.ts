import { inngest } from './client';
import { runPipeline } from '@/lib/agents/pipeline';

export const pipelineFunction = inngest.createFunction(
    { id: 'scan-pipeline', retries: 0 },
    { event: 'scan/start' },
    async ({ event, step }) => {
        const { scanId, repoUrl } = event.data as { scanId: string; repoUrl: string };

        // Inngest calls your Vercel function per step — each gets its own fresh
        // execution window (no more being killed at 10s mid-pipeline).
        // runPipeline is broken into steps so Inngest can schedule each one.
        await step.run('git-connect-and-pipeline', async () => {
            await runPipeline(scanId, repoUrl);
        });
    }
);

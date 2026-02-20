import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import { pipelineFunction } from '@/lib/inngest/pipeline-function';

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [pipelineFunction],
});

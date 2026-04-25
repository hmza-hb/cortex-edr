import { NextRequest } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAuditLog } from '@/lib/security/auditLog';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: scanId } = await params;

    if (!scanId) {
        return new Response('Scan ID is required', { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        await createAuditLog({ action: 'scan_status_blocked', actor_id: 'anonymous', resource_id: scanId, status: 'denied' });
        return new Response('Unauthorized', { status: 401 });
    }
    const userId = (session.user as any).id;

    // Verify ownership before opening stream
    const { data: scanCheck } = await supabaseService
        .from('scans')
        .select('user_id')
        .eq('id', scanId)
        .single();
        
    if (!scanCheck || scanCheck.user_id !== userId) {
        await createAuditLog({ action: 'scan_status_blocked', actor_id: userId, actor_email: session.user.email || undefined, resource_id: scanId, status: 'denied' });
        return new Response('Forbidden', { status: 403 });
    }

    const responseHeaders = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
    };

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            // Functing to send SSE message
            const sendMessage = (data: any) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            // 1. Initial status fetch
            const { data: scan } = await supabaseService
                .from('scans')
                .select('*')
                .eq('id', scanId)
                .single();

            if (scan) {
                sendMessage({ type: 'initial_status', scan });
            }

            // 2. Subscribe to agent_events for this scan
            const channel = supabaseService
                .channel(`scan_events:${scanId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'agent_events',
                        filter: `scan_id=eq.${scanId}`,
                    },
                    (payload) => {
                        sendMessage({ type: 'agent_update', ...payload.new });
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'scans',
                        filter: `id=eq.${scanId}`,
                    },
                    (payload) => {
                        if (payload.new.status === 'completed' || payload.new.status === 'failed') {
                            sendMessage({ type: 'scan_status_change', ...payload.new });
                        }
                    }
                )
                .subscribe();

            // Keep connection alive with heartbeat
            const heartbeat = setInterval(() => {
                sendMessage({ type: 'heartbeat', timestamp: Date.now() });
            }, 15000);

            // 3. Clean up on close
            req.signal.onabort = () => {
                clearInterval(heartbeat);
                supabaseService.removeChannel(channel);
                controller.close();
            };
        },
    });

    return new Response(stream, { headers: responseHeaders });
}

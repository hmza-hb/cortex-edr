import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AgentStatus } from '@/types/agent';

export interface UIEvent {
    id: string;
    agentId: number;
    agentName: string;
    type: string;
    message: string;
    timestamp: number;
}

export function useSSEScan(scanId: string) {
    const supabase = createClient();
    const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
    const [agentStates, setAgentStates] = useState<Record<number, AgentStatus>>({
        0: 'idle', 1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle', 6: 'idle', 7: 'idle'
    });
    const [activityFeed, setActivityFeed] = useState<UIEvent[]>([]);
    const [score, setScore] = useState<number | null>(null);
    const [issuesCount, setIssuesCount] = useState(0);
    const [repoName, setRepoName] = useState<string>('');
    const [cloningProgress, setCloningProgress] = useState<number>(0);
    const processedEventIds = useRef<Set<string>>(new Set());
    const lastEventCount = useRef(0);

    useEffect(() => {
        if (!scanId) return;

        let isSubscribed = true;

        const fetchInitialStatus = async () => {
            const { data: scan } = await supabase
                .from('scans')
                .select('*')
                .eq('id', scanId)
                .single();

            if (scan && isSubscribed) {
                setStatus(scan.status);
                setScore(scan.score);
                setRepoName(scan.repo_name || scan.repo_url || '');

                const newStates: Record<number, AgentStatus> = {};
                for (let i = 0; i <= 7; i++) {
                    if (scan.current_agent > i) newStates[i] = 'completed';
                    else if (scan.current_agent === i && (scan.status === 'processing' || scan.status === 'running')) newStates[i] = 'active';
                    else newStates[i] = 'idle';
                }
                setAgentStates(newStates);
            }

            const { data: events } = await supabase
                .from('agent_events')
                .select('*')
                .eq('scan_id', scanId)
                .order('created_at', { ascending: true });

            if (events && isSubscribed) {
                events.forEach(event => handleEvent(event));
                lastEventCount.current = events.length;
            }
        };

        fetchInitialStatus();

        // POLLING FALLBACK - Poll every 500ms for new events
        const pollInterval = setInterval(async () => {
            if (!isSubscribed) return;

            const { data: events } = await supabase
                .from('agent_events')
                .select('*')
                .eq('scan_id', scanId)
                .order('created_at', { ascending: true });

            if (events && events.length > lastEventCount.current) {
                console.log('[POLL] Found', events.length - lastEventCount.current, 'new events');
                events.slice(lastEventCount.current).forEach(event => handleEvent(event));
                lastEventCount.current = events.length;
            }

            // Also check scan status
            const { data: scan } = await supabase
                .from('scans')
                .select('status, score, current_agent')
                .eq('id', scanId)
                .single();

            if (scan && isSubscribed) {
                setStatus(scan.status);
                if (scan.score) setScore(scan.score);

                if (scan.status === 'completed') {
                    setAgentStates({
                        0: 'completed', 1: 'completed', 2: 'completed', 3: 'completed',
                        4: 'completed', 5: 'completed', 6: 'completed', 7: 'completed'
                    });
                    clearInterval(pollInterval);
                }
            }
        }, 500);

        // Try Realtime subscription as well
        const eventsChannel = supabase
            .channel(`agent-events-${scanId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'agent_events',
                    filter: `scan_id=eq.${scanId}`,
                },
                (payload) => {
                    console.log('[REALTIME] Event:', payload.new);
                    handleEvent(payload.new);
                }
            )
            .subscribe((subStatus) => {
                console.log('[REALTIME] Subscription:', subStatus);
            });

        return () => {
            isSubscribed = false;
            clearInterval(pollInterval);
            supabase.removeChannel(eventsChannel);
        };
    }, [scanId]);

    const handleEvent = (event: any) => {
        if (processedEventIds.current.has(event.id)) return;
        processedEventIds.current.add(event.id);

        const agentId = event.agent_id;
        const eventType = event.event_type;
        const message = event.message;

        setActivityFeed(prev => {
            const newEvent: UIEvent = {
                id: event.id,
                agentId,
                agentName: event.agent_name,
                type: eventType,
                message: message,
                timestamp: Date.now()
            };
            return [...prev, newEvent].slice(-100);
        });

        setAgentStates(prev => {
            const next = { ...prev };

            if (eventType === 'started') {
                next[agentId] = 'active';
                for (let i = 0; i < agentId; i++) {
                    next[i] = 'completed';
                }
            }
            if (eventType === 'completed') next[agentId] = 'completed';
            if (eventType === 'error') next[agentId] = 'error';

            return next;
        });

        if (eventType === 'found_issue') {
            setIssuesCount(prev => prev + 1);
        }

        if (agentId === 0 && eventType === 'processing' && event.data?.progress) {
            setCloningProgress(event.data.progress);
        }
    };

    return {
        status,
        agentStates,
        activityFeed,
        score,
        issuesCount,
        repoName,
        cloningProgress
    };
}

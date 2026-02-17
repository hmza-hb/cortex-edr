import { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (!scanId) return;

        // Fetch initial scan status
        const fetchInitialStatus = async () => {
            const { data: scan } = await supabase
                .from('scans')
                .select('*')
                .eq('id', scanId)
                .single();

            if (scan) {
                setStatus(scan.status);
                setScore(scan.score);
                setRepoName(scan.repo_name || scan.repo_url || '');

                // Set initial agent states based on current_agent
                const newStates: Record<number, AgentStatus> = {};
                for (let i = 0; i <= 7; i++) {
                    if (scan.current_agent > i) newStates[i] = 'completed';
                    else if (scan.current_agent === i && scan.status === 'processing') newStates[i] = 'active';
                    else newStates[i] = 'idle';
                }
                setAgentStates(newStates);
            }

            // Fetch existing events
            const { data: events } = await supabase
                .from('agent_events')
                .select('*')
                .eq('scan_id', scanId)
                .order('created_at', { ascending: true });

            if (events) {
                for (const event of events) {
                    handleEvent(event);
                }
            }
        };

        fetchInitialStatus();

        // Subscribe to real-time changes on agent_events table
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
                    console.log('📡 Received event:', payload.new);
                    handleEvent(payload.new);
                }
            )
            .subscribe((status) => {
                console.log('📡 Subscription status:', status);
            });

        // Subscribe to scans table for status updates
        const scansChannel = supabase
            .channel(`scan-status-${scanId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'scans',
                    filter: `id=eq.${scanId}`,
                },
                (payload) => {
                    console.log('📡 Scan updated:', payload.new);
                    const scan = payload.new as any;
                    setStatus(scan.status);
                    if (scan.score) setScore(scan.score);
                    if (scan.status === 'completed') {
                        // Mark all agents as completed
                        setAgentStates({
                            0: 'completed', 1: 'completed', 2: 'completed', 3: 'completed',
                            4: 'completed', 5: 'completed', 6: 'completed', 7: 'completed'
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(eventsChannel);
            supabase.removeChannel(scansChannel);
        };
    }, [scanId]);

    const handleEvent = (event: any) => {
        const agentId = event.agent_id;
        const eventType = event.event_type;
        const message = event.message;

        // Deduplicate events to prevent React key errors
        setActivityFeed(prev => {
            if (prev.some(e => e.id === event.id)) return prev;

            const newEvent: UIEvent = {
                id: event.id || `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                agentId,
                agentName: event.agent_name,
                type: eventType,
                message: message,
                timestamp: Date.now()
            };
            return [...prev, newEvent].slice(-100);
        });

        // Update agent state
        setAgentStates(prev => {
            const next = { ...prev };

            if (eventType === 'started') {
                next[agentId] = 'active';
                // Mark previous agents as completed
                for (let i = 0; i < agentId; i++) {
                    next[i] = 'completed';
                }
            }
            if (eventType === 'completed') next[agentId] = 'completed';
            if (eventType === 'error') next[agentId] = 'error';

            return next;
        });

        // Count issues
        if (eventType === 'found_issue') {
            setIssuesCount(prev => prev + 1);
        }
    };

    return {
        status,
        agentStates,
        activityFeed,
        score,
        issuesCount,
        repoName
    };
}

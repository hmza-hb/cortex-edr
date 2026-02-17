import { useState, useEffect, useCallback } from 'react';
import { AgentStatus, AgentUpdate, ScanCompleteEvent } from '@/types/agent';

export interface UIEvent {
    id: string;
    agentId: number;
    agentName: string;
    type: string;
    message: string;
    timestamp: number;
}

export function useSSEScan(scanId: string) {
    const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
    const [agentStates, setAgentStates] = useState<Record<number, AgentStatus>>({
        1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle', 6: 'idle', 7: 'idle'
    });
    const [activityFeed, setActivityFeed] = useState<UIEvent[]>([]);
    const [score, setScore] = useState<number | null>(null);
    const [issuesCount, setIssuesCount] = useState(0);
    const [repoName, setRepoName] = useState<string>('');

    useEffect(() => {
        if (!scanId) return;

        const eventSource = new EventSource(`/api/scan/status/${scanId}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'initial_status') {
                setStatus(data.scan.status);
                setScore(data.scan.score);
                setRepoName(data.scan.repo_name || '');
                // Map current_agent to states
                const newStates: Record<number, AgentStatus> = {};
                for (let i = 1; i <= 7; i++) {
                    if (i < data.scan.current_agent) newStates[i] = 'completed';
                    else if (i === data.scan.current_agent) newStates[i] = data.scan.status === 'processing' ? 'active' : 'idle';
                    else newStates[i] = 'idle';
                }
                setAgentStates(newStates);
            }

            if (data.type === 'agent_update') {
                const agentId = data.agent_id;

                // Update agent state based on event type
                setAgentStates(prev => {
                    const next = { ...prev };
                    if (data.event_type === 'started') next[agentId] = 'active';
                    if (data.event_type === 'completed') next[agentId] = 'completed';
                    if (data.event_type === 'error') next[agentId] = 'error';

                    // Set previous agent to completed if this one started
                    if (data.event_type === 'started' && agentId > 1) {
                        next[agentId - 1] = 'completed';
                    }

                    return next;
                });

                // Add to activity feed
                const newEvent: UIEvent = {
                    id: data.id || `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    agentId,
                    agentName: data.agent_name,
                    type: data.event_type,
                    message: data.message,
                    timestamp: Date.now()
                };
                setActivityFeed(prev => [newEvent, ...prev].slice(0, 50));

                if (data.event_type === 'found_issue') {
                    setIssuesCount(prev => prev + 1);
                }
            }

            if (data.type === 'scan_status_change') {
                setStatus(data.status);
                if (data.score) setScore(data.score);
                if (data.status === 'completed') {
                    setAgentStates(prev => {
                        const next = { ...prev };
                        Object.keys(next).forEach(k => next[Number(k)] = 'completed');
                        return next;
                    });
                }
            }
        };

        eventSource.onerror = (err) => {
            console.error('SSE Error:', err);
            // Don't close immediately, let it attempt reconnection
        };

        return () => {
            eventSource.close();
        };
    }, [scanId]);

    return {
        status,
        agentStates,
        activityFeed,
        score,
        issuesCount,
        repoName
    };
}

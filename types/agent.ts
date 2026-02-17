export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type AgentStatus = 'idle' | 'waiting' | 'active' | 'completed' | 'error';
export type EventType = 'started' | 'processing' | 'found_issue' | 'completed' | 'error';

export interface Issue {
    id?: string;
    scan_id: string;
    agent_id: number;
    category: 'security' | 'architecture' | 'quality' | 'tech_debt' | 'ai_specific';
    severity: Severity;
    title: string;
    description: string;
    file_path?: string;
    line_number?: number;
    code_snippet?: string;
    fix_suggestion?: string;
    ai_prompt?: string;
}

export interface AgentEvent {
    scan_id: string;
    agent_id: number;
    agent_name: string;
    event_type: EventType;
    message: string;
    data?: any;
}

export interface TechStack {
    languages: string[];
    frameworks: string[];
    dependencies: Record<string, string>;
}

export interface SharedMemory {
    scanId: string;
    repoPath: string;
    repoUrl: string;
    fileTree: any[];
    techStack: TechStack;
    issues: Issue[];
    summary?: string;
    score?: number;
}

export interface AgentUpdate {
    type: 'agent_update';
    agentId: number;
    agentName: string;
    status: AgentStatus;
    message: string;
    filesProcessed?: number;
    totalFiles?: number;
    issuesFound?: number;
}

export interface ScanCompleteEvent {
    type: 'scan_complete';
    score: number;
    totalIssues: number;
}

export interface EnterpriseIssue {
    // Basic Info
    id: string
    title: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    category: string
    agentName: string

    // Location
    file: string
    line: number
    codeSnippet: string

    // Analysis (what we found)
    whatWeFound: string
    searchingFor: string // what the agent was looking for

    // Impact Analysis (why this matters)
    impact: {
        definite: string[] // Will definitely cause
        likely: string[] // Probably will cause
        reported: string[] // Common problems reported
        possible: string[] // Might cause
    }

    // Solution (fix instructions)
    solution: {
        must: Array<{ action: string, reason: string }>
        should: Array<{ action: string, reason: string }>
        goodToHave: Array<{ action: string, reason: string }>
        niceToHave: Array<{ action: string, reason: string }>
    }

    // AI Fix Prompts
    aiPrompts: {
        cursor: string
        chatgpt: string
        claude: string
    }

    // Metadata
    metadata?: {
        cwe?: string
        owasp?: string
        cvss?: string
        references?: string[]
        effort?: string
        roi?: string
    }
    estimatedTimeToFix: string
    roi: string // Return on investment of fixing this
}

export interface ExecutiveReport {
    // High-Level Summary
    overallScore: number
    riskLevel: 'Critical' | 'High' | 'Medium' | 'Low'
    totalIssues: number

    // Executive Summary
    executiveSummary: {
        overview: string // 2-3 sentences for C-level
        keyFindings: string[] // 3-5 bullet points
        recommendedActions: string[] // Top 3 immediate actions
        businessImpact: string // How this affects the business
    }

    // Detailed Analysis
    technicalAnalysis: {
        architecture: string
        securityPosture: string
        codeQuality: string
        maintainability: string
    }

    // Risk Matrix
    issueBreakdown: {
        critical: number
        high: number
        medium: number
        low: number
    }

    // Prioritization
    topPriorities: EnterpriseIssue[]
}

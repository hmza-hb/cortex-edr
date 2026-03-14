// ============================================================
// CORTEX EDR — Enterprise Report Types
// ============================================================

export interface EnterpriseIssue {
    // Basic Info
    id: string
    title: string
    severity: 'critical' | 'high' | 'medium' | 'low' | 'informational'
    category: string
    agentName: string

    // Finding ID (e.g. SEC-001)
    findingId?: string

    // CVSS & Standards
    cvssScore?: number
    cvssVector?: string
    owaspCategory?: string    // e.g. "A03:2021 Injection"
    cweId?: string            // e.g. "CWE-89"
    mitreAttack?: string      // e.g. "T1190 Exploit Public-Facing Application"

    // Location
    file: string
    line: number
    codeSnippet: string
    endpoint?: string
    functionName?: string

    // Analysis
    whatWeFound: string
    searchingFor: string

    // Description (technical)
    description?: string

    // Impact Analysis
    impact: {
        definite: string[]
        likely: string[]
        reported: string[]
        possible: string[]
    }

    // Business Impact
    businessImpact?: {
        revenueRisk?: string
        reputationDamage?: string
        compliancePenalties?: string
    }

    // Exploitation Scenario
    exploitationScenario?: string

    // Likelihood
    likelihood?: {
        publicExposure?: boolean
        authRequired?: boolean
        skillLevel?: 'Low' | 'Medium' | 'High'
    }

    // Root Cause
    rootCause?: string

    // Solution
    solution: {
        must: Array<{ action: string; reason: string }>
        should: Array<{ action: string; reason: string }>
        goodToHave: Array<{ action: string; reason: string }>
        niceToHave: Array<{ action: string; reason: string }>
    }

    // References
    references?: string[]
    cveIds?: string[]

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
    roi: string
}

export interface ComplianceControl {
    control: string
    framework: string
    status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable'
    gap?: string
    risk: 'critical' | 'high' | 'medium' | 'low'
}

export interface RemediationItem {
    title: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    effort: 'low' | 'medium' | 'high'
    team: string
    dueWindow: 'immediate' | 'short' | 'mid' | 'long'
    description: string
}

export interface MaturityDomain {
    domain: string
    level: number    // 1–5
    maxLevel: 5
    description: string
}

export interface ExecutiveReport {
    // High-Level Summary
    overallScore: number
    riskLevel: 'Critical' | 'High' | 'Medium' | 'Low'
    totalIssues: number

    // Engagement metadata
    engagement?: {
        title?: string
        version?: string
        classification?: 'Confidential' | 'Internal' | 'Restricted' | 'Public'
        preparedBy?: string
        organizationName?: string
    }

    // Executive Summary
    executiveSummary: {
        overview: string
        keyFindings: string[]
        recommendedActions: string[]
        businessImpact: string
        securityPostureRating?: string      // e.g. "Critical / High Risk"
        breachLikelihood?: string
        estimatedFinancialImpact?: string
        regulatoryExposure?: string[]       // e.g. ["GDPR", "SOC 2"]
        remediationTimeline?: string        // high-level timeline
        top5BusinessRisks?: string[]
    }

    // Issue Breakdown
    issueBreakdown: {
        critical: number
        high: number
        medium: number
        low: number
        informational?: number
    }

    // Detailed Analysis
    technicalAnalysis: {
        architecture: string
        securityPosture: string
        codeQuality: string
        maintainability: string
    }

    // Engagement Scope
    scope?: {
        applicationsAssessed?: string[]
        repositoriesAnalyzed?: string[]
        apis?: string[]
        cloudEnvironments?: string[]
        exclusions?: string[]
    }

    // Attack Surface
    attackSurface?: {
        publicEndpoints?: string[]
        adminPanels?: string[]
        externalIntegrations?: string[]
        thirdPartyDependencies?: string[]
        openPorts?: string[]
        secretsExposure?: string[]
    }

    // Codebase Analysis
    codeSecurity?: {
        secureCodingMaturity?: string
        inputValidation?: string
        authenticationHandling?: string
        authorizationLogic?: string
        loggingHygiene?: string
        errorHandling?: string
        architecturalWeaknesses?: string
        dependencyRiskSummary?: string
        secretsManagement?: string
    }

    // Infrastructure
    infrastructureSecurity?: {
        cicdPipeline?: string
        containerSecurity?: string
        cloudIAM?: string
        networkSegmentation?: string
        wafUsage?: string
        loggingMonitoring?: string
        backupRecovery?: string
    }

    // Threat Modeling
    threatModeling?: {
        strideAnalysis?: string
        killChainAnalysis?: string
        mitreAttackMapping?: string
        scenarios?: Array<{
            name: string
            description: string
            likelihood: string
        }>
    }

    // Compliance
    complianceGaps?: ComplianceControl[]

    // Remediation Roadmap
    remediationRoadmap?: RemediationItem[]

    // Security Maturity
    maturityAssessment?: MaturityDomain[]

    // Conclusion
    conclusion?: {
        overallStatement?: string
        productionSafe?: boolean
        immediateRedFlags?: string[]
        strategicRecommendations?: string[]
    }

    // Prioritization
    topPriorities: EnterpriseIssue[]

    // Report Metadata
    reportVersion?: string
    analystName?: string
    attestation?: string

    // UI Metadata
    architectureMap?: string
    applicationStory?: string
    annotatedFileTree?: Array<{ path: string; tag?: string; annotation?: string }>
}

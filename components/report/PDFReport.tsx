import React from 'react';
import { Document, Font } from '@react-pdf/renderer';
import { Issue } from '@/types/agent';
import { ExecutiveReport } from '@/types/report';

import { CoverPage, TOCPage } from './pdf/CoverAndTOC';
import { ExecSummaryPage, EngagementPage, PosturePage } from './pdf/Sections2to4';
import { FindingPage } from './pdf/Section5Findings';
import {
    CodebasePage, InfraPage, ThreatModelPage, CompliancePage,
    RoadmapPage, MaturityPage, ConclusionPage, AppendicesPage
} from './pdf/Sections6to12';

// Register fonts if needed (Helvetica is standard, but you can add custom ones here)
Font.register({
    family: 'Helvetica-Bold',
    src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCgSQ22sZhcl.ttf', // Fallback, standard PDF fonts usually don't need registering unless custom
});

interface PDFReportProps {
    scan: any;
    issues: Issue[];
    enterpriseReport?: ExecutiveReport;
    tierKey?: string;
}

export const PDFReport: React.FC<PDFReportProps> = ({ scan, issues, enterpriseReport, tierKey = 'VIBE_CODER' }) => {
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const isFreeTier = tierKey === 'VIBE_CODER';

    // Sort issues by severity for the Detailed Findings section
    const sortedIssues = [...issues].sort((a, b) => {
        const severityRank = { critical: 4, high: 3, medium: 2, low: 1, informational: 0 };
        const rankA = severityRank[(a.severity as keyof typeof severityRank) || 'low'] || 0;
        const rankB = severityRank[(b.severity as keyof typeof severityRank) || 'low'] || 0;
        return rankB - rankA;
    });

    return (
        <Document title={`Cortex Audit - ${scan?.id || 'Report'}`} author="CortexEDR" subject="Enterprise Security Audit Report">
            <CoverPage scan={scan} enterpriseReport={enterpriseReport} date={date} issueCount={issues.length} />
            <TOCPage date={date} />
            <ExecSummaryPage scan={scan} issues={issues} enterpriseReport={enterpriseReport} date={date} />
            <EngagementPage enterpriseReport={enterpriseReport} scan={scan} date={date} />
            <PosturePage issues={issues} enterpriseReport={enterpriseReport} date={date} />

            {sortedIssues.map((issue, idx) => (
                <FindingPage
                    key={issue.id || idx}
                    issue={issue}
                    idx={idx}
                    total={sortedIssues.length}
                    date={date}
                    showWatermark={isFreeTier}
                />
            ))}

            <CodebasePage enterpriseReport={enterpriseReport} date={date} />
            <InfraPage enterpriseReport={enterpriseReport} date={date} />
            <ThreatModelPage enterpriseReport={enterpriseReport} date={date} />
            <CompliancePage enterpriseReport={enterpriseReport} date={date} />
            <RoadmapPage enterpriseReport={enterpriseReport} issues={issues} date={date} />
            <MaturityPage enterpriseReport={enterpriseReport} date={date} />
            <ConclusionPage enterpriseReport={enterpriseReport} scan={scan} date={date} />
            <AppendicesPage issues={sortedIssues} date={date} />
        </Document>
    );
};

/**
 * PDFReport — Cortex EDR Security Audit Report
 *
 * Structure (4 sections, nothing extra):
 *   1. Cover Page
 *   2. Executive Summary
 *   3. Findings (one page per confirmed issue)
 *   4. Remediation Roadmap + Conclusion
 */
import React from 'react';
import { Document } from '@react-pdf/renderer';
import { Issue } from '@/types/agent';
import { ExecutiveReport, EnterpriseIssue } from '@/types/report';

import { CoverPage } from './pdf/CoverAndTOC';
import { ExecSummaryPage, RoadmapAndConclusionPage } from './pdf/Sections2to4';
import { FindingPage } from './pdf/Section5Findings';

// NOTE: Do NOT register web fonts here — fetching from Google CDN at PDF render
// time causes 60-90 second hangs. Helvetica (built-in to react-pdf) is used instead.

interface PDFReportProps {
    scan: any;
    issues: Issue[];
    enterpriseReport?: ExecutiveReport;
    tierKey?: string;
}

export const PDFReport: React.FC<PDFReportProps> = ({
    scan,
    issues,
    enterpriseReport,
    tierKey = 'SCOUT',
}) => {
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const isFreeTier = tierKey === 'SCOUT';

    // Sort issues: critical → high → medium → low
    const severityRank: Record<string, number> = {
        critical: 4, high: 3, medium: 2, low: 1, informational: 0,
    };

    let sortedIssues: Array<Issue & Partial<EnterpriseIssue>> = [...issues].sort((a, b) =>
        (severityRank[b.severity as string] || 0) - (severityRank[a.severity as string] || 0)
    );

    // Merge deep analysis data from topPriorities into each issue card
    if (enterpriseReport?.topPriorities) {
        sortedIssues = sortedIssues.map(issue => {
            const enriched = enterpriseReport.topPriorities.find(
                (p: any) => p.issueId === issue.id || p.title === issue.title
            );
            return (enriched ? { ...issue, ...enriched } : issue) as any;
        });
    }

    return (
        <Document
            title={`Cortex EDR Security Audit — ${scan?.id || 'Report'}`}
            author="Cortex EDR"
            subject="Application Security Assessment"
            keywords="security, audit, vulnerabilities, cortex"
        >
            {/* 1. Cover */}
            <CoverPage
                scan={scan}
                enterpriseReport={enterpriseReport}
                date={date}
                issueCount={issues.length}
            />

            {/* 2. Executive Summary */}
            <ExecSummaryPage
                scan={scan}
                issues={issues}
                enterpriseReport={enterpriseReport}
                date={date}
            />

            {/* 3. One page per finding */}
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

            {/* 4. Roadmap + Conclusion */}
            <RoadmapAndConclusionPage
                scan={scan}
                enterpriseReport={enterpriseReport}
                issues={issues}
                date={date}
            />
        </Document>
    );
};

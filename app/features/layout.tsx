import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Features',
    description: 'Explore Cortex EDR capabilities — 7-agent AI security pipeline, real-time scan visualization, comprehensive reports, AI chat advisor, multi-language support, and GitHub integration.',
    openGraph: {
        title: 'Features | Cortex EDR',
        description: 'Explore everything Cortex EDR offers — from 7-agent AI scanning to real-time visualization and comprehensive security reports.',
        url: 'https://cortex-edr.com/features',
    },
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}

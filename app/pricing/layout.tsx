import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pricing',
    description: 'Compare Cortex EDR security scanning plans — Scout (free), Sentinel, Guardian, and Fortress. Transparent pricing with no hidden fees. Start scanning for free.',
    openGraph: {
        title: 'Pricing | Cortex EDR',
        description: 'Compare Cortex EDR plans — from free public repo scanning to enterprise-grade dedicated security. Transparent pricing.',
        url: 'https://cortex-edr.com/pricing',
    },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}

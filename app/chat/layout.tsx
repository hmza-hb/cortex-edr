import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Cortex Chat",
    description: "AI-powered security advisor for your codebase. Ask questions about vulnerabilities, get fix suggestions, and understand your security posture with context-aware conversations.",
    openGraph: {
        title: 'Cortex Chat | Cortex EDR',
        description: 'AI security advisor — ask questions about your codebase vulnerabilities and get actionable fix suggestions.',
        url: 'https://cortex-edr.com/chat',
    },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return <div className="h-screen w-screen bg-zinc-950 text-zinc-100">{children}</div>;
}

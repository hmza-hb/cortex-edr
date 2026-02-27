export const metadata = {
    title: "Cortex Chat"
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return <div className="h-screen w-screen bg-zinc-950 text-zinc-100">{children}</div>;
}

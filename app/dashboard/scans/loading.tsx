export default function ScansLoading() {
    return (
        <div className="w-full space-y-6 animate-pulse">
            <div className="space-y-2">
                <div className="h-7 w-40 bg-zinc-800/60 rounded-lg" />
                <div className="h-4 w-64 bg-zinc-900/60 rounded-md" />
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
                <div className="h-14 bg-zinc-800/30 border-b border-zinc-800/50 px-6 flex items-center gap-3">
                    <div className="h-3 w-24 bg-zinc-700/60 rounded" />
                    <div className="ml-auto h-8 w-28 bg-zinc-800 rounded-lg" />
                </div>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-16 border-b border-zinc-800/30 px-6 flex items-center gap-4">
                        <div className="h-8 w-8 rounded-lg bg-zinc-800/60 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-3 w-56 bg-zinc-800/60 rounded" />
                            <div className="h-2.5 w-32 bg-zinc-900/60 rounded" />
                        </div>
                        <div className="h-5 w-16 bg-zinc-800/40 rounded-full" />
                        <div className="h-3 w-20 bg-zinc-900/40 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

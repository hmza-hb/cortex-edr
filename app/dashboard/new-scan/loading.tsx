export default function NewScanLoading() {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-pulse">
            <div className="space-y-2">
                <div className="h-7 w-36 bg-zinc-800/60 rounded-lg" />
                <div className="h-4 w-72 bg-zinc-900/60 rounded-md" />
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8 space-y-6">
                <div className="space-y-2">
                    <div className="h-3.5 w-28 bg-zinc-800/60 rounded" />
                    <div className="h-12 w-full bg-zinc-800/40 rounded-xl" />
                </div>
                <div className="space-y-2">
                    <div className="h-3.5 w-20 bg-zinc-800/60 rounded" />
                    <div className="grid grid-cols-3 gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-zinc-800/40 rounded-xl" />
                        ))}
                    </div>
                </div>
                <div className="h-12 w-full bg-zinc-800/50 rounded-xl" />
            </div>
        </div>
    );
}

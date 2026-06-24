export default function BillingLoading() {
    return (
        <div className="w-full space-y-6 animate-pulse">
            <div className="space-y-2">
                <div className="h-7 w-32 bg-zinc-800/60 rounded-lg" />
                <div className="h-4 w-56 bg-zinc-900/60 rounded-md" />
            </div>
            {/* Current plan card */}
            <div className="h-40 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 space-y-4">
                <div className="h-4 w-28 bg-zinc-800/60 rounded" />
                <div className="flex items-end gap-2">
                    <div className="h-9 w-20 bg-zinc-800/60 rounded-lg" />
                    <div className="h-4 w-16 bg-zinc-900/60 rounded mb-1" />
                </div>
                <div className="h-8 w-32 bg-zinc-800/50 rounded-xl" />
            </div>
            {/* Plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-64 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 space-y-3">
                        <div className="h-4 w-24 bg-zinc-800/60 rounded" />
                        <div className="h-7 w-20 bg-zinc-800/50 rounded-lg" />
                        <div className="space-y-2 pt-2">
                            {[...Array(4)].map((_, j) => (
                                <div key={j} className="h-3 w-full bg-zinc-900/50 rounded" />
                            ))}
                        </div>
                        <div className="h-10 w-full bg-zinc-800/40 rounded-xl mt-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}

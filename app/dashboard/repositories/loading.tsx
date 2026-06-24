export default function RepositoriesLoading() {
    return (
        <div className="w-full space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-44 bg-zinc-800/60 rounded-lg" />
                    <div className="h-4 w-72 bg-zinc-900/60 rounded-md" />
                </div>
                <div className="h-10 w-36 bg-zinc-800/60 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-36 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-zinc-800/60 shrink-0" />
                            <div className="h-4 w-32 bg-zinc-800/60 rounded" />
                        </div>
                        <div className="h-3 w-full bg-zinc-900/60 rounded" />
                        <div className="h-3 w-3/4 bg-zinc-900/40 rounded" />
                        <div className="flex gap-2 pt-1">
                            <div className="h-5 w-14 bg-zinc-800/40 rounded-full" />
                            <div className="h-5 w-16 bg-zinc-800/30 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SettingsLoading() {
    return (
        <div className="w-full max-w-3xl space-y-6 animate-pulse">
            <div className="space-y-2">
                <div className="h-7 w-28 bg-zinc-800/60 rounded-lg" />
                <div className="h-4 w-60 bg-zinc-900/60 rounded-md" />
            </div>
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 space-y-4">
                    <div className="h-4 w-36 bg-zinc-800/60 rounded" />
                    <div className="space-y-3">
                        <div className="h-11 w-full bg-zinc-800/40 rounded-xl" />
                        <div className="h-11 w-full bg-zinc-800/30 rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    );
}

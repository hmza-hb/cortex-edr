// Shared skeleton loader for all dashboard pages.
// Next.js App Router automatically renders this while the page's async data fetches.

export default function DashboardLoading() {
    return (
        <div className="w-full h-full space-y-6 animate-pulse">
            {/* Page header skeleton */}
            <div className="space-y-2">
                <div className="h-7 w-52 bg-zinc-800/60 rounded-lg" />
                <div className="h-4 w-80 bg-zinc-900/60 rounded-md" />
            </div>

            {/* Stat cards row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 space-y-3">
                        <div className="h-3 w-16 bg-zinc-800 rounded" />
                        <div className="h-7 w-24 bg-zinc-800 rounded-lg" />
                        <div className="h-2.5 w-20 bg-zinc-900 rounded" />
                    </div>
                ))}
            </div>

            {/* Main content area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-72 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl" />
                <div className="h-72 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl" />
            </div>

            {/* Table skeleton */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
                <div className="h-12 bg-zinc-800/30 border-b border-zinc-800/50" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 border-b border-zinc-800/30 px-6 flex items-center gap-4">
                        <div className="h-3 w-3 rounded-full bg-zinc-800" />
                        <div className="h-3 w-48 bg-zinc-800/60 rounded" />
                        <div className="ml-auto h-3 w-20 bg-zinc-800/40 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ExplorerLoading() {
    return (
        <div className="container mx-auto py-12 px-6">
            <div className="mb-10 space-y-3">
                <div className="h-9 w-48 rounded-lg bg-surface-2 animate-pulse" />
                <div className="h-4 w-80 rounded bg-surface-2 animate-pulse" />
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 w-28 rounded-full bg-surface-2 animate-pulse" />
                ))}
            </div>

            {[1, 2, 3].map((section) => (
                <div key={section} className="mb-12">
                    <div className="h-8 w-56 rounded bg-surface-2 animate-pulse mb-6" />
                    <div className="flex gap-4 overflow-hidden">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-none w-40 aspect-2/3 rounded-(--radius-cinema) bg-surface-2 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

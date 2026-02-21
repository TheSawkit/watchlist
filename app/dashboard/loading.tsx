export default function DashboardLoading() {
    return (
        <div className="container mx-auto py-12 px-6">
            <div className="mb-10 space-y-3">
                <div className="h-9 w-64 rounded-lg bg-surface-2 animate-pulse" />
                <div className="h-4 w-96 rounded bg-surface-2 animate-pulse" />
            </div>

            {[1, 2, 3].map((section) => (
                <div key={section} className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-8 w-48 rounded bg-surface-2 animate-pulse" />
                    </div>

                    <div className="flex gap-4 overflow-hidden">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-none w-40 md:w-50 aspect-2/3 rounded-(--radius-cinema) bg-surface-2 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

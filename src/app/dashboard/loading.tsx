export default function DashboardLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <div className="h-9 w-48 bg-orange-100/50 animate-pulse rounded-md mb-2"></div>
                    <div className="h-5 w-72 bg-orange-50/50 animate-pulse rounded-md"></div>
                </div>
                <div className="h-10 w-32 bg-orange-200/50 animate-pulse rounded-md"></div>
            </div>

            <div className="h-10 w-full animate-pulse bg-orange-100/50 rounded-md mb-8"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex flex-col h-full bg-white rounded-xl border border-orange-100/50 overflow-hidden shadow-sm">
                        <div className="w-full aspect-[4/3] bg-orange-50/50 animate-pulse"></div>
                        <div className="p-4 flex flex-col flex-1 gap-3">
                            <div className="h-6 w-3/4 bg-orange-100/50 animate-pulse rounded-md"></div>
                            <div className="h-4 w-full bg-orange-50/50 animate-pulse rounded-md"></div>
                            <div className="h-4 w-2/3 bg-orange-50/50 animate-pulse rounded-md mb-2"></div>
                            <div className="h-4 w-20 bg-orange-100/50 animate-pulse rounded-md mt-auto"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

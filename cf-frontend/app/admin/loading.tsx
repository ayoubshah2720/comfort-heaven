export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-48 animate-pulse rounded-lg bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 h-4 w-28 animate-pulse rounded bg-gray-200" />
            <div className="space-y-0 divide-y divide-gray-100">
              {/* Header row */}
              <div className="flex gap-4 py-2">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
              </div>
              {/* Body rows */}
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex gap-4 py-3">
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-14 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-14 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

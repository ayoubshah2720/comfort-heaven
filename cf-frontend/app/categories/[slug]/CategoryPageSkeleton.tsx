export default function CategoryPageSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full h-72 bg-gray-200 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded">
              <div className="h-36 bg-gray-100 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        <div className="w-48 flex-shrink-0 space-y-4">
          <div className="h-8 bg-[#3D6B6B]/20 rounded animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          ))}
          <div className="h-8 bg-[#3D6B6B]/20 rounded animate-pulse mt-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        <div className="flex-1">
          <div className="h-10 bg-[#3D6B6B]/20 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded">
                <div className="h-36 bg-gray-100 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

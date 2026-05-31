export default function CategoriesLoading() {
  return (
    <>
      {/* New Category Button */}
      <div className="mb-4 flex justify-end">
        <div className="h-9 w-32 animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* Category Rows */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-14 animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-10 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-12 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

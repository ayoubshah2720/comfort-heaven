export default function ProductsLoading() {
  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 sm:w-64" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 sm:w-40" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 sm:w-36" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3"><div className="h-3 w-6 animate-pulse rounded bg-gray-200" /></th>
                <th className="px-4 py-3"><div className="h-3 w-12 animate-pulse rounded bg-gray-200" /></th>
                <th className="px-4 py-3"><div className="h-3 w-16 animate-pulse rounded bg-gray-200" /></th>
                <th className="px-4 py-3"><div className="h-3 w-12 animate-pulse rounded bg-gray-200" /></th>
                <th className="px-4 py-3"><div className="h-3 w-12 animate-pulse rounded bg-gray-200" /></th>
                <th className="px-4 py-3"><div className="h-3 w-16 animate-pulse rounded bg-gray-200" /></th>
                <th className="px-4 py-3"><div className="h-3 w-14 animate-pulse rounded bg-gray-200" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <div className="h-10 w-10 animate-pulse rounded bg-gray-100" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-14 animate-pulse rounded-full bg-gray-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-10 animate-pulse rounded bg-gray-200" />
                      <div className="h-6 w-12 animate-pulse rounded bg-gray-200" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-8 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

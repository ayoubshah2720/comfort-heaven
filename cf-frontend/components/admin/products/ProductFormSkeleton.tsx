"use client";

interface ProductFormSkeletonProps {
  showImageManager?: boolean;
}

export default function ProductFormSkeleton({ showImageManager }: ProductFormSkeletonProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Basic Info */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-4 w-20 animate-pulse rounded bg-gray-200" />
        <div className="space-y-4">
          <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Classification */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-4 w-28 animate-pulse rounded bg-gray-200" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-4 w-16 animate-pulse rounded bg-gray-200" />
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-20 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-20 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Specifications */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-4 w-28 animate-pulse rounded bg-gray-200" />
        <div className="h-9 w-36 animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* Tags */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-4 w-10 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* Settings */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-4 w-18 animate-pulse rounded bg-gray-200" />
        <div className="space-y-4">
          <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
          <div className="flex items-center gap-6">
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Image Manager */}
      {showImageManager && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
          <div className="space-y-3 rounded-lg bg-gray-50 p-4">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      )}

      {/* Button Row */}
      <div className="flex justify-end gap-3 pb-8">
        <div className="h-10 w-20 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

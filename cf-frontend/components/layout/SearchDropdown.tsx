import Link from "next/link";
import Image from "next/image";
import type { BackendProduct } from "@/types/product";

interface SearchDropdownProps {
  products: BackendProduct[];
  isLoading: boolean;
  query: string;
  onSelect: () => void;
}

function getProductImage(product: BackendProduct): string {
  const cover = product.images.find((i) => i.isCover);
  return cover?.url || product.images[0]?.url || product.imageUrl || "/sofa.png";
}

function formatPrice(cents: number): string {
  return `Rs. ${(cents / 100).toLocaleString()}`;
}

export default function SearchDropdown({
  products,
  isLoading,
  query,
  onSelect,
}: SearchDropdownProps) {
  if (isLoading) {
    return (
      <div className="absolute left-0 right-0 top-full bg-white shadow-lg rounded-b z-50 border border-gray-200">
        <div className="flex items-center justify-center py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8B800] border-t-transparent" />
          <span className="ml-2 text-sm text-gray-500">Searching...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="absolute left-0 right-0 top-full bg-white shadow-lg rounded-b z-50 border border-gray-200">
        <p className="px-4 py-4 text-sm text-gray-500">
          No products found for &apos;{query}&apos;
        </p>
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-0 top-full bg-white shadow-lg rounded-b z-50 border border-gray-200 max-h-[360px] overflow-y-auto">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          onClick={onSelect}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
        >
          <Image
            src={getProductImage(product)}
            alt={product.name}
            width={40}
            height={40}
            className="rounded object-cover flex-shrink-0"
            unoptimized
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 truncate">
              {product.name}
            </p>
            <p className="text-xs text-gray-500">{product.category.name}</p>
          </div>
          <span className="text-sm font-semibold text-[#E8B800] flex-shrink-0">
            {formatPrice(product.priceCents)}
          </span>
        </Link>
      ))}
    </div>
  );
}

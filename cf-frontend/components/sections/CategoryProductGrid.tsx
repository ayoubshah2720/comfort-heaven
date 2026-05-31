"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectIsInWishlist } from "@/store/slices/wishlistSlice";
import { useContactOptions } from "@/hooks/useContactOptions";
import { useWishlistActions } from "@/hooks/useWishlistActions";
import { ContactOptionsModal } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { useCategoryFilters } from "./CategoryFilterContext";
import type { BackendProduct } from "@/types/product";

type ViewMode = "grid" | "list";

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`text-sm ${i < rating ? "text-[#E8B800]" : "text-gray-300"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function getProductImage(product: BackendProduct): string {
  const cover = product.images.find((i) => i.isCover);
  return cover?.url || product.images[0]?.url || product.imageUrl || "/sofa.png";
}

function getProductPrice(product: BackendProduct) {
  return product.priceCents / 100;
}

function WishlistIcon({ productId }: { productId: string }) {
  const isInWishlist = useAppSelector((state) =>
    selectIsInWishlist(state, productId)
  );
  return (
    <svg
      viewBox="0 0 20 20"
      fill={isInWishlist ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      width="16"
      height="16"
    >
      <path d="M10 17C10 17 2 12.5 2 7a4 4 0 017-2.67A4 4 0 0118 7c0 5.5-8 10-8 10z" />
    </svg>
  );
}

function ProductCard({ product, view, onBuyNow, onToggleWishlist }: {
  product: BackendProduct;
  view: ViewMode;
  onBuyNow: () => void;
  onToggleWishlist: () => void;
}) {
  const imageSrc = getProductImage(product);
  const formattedPrice = formatPrice(product.priceCents);
  const productUrl = `/products/${product.id}`;

  if (view === "list") {
    return (
      <div className="flex gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <Link href={productUrl} className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-100 flex-shrink-0 overflow-hidden">
          <img src={imageSrc} alt={product.name} className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={productUrl}>
                <h3 className="text-sm font-bold text-gray-800 uppercase hover:text-[#E8B800] transition-colors">{product.name}</h3>
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-[#E8B800]">{formattedPrice}</span>
              </div>
              <StarRating rating={4} />
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <button onClick={onBuyNow} className="bg-[#E8B800] text-white text-xs font-semibold px-4 py-1.5 hover:bg-[#d4a700] transition-colors uppercase tracking-wide whitespace-nowrap">
                BUY NOW
              </button>
              <button onClick={onToggleWishlist} className="text-gray-400 hover:text-red-500 transition-colors" title="Wishlist">
                <WishlistIcon productId={product.id} />
              </button>
            </div>
          </div>
          {product.description && (
            <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-3">{product.description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded hover:shadow-md transition-shadow group">
      <Link href={productUrl}>
        <div className="h-36 bg-gray-50 overflow-hidden p-3">
          <img src={imageSrc} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-3 pb-0">
          <p className="text-xs font-bold text-gray-800 uppercase hover:text-[#E8B800] transition-colors">{product.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs font-bold text-[#E8B800]">{formattedPrice}</span>
          </div>
          <StarRating rating={4} />
          {product.description && (
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{product.description}</p>
          )}
        </div>
      </Link>
      <div className="px-3 pb-3">
        <button onClick={onBuyNow} className="mt-2 w-full bg-[#E8B800] text-white text-[10px] font-semibold py-1 hover:bg-[#d4a700] transition-colors uppercase tracking-wide">
          BUY NOW
        </button>
        <div className="flex justify-center mt-1.5">
          <button onClick={onToggleWishlist} className="text-gray-400 hover:text-red-500 transition-colors" title="Wishlist">
            <WishlistIcon productId={product.id} />
          </button>
        </div>
      </div>
    </div>
  );
}

const SORT_OPTIONS = [
  { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Price: Low to High", sortBy: "priceCents", sortOrder: "asc" },
  { label: "Price: High to Low", sortBy: "priceCents", sortOrder: "desc" },
  { label: "Name: A-Z", sortBy: "name", sortOrder: "asc" },
] as const;

export default function CategoryProductGrid() {
  const [view, setView] = useState<ViewMode>("grid");
  const { handleBuyNow, isModalOpen, productName, isPhoneDetailView, handleCall, handleEmail, handleWhatsApp, backToOptions, closeModal } = useContactOptions();
  const { handleToggleWishlist } = useWishlistActions();
  const { paginatedProducts, pagination, sortBy, sortOrder, setSort, setPage, isLoading, error } = useCategoryFilters();

  const currentSort = `${sortBy}-${sortOrder}`;

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const [newSortBy, newSortOrder] = e.target.value.split("-");
    setSort(newSortBy, newSortOrder);
  }


  return (
    <div className="flex-1 min-w-0 w-full">
      {/* Header bar */}
      <div className="bg-[#3D6B6B] text-white flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 mb-4">
        <span className="text-sm font-semibold">{pagination.total} Results</span>
        <div className="flex items-center gap-3">
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="bg-transparent text-white text-xs border border-white/30 px-2 py-1 rounded cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={`${opt.sortBy}-${opt.sortOrder}`} value={`${opt.sortBy}-${opt.sortOrder}`} className="text-gray-800">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button onClick={() => setView("grid")} title="Grid view" className={`transition-opacity ${view === "grid" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}>
              <svg viewBox="0 0 16 16" fill="white" width="16" height="16">
                <rect x="1" y="1" width="6" height="6" />
                <rect x="9" y="1" width="6" height="6" />
                <rect x="1" y="9" width="6" height="6" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
            </button>
            <button onClick={() => setView("list")} title="List view" className={`transition-opacity ${view === "list" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}>
              <svg viewBox="0 0 16 16" fill="white" width="16" height="16">
                <rect x="1" y="2" width="14" height="2" />
                <rect x="1" y="7" width="14" height="2" />
                <rect x="1" y="12" width="14" height="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <button
            onClick={() => setPage(pagination.page)}
            className="text-sm font-semibold text-red-700 hover:text-red-900 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#3D6B6B] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {paginatedProducts.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : view === "list" ? (
          <div className="flex flex-col">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                view="list"
                onBuyNow={() => handleBuyNow(product.name)}
                onToggleWishlist={() => handleToggleWishlist(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                view="grid"
                onBuyNow={() => handleBuyNow(product.name)}
                onToggleWishlist={() => handleToggleWishlist(product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center gap-1 mt-6 justify-end">
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 text-xs font-semibold border flex items-center justify-center transition-colors ${pagination.page === i + 1
                ? "bg-[#3D6B6B] border-[#3D6B6B] text-white"
                : "border-gray-300 text-gray-600 hover:border-[#3D6B6B] hover:text-[#3D6B6B]"
                }`}
            >
              {i + 1}
            </button>
          ))}
          {pagination.page < pagination.totalPages && (
            <button
              onClick={() => setPage(pagination.page + 1)}
              className="w-8 h-8 text-xs border border-gray-300 text-gray-600 hover:border-[#3D6B6B] hover:text-[#3D6B6B] flex items-center justify-center transition-colors"
            >
              →
            </button>
          )}
        </div>
      )}
      <ContactOptionsModal isOpen={isModalOpen} productName={productName} isPhoneDetailView={isPhoneDetailView} onCall={handleCall} onEmail={handleEmail} onWhatsApp={handleWhatsApp} onBackToOptions={backToOptions} onClose={closeModal} />
    </div>
  );
}

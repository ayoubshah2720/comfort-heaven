"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectIsInWishlist } from "@/store/slices/wishlistSlice";
import { useContactOptions } from "@/hooks/useContactOptions";
import { useWishlistActions } from "@/hooks/useWishlistActions";
import { ContactOptionsModal } from "@/components/ui";
import { selectFilters } from "@/store/slices/filtersSlice";

export interface ListProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  imageSrc: string;
  rating: number;
  description: string;
}

interface CategoryProductListProps {
  products: ListProduct[];
}

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

function WishlistButton({ productId }: { productId: string | number }) {
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

function WishlistButtonSmall({ productId }: { productId: string | number }) {
  const isInWishlist = useAppSelector((state) =>
    selectIsInWishlist(state, productId)
  );
  return (
    <svg
      viewBox="0 0 20 20"
      fill={isInWishlist ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      width="14"
      height="14"
    >
      <path d="M10 17C10 17 2 12.5 2 7a4 4 0 017-2.67A4 4 0 0118 7c0 5.5-8 10-8 10z" />
    </svg>
  );
}

type ViewMode = "list" | "grid";

const PRODUCTS_PER_PAGE = 9;

export default function CategoryProductList({ products }: CategoryProductListProps) {
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const { handleBuyNow, isModalOpen, productName, isPhoneDetailView, handleCall, handleEmail, handleWhatsApp, backToOptions, closeModal } = useContactOptions();
  const { handleToggleWishlist } = useWishlistActions();
  const filters = useAppSelector(selectFilters);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        filters.selectedCategories.length > 0 &&
        !filters.selectedCategories.some((cat: string) =>
          product.name.toLowerCase().includes(cat.toLowerCase())
        )
      ) {
        return false;
      }

      if (product.price < filters.priceMin || product.price > filters.priceMax) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );


  return (
    <div className="flex-1 min-w-0">
      {/* Header bar */}
      <div className="bg-[#3D6B6B] text-white flex items-center justify-between px-4 py-2.5 mb-4">
        <span className="text-sm font-semibold">{filteredProducts.length} Results</span>
        <div className="flex items-center gap-2">
          {/* Grid view icon */}
          <button
            onClick={() => setView("grid")}
            title="Grid view"
            className={`transition-opacity ${view === "grid" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
          >
            <svg viewBox="0 0 16 16" fill="white" width="16" height="16">
              <rect x="1" y="1" width="6" height="6" />
              <rect x="9" y="1" width="6" height="6" />
              <rect x="1" y="9" width="6" height="6" />
              <rect x="9" y="9" width="6" height="6" />
            </svg>
          </button>
          {/* List view icon */}
          <button
            onClick={() => setView("list")}
            title="List view"
            className={`transition-opacity ${view === "list" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
          >
            <svg viewBox="0 0 16 16" fill="white" width="16" height="16">
              <rect x="1" y="2" width="14" height="2" />
              <rect x="1" y="7" width="14" height="2" />
              <rect x="1" y="12" width="14" height="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product list */}
      {view === "list" ? (
        <div className="flex flex-col gap-0">
          {paginatedProducts.map((product, idx) => (
            <div
              key={product.id}
              className={`flex gap-4 p-4 ${idx < paginatedProducts.length - 1 ? "border-b border-gray-200" : ""} hover:bg-gray-50 transition-colors`}
            >
              {/* Product image */}
              <Link href={`/products/${product.id}`} className="w-28 h-28 bg-gray-100 flex-shrink-0 overflow-hidden">
                <img
                  src={product.imageSrc}
                  alt={product.name}
                  className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-sm font-bold text-gray-800 uppercase hover:text-[#E8B800] transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-bold text-[#E8B800]">Rs {product.price}.00</span>
                      <span className="text-xs text-gray-400 line-through">Rs {product.originalPrice}.00</span>
                    </div>
                    <StarRating rating={product.rating} />
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleBuyNow(product.name)}
                      className="bg-[#E8B800] text-white text-xs font-semibold px-4 py-1.5 hover:bg-[#d4a700] transition-colors uppercase tracking-wide whitespace-nowrap"
                    >
                      BUY NOW
                    </button>
                    <button
                      onClick={() => handleToggleWishlist(product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Wishlist"
                    >
                      <WishlistButton productId={product.id} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-3">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded hover:shadow-md transition-shadow group">
              <Link href={`/products/${product.id}`}>
                <div className="h-36 bg-gray-50 overflow-hidden p-3">
                  <img
                    src={product.imageSrc}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 pb-0">
                  <p className="text-xs font-bold text-gray-800 uppercase hover:text-[#E8B800] transition-colors">{product.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-bold text-[#E8B800]">Rs {product.price}.00</span>
                    <span className="text-[10px] text-gray-400 line-through">Rs {product.originalPrice}.00</span>
                  </div>
                  <StarRating rating={product.rating} />
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{product.description}</p>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <button
                  onClick={() => handleBuyNow(product.name)}
                  className="mt-2 w-full bg-[#E8B800] text-white text-[10px] font-semibold py-1 hover:bg-[#d4a700] transition-colors uppercase tracking-wide"
                >
                  BUY NOW
                </button>
                <div className="flex justify-center mt-1.5">
                  <button
                    onClick={() => handleToggleWishlist(product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Wishlist"
                  >
                    <WishlistButtonSmall productId={product.id} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center gap-1 mt-6 justify-end">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-8 h-8 text-xs font-semibold border transition-colors ${currentPage === i + 1
              ? "bg-[#3D6B6B] border-[#3D6B6B] text-white"
              : "border-gray-300 text-gray-600 hover:border-[#3D6B6B] hover:text-[#3D6B6B]"
              }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 text-xs border border-gray-300 text-gray-600 hover:border-[#3D6B6B] hover:text-[#3D6B6B] disabled:opacity-40 transition-colors"
        >
          →
        </button>
      </div>
      <ContactOptionsModal isOpen={isModalOpen} productName={productName} isPhoneDetailView={isPhoneDetailView} onCall={handleCall} onEmail={handleEmail} onWhatsApp={handleWhatsApp} onBackToOptions={backToOptions} onClose={closeModal} />
    </div>
  );
}

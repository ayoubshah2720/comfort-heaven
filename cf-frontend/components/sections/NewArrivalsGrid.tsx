"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectIsInWishlist } from "@/store/slices/wishlistSlice";
import { useContactOptions } from "@/hooks/useContactOptions";
import { useWishlistActions } from "@/hooks/useWishlistActions";
import { ContactOptionsModal } from "@/components/ui";

export interface NewArrivalProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  imageSrc: string;
  rating: number;
}

interface NewArrivalsGridProps {
  products: NewArrivalProduct[];
  productsPerPage?: number;
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? "text-[#E8B800]" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function WishlistButtonSmall({ productId }: { productId: string }) {
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

export default function NewArrivalsGrid({
  products,
  productsPerPage = 15,
}: NewArrivalsGridProps) {
  const [page, setPage] = useState(1);
  const { handleBuyNow, isModalOpen, productName, isPhoneDetailView, handleCall, handleEmail, handleWhatsApp, backToOptions, closeModal } = useContactOptions();
  const { handleToggleWishlist } = useWishlistActions();

  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );


  return (
    <div>
      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 group"
          >
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square bg-gray-100 overflow-hidden p-4">
                <img
                  src={product.imageSrc}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <div className="p-3 text-center">
              <Link href={`/products/${product.id}`}>
                <p className="text-xs font-bold text-gray-800 uppercase hover:text-[#E8B800] transition-colors">
                  {product.name}
                </p>
              </Link>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="text-xs font-bold text-[#E8B800]">
                  Rs {product.price}.00
                </span>
                <span className="text-[10px] text-gray-400 line-through">
                  Rs {product.originalPrice}.00
                </span>
              </div>
              <div className="mt-1">
                <StarRating rating={product.rating} />
              </div>
              <div className="flex items-center justify-center gap-4 mt-2">
                {/* Compare icon (placeholder) */}
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Compare"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    width="14"
                    height="14"
                  >
                    <path d="M4 4h4l3 9h6l3-6H10" />
                    <path d="M16 19a1 1 0 100-2 1 1 0 000 2zM7 19a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </button>
                {/* Add to cart */}
                <button
                  onClick={() => handleBuyNow(product.name)}
                  className="underline uppercase font-semibold text-xs hover:text-[#E8B800] transition-colors"
                >
                  BUY NOW
                </button>
                {/* Wishlist */}
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

      {/* Pagination */}
      <div className="flex items-center gap-1 mt-6 justify-end">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-8 h-8 text-xs font-semibold border transition-colors ${currentPage === i + 1
              ? "bg-[#E8B800] border-[#E8B800] text-white"
              : "border-gray-300 text-gray-600 hover:border-[#E8B800] hover:text-[#E8B800]"
              }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 text-xs border border-gray-300 text-gray-600 hover:border-[#E8B800] hover:text-[#E8B800] disabled:opacity-40 transition-colors"
        >
          →
        </button>
      </div>
      <ContactOptionsModal isOpen={isModalOpen} productName={productName} isPhoneDetailView={isPhoneDetailView} onCall={handleCall} onEmail={handleEmail} onWhatsApp={handleWhatsApp} onBackToOptions={backToOptions} onClose={closeModal} />
    </div>
  );
}

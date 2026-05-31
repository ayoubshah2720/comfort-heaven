"use client";

import Link from "next/link";
import type { BackendProduct } from "@/types/product";
import { useAppSelector } from "@/store/hooks";
import { selectIsInWishlist } from "@/store/slices/wishlistSlice";
import { useContactOptions } from "@/hooks/useContactOptions";
import { useWishlistActions } from "@/hooks/useWishlistActions";
import { getProductCoverImage } from "@/lib/product-utils";
import { ContactOptionsModal } from "@/components/ui";

interface RelatedProductsProps {
  products: BackendProduct[];
}

function RelatedProductCard({ product, onBuyNow }: { product: BackendProduct; onBuyNow: (name: string) => void }) {
  const { handleToggleWishlist } = useWishlistActions();
  const isInWishlist = useAppSelector((state) =>
    selectIsInWishlist(state, product.id)
  );

  const price = product.priceCents / 100;
  const comparePrice = product.comparePriceCents
    ? product.comparePriceCents / 100
    : price;
  const imageSrc = getProductCoverImage(product);

  return (
    <div className="border border-gray-200 rounded bg-white hover:shadow-md transition-shadow group">
      <Link href={`/products/${product.id}`}>
        <div className="h-36 bg-gray-50 flex items-center justify-center overflow-hidden p-3">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-400"
          />
        </div>
        <div className="p-2.5">
          <p className="text-gray-800 text-xs font-semibold uppercase leading-tight">
            {product.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[#3D6B6B] text-xs font-bold">
              Rs {price.toLocaleString()}.00
            </span>
            {comparePrice > price && (
              <span className="text-gray-400 text-[11px] line-through">
                Rs {comparePrice.toLocaleString()}.00
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between px-2.5 pb-2.5">
        <button
          onClick={() => handleToggleWishlist(product.id)}
          className={`transition-colors ${isInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
          title="Wishlist"
        >
          <svg
            viewBox="0 0 16 16"
            fill={isInWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            width="13"
            height="13"
          >
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5a3 3 0 015-2.2A3 3 0 0114.5 5.5c0 4-6.5 8-6.5 8z" />
          </svg>
        </button>
        <button
          onClick={() => onBuyNow(product.name)}
          className="bg-[#E8B800] text-white text-[10px] font-semibold px-2 py-1 hover:bg-[#d4a700] transition-colors uppercase tracking-wide"
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { handleBuyNow, isModalOpen, productName, isPhoneDetailView, handleCall, handleEmail, handleWhatsApp, backToOptions, closeModal } = useContactOptions();

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-center text-xl font-bold text-gray-800 mb-1">
          Related Product
        </h2>
        <div className="w-16 h-0.5 bg-[#E8B800] mx-auto mb-8" />

        {/* 5×2 Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <RelatedProductCard key={product.id} product={product} onBuyNow={handleBuyNow} />
          ))}
        </div>
      </div>
      <ContactOptionsModal isOpen={isModalOpen} productName={productName} isPhoneDetailView={isPhoneDetailView} onCall={handleCall} onEmail={handleEmail} onWhatsApp={handleWhatsApp} onBackToOptions={backToOptions} onClose={closeModal} />
    </section>
  );
}

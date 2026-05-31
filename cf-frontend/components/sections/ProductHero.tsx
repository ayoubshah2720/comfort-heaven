"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { ContactButtons, ContactOptionsModal } from "@/components/ui";
import type { BackendProductDetail } from "@/types/product";
import { useAppSelector } from "@/store/hooks";
import { selectIsInWishlist } from "@/store/slices/wishlistSlice";
import { useWishlistActions } from "@/hooks/useWishlistActions";
import { useContactOptions } from "@/hooks/useContactOptions";
import { getProductCoverImage } from "@/lib/product-utils";

interface ProductHeroProps {
  product: BackendProductDetail;
}

export default function ProductHero({ product }: ProductHeroProps) {
  const [activeImage, setActiveImage] = useState(0);
  const { handleToggleWishlist } = useWishlistActions();
  const { openPhoneModal, isModalOpen, productName, isPhoneDetailView, handleCall, handleEmail, handleWhatsApp, backToOptions, closeModal } = useContactOptions();
  const isInWishlist = useAppSelector((state) =>
    selectIsInWishlist(state, product.id)
  );

  const images = product.images;
  const price = product.priceCents / 100;
  const comparePrice = product.comparePriceCents
    ? product.comparePriceCents / 100
    : null;
  const seller =
    product.vendor?.name || product.brand?.name || "InteQ Furniture";

  function handlePrev() {
    setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function handleNext() {
    setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1));
  }


  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left — Image gallery */}
        <div className="lg:w-[45%]">
          {/* Main image */}
          <div className="relative bg-gray-50 border border-gray-200 rounded overflow-hidden h-[400px] flex items-center justify-center">
            {images.length > 0 ? (
              <img
                src={images[activeImage].url}
                alt={images[activeImage].altText || product.name}
                className="max-h-full max-w-full object-contain p-4"
              />
            ) : (
              <img
                src={getProductCoverImage(product)}
                alt={product.name}
                className="max-h-full max-w-full object-contain p-4"
              />
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 border border-gray-300 rounded-full flex items-center justify-center shadow hover:bg-white text-gray-600 text-lg"
                >
                  &#8249;
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 border border-gray-300 rounded-full flex items-center justify-center shadow hover:bg-white text-gray-600 text-lg"
                >
                  &#8250;
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 border-2 rounded overflow-hidden flex-shrink-0 ${i === activeImage
                    ? "border-[#E8B800]"
                    : "border-gray-200 hover:border-gray-400"
                    }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || product.name}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Product info */}
        <div className="lg:w-[55%]">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mt-3">
            {comparePrice && comparePrice > price && (
              <span className="text-gray-400 line-through text-lg">
                Rs {comparePrice.toLocaleString()}.00
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">
              Rs {price.toLocaleString()}.00
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm mt-4 leading-relaxed">
            {product.description}
          </p>

          {/* Buy Now */}


          {/* Meta info */}
          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <p>
              <span className="font-semibold text-gray-700">Sold By:</span>{" "}
              {seller}
            </p>
            {product.tags.length > 0 && (
              <p>
                <span className="font-semibold text-gray-700">Tags:</span>{" "}
                {product.tags.join(", ")}
              </p>
            )}
            <p>
              <span className="font-semibold text-gray-700">Categories:</span>{" "}
              {[product.category.name, product.subCategory.name].join(", ")}
            </p>
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 mt-5">
            <span className="text-sm text-gray-500 font-semibold">Share:</span>
            <div className="flex gap-2">
              {[
                { label: "FB", count: "1.2k" },
                { label: "TW", count: "842" },
                { label: "PT", count: "463" },
              ].map((social) => (
                <button
                  key={social.label}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 text-xs text-gray-500 hover:border-gray-400 transition-colors"
                >
                  <span className="font-semibold">{social.label}</span>
                  <span>{social.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <ContactButtons productName={product.name} onCallDesktop={() => openPhoneModal(product.name)} />
          </div>

          {/* Add to Wishlist */}
          <Button
            variant="primary"
            size="lg"
            className="w-full mt-3 uppercase tracking-wide gap-2"
            onClick={() => handleToggleWishlist(product.id)}
          >
            <svg
              viewBox="0 0 20 20"
              fill={isInWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              width="18"
              height="18"
            >
              <path d="M10 17C10 17 2 12.5 2 7a4 4 0 017-2.67A4 4 0 0118 7c0 5.5-8 10-8 10z" />
            </svg>
            {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          </Button>
        </div>
      </div>
      <ContactOptionsModal isOpen={isModalOpen} productName={productName} isPhoneDetailView={isPhoneDetailView} onCall={handleCall} onEmail={handleEmail} onWhatsApp={handleWhatsApp} onBackToOptions={backToOptions} onClose={closeModal} showBack={false} />
    </section>
  );
}

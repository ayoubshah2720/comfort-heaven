"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectIsInWishlist } from "@/store/slices/wishlistSlice";
import { useContactOptions } from "@/hooks/useContactOptions";
import { useWishlistActions } from "@/hooks/useWishlistActions";
import { ContactOptionsModal } from "@/components/ui";

export interface CarouselProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  imageSrc: string;
  rating: number;
}

interface FeaturedCarouselProps {
  title?: string;
  subtitle?: string;
  products: CarouselProduct[];
}

function useResponsivePerPage(): number {
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640) setPerPage(4);
      else if (w < 768) setPerPage(6);
      else if (w < 1024) setPerPage(8);
      else setPerPage(10);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perPage;
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`text-base ${i < rating ? "text-[#E8B800]" : "text-gray-300"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function CarouselCard({ product, onBuyNow }: { product: CarouselProduct; onBuyNow: (name: string) => void }) {
  const { handleToggleWishlist } = useWishlistActions();
  const isInWishlist = useAppSelector((state) =>
    selectIsInWishlist(state, product.id)
  );

  return (
    <div className="border border-gray-200 rounded bg-white hover:shadow-md transition-shadow group">
      <Link href={`/products/${product.id}`}>
        {/* Image */}
        <div className="h-36 bg-gray-50 flex items-center justify-center overflow-hidden p-3">
          <img
            src={product.imageSrc}
            alt={product.name}
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-400"
          />
        </div>

        {/* Info */}
        <div className="p-2.5">
          <p className="text-gray-800 text-xs font-semibold uppercase leading-tight">{product.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[#3D6B6B] text-xs font-bold">Rs {product.price}.00</span>
            <span className="text-gray-400 text-[11px] line-through">Rs {product.originalPrice}.00</span>
          </div>
          <StarRating rating={product.rating} />
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between px-2.5 pb-2.5">
        <div className="flex items-center gap-1.5">
          {/* Compare icon */}
          <button className="text-gray-400 hover:text-[#3D6B6B] transition-colors" title="Compare">
            <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13">
              <path d="M3 3h10v2H3V3zm2 4h6v2H5V7zm2 4h2v2H7v-2z" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => onBuyNow(product.name)}
          className="bg-[#E8B800] text-white text-[10px] font-semibold px-2 py-1 hover:bg-[#d4a700] transition-colors uppercase tracking-wide"
        >
          BUY NOW
        </button>

        {/* Wishlist */}
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
      </div>
    </div>
  );
}

export default function FeaturedCarousel({
  title = "Find out Economic Office Chairs in Pakistan",
  subtitle = "Office chair is another office furniture item and holds an integral importance. This furniture item is available in different styles and designs for catering to the requirements of different offices. Swiveling executive chairs are mostly used in the offices. However, other types of chairs are also used in the offices.",
  products,
}: FeaturedCarouselProps) {
  const { handleBuyNow, isModalOpen, productName, isPhoneDetailView, handleCall, handleEmail, handleWhatsApp, backToOptions, closeModal } = useContactOptions();
  const perPage = useResponsivePerPage();
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(products.length / perPage);
  const visible = products.slice(page * perPage, (page + 1) * perPage);

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, Math.ceil(products.length / perPage) - 1)));
  }, [perPage, products.length]);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>
        <p className="text-xs text-gray-500 mb-6 max-w-3xl leading-relaxed">{subtitle}</p>

        <div className="relative overflow-hidden">
          {/* Prev arrow */}
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="absolute -left-2 sm:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-8 sm:h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow text-gray-600 hover:bg-gray-50 disabled:opacity-30 text-lg"
          >
            ‹
          </button>

          {/* Grid: responsive cols */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {visible.map((product) => (
              <CarouselCard key={product.id} product={product} onBuyNow={handleBuyNow} />
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="absolute -right-2 sm:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-8 sm:h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow text-gray-600 hover:bg-gray-50 disabled:opacity-30 text-lg"
          >
            ›
          </button>
        </div>
      </div>
      <ContactOptionsModal isOpen={isModalOpen} productName={productName} isPhoneDetailView={isPhoneDetailView} onCall={handleCall} onEmail={handleEmail} onWhatsApp={handleWhatsApp} onBackToOptions={backToOptions} onClose={closeModal} />
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import {
  selectWishlistItems,
  selectWishlistTotal,
  selectWishlistLoading,
  selectWishlistError,
} from "@/store/slices/wishlistSlice";
import { useContactOptions } from "@/hooks/useContactOptions";
import { useWishlistActions } from "@/hooks/useWishlistActions";
import { ContactOptionsModal } from "@/components/ui";
import type { WishlistItem } from "@/store/slices/wishlistSlice";
import ProfileSidebar from "./ProfileSidebar";

function formatDate(addedAt: string | undefined): string {
  if (!addedAt) return "N/A";
  const date = new Date(addedAt);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function WishlistContent() {
  const { handleBuyNow, isModalOpen, productName, isPhoneDetailView, handleCall, handleEmail, handleWhatsApp, backToOptions, closeModal } = useContactOptions();
  const { handleRemoveFromWishlist } = useWishlistActions();
  const items = useAppSelector(selectWishlistItems);
  const total = useAppSelector(selectWishlistTotal);
  const loading = useAppSelector(selectWishlistLoading);
  const error = useAppSelector(selectWishlistError);

  function handleRemove(item: WishlistItem) {
    handleRemoveFromWishlist(item.backendItemId);
  }


  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl mb-6">
        My{" "}
        <span className="font-bold text-[#E8B800] underline">Wishlist</span>
      </h1>

      {/* Gold info bar */}
      <div className="bg-[#E8B800] rounded px-6 py-3 flex items-center justify-between mb-8">
        <span className="text-white text-sm">Home Page / My Wishlist</span>
        <span className="text-white text-sm font-semibold uppercase">
          Current Amount {total.toLocaleString()}.00 Rs
        </span>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-4 text-sm rounded">
          {error}
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex gap-6">
        <ProfileSidebar activeItem="wishlist" />

        <div className="flex-1 min-w-0 relative">
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-[#E8B800] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {items.length === 0 && !loading ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">
                Your wishlist is empty
              </p>
              <Link
                href="/"
                className="inline-block bg-[#E8B800] text-white px-6 py-2 rounded font-semibold hover:bg-[#d4a700] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-[#E8B800] text-left">
                      <th className="px-4 py-3 font-semibold w-10"></th>
                      <th className="px-4 py-3 font-semibold w-20"></th>
                      <th className="px-4 py-3 font-semibold">
                        Products Name
                      </th>
                      <th className="px-4 py-3 font-semibold">Unit Price</th>
                      <th className="px-4 py-3 font-semibold">Stock Status</th>
                      <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: WishlistItem) => (
                      <tr
                        key={item.backendItemId}
                        className="border-b border-gray-100 align-middle"
                      >
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleRemove(item)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition-colors"
                            aria-label={`Remove ${item.name} from wishlist`}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={item.imageSrc}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                              unoptimized
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          Rs {item.price.toLocaleString()}.00
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-green-600 font-medium">
                            In Stock
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">
                              Added On; {formatDate(item.addedAt)}
                            </p>
                            <button
                              onClick={() => handleBuyNow(item.name)}
                              className="bg-[#E8B800] text-white text-xs px-4 py-1.5 rounded font-semibold hover:bg-[#d4a700] transition-colors"
                            >
                              BUY NOW
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards */}
              <div className="md:hidden space-y-4">
                {items.map((item: WishlistItem) => (
                  <div
                    key={item.backendItemId}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.imageSrc}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          Rs {item.price.toLocaleString()}.00
                        </p>
                        <p className="text-xs text-green-600 font-medium mt-0.5">
                          In Stock
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Added On; {formatDate(item.addedAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition-colors flex-shrink-0 self-start"
                        aria-label={`Remove ${item.name} from wishlist`}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleBuyNow(item.name)}
                        className="bg-[#E8B800] text-white text-sm px-4 py-1.5 rounded font-semibold hover:bg-[#d4a700] transition-colors"
                      >
                        BUY NOW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <ContactOptionsModal isOpen={isModalOpen} productName={productName} isPhoneDetailView={isPhoneDetailView} onCall={handleCall} onEmail={handleEmail} onWhatsApp={handleWhatsApp} onBackToOptions={backToOptions} onClose={closeModal} />
    </div>
  );
}

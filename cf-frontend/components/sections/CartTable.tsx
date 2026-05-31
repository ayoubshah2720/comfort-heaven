"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import {
  selectCartItems,
  selectCartCount,
  selectCartLoading,
  type CartItem,
} from "@/store/slices/cartSlice";
import { useCartActions } from "@/hooks/useCartActions";

interface ProductDisplayInfo {
  color: string;
  categories: string;
}

function getDisplayInfo(_productId: string | number): ProductDisplayInfo {
  return { color: "N/A", categories: "N/A" };
}

function formatModel(id: string | number): string {
  return typeof id === "number" ? `C-${String(id).padStart(2, "0")}` : String(id).slice(0, 8);
}

export default function CartTable() {
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const loading = useAppSelector(selectCartLoading);
  const { handleUpdateQuantity, handleRemoveFromCart } = useCartActions();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
        <Link
          href="/"
          className="inline-block bg-[#E8B800] text-white px-6 py-2 rounded font-semibold hover:bg-[#d4a700] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  function handleQuantityChange(productId: string | number, value: string, backendItemId?: string) {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty >= 1) {
      handleUpdateQuantity(productId, qty, backendItemId);
    }
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#E8B800] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        You have {count} item(s) in Your Cart
      </h2>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-[#E8B800] text-left">
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Product Name</th>
              <th className="px-4 py-3 font-semibold">Model</th>
              <th className="px-4 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 font-semibold">Unit Price</th>
              <th className="px-4 py-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: CartItem) => {
              const info = getDisplayInfo(item.productId);
              const rowTotal = item.price * item.quantity;
              return (
                <tr
                  key={item.productId}
                  className="border-b border-gray-100 align-top"
                >
                  <td className="px-4 py-4">
                    <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Color: {info.color}
                    </p>
                    <p className="text-xs text-gray-500">
                      Categories: {info.categories}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {formatModel(item.productId)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.productId, e.target.value, item.backendItemId)
                        }
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm focus:outline-none focus:border-[#E8B800]"
                      />
                      <button
                        onClick={() => handleRemoveFromCart(item.productId, item.backendItemId)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    Rs {item.price.toLocaleString()}.00
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    Rs {rowTotal.toLocaleString()}.00
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-4">
        {items.map((item: CartItem) => {
          const info = getDisplayInfo(item.productId);
          const rowTotal = item.price * item.quantity;
          return (
            <div
              key={item.productId}
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
                  <p className="text-xs text-gray-500 mt-0.5">
                    Model: {formatModel(item.productId)}
                  </p>
                  <p className="text-xs text-gray-500">Color: {info.color}</p>
                  <p className="text-xs text-gray-500">
                    Categories: {info.categories}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.productId, item.backendItemId)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition-colors flex-shrink-0 self-start"
                  aria-label={`Remove ${item.name}`}
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Qty:</span>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.productId, e.target.value, item.backendItemId)
                    }
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm focus:outline-none focus:border-[#E8B800]"
                  />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Rs {item.price.toLocaleString()}.00 each
                  </p>
                  <p className="font-semibold text-gray-800">
                    Rs {rowTotal.toLocaleString()}.00
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

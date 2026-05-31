"use client";

import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems, selectCartOrderSummary, type CartItem } from "@/store/slices/cartSlice";
import { useCartActions } from "@/hooks/useCartActions";
import { FLAT_SHIPPING_RATE } from "@/constants";

export default function CheckoutOrderTable() {
  const items = useAppSelector(selectCartItems);
  const { subtotal, vat, ecoTax, total } = useAppSelector(selectCartOrderSummary);
  const { handleRemoveFromCart } = useCartActions();

  const totalWeight = items.reduce((sum: number, item: CartItem) => sum + item.quantity * 0.5, 0);
  const grandTotal = total + FLAT_SHIPPING_RATE;

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-700">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">
          Shopping Cart ({totalWeight.toFixed(2)}KG)
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 py-4">Your cart is empty.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                  <th className="py-2">Image</th>
                  <th className="py-2">Product Name</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: CartItem) => (
                  <tr key={item.productId} className="border-b border-gray-100">
                    <td className="py-3">
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                        unoptimized
                      />
                    </td>
                    <td className="py-3">
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">Rs {item.price.toLocaleString()}.00</td>
                    <td className="py-3 text-right font-medium">
                      Rs {(item.price * item.quantity).toLocaleString()}.00
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleRemoveFromCart(item.productId, item.backendItemId)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100 text-gray-600">
              <span>SUB-TOTAL</span>
              <span>Rs {subtotal.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-gray-600">
              <span>FLAT SHIPPING RATE</span>
              <span>Rs {FLAT_SHIPPING_RATE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-gray-600">
              <span>ECO TAX (-2.00)</span>
              <span>Rs {ecoTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-gray-600">
              <span>VAT (15%)</span>
              <span>Rs {vat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 text-base font-bold text-gray-900">
              <span>TOTAL</span>
              <span>Rs {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

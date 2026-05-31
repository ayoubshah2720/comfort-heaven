"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchOrderDetailThunk,
  selectSelectedOrder,
  selectOrdersLoading,
  selectOrdersError,
} from "@/store/slices/ordersSlice";
import type { OrderStatus, BackendOrderItem } from "@/types/order";

interface OrderDetailContentProps {
  orderId: string;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const colorMap: Record<OrderStatus, string> = {
    PENDING: "text-yellow-600 bg-yellow-50",
    CONFIRMED: "text-blue-600 bg-blue-50",
    FULFILLED: "text-green-700 bg-green-50",
    CANCELLED: "text-red-600 bg-red-50",
    REFUNDED: "text-purple-600 bg-purple-50",
  };

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded ${colorMap[status]}`}>
      {status}
    </span>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(cents: number): string {
  return `Rs ${(cents / 100).toLocaleString()}`;
}

export default function OrderDetailContent({ orderId }: OrderDetailContentProps) {
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectSelectedOrder);
  const loading = useAppSelector(selectOrdersLoading);
  const error = useAppSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchOrderDetailThunk(orderId));
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#E8B800] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchOrderDetailThunk(orderId))}
          className="bg-[#E8B800] text-white px-6 py-2 rounded font-semibold hover:bg-[#d4a700] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/profile/orders"
        className="inline-flex items-center gap-1 text-sm text-[#3D6B6B] hover:text-[#2f5656] font-semibold mb-6"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Orders
      </Link>

      {/* Order header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
            {order.notes && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Notes:</span> {order.notes}
              </p>
            )}
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Items table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">
            Items ({order.items.length})
          </h3>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3 text-center">Qty</th>
                <th className="px-6 py-3 text-right">Unit Price</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: BackendOrderItem) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.product.imageUrl && (
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="48px"
                            unoptimized
                          />
                        </div>
                      )}
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium text-gray-800 hover:text-[#E8B800] transition-colors"
                      >
                        {item.productName}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">{item.quantity}</td>
                  <td className="px-6 py-4 text-right">
                    {formatPrice(item.unitPriceCents)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {formatPrice(item.totalCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-gray-100">
          {order.items.map((item: BackendOrderItem) => (
            <div key={item.id} className="px-4 py-4 flex gap-3">
              {item.product.imageUrl && (
                <div className="relative w-14 h-14 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="56px"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">
                  {item.productName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Qty: {item.quantity} x {formatPrice(item.unitPriceCents)}
                </p>
                <p className="text-sm font-semibold text-gray-800 mt-1">
                  {formatPrice(item.totalCents)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotalCents)}</span>
          </div>
          {order.taxCents > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatPrice(order.taxCents)}</span>
            </div>
          )}
          {order.shippingCents > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{formatPrice(order.shippingCents)}</span>
            </div>
          )}
          {order.discountCents > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(order.discountCents)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>{formatPrice(order.totalCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

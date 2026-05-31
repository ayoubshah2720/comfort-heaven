"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchOrdersThunk,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
} from "@/store/slices/ordersSlice";
import type { OrderStatus, BackendOrder } from "@/types/order";
import ProfileSidebar from "./ProfileSidebar";

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
    month: "short",
    day: "numeric",
  });
}

function formatPrice(cents: number): string {
  return `Rs ${(cents / 100).toLocaleString()}`;
}

export default function OrdersContent() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectOrdersLoading);
  const error = useAppSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchOrdersThunk());
  }, [dispatch]);

  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl text-center mb-6">
        My{" "}
        <span className="font-bold text-[#E8B800] underline">ORDER</span>
      </h1>

      {/* Gold info bar */}
      <div className="bg-[#E8B800] rounded px-6 py-3 flex items-center justify-between mb-8">
        <span className="text-white text-sm">Home Page / My Order</span>
        <span className="text-white text-sm font-semibold uppercase">
          {orders.length} Order(s)
        </span>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        <ProfileSidebar activeItem="orders" />

        <div className="flex-1 min-w-0">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#E8B800] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchOrdersThunk())}
                className="bg-[#E8B800] text-white px-6 py-2 rounded font-semibold hover:bg-[#d4a700] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">No orders yet</p>
              <Link
                href="/"
                className="inline-block bg-[#E8B800] text-white px-6 py-2 rounded font-semibold hover:bg-[#d4a700] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          )}

          {/* Orders list */}
          {!loading && !error && orders.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="px-4 py-3 font-semibold">Order Number</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold text-right">Total</th>
                      <th className="px-4 py-3 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: BackendOrder) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 align-middle"
                      >
                        <td className="px-4 py-4 font-semibold text-gray-800">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-gray-800">
                          {formatPrice(order.totalCents)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link
                            href={`/profile/orders/${order.id}`}
                            className="text-[#3D6B6B] hover:text-[#2f5656] font-semibold text-sm underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards */}
              <div className="md:hidden space-y-4">
                {orders.map((order: BackendOrder) => (
                  <Link
                    key={order.id}
                    href={`/profile/orders/${order.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-[#E8B800] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800 flex-shrink-0">
                        {formatPrice(order.totalCents)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

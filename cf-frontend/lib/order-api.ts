import { apiFetch } from "@/lib/api-client";
import { ORDER_ENDPOINTS } from "@/constants/api";
import type { BackendOrder, CheckoutRequest } from "@/types/order";

export async function apiListOrders(status?: string) {
  const query = status ? `?status=${status}` : "";
  return apiFetch<BackendOrder[]>(`${ORDER_ENDPOINTS.LIST}${query}`, {
    method: "GET",
  });
}

export async function apiGetOrder(orderId: string) {
  return apiFetch<BackendOrder>(ORDER_ENDPOINTS.DETAIL(orderId), {
    method: "GET",
  });
}

export async function apiCheckout(data: CheckoutRequest) {
  return apiFetch<BackendOrder>(ORDER_ENDPOINTS.CHECKOUT, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

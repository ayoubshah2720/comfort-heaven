import { apiFetch } from "@/lib/api-client";
import { CART_ENDPOINTS } from "@/constants/api";
import type { BackendCart, AddCartItemRequest, UpdateCartItemRequest } from "@/types/cart";

export async function apiGetCart() {
  return apiFetch<BackendCart>(CART_ENDPOINTS.GET, { method: "GET" });
}

export async function apiAddCartItem(data: AddCartItemRequest) {
  return apiFetch<BackendCart>(CART_ENDPOINTS.ADD_ITEM, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiUpdateCartItem(itemId: string, data: UpdateCartItemRequest) {
  return apiFetch<BackendCart>(CART_ENDPOINTS.UPDATE_ITEM(itemId), {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiRemoveCartItem(itemId: string) {
  return apiFetch<BackendCart>(CART_ENDPOINTS.REMOVE_ITEM(itemId), {
    method: "DELETE",
  });
}

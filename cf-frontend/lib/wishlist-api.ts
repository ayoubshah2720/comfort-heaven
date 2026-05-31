import { apiFetch } from "@/lib/api-client";
import { WISHLIST_ENDPOINTS } from "@/constants/api";
import type {
  BackendWishlistItem,
  ToggleWishlistRequest,
  ToggleWishlistResponse,
} from "@/types/wishlist";

export async function apiGetWishlist() {
  return apiFetch<BackendWishlistItem[]>(WISHLIST_ENDPOINTS.GET, {
    method: "GET",
  });
}

export async function apiToggleWishlistItem(data: ToggleWishlistRequest) {
  return apiFetch<ToggleWishlistResponse>(WISHLIST_ENDPOINTS.TOGGLE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiRemoveWishlistItem(itemId: string) {
  return apiFetch<BackendWishlistItem[]>(WISHLIST_ENDPOINTS.REMOVE_ITEM(itemId), {
    method: "DELETE",
  });
}

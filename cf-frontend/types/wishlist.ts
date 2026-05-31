export interface WishlistProductRef {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  priceCents: number;
  isActive: boolean;
}

export interface BackendWishlistItem {
  id: string;
  productId: string;
  product: WishlistProductRef;
  createdAt: string;
}

export interface ToggleWishlistRequest {
  productId: string;
}

export interface ToggleWishlistResponse {
  action: "added" | "removed";
  items: BackendWishlistItem[];
}

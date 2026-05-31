export interface CartProductRef {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  priceCents: number;
  isActive: boolean;
}

export interface BackendCartItem {
  id: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  product: CartProductRef;
}

export interface BackendCart {
  id: string | null;
  items: BackendCartItem[];
  totals: {
    itemsCount: number;
    subtotalCents: number;
  };
}

export interface AddCartItemRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

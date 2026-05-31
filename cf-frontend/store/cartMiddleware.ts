import type { Middleware } from "@reduxjs/toolkit";
import { saveGuestCart } from "@/lib/cart-storage";

const GUEST_CART_ACTIONS = [
  "cart/addToCart",
  "cart/removeFromCart",
  "cart/updateQuantity",
  "cart/clearCart",
];

export const cartPersistMiddleware: Middleware =
  (storeApi) => (next) => (action) => {
    const result = next(action);

    if (
      typeof action === "object" &&
      action !== null &&
      "type" in action &&
      typeof (action as { type: string }).type === "string" &&
      GUEST_CART_ACTIONS.includes((action as { type: string }).type)
    ) {
      const state = storeApi.getState();
      if (!state.auth.isAuthenticated) {
        saveGuestCart(state.cart.items);
      }
    }

    return result;
  };

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { VAT_RATE, ECO_TAX } from "@/constants";
import type { BackendCart } from "@/types/cart";
import { apiGetCart, apiAddCartItem, apiUpdateCartItem, apiRemoveCartItem } from "@/lib/cart-api";

export interface CartItem {
  productId: string | number;
  name: string;
  price: number;
  originalPrice: number;
  imageSrc: string;
  quantity: number;
  backendItemId?: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

function backendCartToItems(cart: BackendCart): CartItem[] {
  return cart.items.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    price: item.unitPriceCents / 100,
    originalPrice: item.product.priceCents / 100,
    imageSrc: item.product.imageUrl || "/placeholder.png",
    quantity: item.quantity,
    backendItemId: item.id,
  }));
}

export const fetchCartThunk = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const result = await apiGetCart();
    return backendCartToItems(result.data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch cart";
    return rejectWithValue(msg);
  }
});

export const addToCartThunk = createAsyncThunk<
  CartItem[],
  { productId: string; quantity?: number },
  { rejectValue: string }
>("cart/addToCartApi", async (data, { rejectWithValue }) => {
  try {
    const result = await apiAddCartItem(data);
    return backendCartToItems(result.data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to add item";
    return rejectWithValue(msg);
  }
});

export const updateCartItemThunk = createAsyncThunk<
  CartItem[],
  { backendItemId: string; quantity: number },
  { rejectValue: string }
>("cart/updateCartItemApi", async ({ backendItemId, quantity }, { rejectWithValue }) => {
  try {
    const result = await apiUpdateCartItem(backendItemId, { quantity });
    return backendCartToItems(result.data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update item";
    return rejectWithValue(msg);
  }
});

export const removeCartItemThunk = createAsyncThunk<
  CartItem[],
  { backendItemId: string },
  { rejectValue: string }
>("cart/removeCartItemApi", async ({ backendItemId }, { rejectWithValue }) => {
  try {
    const result = await apiRemoveCartItem(backendItemId);
    return backendCartToItems(result.data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to remove item";
    return rejectWithValue(msg);
  }
});

export const syncGuestCartThunk = createAsyncThunk<
  CartItem[],
  CartItem[],
  { rejectValue: string }
>("cart/syncGuestCart", async (guestItems, { rejectWithValue }) => {
  try {
    for (const item of guestItems) {
      await apiAddCartItem({
        productId: String(item.productId),
        quantity: item.quantity,
      });
    }
    const result = await apiGetCart();
    return backendCartToItems(result.data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to sync cart";
    return rejectWithValue(msg);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<string | number>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string | number; quantity: number }>
    ) {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    setCartFromGuest(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    setCartFromBackend(state, action: PayloadAction<BackendCart>) {
      state.items = backendCartToItems(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch cart";
      });

    builder
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add item";
      });

    builder
      .addCase(updateCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update item";
      });

    builder
      .addCase(removeCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to remove item";
      });

    builder
      .addCase(syncGuestCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncGuestCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(syncGuestCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to sync cart";
      });

    builder.addMatcher(
      (action) => action.type === "auth/logout/fulfilled",
      (state) => {
        state.items = [];
        state.loading = false;
        state.error = null;
      }
    );
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartFromGuest,
  setCartFromBackend,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectCartOrderSummary = (state: RootState) => {
  const subtotal = state.cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const ecoTax = ECO_TAX;
  const total = subtotal + vat + ecoTax;
  return { subtotal, vat, ecoTax, total };
};

export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;

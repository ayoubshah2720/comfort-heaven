import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { BackendWishlistItem } from "@/types/wishlist";
import {
  apiGetWishlist,
  apiToggleWishlistItem,
  apiRemoveWishlistItem,
} from "@/lib/wishlist-api";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  imageSrc: string;
  addedAt: string;
  backendItemId: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

function backendItemsToWishlistItems(
  items: BackendWishlistItem[]
): WishlistItem[] {
  return items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    price: item.product.priceCents / 100,
    originalPrice: item.product.priceCents / 100,
    imageSrc: item.product.imageUrl || "/placeholder.png",
    addedAt: item.createdAt,
    backendItemId: item.id,
  }));
}

export const fetchWishlistThunk = createAsyncThunk<
  WishlistItem[],
  void,
  { rejectValue: string }
>("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await apiGetWishlist();
    return backendItemsToWishlistItems(res.data!);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : (err as { message?: string })?.message || "Failed to load wishlist";
    return rejectWithValue(message);
  }
});

export const toggleWishlistThunk = createAsyncThunk<
  WishlistItem[],
  { productId: string },
  { rejectValue: string }
>("wishlist/toggle", async ({ productId }, { rejectWithValue }) => {
  try {
    const res = await apiToggleWishlistItem({ productId });
    return backendItemsToWishlistItems(res.data!.items);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : (err as { message?: string })?.message || "Failed to update wishlist";
    return rejectWithValue(message);
  }
});

export const removeWishlistItemThunk = createAsyncThunk<
  WishlistItem[],
  { backendItemId: string },
  { rejectValue: string }
>("wishlist/remove", async ({ backendItemId }, { rejectWithValue }) => {
  try {
    const res = await apiRemoveWishlistItem(backendItemId);
    return backendItemsToWishlistItems(res.data!);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : (err as { message?: string })?.message ||
        "Failed to remove wishlist item";
    return rejectWithValue(message);
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load wishlist";
      })
      .addCase(toggleWishlistThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleWishlistThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleWishlistThunk.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update wishlist";
      })
      .addCase(removeWishlistItemThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(removeWishlistItemThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeWishlistItemThunk.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to remove wishlist item";
      })
      .addMatcher(
        (action) => action.type === "auth/logout/fulfilled",
        (state) => {
          state.items = [];
          state.loading = false;
          state.error = null;
        }
      );
  },
});

export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistCount = (state: RootState) =>
  state.wishlist.items.length;
export const selectIsInWishlist = (
  state: RootState,
  productId: string | number
) => state.wishlist.items.some((item) => String(item.productId) === String(productId));
export const selectWishlistTotal = (state: RootState) =>
  state.wishlist.items.reduce((sum, item) => sum + item.price, 0);
export const selectWishlistLoading = (state: RootState) =>
  state.wishlist.loading;
export const selectWishlistError = (state: RootState) => state.wishlist.error;

export default wishlistSlice.reducer;

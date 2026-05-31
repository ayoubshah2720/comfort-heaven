import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { HeaderCategory } from "@/types/product";
import { apiFetch } from "@/lib/api-client";
import { CATEGORY_ENDPOINTS } from "@/constants/api";

interface HeaderCategoriesState {
  categories: HeaderCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: HeaderCategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchHeaderCategoriesThunk = createAsyncThunk<
  HeaderCategory[],
  void,
  { rejectValue: string }
>("headerCategories/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await apiFetch<HeaderCategory[]>(CATEGORY_ENDPOINTS.HEADER);
    return res.data!;
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : (err as { message?: string })?.message ||
        "Failed to load header categories";
    return rejectWithValue(message);
  }
});

const headerCategoriesSlice = createSlice({
  name: "headerCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeaderCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeaderCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchHeaderCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load header categories";
      });
  },
});

export const selectHeaderCategories = (state: RootState) =>
  state.headerCategories.categories;
export const selectHeaderCategoriesLoading = (state: RootState) =>
  state.headerCategories.loading;

export default headerCategoriesSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

interface FiltersState {
  selectedCategories: string[];
  selectedManufacturers: string[];
  priceMin: number;
  priceMax: number;
  selectedColors: string[];
}

const initialState: FiltersState = {
  selectedCategories: [],
  selectedManufacturers: [],
  priceMin: 0,
  priceMax: 999,
  selectedColors: [],
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleCategory(state, action: PayloadAction<string>) {
      const index = state.selectedCategories.indexOf(action.payload);
      if (index >= 0) {
        state.selectedCategories.splice(index, 1);
      } else {
        state.selectedCategories.push(action.payload);
      }
    },
    toggleManufacturer(state, action: PayloadAction<string>) {
      const index = state.selectedManufacturers.indexOf(action.payload);
      if (index >= 0) {
        state.selectedManufacturers.splice(index, 1);
      } else {
        state.selectedManufacturers.push(action.payload);
      }
    },
    setPriceRange(
      state,
      action: PayloadAction<{ min: number; max: number }>
    ) {
      state.priceMin = action.payload.min;
      state.priceMax = action.payload.max;
    },
    toggleColor(state, action: PayloadAction<string>) {
      const index = state.selectedColors.indexOf(action.payload);
      if (index >= 0) {
        state.selectedColors.splice(index, 1);
      } else {
        state.selectedColors.push(action.payload);
      }
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  toggleCategory,
  toggleManufacturer,
  setPriceRange,
  toggleColor,
  resetFilters,
} = filtersSlice.actions;

export const selectFilters = (state: RootState) => state.filters;
export const selectSelectedCategories = (state: RootState) =>
  state.filters.selectedCategories;
export const selectSelectedManufacturers = (state: RootState) =>
  state.filters.selectedManufacturers;
export const selectPriceRange = (state: RootState) => ({
  min: state.filters.priceMin,
  max: state.filters.priceMax,
});
export const selectSelectedColors = (state: RootState) =>
  state.filters.selectedColors;

export default filtersSlice.reducer;

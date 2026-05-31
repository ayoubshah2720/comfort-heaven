"use client";

import { createContext, useContext } from "react";
import type { BackendProduct, PaginationMeta, BackendSubCategory, BackendBrand } from "@/types/product";

export interface CategoryFilterContextValue {
  subCategorySlug: string;
  brandId: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  sortOrder: string;
  page: number;

  filteredProducts: BackendProduct[];
  paginatedProducts: BackendProduct[];
  pagination: PaginationMeta;

  isLoading: boolean;
  error: string | null;

  subcategories: BackendSubCategory[];
  brands: BackendBrand[];
  categorySlug: string;

  setSubCategorySlug: (slug: string) => void;
  setBrandId: (id: string) => void;
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  setSort: (sortBy: string, sortOrder: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const CategoryFilterContext = createContext<CategoryFilterContextValue | null>(null);

export function useCategoryFilters(): CategoryFilterContextValue {
  const ctx = useContext(CategoryFilterContext);
  if (!ctx) {
    throw new Error("useCategoryFilters must be used within a CategoryProductSection");
  }
  return ctx;
}

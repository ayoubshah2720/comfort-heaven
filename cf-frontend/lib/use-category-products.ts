"use client";

import { useState, useRef, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";
import { buildProductSearchParams } from "@/lib/search-params";
import { PRODUCT_ENDPOINTS } from "@/constants/api";
import type { ProductFilters } from "@/lib/search-params";
import type { BackendProduct, PaginationMeta, PaginatedProducts } from "@/types/product";

interface UseCategoryProductsOptions {
  categorySlug: string;
  initialProducts?: BackendProduct[];
  initialPagination?: PaginationMeta;
}

interface UseCategoryProductsReturn {
  products: BackendProduct[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  fetchProducts: (filters: ProductFilters) => void;
}

export function useCategoryProducts({
  categorySlug,
  initialProducts = [],
  initialPagination = { page: 1, pageSize: 12, total: 0, totalPages: 0 },
}: UseCategoryProductsOptions): UseCategoryProductsReturn {
  const [products, setProducts] = useState<BackendProduct[]>(initialProducts);
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(
    (filters: ProductFilters) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      const searchParams = buildProductSearchParams(filters);
      searchParams.categorySlug = categorySlug;

      const queryString = new URLSearchParams(searchParams).toString();
      const endpoint = `${PRODUCT_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ""}`;

      apiFetch<PaginatedProducts>(endpoint, { signal: controller.signal })
        .then((response) => {
          if (controller.signal.aborted) return;
          setProducts(response.data.products);
          setPagination(response.data.pagination);
          setIsLoading(false);
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          setError(err?.message || "Failed to load products");
          setIsLoading(false);
        });
    },
    [categorySlug]
  );

  return { products, pagination, isLoading, error, fetchProducts };
}

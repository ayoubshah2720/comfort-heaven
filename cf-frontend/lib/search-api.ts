import { apiFetch } from "@/lib/api-client";
import { PRODUCT_ENDPOINTS } from "@/constants/api";
import type { PaginatedProducts } from "@/types/product";

export async function apiSearchProducts(
  query: string,
  pageSize = 6,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({ q: query, pageSize: String(pageSize) });
  return apiFetch<PaginatedProducts>(
    `${PRODUCT_ENDPOINTS.LIST}?${params.toString()}`,
    { signal },
  );
}

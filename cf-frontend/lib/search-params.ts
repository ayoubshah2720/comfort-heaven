export interface ProductFilters {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  sortOrder?: string;
  subCategorySlug?: string;
  brandId?: string;
  minPrice?: string;
  maxPrice?: string;
}

const FILTER_KEYS: (keyof ProductFilters)[] = [
  "page",
  "pageSize",
  "sortBy",
  "sortOrder",
  "subCategorySlug",
  "brandId",
  "minPrice",
  "maxPrice",
];

export function parseProductFilters(
  searchParams: Record<string, string | string[] | undefined>
): ProductFilters {
  const filters: ProductFilters = {};
  for (const key of FILTER_KEYS) {
    const value = searchParams[key];
    if (typeof value === "string" && value !== "") {
      filters[key] = value;
    }
  }
  return filters;
}

export function buildProductSearchParams(
  filters: ProductFilters
): Record<string, string> {
  const params: Record<string, string> = {};
  for (const key of FILTER_KEYS) {
    const value = filters[key];
    if (value !== undefined && value !== "") {
      params[key] = value;
    }
  }
  return params;
}

export function buildFilterUrl(
  categorySlug: string,
  currentFilters: ProductFilters,
  updates: Partial<ProductFilters>
): string {
  const merged = { ...currentFilters, ...updates };
  if (!("page" in updates)) {
    delete merged.page;
  }
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = merged[key];
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return `/categories/${categorySlug}${qs ? `?${qs}` : ""}`;
}

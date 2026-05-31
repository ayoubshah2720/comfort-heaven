import type { BackendProduct, PaginationMeta } from "@/types/product";

export interface ClientFilters {
  subCategorySlug: string;
  brandId: string;
  minPrice: number | null;
  maxPrice: number | null;
}

export function filterProducts(
  products: BackendProduct[],
  filters: ClientFilters
): BackendProduct[] {
  return products.filter((p) => {
    if (filters.subCategorySlug && p.subCategory.slug !== filters.subCategorySlug) {
      return false;
    }
    if (filters.brandId && p.brand?.id !== filters.brandId) {
      return false;
    }
    if (filters.minPrice !== null && p.priceCents < filters.minPrice * 100) {
      return false;
    }
    if (filters.maxPrice !== null && p.priceCents > filters.maxPrice * 100) {
      return false;
    }
    return true;
  });
}

export function sortProducts(
  products: BackendProduct[],
  sortBy: string,
  sortOrder: string
): BackendProduct[] {
  const sorted = [...products];
  sorted.sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case "priceCents":
        cmp = a.priceCents - b.priceCents;
        break;
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "createdAt":
      default:
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }
    return sortOrder === "desc" ? -cmp : cmp;
  });
  return sorted;
}

export interface PaginatedResult {
  products: BackendProduct[];
  pagination: PaginationMeta;
}

export function paginateProducts(
  products: BackendProduct[],
  page: number,
  pageSize: number
): PaginatedResult {
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const sliced = products.slice(start, start + pageSize);

  return {
    products: sliced,
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
    },
  };
}

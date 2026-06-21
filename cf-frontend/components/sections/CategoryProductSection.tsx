"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import type { BackendProduct, BackendSubCategory, BackendBrand, PaginationMeta } from "@/types/product";
import type { ProductFilters } from "@/lib/search-params";
import { buildFilterUrl } from "@/lib/search-params";
import { useCategoryProducts } from "@/lib/use-category-products";
import { CategoryFilterContext } from "./CategoryFilterContext";
import CategorySidebar from "./CategorySidebar";
import CategoryProductGrid from "./CategoryProductGrid";

interface CategoryProductSectionProps {
  initialProducts?: BackendProduct[];
  initialPagination?: PaginationMeta;
  subcategories: BackendSubCategory[];
  brands: BackendBrand[];
  categorySlug: string;
  initialFilters: ProductFilters;
}

const PAGE_SIZE = 12;

export default function CategoryProductSection({
  initialProducts,
  initialPagination,
  subcategories,
  brands,
  categorySlug,
  initialFilters,
}: CategoryProductSectionProps) {
  const [subCategorySlug, setSubCategorySlug] = useState(initialFilters.subCategorySlug ?? "");
  const [brandId, setBrandId] = useState(initialFilters.brandId ?? "");
  const [minPrice, setMinPrice] = useState<number | null>(
    initialFilters.minPrice ? Number(initialFilters.minPrice) : null
  );
  const [maxPrice, setMaxPrice] = useState<number | null>(
    initialFilters.maxPrice ? Number(initialFilters.maxPrice) : null
  );
  const [sortBy, setSortBy] = useState(initialFilters.sortBy ?? "createdAt");
  const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder ?? "desc");
  const [page, setPage] = useState(Number(initialFilters.page) || 1);

  const { products, pagination, isLoading, error, fetchProducts } = useCategoryProducts({
    categorySlug,
    initialProducts,
    initialPagination,
  });

  const hasInitialProducts = (initialProducts?.length ?? 0) > 0;
  const isInitialMount = useRef(true);
  const prevFiltersRef = useRef({ subCategorySlug, brandId, minPrice, maxPrice, sortBy, sortOrder, page });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!hasInitialProducts) {
        const filters: ProductFilters = {
          pageSize: String(PAGE_SIZE),
        };
        if (subCategorySlug) filters.subCategorySlug = subCategorySlug;
        if (brandId) filters.brandId = brandId;
        if (minPrice !== null) filters.minPrice = String(minPrice);
        if (maxPrice !== null) filters.maxPrice = String(maxPrice);
        if (sortBy !== "createdAt") filters.sortBy = sortBy;
        if (sortOrder !== "desc") filters.sortOrder = sortOrder;
        if (page > 1) filters.page = String(page);
        fetchProducts(filters);
      }
      return;
    }

    const prev = prevFiltersRef.current;
    const filtersChanged =
      prev.subCategorySlug !== subCategorySlug ||
      prev.brandId !== brandId ||
      prev.minPrice !== minPrice ||
      prev.maxPrice !== maxPrice ||
      prev.sortBy !== sortBy ||
      prev.sortOrder !== sortOrder;

    let effectivePage = page;
    if (filtersChanged && page !== 1) {
      setPage(1);
      effectivePage = 1;
    }

    prevFiltersRef.current = { subCategorySlug, brandId, minPrice, maxPrice, sortBy, sortOrder, page: effectivePage };

    const timer = setTimeout(() => {
      const filters: ProductFilters = {
        pageSize: String(PAGE_SIZE),
      };
      if (subCategorySlug) filters.subCategorySlug = subCategorySlug;
      if (brandId) filters.brandId = brandId;
      if (minPrice !== null) filters.minPrice = String(minPrice);
      if (maxPrice !== null) filters.maxPrice = String(maxPrice);
      if (sortBy !== "createdAt") filters.sortBy = sortBy;
      if (sortOrder !== "desc") filters.sortOrder = sortOrder;
      if (effectivePage > 1) filters.page = String(effectivePage);

      fetchProducts(filters);
    }, 150);

    return () => clearTimeout(timer);
  }, [subCategorySlug, brandId, minPrice, maxPrice, sortBy, sortOrder, page, fetchProducts, hasInitialProducts]);

  useEffect(() => {
    const filters: ProductFilters = {};
    if (subCategorySlug) filters.subCategorySlug = subCategorySlug;
    if (brandId) filters.brandId = brandId;
    if (minPrice !== null) filters.minPrice = String(minPrice);
    if (maxPrice !== null) filters.maxPrice = String(maxPrice);
    if (sortBy !== "createdAt") filters.sortBy = sortBy;
    if (sortOrder !== "desc") filters.sortOrder = sortOrder;
    if (page > 1) filters.page = String(page);

    const url = buildFilterUrl(categorySlug, filters, filters.page ? { page: filters.page } : {});
    window.history.replaceState(null, "", url);
  }, [subCategorySlug, brandId, minPrice, maxPrice, sortBy, sortOrder, page, categorySlug]);

  const setSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }, []);

  const resetFilters = useCallback(() => {
    setSubCategorySlug("");
    setBrandId("");
    setMinPrice(null);
    setMaxPrice(null);
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  }, []);

  const contextValue = useMemo(
    () => ({
      subCategorySlug,
      brandId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page,
      filteredProducts: products,
      paginatedProducts: products,
      pagination,
      isLoading,
      error,
      subcategories,
      brands,
      categorySlug,
      setSubCategorySlug,
      setBrandId,
      setMinPrice,
      setMaxPrice,
      setSort,
      setPage,
      resetFilters,
    }),
    [
      subCategorySlug, brandId, minPrice, maxPrice, sortBy, sortOrder, page,
      products, pagination, isLoading, error,
      subcategories, brands, categorySlug,
      setSort, resetFilters,
    ]
  );

  const [showFilters, setShowFilters] = useState(false);

  return (
    <CategoryFilterContext.Provider value={contextValue}>
      <section className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 items-start">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="md:hidden flex items-center gap-2 bg-[#3D6B6B] text-white text-sm font-semibold px-4 py-2 uppercase tracking-wide"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          {showFilters ? "Hide Filters" : "Filters"}
        </button>
        <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-auto`}>
          <CategorySidebar />
        </div>
        <CategoryProductGrid />
      </section>
    </CategoryFilterContext.Provider>
  );
}

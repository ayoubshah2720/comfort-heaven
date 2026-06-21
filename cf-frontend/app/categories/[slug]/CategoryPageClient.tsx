"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar, Footer } from "@/components/layout";
import Header from "@/components/layout/Header";
import {
  CategoryHero,
  FeaturedCarousel,
  CategoryProductSection,
} from "@/components/sections";
import { FloatingChatButton } from "@/components/ui";
import { apiFetch } from "@/lib/api-client";
import { BRAND_ENDPOINTS, CATEGORY_ENDPOINTS, PRODUCT_ENDPOINTS } from "@/constants/api";
import { buildProductSearchParams, parseProductFilters } from "@/lib/search-params";
import type { BackendCategory, BackendBrand, PaginatedProducts } from "@/types/product";
import type { CarouselProduct } from "@/components/sections/FeaturedCarousel";
import CategoryPageSkeleton from "./CategoryPageSkeleton";

interface CategoryPageClientProps {
  slug: string;
}

interface CategoryPageData {
  category: BackendCategory;
  productsData: PaginatedProducts;
  brands: BackendBrand[];
}

const categoryPageCache = new Map<string, CategoryPageData>();

function formatSlugTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getCacheKey(slug: string, filters: ReturnType<typeof parseProductFilters>) {
  return JSON.stringify({
    slug,
    subCategorySlug: filters.subCategorySlug ?? "",
    brandId: filters.brandId ?? "",
    minPrice: filters.minPrice ?? "",
    maxPrice: filters.maxPrice ?? "",
    sortBy: filters.sortBy ?? "",
    sortOrder: filters.sortOrder ?? "",
    page: filters.page ?? "",
    pageSize: filters.pageSize ?? "",
  });
}

export default function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const searchParams = useSearchParams();
  const [initialFilters] = useState(() =>
    parseProductFilters(Object.fromEntries(searchParams.entries()))
  );
  const cacheKey = useMemo(
    () => getCacheKey(slug, initialFilters),
    [slug, initialFilters]
  );
  const cachedData = useMemo(
    () => categoryPageCache.get(cacheKey) ?? null,
    [cacheKey]
  );

  const [category, setCategory] = useState<BackendCategory | null>(
    cachedData?.category ?? null
  );
  const [productsData, setProductsData] = useState<PaginatedProducts | null>(
    cachedData?.productsData ?? null
  );
  const [brands, setBrands] = useState<BackendBrand[]>(
    cachedData?.brands ?? []
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) {
      setCategory(cachedData.category);
      setProductsData(cachedData.productsData);
      setBrands(cachedData.brands);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const initialSearchParams = buildProductSearchParams({
      ...initialFilters,
      pageSize: initialFilters.pageSize || "12",
    });

    setLoading(true);
    setError(null);

    Promise.all([
      apiFetch<BackendCategory>(CATEGORY_ENDPOINTS.DETAIL(slug), {
        signal: controller.signal,
      }),
      apiFetch<PaginatedProducts>(
        `${PRODUCT_ENDPOINTS.LIST}?${new URLSearchParams({
          categorySlug: slug,
          ...initialSearchParams,
        }).toString()}`,
        { signal: controller.signal }
      ),
      apiFetch<BackendBrand[]>(BRAND_ENDPOINTS.LIST, {
        signal: controller.signal,
      }),
    ])
      .then(([categoryRes, productsRes, brandsRes]) => {
        if (controller.signal.aborted) return;
        const nextData: CategoryPageData = {
          category: categoryRes.data,
          productsData: productsRes.data,
          brands: brandsRes.data,
        };
        categoryPageCache.set(cacheKey, nextData);
        setCategory(nextData.category);
        setProductsData(nextData.productsData);
        setBrands(nextData.brands);
        setLoading(false);
      })
      .catch((fetchError) => {
        if (controller.signal.aborted) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load category page."
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [slug, initialFilters, cacheKey, cachedData]);

  const carouselProducts: CarouselProduct[] = useMemo(() => {
    if (!productsData) return [];
    return productsData.products.slice(0, 10).map((p) => ({
      id: p.id as unknown as number,
      name: p.name,
      price: p.priceCents / 100,
      originalPrice: p.priceCents / 100,
      imageSrc:
        p.images.find((i) => i.isCover)?.url || p.images[0]?.url || p.imageUrl || "/sofa.png",
      rating: 4,
    }));
  }, [productsData]);

  if (loading) {
    return <CategoryPageSkeleton />;
  }

  if (error || !category || !productsData) {
    return (
      <main className="min-h-screen bg-white">
        <AnnouncementBar />
        <Header />
        <section className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {formatSlugTitle(slug)}
          </h1>
          <p className="mt-4 text-sm text-red-600">
            {error || "Failed to load category."}
          </p>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />

      <CategoryHero
        title={category.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/#categories" },
          { label: category.name },
        ]}
        backgroundImage={
          category.imageUrl ||
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80"
        }
      />

      {carouselProducts.length > 0 && (
        <FeaturedCarousel
          title={`Featured ${category.name}`}
          subtitle={
            category.description ||
            `Browse our collection of ${category.name.toLowerCase()}`
          }
          products={carouselProducts}
        />
      )}

      <FloatingChatButton />

      <CategoryProductSection
        key={slug}
        initialProducts={productsData.products}
        initialPagination={productsData.pagination}
        subcategories={category.subcategories}
        brands={brands}
        categorySlug={slug}
        initialFilters={initialFilters}
      />

      <Footer />
    </main>
  );
}

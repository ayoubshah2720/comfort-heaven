import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnnouncementBar, Header, Footer } from "@/components/layout";
import {
  CategoryHero,
  FeaturedCarousel,
  CategoryProductSection,
} from "@/components/sections";
import { FloatingChatButton } from "@/components/ui";
import { serverFetch } from "@/lib/api-server";
import { CATEGORY_ENDPOINTS, PRODUCT_ENDPOINTS, BRAND_ENDPOINTS } from "@/constants/api";
import { parseProductFilters, buildProductSearchParams } from "@/lib/search-params";
import type { BackendCategory, PaginatedProducts, BackendBrand } from "@/types/product";
import type { CarouselProduct } from "@/components/sections/FeaturedCarousel";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await serverFetch<BackendCategory>(CATEGORY_ENDPOINTS.DETAIL(slug));
    return {
      title: `${category.name} | Furniture Shop`,
      description: category.description || `Browse ${category.name} products`,
    };
  } catch {
    return { title: "Category Not Found" };
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;
  const initialFilters = parseProductFilters(rawSearchParams);

  let category: BackendCategory;
  try {
    category = await serverFetch<BackendCategory>(CATEGORY_ENDPOINTS.DETAIL(slug));
  } catch {
    notFound();
  }

  const initialSearchParams = buildProductSearchParams({
    ...initialFilters,
    pageSize: initialFilters.pageSize || "12",
  });

  const [productsData, carouselData, brands] = await Promise.all([
    serverFetch<PaginatedProducts>(PRODUCT_ENDPOINTS.LIST, {
      searchParams: { categorySlug: slug, ...initialSearchParams },
      revalidate: 30,
    }),
    serverFetch<PaginatedProducts>(PRODUCT_ENDPOINTS.LIST, {
      searchParams: { categorySlug: slug, pageSize: "10" },
      revalidate: 30,
    }),
    serverFetch<BackendBrand[]>(BRAND_ENDPOINTS.LIST, { revalidate: 120 }).catch(() => [] as BackendBrand[]),
  ]);

  const carouselProducts: CarouselProduct[] = carouselData.products.slice(0, 10).map((p) => ({
    id: p.id as unknown as number,
    name: p.name,
    price: p.priceCents / 100,
    originalPrice: p.priceCents / 100,
    imageSrc: p.images.find((i) => i.isCover)?.url || p.images[0]?.url || p.imageUrl || "/sofa.png",
    rating: 4,
  }));

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
        backgroundImage={category.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80"}
      />

      {carouselProducts.length > 0 && (
        <FeaturedCarousel
          title={`Featured ${category.name}`}
          subtitle={category.description || `Browse our collection of ${category.name.toLowerCase()}`}
          products={carouselProducts}
        />
      )}

      <FloatingChatButton />

      <CategoryProductSection
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

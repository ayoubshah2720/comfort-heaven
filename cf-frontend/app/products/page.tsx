import { AnnouncementBar, Footer, Header } from "@/components/layout";
import { FloatingChatButton } from "@/components/ui";
import ProductCard from "@/components/sections/ProductCard";
import { PRODUCT_ENDPOINTS } from "@/constants/api";
import { serverFetch } from "@/lib/api-server";
import { getProductCoverImage } from "@/lib/product-utils";
import type { PaginatedProducts } from "@/types/product";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getStringParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = getStringParam(params.q).trim();
  const page = getStringParam(params.page).trim() || "1";

  let results: PaginatedProducts["products"] = [];
  let total = 0;

  if (query) {
    try {
      const data = await serverFetch<PaginatedProducts>(PRODUCT_ENDPOINTS.LIST, {
        searchParams: { q: query, page, pageSize: "18" },
        revalidate: 30,
      });
      results = data.products;
      total = data.pagination.total;
    } catch {
      results = [];
      total = 0;
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Products</h1>
          <p className="mt-2 text-sm text-gray-500">
            {query
              ? `${total} result(s) for "${query}"`
              : "Use the search bar above to find products."}
          </p>
        </div>

        {!query ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center text-gray-500">
            Start typing a product name to see matching results.
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <p className="text-lg text-gray-700">No matching products found.</p>
            <p className="mt-2 text-sm text-gray-500">
              Try a shorter phrase or a different keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  imageSrc: getProductCoverImage(product),
                  price: product.priceCents / 100,
                  originalPrice: product.comparePriceCents
                    ? product.comparePriceCents / 100
                    : undefined,
                  category: product.category.name,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <FloatingChatButton />
      <Footer />
    </main>
  );
}

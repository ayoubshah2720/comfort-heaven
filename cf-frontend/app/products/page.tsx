import { AnnouncementBar, Footer, Header } from "@/components/layout";
import { FloatingChatButton } from "@/components/ui";
import ProductCard from "@/components/sections/ProductCard";
import { PRODUCT_ENDPOINTS } from "@/constants/api";
import { serverFetch } from "@/lib/api-server";
import { getProductCoverImage } from "@/lib/product-utils";
import type { PaginatedProducts } from "@/types/product";
import Link from "next/link";

const PRODUCTS_PER_PAGE = 15;

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getStringParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getProductsHref(page: number, query: string): string {
  const params = new URLSearchParams({ page: String(page) });
  if (query) {
    params.set("q", query);
  }
  return `/products?${params.toString()}`;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = getStringParam(params.q).trim();
  const pageParam = getStringParam(params.page).trim() || "1";
  const currentPage = Math.max(1, Number.parseInt(pageParam, 10) || 1);

  let results: PaginatedProducts["products"] = [];
  let total = 0;
  let totalPages = 0;
  let pageSize = PRODUCTS_PER_PAGE;

  try {
    const data = await serverFetch<PaginatedProducts>(PRODUCT_ENDPOINTS.LIST, {
      searchParams: query
        ? { q: query, page: String(currentPage), pageSize: String(PRODUCTS_PER_PAGE) }
        : { page: String(currentPage), pageSize: String(PRODUCTS_PER_PAGE) },
      revalidate: 30,
    });
    results = data.products;
    total = data.pagination.total;
    totalPages = data.pagination.totalPages;
    pageSize = data.pagination.pageSize;
  } catch {
    results = [];
    total = 0;
    totalPages = 0;
  }

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = total === 0 ? 0 : rangeStart + results.length - 1;

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {query ? "Search Products" : "All Products"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {query
              ? `${total} result(s) for "${query}"`
              : `${total} product(s) across all categories.`}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <p className="text-lg text-gray-700">
              {query ? "No matching products found." : "No products found."}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {query
                ? "Try a shorter phrase or a different keyword."
                : "Products will appear here once they are available."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
              <span>
                Showing {rangeStart}-{rangeEnd} of {total}
              </span>
              {totalPages > 1 && (
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

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

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-end gap-2">
                {currentPage > 1 && (
                  <Link
                    href={getProductsHref(currentPage - 1, query)}
                    className="rounded border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-[#3D6B6B] hover:text-[#3D6B6B]"
                  >
                    Previous
                  </Link>
                )}

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  return (
                    <Link
                      key={page}
                      href={getProductsHref(page, query)}
                      className={`flex h-8 w-8 items-center justify-center border text-xs font-semibold transition-colors ${
                        currentPage === page
                          ? "border-[#3D6B6B] bg-[#3D6B6B] text-white"
                          : "border-gray-300 text-gray-600 hover:border-[#3D6B6B] hover:text-[#3D6B6B]"
                      }`}
                    >
                      {page}
                    </Link>
                  );
                })}

                {currentPage < totalPages && (
                  <Link
                    href={getProductsHref(currentPage + 1, query)}
                    className="rounded border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-[#3D6B6B] hover:text-[#3D6B6B]"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <FloatingChatButton />
      <Footer />
    </main>
  );
}

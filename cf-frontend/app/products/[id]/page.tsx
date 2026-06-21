import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnnouncementBar, Header, Footer } from "@/components/layout";
import {
  ProductHero,
  ProductDescription,
  RelatedProducts,
} from "@/components/sections";
import { serverFetch } from "@/lib/api-server";
import { PRODUCT_ENDPOINTS } from "@/constants/api";
import { getProductById } from "@/lib/storefront-api";
import type {
  BackendProductDetail,
  PaginatedProducts,
} from "@/types/product";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    return {
      title: `${product.name} — Rs ${(product.priceCents / 100).toLocaleString()}.00`,
      description: product.description || product.name,
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product: BackendProductDetail;
  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  let relatedProducts: PaginatedProducts["products"] = [];
  try {
    const relatedData = await serverFetch<PaginatedProducts>(
      PRODUCT_ENDPOINTS.LIST,
      {
        searchParams: {
          categorySlug: product.category.slug,
          pageSize: "11",
        },
        revalidate: 30,
      }
    );
    relatedProducts = relatedData.products
      .filter((p) => p.id !== product.id)
      .slice(0, 10);
  } catch {
  }

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <ProductHero product={product} />
      <ProductDescription product={product} />
      <RelatedProducts products={relatedProducts} />
      <Footer />
    </main>
  );
}

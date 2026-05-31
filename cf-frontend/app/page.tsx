import { AnnouncementBar, Header, Footer } from "@/components/layout";
import {
  HeroSection,
  FeaturesBar,
  CategoryGrid,
  NewArrivals,
  PopularProducts,
  FeaturedProducts,
  Newsletter,
} from "@/components/sections";
import { FloatingChatButton } from "@/components/ui";
import { serverFetch } from "@/lib/api-server";
import { CATEGORY_ENDPOINTS } from "@/constants/api";
import type { BackendCategory } from "@/types/product";

export default async function Home() {
  let categories: { id: string; name: string; slug: string; imageUrl: string | null; productCount: number }[] = [];

  try {
    const data = await serverFetch<BackendCategory[]>(CATEGORY_ENDPOINTS.LIST);
    categories = data.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      imageUrl: c.imageUrl,
      productCount: c._count?.products ?? 0,
    }));
  } catch {
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Header />
      <HeroSection />
      <div className="max-w-6xl mx-auto px-4 -mt-3 sm:-mt-6 relative z-10">
        <FeaturesBar />
      </div>
      <CategoryGrid categories={categories} />
      <NewArrivals />
      <PopularProducts />
      <FeaturedProducts />
      <Newsletter />
      <Footer />
      <FloatingChatButton />
    </main>
  );
}

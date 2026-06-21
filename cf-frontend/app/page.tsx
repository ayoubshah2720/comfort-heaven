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
import { getCategories } from "@/lib/storefront-api";

export default async function Home() {
  const data = await getCategories();
  const categories = data.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    imageUrl: c.imageUrl,
    productCount: c._count?.products ?? 0,
  }));

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

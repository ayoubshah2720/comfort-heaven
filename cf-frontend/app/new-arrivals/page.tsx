import { AnnouncementBar, Header, Footer } from "@/components/layout";
import { FloatingChatButton } from "@/components/ui";
import { NewArrivalHero, NewArrivalsGrid } from "@/components/sections";
import { getNewArrivals } from "@/lib/storefront-api";
import type { NewArrivalProduct } from "@/components/sections/NewArrivalsGrid";

export default async function NewArrivalsPage() {
  const backendProducts = await getNewArrivals();

  const gridProducts: NewArrivalProduct[] = backendProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.priceCents / 100,
    originalPrice: p.priceCents / 100,
    imageSrc:
      p.images.find((i) => i.isCover)?.url ||
      p.images[0]?.url ||
      p.imageUrl ||
      "/sofa.png",
    rating: 4,
  }));

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <NewArrivalHero />

      <FloatingChatButton />

      <section id="products" className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-center text-2xl mb-8">
          Browse Our New <span className="font-bold underline">Arrival</span>
        </h2>
        <NewArrivalsGrid products={gridProducts} />
      </section>

      <Footer />
    </main>
  );
}

import { AnnouncementBar, Header, Footer } from "@/components/layout";
import { FloatingChatButton } from "@/components/ui";
import { CategoryHero, OrdersContent } from "@/components/sections";

export default function OrdersPage() {
  return (
    <main>
      <AnnouncementBar />
      <Header />
      <CategoryHero
        title="Order"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Order" },
        ]}
        backgroundImage="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80"
      />

      <FloatingChatButton />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <OrdersContent />
      </section>

      <Footer />
    </main>
  );
}

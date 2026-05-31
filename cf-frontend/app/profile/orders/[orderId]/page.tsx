import { AnnouncementBar, Header, Footer } from "@/components/layout";
import { FloatingChatButton } from "@/components/ui";
import { CategoryHero } from "@/components/sections";
import OrderDetailContent from "./OrderDetailContent";

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;

  return (
    <main>
      <AnnouncementBar />
      <Header />
      <CategoryHero
        title="Order Details"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Orders", href: "/profile/orders" },
          { label: "Order Details" },
        ]}
        backgroundImage="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80"
      />

      <FloatingChatButton />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <OrderDetailContent orderId={orderId} />
      </section>

      <Footer />
    </main>
  );
}

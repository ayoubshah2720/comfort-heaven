import { AnnouncementBar, Header, Footer } from "@/components/layout";
import { FloatingChatButton } from "@/components/ui";
import { CategoryHero, ProfileContent } from "@/components/sections";

export default function ProfilePage() {
  return (
    <main>
      <AnnouncementBar />
      <Header />
      <CategoryHero
        title="Profile"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Profile" },
        ]}
        backgroundImage="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80"
      />

      <FloatingChatButton />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <ProfileContent />
      </section>

      <Footer />
    </main>
  );
}

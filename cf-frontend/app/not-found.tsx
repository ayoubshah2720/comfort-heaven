import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar, Header, Footer } from "@/components/layout";
import { CategoryHero } from "@/components/sections";

export const metadata: Metadata = {
  title: "Page Not Found — Furniture Shop",
};

export default function NotFound() {
  return (
    <main>
      <AnnouncementBar />
      <Header />
      <CategoryHero
        title="Page Not Found"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "404" },
        ]}
        backgroundImage="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80"
      />
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-8xl font-bold text-[#E8B800] mb-6">404</p>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Oops! This page doesn&apos;t exist
        </h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for might have been moved, deleted, or
          perhaps never existed.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded transition-colors duration-200 bg-[#E8B800] text-white hover:bg-[#d4a700] font-semibold px-8 py-3 text-base"
          >
            Go to Homepage
          </Link>
          <Link
            href="/categories/office-chairs"
            className="inline-flex items-center justify-center rounded transition-colors duration-200 border border-[#E8B800] text-[#E8B800] hover:bg-[#E8B800] hover:text-white font-semibold px-8 py-3 text-base"
          >
            Browse Products
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}

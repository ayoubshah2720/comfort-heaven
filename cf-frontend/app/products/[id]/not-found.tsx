import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar, Header, Footer } from "@/components/layout";
import { CategoryHero } from "@/components/sections";

export const metadata: Metadata = {
  title: "Product Not Found — Furniture Shop",
};

export default function ProductNotFound() {
  return (
    <main>
      <AnnouncementBar />
      <Header />
      <CategoryHero
        title="Product Not Found"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/categories/office-chairs" },
          { label: "Not Found" },
        ]}
        backgroundImage="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80"
      />
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Magnifying glass icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3D6B6B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-6"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          We couldn&apos;t find that product
        </h2>
        <p className="text-gray-500 mb-8">
          The product you&apos;re looking for may have been removed, had its
          name changed, or is temporarily unavailable.
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

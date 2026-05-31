import Button from "@/components/ui/Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  productCount: number;
}

interface CategoryGridProps {
  title?: string;
  categories?: CategoryItem[];
  showMoreHref?: string;
}

interface CategoryCardProps {
  category: CategoryItem;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <div className="flex flex-col items-center transition-transform hover:-translate-y-2">
        <div className="relative w-full max-w-[170px] mx-auto aspect-[170/182] pt-3 pb-2 px-2 flex flex-col items-center justify-center">
          {/* SVG Card Shape */}
          <svg
            viewBox="0 0 250 267"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-1/2 -translate-x-1/2 z-0 w-full h-auto"
          >
            <path d="M209.182 167.415C210.789 167.39 212.233 166.408 212.795 164.902C218.214 150.4 220.172 134.818 218.5 119.392C216.732 103.085 210.961 87.4558 201.698 73.8881C192.436 60.3203 179.967 49.233 165.397 41.6082C150.827 33.9835 134.605 30.0567 118.168 30.1757C101.732 30.2947 85.5878 34.4558 71.1663 42.2904C56.7448 50.1249 44.491 61.3912 35.4903 75.0912C26.4897 88.7912 21.02 104.502 19.5657 120.832C18.1895 136.286 20.4497 151.843 26.1505 166.268C26.7391 167.758 28.192 168.712 29.7935 168.714L118.33 168.817L209.182 167.415Z" fill="#F9F9F9" />
            <rect x="51.2422" y="234" width="133" height="33" rx="4" fill="#E5D141" />
          </svg>
          {/* Image or fallback icon */}
          <span className="relative z-10 flex items-center justify-center mt-6 mb-2">
            <span className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full shadow border-2 border-[#E5D141] bg-white overflow-hidden">
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="#3D6B6B" strokeWidth="1.5" className="w-7 h-7">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )}
            </span>
          </span>
          {/* Name / count */}
          <span className="relative z-10 flex flex-col items-center mt-2">
            <span className="text-xs font-bold text-center text-[#4D4D4D] uppercase tracking-wider">{category.name}</span>
            <span className="text-[11px] text-gray-500 font-medium mt-0.5">{category.productCount} PRODUCTS</span>
          </span>
          {/* Button */}
          <span className="relative z-10 mt-4">
            <Button
              size="sm"
              className="text-xs rounded bg-[#E8B800] text-black font-semibold px-5 py-1 border-0 hover:bg-[#d4a700] shadow"
            >
              EXPLORE NOW
            </Button>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryGrid({
  categories = [],
  showMoreHref = "#",
}: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-2xl text-white mb-10 font-normal">
          Browse Our{" "}
          <span className="font-black text-[#3D6B6B]">Categories</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-6 sm:gap-y-10 gap-x-2 sm:gap-x-4 md:gap-x-8">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link href={showMoreHref}>
            <Button
              size="md"
              className="rounded bg-[#E8B800] text-black font-semibold px-10 py-2.5 text-sm border-0 hover:bg-[#d4a700]"
              style={{ boxShadow: "0 2px 6px 0 rgba(0,0,0,0.06)" }}
            >
              SEE MORE <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

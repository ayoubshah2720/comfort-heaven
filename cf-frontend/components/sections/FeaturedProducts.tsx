import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";
import Button from "@/components/ui/Button";

interface FeaturedProductsProps {
  title?: string;
  products?: Product[];
  showMoreHref?: string;
}

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "COMFY COUCH CHAIR",
    imageSrc: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80",
    price: 5305,
    originalPrice: 7000,
    currency: "Rs.",
    category: "Chair",
  },
  {
    id: 2,
    name: "STONE CEILING LAMP",
    imageSrc: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&q=80",
    price: 89295,
    currency: "Rs.",
    category: "Light",
  },
  {
    id: 3,
    name: "PILLOW GREY CHAIR",
    imageSrc: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    price: 70596,
    originalPrice: 90000,
    currency: "Rs.",
    category: "Chair",
  },
];

export default function FeaturedProducts({
  products = defaultProducts,
  showMoreHref = "/products",
}: FeaturedProductsProps) {
  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-2xl text-gray-800 underline underline-offset-8 mb-5">
          Featured <span className="font-bold text-[#3D6B6B]">Products</span>
        </h2>
        <div className="flex justify-center mb-8">
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link href={showMoreHref}>
            <Button variant="outline" size="md" className="rounded-none text-xs px-8">
              VIEW ALL PRODUCTS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";

export interface PopularProduct {
  src: string;
  alt: string;
  label: string;
  badge?: string;
  span?: "wide" | "tall" | "normal";
}

interface PopularProductsProps {
  title?: string;
  products?: PopularProduct[];
}


function ProductTile({ product }: { product: PopularProduct }) {
  return (
    <div className="relative overflow-hidden rounded group cursor-pointer">
      <img
        src={product.src}
        alt={product.alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        style={{ minHeight: product.span === "tall" ? "280px" : "130px" }}
      />
      {/* Label badge */}
      <div className="absolute bottom-2 left-2 bg-[#E8B800] text-white text-xs font-semibold px-3 py-1 rounded-sm">
        {product.label}
      </div>
    </div>
  );
}

const defaultProducts: PopularProduct[] = [
  {
    src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80",
    alt: "Bed Room",
    label: "Bed Room",
    badge: "Bed Room",
    span: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&q=80",
    alt: "Living Room",
    label: "Living Room",
    badge: "Living Room",
    span: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&q=80",
    alt: "Interior",
    label: "Interior",
    badge: "Interior",
    span: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1556909190-ece8f1ae89f2?w=400&q=80",
    alt: "Kitchen",
    label: "Kitchen",
    badge: "Kitchen",
    span: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=400&q=80",
    alt: "Study",
    label: "Study",
    badge: "Study",
    span: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80",
    alt: "TV Room",
    label: "Tv Room",
    badge: "Tv Room",
    span: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    alt: "Home",
    label: "Home",
    badge: "Home",
    span: "normal",
  },
];

export default function PopularProducts({
  products = defaultProducts,
  title = "Our Popular Products"
}: PopularProductsProps) {
  // Map product indices to role for easier grid assignment (matching screenshot and your updated text)
  // 0: Bed Room, 1: Living Room, 2: Interior, 3: Kitchen, 4: Study, 5: TV Room, 6: Home
  const [bedRoom, livingRoom, interior, kitchen, study, tvRoom, home] = products;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-2xl text-gray-800 underline underline-offset-8 mb-5">
          {title.split("Popular Products")[0]}
          <span className="font-bold text-[#3D6B6B]">Popular Products</span>
        </h2>

        {/* Custom CSS grid to match precise design */}

        <div className="flex justify-center">
          <Image src={"/popular-products.png"} alt="Popular Products" width={1000} height={1000} className="w-full" unoptimized />
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export interface Product {
  id: string | number;
  name: string;
  imageSrc: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  href?: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    name,
    imageSrc,
    price,
    originalPrice,
    currency = "Rs.",
    href,
    category,
  } = product;

  const linkHref = href ?? `/products/${id}`;

  return (
    <Link href={linkHref} className="group block">
      <div className="bg-gray-50 rounded overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden bg-white">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-gray-700 text-sm font-medium line-clamp-2">{name}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[#E8B800] font-bold text-sm">
              {currency} {price.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-gray-400 text-xs line-through">
                {currency} {originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {category && <p className="text-gray-400 text-xs mt-1">{category}</p>}
        </div>
      </div>
    </Link>
  );
}

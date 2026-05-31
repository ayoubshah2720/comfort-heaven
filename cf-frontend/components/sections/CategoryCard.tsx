import Button from "@/components/ui/Button";
import Link from "next/link";

export interface Category {
  icon: React.ReactNode;
  name: string;
  productCount: number;
  href?: string;
}

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <Link href={category.href || "#"}>
      {/* Icon circle */}
      <div className="w-20 h-20 rounded-full border-2 border-gray-200 flex items-center justify-center text-3xl group-hover:border-[#E8B800] transition-colors bg-white shadow-sm">
        {category.icon}
      </div>
      <p className="font-bold text-gray-800 text-xs text-center uppercase">{category.name}</p>
      <p className="text-gray-400 text-xs">{category.productCount} PRODUCTS</p>
      <Button size="sm" className="text-xs px-4 py-1 rounded-none">
        EXPLORE NOW
      </Button>
      </Link>
    </div>
  );
}

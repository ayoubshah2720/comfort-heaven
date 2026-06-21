import type { Metadata } from "next";
import CategoryPageClient from "./CategoryPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return {
    title: `${title} | Furniture Shop`,
    description: `Browse ${title} products`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}

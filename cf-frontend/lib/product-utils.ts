import type { BackendProduct } from "@/types/product";

export function getProductCoverImage(
  product: Pick<BackendProduct, "images" | "imageUrl">
): string {
  return (
    product.images.find((i) => i.isCover)?.url ||
    product.images[0]?.url ||
    product.imageUrl ||
    "/sofa.png"
  );
}

export function formatPrice(priceCents: number): string {
  return `Rs ${(priceCents / 100).toLocaleString()}.00`;
}

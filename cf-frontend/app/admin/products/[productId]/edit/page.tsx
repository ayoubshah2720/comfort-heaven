"use client";

import { useEffect, useState, useCallback, use } from "react";
import ProductForm from "@/components/admin/products/ProductForm";
import ProductImageManager from "@/components/admin/products/ProductImageManager";
import ProductFormSkeleton from "@/components/admin/products/ProductFormSkeleton";
import type { BackendProduct } from "@/types/product";
import { apiGetAdminProduct } from "@/lib/admin-api";

interface EditProductPageProps {
  params: Promise<{ productId: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { productId } = use(params);
  const [product, setProduct] = useState<BackendProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(() => {
    setLoading(true);
    apiGetAdminProduct(productId)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return <ProductFormSkeleton showImageManager />;
  }

  if (error || !product) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-sm text-red-600">
        {error || "Product not found"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ProductForm product={product} />
      <ProductImageManager
        productId={product.id}
        images={product.images}
        onUpdate={fetchProduct}
      />
    </div>
  );
}

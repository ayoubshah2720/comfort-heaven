import { cache } from "react";
import { BRAND_ENDPOINTS, CATEGORY_ENDPOINTS, PRODUCT_ENDPOINTS } from "@/constants/api";
import { serverFetch } from "@/lib/api-server";
import type {
  BackendBrand,
  BackendCategory,
  BackendProduct,
  BackendProductDetail,
  HeaderCategory,
} from "@/types/product";

export const getHeaderCategories = cache(async (): Promise<HeaderCategory[]> => {
  try {
    return await serverFetch<HeaderCategory[]>(CATEGORY_ENDPOINTS.HEADER, {
      revalidate: 300,
    });
  } catch {
    return [];
  }
});

export const getCategories = cache(async (): Promise<BackendCategory[]> => {
  try {
    return await serverFetch<BackendCategory[]>(CATEGORY_ENDPOINTS.LIST, {
      revalidate: 300,
    });
  } catch {
    return [];
  }
});

export const getCategoryBySlug = cache(async (slug: string): Promise<BackendCategory> => {
  return serverFetch<BackendCategory>(CATEGORY_ENDPOINTS.DETAIL(slug), {
    revalidate: 300,
  });
});

export const getProductById = cache(async (id: string): Promise<BackendProductDetail> => {
  return serverFetch<BackendProductDetail>(PRODUCT_ENDPOINTS.DETAIL(id), {
    revalidate: 30,
  });
});

export const getNewArrivals = cache(async (): Promise<BackendProduct[]> => {
  try {
    return await serverFetch<BackendProduct[]>(PRODUCT_ENDPOINTS.NEW_ARRIVALS, {
      revalidate: 60,
    });
  } catch {
    return [];
  }
});

export const getBrands = cache(async (): Promise<BackendBrand[]> => {
  try {
    return await serverFetch<BackendBrand[]>(BRAND_ENDPOINTS.LIST, {
      revalidate: 300,
    });
  } catch {
    return [];
  }
});

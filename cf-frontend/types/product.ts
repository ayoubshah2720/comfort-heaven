export interface EntityRef {
  id: string;
  name: string;
  slug: string;
}

export interface BackendProductImage {
  id: string;
  url: string;
  altText: string | null;
  isCover: boolean;
}

export interface Specification {
  label: string;
  value: string;
}

export interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  priceCents: number;
  comparePriceCents: number | null;
  category: EntityRef;
  subCategory: EntityRef;
  brand: EntityRef | null;
  vendor: EntityRef | null;
  collection: EntityRef | null;
  images: BackendProductImage[];
  isActive: boolean;
  isNewArrival: boolean;
  longDescription: string | null;
  productDetails: string[];
  dimensions: string[];
  careAndCleaning: string | null;
  specifications: Specification[] | null;
  tags: string[];
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  reviewCount: number;
}

export interface BackendProductDetail extends BackendProduct {
  reviewSummary: ReviewSummary;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedProducts {
  products: BackendProduct[];
  pagination: PaginationMeta;
}

export interface BackendSubCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  subcategories: BackendSubCategory[];
  _count?: { products: number };
}

export interface BackendBrand {
  id: string;
  name: string;
  slug: string;
}

export interface HeaderCategory {
  id: string;
  name: string;
  slug: string;
}

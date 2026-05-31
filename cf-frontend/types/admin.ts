export interface DashboardStats {
  userCount: number;
  productCount: number;
  categoryCount: number;
  orderCount: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  profileImageUrl?: string | null;
  profileImagePublicId?: string | null;
}

export interface CreateProductRequest {
  name: string;
  categoryId: string;
  subCategoryId: string;
  description?: string;
  priceCents: number;
  comparePriceCents?: number;
  imageUrl?: string;
  isActive?: boolean;
  isNewArrival?: boolean;
  brandId?: string;
  vendorId?: string;
  collectionId?: string;
  longDescription?: string;
  productDetails?: string[];
  dimensions?: string[];
  careAndCleaning?: string;
  specifications?: { label: string; value: string }[];
  tags?: string[];
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

export interface AddProductImageRequest {
  url: string;
  altText?: string;
  isCover?: boolean;
  publicId?: string;
  syncDefault?: boolean;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  showInHeader: boolean;
  headerOrder: number | null;
  subcategories: AdminSubCategory[];
  _count?: { products: number };
}

export interface AdminSubCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  showInHeader?: boolean;
  headerOrder?: number;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

export interface CreateSubCategoryRequest {
  categoryId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export type UpdateSubCategoryRequest = Partial<Omit<CreateSubCategoryRequest, "categoryId">>;

export interface AdminEntity {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface DashboardProduct {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  isActive: boolean;
  createdAt: string;
  category: { name: string };
}

export interface DashboardCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  _count: { products: number };
}

export interface DashboardOverview {
  charts: {
    users: DailyCount[];
    products: DailyCount[];
    categories: DailyCount[];
  };
  tables: {
    users: AdminUser[];
    products: DashboardProduct[];
    categories: DashboardCategory[];
  };
}

import { apiFetch } from "@/lib/api-client";
import { ADMIN_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/auth";
import type {
  DashboardStats,
  DashboardOverview,
  AdminUser,
  CreateProductRequest,
  UpdateProductRequest,
  AddProductImageRequest,
  AdminCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
  AdminSubCategory,
  AdminEntity,
} from "@/types/admin";
import type {
  BackendProduct,
  BackendProductImage,
  PaginatedProducts,
} from "@/types/product";

export function apiGetDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return apiFetch<DashboardStats>(ADMIN_ENDPOINTS.DASHBOARD_STATS);
}

export function apiGetDashboardOverview(): Promise<ApiResponse<DashboardOverview>> {
  return apiFetch<DashboardOverview>(ADMIN_ENDPOINTS.DASHBOARD_OVERVIEW);
}

export function apiListAdminUsers(): Promise<ApiResponse<AdminUser[]>> {
  return apiFetch<AdminUser[]>(ADMIN_ENDPOINTS.USERS_LIST);
}

export function apiDeactivateUser(
  id: string,
): Promise<ApiResponse<{ id: string; isActive: boolean }>> {
  return apiFetch(ADMIN_ENDPOINTS.USERS_DEACTIVATE(id), { method: "PATCH" });
}

export function apiReactivateUser(
  id: string,
): Promise<ApiResponse<{ id: string; isActive: boolean }>> {
  return apiFetch(ADMIN_ENDPOINTS.USERS_REACTIVATE(id), { method: "PATCH" });
}

export function apiChangeUserRole(
  id: string,
  role: "USER" | "ADMIN",
): Promise<ApiResponse<{ id: string; role: string }>> {
  return apiFetch(ADMIN_ENDPOINTS.USERS_CHANGE_ROLE(id), {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export function apiUploadUserImage(
  id: string,
  formData: FormData,
): Promise<ApiResponse<AdminUser>> {
  return apiFetch<AdminUser>(ADMIN_ENDPOINTS.USERS_UPLOAD_IMAGE(id), {
    method: "POST",
    body: formData,
  });
}

export function apiDeleteUserImage(
  id: string,
): Promise<ApiResponse<AdminUser>> {
  return apiFetch<AdminUser>(ADMIN_ENDPOINTS.USERS_DELETE_IMAGE(id), {
    method: "DELETE",
  });
}

export function apiListAdminProducts(
  params: Record<string, string> = {},
): Promise<ApiResponse<PaginatedProducts>> {
  const qs = new URLSearchParams(params).toString();
  const url = qs
    ? `${ADMIN_ENDPOINTS.PRODUCTS_LIST}?${qs}`
    : ADMIN_ENDPOINTS.PRODUCTS_LIST;
  return apiFetch<PaginatedProducts>(url);
}

export function apiGetAdminProduct(
  id: string,
): Promise<ApiResponse<BackendProduct>> {
  return apiFetch<BackendProduct>(ADMIN_ENDPOINTS.PRODUCTS_DETAIL(id));
}

export function apiCreateProduct(
  data: CreateProductRequest,
): Promise<ApiResponse<BackendProduct>> {
  return apiFetch<BackendProduct>(ADMIN_ENDPOINTS.PRODUCTS_CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiUpdateProduct(
  id: string,
  data: UpdateProductRequest,
): Promise<ApiResponse<BackendProduct>> {
  return apiFetch<BackendProduct>(ADMIN_ENDPOINTS.PRODUCTS_UPDATE(id), {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function apiDeleteProduct(
  id: string,
): Promise<ApiResponse<null>> {
  return apiFetch<null>(ADMIN_ENDPOINTS.PRODUCTS_DELETE(id), {
    method: "DELETE",
  });
}

export function apiAddProductImage(
  productId: string,
  data: AddProductImageRequest,
): Promise<ApiResponse<BackendProductImage>> {
  return apiFetch<BackendProductImage>(
    ADMIN_ENDPOINTS.PRODUCTS_ADD_IMAGE(productId),
    { method: "POST", body: JSON.stringify(data) },
  );
}

export function apiUploadProductImage(
  productId: string,
  file: File,
  options: {
    altText?: string;
    isCover?: boolean;
    syncDefault?: boolean;
  } = {},
): Promise<ApiResponse<BackendProductImage>> {
  const formData = new FormData();
  formData.append("image", file);
  if (options.altText) {
    formData.append("altText", options.altText);
  }
  if (options.isCover !== undefined) {
    formData.append("isCover", String(options.isCover));
  }
  if (options.syncDefault !== undefined) {
    formData.append("syncDefault", String(options.syncDefault));
  }

  return apiFetch<BackendProductImage>(
    ADMIN_ENDPOINTS.PRODUCTS_UPLOAD_IMAGE(productId),
    {
      method: "POST",
      body: formData,
    },
  );
}

export function apiRemoveProductImage(
  productId: string,
  imageId: string,
): Promise<ApiResponse<null>> {
  return apiFetch<null>(
    ADMIN_ENDPOINTS.PRODUCTS_REMOVE_IMAGE(productId, imageId),
    { method: "DELETE" },
  );
}

export function apiListAdminCategories(): Promise<
  ApiResponse<AdminCategory[]>
> {
  return apiFetch<AdminCategory[]>(ADMIN_ENDPOINTS.CATEGORIES_LIST);
}

export function apiCreateCategory(
  data: CreateCategoryRequest,
): Promise<ApiResponse<AdminCategory>> {
  return apiFetch<AdminCategory>(ADMIN_ENDPOINTS.CATEGORIES_CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiUpdateCategory(
  id: string,
  data: UpdateCategoryRequest,
): Promise<ApiResponse<AdminCategory>> {
  return apiFetch<AdminCategory>(ADMIN_ENDPOINTS.CATEGORIES_UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function apiDeleteCategory(
  id: string,
): Promise<ApiResponse<null>> {
  return apiFetch<null>(ADMIN_ENDPOINTS.CATEGORIES_DELETE(id), {
    method: "DELETE",
  });
}

export function apiCreateSubCategory(
  data: CreateSubCategoryRequest,
): Promise<ApiResponse<AdminSubCategory>> {
  return apiFetch<AdminSubCategory>(ADMIN_ENDPOINTS.SUBCATEGORIES_CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiUpdateSubCategory(
  id: string,
  data: UpdateSubCategoryRequest,
): Promise<ApiResponse<AdminSubCategory>> {
  return apiFetch<AdminSubCategory>(ADMIN_ENDPOINTS.SUBCATEGORIES_UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function apiDeleteSubCategory(
  id: string,
): Promise<ApiResponse<null>> {
  return apiFetch<null>(ADMIN_ENDPOINTS.SUBCATEGORIES_DELETE(id), {
    method: "DELETE",
  });
}

export function apiListBrands(): Promise<ApiResponse<AdminEntity[]>> {
  return apiFetch<AdminEntity[]>(ADMIN_ENDPOINTS.BRANDS_LIST);
}

export function apiListVendors(): Promise<ApiResponse<AdminEntity[]>> {
  return apiFetch<AdminEntity[]>(ADMIN_ENDPOINTS.VENDORS_LIST);
}

export function apiListCollections(): Promise<ApiResponse<AdminEntity[]>> {
  return apiFetch<AdminEntity[]>(ADMIN_ENDPOINTS.COLLECTIONS_LIST);
}

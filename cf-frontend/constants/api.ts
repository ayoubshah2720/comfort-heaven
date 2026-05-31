export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
export const API_ROOT_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  UPDATE_ME: "/auth/me",

  LOGOUT: "/auth/logout",
} as const;

export const CATEGORY_ENDPOINTS = {
  LIST: "/categories",
  HEADER: "/categories/header",
  DETAIL: (slug: string) => `/categories/${slug}`,
} as const;

export const PRODUCT_ENDPOINTS = {
  LIST: "/products",
  DETAIL: (id: string) => `/products/${id}`,
  NEW_ARRIVALS: "/products/new-arrivals",
  SEARCH: "/search",
} as const;

export const BRAND_ENDPOINTS = { LIST: "/brands" } as const;

export const CART_ENDPOINTS = {
  GET: "/cart",
  ADD_ITEM: "/cart/items",
  UPDATE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
  REMOVE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
} as const;

export const ORDER_ENDPOINTS = {
  LIST: "/orders",
  DETAIL: (orderId: string) => `/orders/${orderId}`,
  CHECKOUT: "/checkout",
} as const;

export const WISHLIST_ENDPOINTS = {
  GET: "/wishlist",
  TOGGLE: "/wishlist/toggle",
  REMOVE_ITEM: (itemId: string) => `/wishlist/items/${itemId}`,
} as const;

export const NEWSLETTER_ENDPOINTS = {
  SUBSCRIBE: "/newsletter/subscribe",
} as const;

export const ADDRESS_ENDPOINTS = {
  LIST: "/addresses",
  CREATE: "/addresses",
  UPDATE: (id: string) => `/addresses/${id}`,
  DELETE: (id: string) => `/addresses/${id}`,
  SET_DEFAULT: (id: string) => `/addresses/${id}/default`,
} as const;

export const ADMIN_ENDPOINTS = {
  DASHBOARD_STATS: "/admin/dashboard/stats",
  DASHBOARD_OVERVIEW: "/admin/dashboard/overview",

  USERS_LIST: "/admin/users",
  USERS_DEACTIVATE: (id: string) => `/admin/users/${id}/deactivate`,
  USERS_REACTIVATE: (id: string) => `/admin/users/${id}/reactivate`,
  USERS_CHANGE_ROLE: (id: string) => `/admin/users/${id}/role`,
  USERS_UPLOAD_IMAGE: (id: string) => `/admin/users/${id}/image`,
  USERS_DELETE_IMAGE: (id: string) => `/admin/users/${id}/image`,

  PRODUCTS_LIST: "/admin/products",
  PRODUCTS_DETAIL: (id: string) => `/admin/products/${id}`,
  PRODUCTS_CREATE: "/admin/products",
  PRODUCTS_UPDATE: (id: string) => `/admin/products/${id}`,
  PRODUCTS_DELETE: (id: string) => `/admin/products/${id}`,
  PRODUCTS_UPLOAD_IMAGE: (id: string) => `/admin/products/${id}/images/upload`,
  PRODUCTS_ADD_IMAGE: (id: string) => `/admin/products/${id}/images`,
  PRODUCTS_REMOVE_IMAGE: (productId: string, imageId: string) =>
    `/admin/products/${productId}/images/${imageId}`,

  CATEGORIES_LIST: "/admin/categories",
  CATEGORIES_CREATE: "/admin/categories",
  CATEGORIES_UPDATE: (id: string) => `/admin/categories/${id}`,
  CATEGORIES_DELETE: (id: string) => `/admin/categories/${id}`,

  SUBCATEGORIES_CREATE: "/admin/subcategories",
  SUBCATEGORIES_UPDATE: (id: string) => `/admin/subcategories/${id}`,
  SUBCATEGORIES_DELETE: (id: string) => `/admin/subcategories/${id}`,

  BRANDS_LIST: "/admin/brands",
  VENDORS_LIST: "/admin/vendors",
  COLLECTIONS_LIST: "/admin/collections",
} as const;

export const IMAGE_ENDPOINTS = {
  UPLOAD: "/api/image/upload",
} as const;

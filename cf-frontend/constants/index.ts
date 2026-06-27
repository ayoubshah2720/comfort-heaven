const env = process.env;

export const SITE_NAME = env.NEXT_PUBLIC_SITE_NAME || "Royal Touch Interior";
export const SITE_DESCRIPTION =
  env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  `${SITE_NAME} is a premium furniture and home decor storefront with category browsing, search, and modern interior collections.`;

export const BRAND_COLOR = env.NEXT_PUBLIC_BRAND_COLOR || "#E8B800";
export const BRAND_TEAL = env.NEXT_PUBLIC_BRAND_TEAL || "#3D6B6B";

export const VAT_RATE = Number(env.NEXT_PUBLIC_VAT_RATE || "0.15");
export const ECO_TAX = Number(env.NEXT_PUBLIC_ECO_TAX || "2");
export const FLAT_SHIPPING_RATE = Number(
  env.NEXT_PUBLIC_FLAT_SHIPPING_RATE || "8"
);

export const STORE_PHONE_NUMBER =
  env.NEXT_PUBLIC_STORE_PHONE_NUMBER || "+923315994525";
export const STORE_PHONE_DISPLAY =
  env.NEXT_PUBLIC_STORE_PHONE_DISPLAY || "0331-5994525";
export const STORE_EMAIL =
  env.NEXT_PUBLIC_STORE_EMAIL || "info@royaltouchinterior.com";
export const STORE_WHATSAPP_NUMBER =
  env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || "923315994525";

export const STORE_ADDRESS_LINE =
  env.NEXT_PUBLIC_STORE_ADDRESS_LINE || "Innovation Heights Complex";
export const STORE_CITY = env.NEXT_PUBLIC_STORE_CITY || "Bahawalpur";
export const STORE_COUNTRY = env.NEXT_PUBLIC_STORE_COUNTRY || "Pakistan";
export const STORE_FULL_ADDRESS = `${STORE_ADDRESS_LINE}, ${STORE_CITY}`;

export const STORE_BUSINESS_HOURS =
  env.NEXT_PUBLIC_STORE_BUSINESS_HOURS || "Monday - Saturday: 10:00 AM - 8:00 PM";
export const STORE_BUSINESS_HOURS_NOTE =
  env.NEXT_PUBLIC_STORE_BUSINESS_HOURS_NOTE || "Closed on Sundays";

export const SOCIAL_FACEBOOK_URL =
  env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL || "https://facebook.com";
export const SOCIAL_INSTAGRAM_URL =
  env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL || "https://instagram.com";
export const SOCIAL_X_URL =
  env.NEXT_PUBLIC_SOCIAL_X_URL || "https://x.com";
export const SOCIAL_LINKEDIN_URL =
  env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL || "https://linkedin.com";

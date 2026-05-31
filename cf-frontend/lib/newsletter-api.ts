import { apiFetch } from "@/lib/api-client";
import { NEWSLETTER_ENDPOINTS } from "@/constants/api";

export async function apiSubscribeNewsletter(email: string) {
  return apiFetch<null>(NEWSLETTER_ENDPOINTS.SUBSCRIBE, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

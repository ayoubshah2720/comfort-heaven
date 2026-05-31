import { apiFetch } from "@/lib/api-client";
import { ADDRESS_ENDPOINTS } from "@/constants/api";
import type { BackendAddress, CreateAddressRequest, UpdateAddressRequest } from "@/types/address";

export async function apiListAddresses() {
  return apiFetch<BackendAddress[]>(ADDRESS_ENDPOINTS.LIST, {
    method: "GET",
  });
}

export async function apiCreateAddress(data: CreateAddressRequest) {
  return apiFetch<BackendAddress>(ADDRESS_ENDPOINTS.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiUpdateAddress(id: string, data: UpdateAddressRequest) {
  return apiFetch<BackendAddress>(ADDRESS_ENDPOINTS.UPDATE(id), {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiDeleteAddress(id: string) {
  return apiFetch<null>(ADDRESS_ENDPOINTS.DELETE(id), {
    method: "DELETE",
  });
}

export async function apiSetDefaultAddress(id: string) {
  return apiFetch<BackendAddress>(ADDRESS_ENDPOINTS.SET_DEFAULT(id), {
    method: "POST",
  });
}

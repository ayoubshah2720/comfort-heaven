import { apiFetch, setAccessToken } from "@/lib/api-client";
import { AUTH_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  AuthResponseData,
  BackendUserProfile,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from "@/types/auth";

export async function apiLogin(
  data: LoginRequest,
): Promise<ApiResponse<AuthResponseData>> {
  const result = await apiFetch<AuthResponseData>(AUTH_ENDPOINTS.LOGIN, {
    method: "POST",
    body: JSON.stringify(data),
  });
  setAccessToken(result.data.accessToken);
  return result;
}

export async function apiRegister(
  data: RegisterRequest,
): Promise<ApiResponse<AuthResponseData>> {
  const result = await apiFetch<AuthResponseData>(AUTH_ENDPOINTS.REGISTER, {
    method: "POST",
    body: JSON.stringify(data),
  });
  setAccessToken(result.data.accessToken);
  return result;
}

export async function apiGetMe(): Promise<ApiResponse<BackendUserProfile>> {
  return apiFetch<BackendUserProfile>(AUTH_ENDPOINTS.ME, { method: "GET" });
}

export async function apiUpdateProfile(
  data: UpdateProfileRequest,
): Promise<ApiResponse<BackendUserProfile>> {
  return apiFetch<BackendUserProfile>(AUTH_ENDPOINTS.UPDATE_ME, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function apiLogout(): Promise<ApiResponse<null>> {
  const result = await apiFetch<null>(AUTH_ENDPOINTS.LOGOUT, {
    method: "POST",
  });
  setAccessToken(null);
  return result;
}

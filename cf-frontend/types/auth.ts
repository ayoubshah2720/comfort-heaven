export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  status_code: number;
  data: T;
}

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  username: string | null;
  phone: string | null;
  gender: string | null;
}

export interface BackendUserProfile extends BackendUser {
  isActive: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  phone?: string;
  gender?: string;
}

export interface AuthResponseData {
  accessToken: string;
  user: BackendUser;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ValidationErrorItem {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { apiLogin, apiRegister, apiLogout, apiGetMe, apiUpdateProfile } from "@/lib/auth-api";
import type { ApiResponse, ValidationErrorItem, UpdateProfileRequest } from "@/types/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  username: string | null;
  phone: string | null;
  gender: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  sessionChecked: boolean;
  updating: boolean;
  updateError: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  sessionChecked: false,
  updating: false,
  updateError: null,
};

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }

  const apiErr = err as ApiResponse<unknown> & { errors?: ValidationErrorItem[] };

  if (apiErr?.errors?.length) {
    return apiErr.errors.map((e) => e.msg).join(". ");
  }

  const code = apiErr?.status_code;
  const msg = apiErr?.message;

  if (code === 401) return "Invalid email or password";
  if (code === 403) return "Your account has been deactivated. Please contact support.";
  if (code === 409) return "An account with this email already exists";
  if (code === 429) return "Too many attempts. Please try again later.";
  if (msg) return msg;

  return "Something went wrong. Please try again.";
}

export const loginThunk = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const result = await apiLogin(credentials);
    return result.data.user;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const signupThunk = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/signup", async (data, { rejectWithValue }) => {
  try {
    const result = await apiRegister(data);
    return result.data.user;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      await apiLogout();
    } catch {
    }
  },
);

export const restoreSessionThunk = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>("auth/restoreSession", async (_, { rejectWithValue }) => {
  try {
    const meResult = await apiGetMe();
    const d = meResult.data;
    return {
      id: d.id,
      name: d.name,
      email: d.email,
      role: d.role,
      username: d.username,
      phone: d.phone,
      gender: d.gender,
    };
  } catch {
    return rejectWithValue("Session expired");
  }
});

export const updateProfileThunk = createAsyncThunk<
  User,
  UpdateProfileRequest,
  { rejectValue: string }
>("auth/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const result = await apiUpdateProfile(data);
    const d = result.data;
    return {
      id: d.id,
      name: d.name,
      email: d.email,
      role: d.role,
      username: d.username,
      phone: d.phone,
      gender: d.gender,
    };
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Sign up failed";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(restoreSessionThunk.fulfilled, (state, action) => {
        state.sessionChecked = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(restoreSessionThunk.rejected, (state) => {
        state.sessionChecked = true;
      })
      .addCase(updateProfileThunk.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.user = action.payload;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload ?? "Profile update failed";
      });
  },
});

export const { clearError } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectSessionChecked = (state: RootState) =>
  state.auth.sessionChecked;
export const selectProfileUpdating = (state: RootState) => state.auth.updating;
export const selectProfileUpdateError = (state: RootState) =>
  state.auth.updateError;

export default authSlice.reducer;

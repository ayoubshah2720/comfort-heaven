import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { BackendAddress, CreateAddressRequest, UpdateAddressRequest } from "@/types/address";
import {
  apiListAddresses,
  apiCreateAddress,
  apiUpdateAddress,
  apiDeleteAddress,
  apiSetDefaultAddress,
} from "@/lib/address-api";

export type { BackendAddress as Address };

interface AddressesState {
  addresses: BackendAddress[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressesState = {
  addresses: [],
  loading: false,
  error: null,
};

export const fetchAddressesThunk = createAsyncThunk<
  BackendAddress[],
  void,
  { rejectValue: string }
>("addresses/fetchAddresses", async (_, { rejectWithValue }) => {
  try {
    const result = await apiListAddresses();
    return result.data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch addresses";
    return rejectWithValue(msg);
  }
});

export const createAddressThunk = createAsyncThunk<
  BackendAddress[],
  CreateAddressRequest,
  { rejectValue: string }
>("addresses/createAddress", async (data, { rejectWithValue }) => {
  try {
    await apiCreateAddress(data);
    const result = await apiListAddresses();
    return result.data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create address";
    return rejectWithValue(msg);
  }
});

export const updateAddressThunk = createAsyncThunk<
  BackendAddress[],
  { id: string; data: UpdateAddressRequest },
  { rejectValue: string }
>("addresses/updateAddress", async ({ id, data }, { rejectWithValue }) => {
  try {
    await apiUpdateAddress(id, data);
    const result = await apiListAddresses();
    return result.data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update address";
    return rejectWithValue(msg);
  }
});

export const deleteAddressThunk = createAsyncThunk<
  BackendAddress[],
  string,
  { rejectValue: string }
>("addresses/deleteAddress", async (id, { rejectWithValue }) => {
  try {
    await apiDeleteAddress(id);
    const result = await apiListAddresses();
    return result.data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete address";
    return rejectWithValue(msg);
  }
});

export const setDefaultAddressThunk = createAsyncThunk<
  BackendAddress[],
  string,
  { rejectValue: string }
>("addresses/setDefaultAddress", async (id, { rejectWithValue }) => {
  try {
    await apiSetDefaultAddress(id);
    const result = await apiListAddresses();
    return result.data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to set default address";
    return rejectWithValue(msg);
  }
});

const addressesSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddressesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddressesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch addresses";
      });

    builder
      .addCase(createAddressThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddressThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(createAddressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create address";
      });

    builder
      .addCase(updateAddressThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddressThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(updateAddressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update address";
      });

    builder
      .addCase(deleteAddressThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddressThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(deleteAddressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete address";
      });

    builder
      .addCase(setDefaultAddressThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddressThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(setDefaultAddressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to set default address";
      });

    builder.addMatcher(
      (action) => action.type === "auth/logout/fulfilled",
      (state) => {
        state.addresses = [];
        state.loading = false;
        state.error = null;
      }
    );
  },
});

export const selectAddresses = (state: RootState) => state.addresses.addresses;
export const selectDefaultAddress = (state: RootState) =>
  state.addresses.addresses.find((a) => a.isDefault) ?? null;
export const selectAddressesLoading = (state: RootState) => state.addresses.loading;
export const selectAddressesError = (state: RootState) => state.addresses.error;

export default addressesSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { BackendOrder } from "@/types/order";
import { apiListOrders, apiGetOrder } from "@/lib/order-api";

interface OrdersState {
  orders: BackendOrder[];
  selectedOrder: BackendOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

export const fetchOrdersThunk = createAsyncThunk<
  BackendOrder[],
  string | undefined,
  { rejectValue: string }
>("orders/fetchOrders", async (status, { rejectWithValue }) => {
  try {
    const result = await apiListOrders(status);
    return result.data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch orders";
    return rejectWithValue(msg);
  }
});

export const fetchOrderDetailThunk = createAsyncThunk<
  BackendOrder,
  string,
  { rejectValue: string }
>("orders/fetchOrderDetail", async (orderId, { rejectWithValue }) => {
  try {
    const result = await apiGetOrder(orderId);
    return result.data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch order";
    return rejectWithValue(msg);
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch orders";
      });

    builder
      .addCase(fetchOrderDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch order";
      });
  },
});

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectSelectedOrder = (state: RootState) => state.orders.selectedOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;

export default ordersSlice.reducer;

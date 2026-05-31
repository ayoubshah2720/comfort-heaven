import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/store/slices/cartSlice";
import wishlistReducer from "@/store/slices/wishlistSlice";
import authReducer from "@/store/slices/authSlice";
import filtersReducer from "@/store/slices/filtersSlice";
import searchReducer from "@/store/slices/searchSlice";
import walletReducer from "@/store/slices/walletSlice";
import ordersReducer from "@/store/slices/ordersSlice";
import addressesReducer from "@/store/slices/addressesSlice";
import headerCategoriesReducer from "@/store/slices/headerCategoriesSlice";
import { cartPersistMiddleware } from "@/store/cartMiddleware";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    filters: filtersReducer,
    search: searchReducer,
    wallet: walletReducer,
    orders: ordersReducer,
    addresses: addressesReducer,
    headerCategories: headerCategoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartPersistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

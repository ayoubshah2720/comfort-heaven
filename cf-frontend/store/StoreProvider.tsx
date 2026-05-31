"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import HeaderCategoriesInitializer from "@/components/layout/HeaderCategoriesInitializer";
import AuthInitializer from "@/components/auth/AuthInitializer";
// CART_DISABLED: import CartInitializer from "@/components/cart/CartInitializer";
import WishlistInitializer from "@/components/wishlist/WishlistInitializer";

interface StoreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  return (
    <Provider store={store}>
      <HeaderCategoriesInitializer />
      <AuthInitializer />
      {/* CART_DISABLED: <CartInitializer /> */}
      <WishlistInitializer />
      {children}
    </Provider>
  );
}

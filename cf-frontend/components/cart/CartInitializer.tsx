"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectSessionChecked } from "@/store/slices/authSlice";
import {
  fetchCartThunk,
  syncGuestCartThunk,
  setCartFromGuest,
} from "@/store/slices/cartSlice";
import { loadGuestCart, clearGuestCart } from "@/lib/cart-storage";

export default function CartInitializer() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const sessionChecked = useAppSelector(selectSessionChecked);
  const didInit = useRef(false);
  const prevAuth = useRef(false);

  useEffect(() => {
    if (!sessionChecked) return;

    if (!didInit.current) {
      didInit.current = true;
      prevAuth.current = isAuthenticated;

      if (isAuthenticated) {
        const guestItems = loadGuestCart();
        if (guestItems.length > 0) {
          dispatch(syncGuestCartThunk(guestItems)).then(() => clearGuestCart());
        } else {
          dispatch(fetchCartThunk());
        }
      } else {
        const guestItems = loadGuestCart();
        if (guestItems.length > 0) {
          dispatch(setCartFromGuest(guestItems));
        }
      }
      return;
    }

    const wasAuth = prevAuth.current;
    prevAuth.current = isAuthenticated;

    if (!wasAuth && isAuthenticated) {
      const guestItems = loadGuestCart();
      if (guestItems.length > 0) {
        dispatch(syncGuestCartThunk(guestItems)).then(() => clearGuestCart());
      } else {
        dispatch(fetchCartThunk());
      }
    }

    if (wasAuth && !isAuthenticated) {
      clearGuestCart();
    }
  }, [sessionChecked, isAuthenticated, dispatch]);

  return null;
}

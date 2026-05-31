"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectSessionChecked } from "@/store/slices/authSlice";
import { fetchWishlistThunk } from "@/store/slices/wishlistSlice";

export default function WishlistInitializer() {
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
        dispatch(fetchWishlistThunk());
      }
      return;
    }

    const wasAuth = prevAuth.current;
    prevAuth.current = isAuthenticated;

    if (!wasAuth && isAuthenticated) {
      dispatch(fetchWishlistThunk());
    }
  }, [sessionChecked, isAuthenticated, dispatch]);

  return null;
}

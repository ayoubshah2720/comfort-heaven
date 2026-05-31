"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchHeaderCategoriesThunk } from "@/store/slices/headerCategoriesSlice";

export default function HeaderCategoriesInitializer() {
  const dispatch = useAppDispatch();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    dispatch(fetchHeaderCategoriesThunk());
  }, [dispatch]);

  return null;
}

"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { restoreSessionThunk } from "@/store/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  return null;
}

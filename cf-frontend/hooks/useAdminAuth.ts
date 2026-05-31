"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectUser, selectSessionChecked } from "@/store/slices/authSlice";

export function useAdminAuth() {
  const user = useAppSelector(selectUser);
  const sessionChecked = useAppSelector(selectSessionChecked);
  const router = useRouter();

  const isAdmin = sessionChecked && user?.role === "ADMIN";
  const isLoading = !sessionChecked;

  useEffect(() => {
    if (sessionChecked && (!user || user.role !== "ADMIN")) {
      router.replace("/signin");
    }
  }, [sessionChecked, user, router]);

  return { isLoading, isAdmin };
}

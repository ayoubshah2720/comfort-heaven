"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectSessionChecked } from "@/store/slices/authSlice";

interface CheckoutGuardProps {
  children: React.ReactNode;
}

export default function CheckoutGuard({ children }: CheckoutGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const sessionChecked = useAppSelector(selectSessionChecked);

  useEffect(() => {
    if (sessionChecked && !isAuthenticated) {
      router.replace("/signin?returnUrl=/checkout");
    }
  }, [sessionChecked, isAuthenticated, router]);

  if (!sessionChecked) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#E8B800] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Redirecting to sign in...</p>
      </div>
    );
  }

  return <>{children}</>;
}

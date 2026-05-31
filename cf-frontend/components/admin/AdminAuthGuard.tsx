"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { isLoading, isAdmin } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E8B800] border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return <>{children}</>;
}

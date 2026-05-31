"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  StatCard,
  StatusBadge,
  DashboardChart,
  DashboardRecentTable,
} from "@/components/admin";
import type { Column } from "@/components/admin";
import type {
  DashboardStats,
  DashboardOverview,
  AdminUser,
  DashboardProduct,
  DashboardCategory,
} from "@/types/admin";
import { apiGetDashboardStats, apiGetDashboardOverview } from "@/lib/admin-api";
import { BRAND_COLOR, BRAND_TEAL } from "@/constants";

const userColumns: Column<AdminUser>[] = [
  { key: "name", label: "Name", render: (r) => r.name },
  { key: "email", label: "Email", render: (r) => r.email },
  {
    key: "role",
    label: "Role",
    render: (r) => (
      <StatusBadge variant={r.role === "ADMIN" ? "admin" : "user"} />
    ),
  },
  {
    key: "joined",
    label: "Joined",
    render: (r) => new Date(r.createdAt).toLocaleDateString(),
  },
  {
    key: "details",
    label: "",
    render: () => (
      <Link
        href="/admin/users"
        className="text-xs font-medium text-[#E8B800] hover:text-[#d4a700]"
      >
        Details
      </Link>
    ),
  },
];

const productColumns: Column<DashboardProduct>[] = [
  { key: "name", label: "Name", render: (r) => r.name },
  { key: "category", label: "Category", render: (r) => r.category.name },
  {
    key: "price",
    label: "Price",
    render: (r) => `Rs. ${(r.priceCents / 100).toLocaleString()}`,
  },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <StatusBadge variant={r.isActive ? "active" : "inactive"} />
    ),
  },
  {
    key: "details",
    label: "",
    render: () => (
      <Link
        href="/admin/products"
        className="text-xs font-medium text-[#E8B800] hover:text-[#d4a700]"
      >
        Details
      </Link>
    ),
  },
];

const categoryColumns: Column<DashboardCategory>[] = [
  { key: "name", label: "Name", render: (r) => r.name },
  {
    key: "products",
    label: "Products",
    render: (r) => r._count.products,
  },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <StatusBadge variant={r.isActive ? "active" : "inactive"} />
    ),
  },
  {
    key: "created",
    label: "Created",
    render: (r) => new Date(r.createdAt).toLocaleDateString(),
  },
  {
    key: "details",
    label: "",
    render: () => (
      <Link
        href="/admin/categories"
        className="text-xs font-medium text-[#E8B800] hover:text-[#d4a700]"
      >
        Details
      </Link>
    ),
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetDashboardStats(), apiGetDashboardOverview()])
      .then(([statsRes, overviewRes]) => {
        setStats(statsRes.data);
        setOverview(overviewRes.data);
      })
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {!stats
          ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-white shadow-sm"
            />
          ))
          : (
            <>
              <StatCard
                label="Total Users"
                value={stats.userCount}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                }
              />
              <StatCard
                label="Products"
                value={stats.productCount}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                }
              />
              <StatCard
                label="Categories"
                value={stats.categoryCount}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                  </svg>
                }
              />
              <StatCard
                label="Orders"
                value={stats.orderCount}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                }
              />
            </>
          )}
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {!overview
          ? Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-white shadow-sm"
            />
          ))
          : (
            <>
              <DashboardChart
                title="Users (Last 7 Days)"
                data={overview.charts.users}
                color={BRAND_COLOR}
              />
              <DashboardChart
                title="Products (Last 7 Days)"
                data={overview.charts.products}
                color={BRAND_TEAL}
              />
              <DashboardChart
                title="Categories (Last 7 Days)"
                data={overview.charts.categories}
                color={BRAND_COLOR}
              />
            </>
          )}
      </div>

      {/* Row 3: Recent Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {!overview
          ? Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl bg-white shadow-sm"
            />
          ))
          : (
            <>
              <DashboardRecentTable
                title="Recent Users"
                columns={userColumns}
                data={overview.tables.users}
                keyExtractor={(r) => r.id}
                href="/admin/users"
                loading={loading}
              />
              <DashboardRecentTable
                title="Recent Products"
                columns={productColumns}
                data={overview.tables.products}
                keyExtractor={(r) => r.id}
                href="/admin/products"
                loading={loading}
              />
              <DashboardRecentTable
                title="Recent Categories"
                columns={categoryColumns}
                data={overview.tables.categories}
                keyExtractor={(r) => r.id}
                href="/admin/categories"
                loading={loading}
              />
            </>
          )}
      </div>
    </div>
  );
}

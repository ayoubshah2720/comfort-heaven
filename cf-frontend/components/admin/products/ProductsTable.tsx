"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { DataTable, SearchInput, ConfirmDialog, StatusBadge } from "@/components/admin";
import type { Column } from "@/components/admin";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { BackendProduct, PaginationMeta } from "@/types/product";
import type { AdminCategory } from "@/types/admin";
import { apiListAdminProducts, apiDeleteProduct, apiListAdminCategories } from "@/lib/admin-api";
import { formatPrice } from "@/lib/product-utils";
import Image from "next/image";

export default function ProductsTable() {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState<AdminCategory[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<BackendProduct | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    apiListAdminCategories()
      .then((res) => setCategories(res.data))
      .catch(() => { });
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = {
      page: String(page),
      pageSize: "12",
      sortBy,
      sortOrder,
    };
    if (search) params.q = search;
    if (categoryId) params.categoryId = categoryId;
    if (statusFilter === "active") params.includeInactive = "false";
    else if (statusFilter === "inactive") {
      params.includeInactive = "true";
    } else {
      params.includeInactive = "true";
    }

    apiListAdminProducts(params)
      .then((res) => {
        let filtered = res.data.products;
        if (statusFilter === "active") {
          filtered = filtered.filter((p) => p.isActive);
        } else if (statusFilter === "inactive") {
          filtered = filtered.filter((p) => !p.isActive);
        }
        setProducts(filtered);
        setPagination(res.data.pagination);
      })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, [page, sortBy, sortOrder, search, categoryId, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleSort = useCallback((key: string, order: "asc" | "desc") => {
    const sortMap: Record<string, string> = {
      name: "name",
      price: "priceCents",
      createdAt: "createdAt",
    };
    setSortBy(sortMap[key] || "createdAt");
    setSortOrder(order);
    setPage(1);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await apiDeleteProduct(deleteTarget.id);
      fetchProducts();
    } catch {
      // silent
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const columns: Column<BackendProduct>[] = [
    {
      key: "image",
      label: "",
      render: (p) => (
        <div className="h-10 w-10 overflow-hidden rounded bg-gray-100">
          {(p.imageUrl || p.images[0]?.url) && (
            <Image
              src={p.images.find((i) => i.isCover)?.url || p.images[0]?.url || p.imageUrl || ""}
              alt={p.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
              unoptimized
            />
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (p) => <span className="font-medium">{p.name}</span>,
    },
    {
      key: "category",
      label: "Category",
      render: (p) => p.category?.name ?? "—",
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (p) => formatPrice(p.priceCents),
    },
    {
      key: "status",
      label: "Status",
      render: (p) => <StatusBadge variant={p.isActive ? "active" : "inactive"} />,
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (p) => new Date(p.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (p) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/products/${p.id}/edit`}
            className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          >
            Edit
          </Link>
          <button
            onClick={() => setDeleteTarget(p)}
            className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (error) {
    return <div className="rounded-xl bg-red-50 p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <SearchInput placeholder="Search products..." onSearch={handleSearch} />
          </div>
          <Select
            options={[
              { value: "", label: "All Categories" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="!border !border-gray-200 !rounded-lg !bg-white !py-2 !px-3"
          />
          <Select
            options={[
              { value: "", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="!border !border-gray-200 !rounded-lg !bg-white !py-2 !px-3"
          />
        </div>
        <Link href="/admin/products/new">
          <Button size="sm">+ New Product</Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={products}
        keyExtractor={(p) => p.id}
        loading={loading}
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
        onSort={handleSort}
        emptyMessage="No products found"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

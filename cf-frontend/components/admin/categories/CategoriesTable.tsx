"use client";

import { useEffect, useState, useCallback } from "react";
import { ConfirmDialog, StatusBadge } from "@/components/admin";
import Button from "@/components/ui/Button";
import type { AdminCategory, AdminSubCategory, CreateCategoryRequest, CreateSubCategoryRequest } from "@/types/admin";
import {
  apiListAdminCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
  apiCreateSubCategory,
  apiUpdateSubCategory,
  apiDeleteSubCategory,
} from "@/lib/admin-api";
import CategoryForm from "./CategoryForm";
import SubCategoryForm from "./SubCategoryForm";

export default function CategoriesTable() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  const [subFormCategoryId, setSubFormCategoryId] = useState<string | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<AdminSubCategory | null>(null);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const [deleteTarget, setDeleteTarget] = useState<{ type: "category" | "subcategory"; id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = useCallback(() => {
    setLoading(true);
    apiListAdminCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreateCategory = async (data: CreateCategoryRequest) => {
    await apiCreateCategory(data);
    setShowCategoryForm(false);
    fetchCategories();
  };

  const handleUpdateCategory = async (data: CreateCategoryRequest) => {
    if (!editingCategory) return;
    await apiUpdateCategory(editingCategory.id, data);
    setEditingCategory(null);
    fetchCategories();
  };

  const handleCreateSubCategory = async (data: CreateSubCategoryRequest) => {
    await apiCreateSubCategory(data);
    setSubFormCategoryId(null);
    fetchCategories();
  };

  const handleUpdateSubCategory = async (data: CreateSubCategoryRequest) => {
    if (!editingSubCategory) return;
    await apiUpdateSubCategory(editingSubCategory.id, data);
    setEditingSubCategory(null);
    fetchCategories();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteTarget.type === "category") {
        await apiDeleteCategory(deleteTarget.id);
      } else {
        await apiDeleteSubCategory(deleteTarget.id);
      }
      fetchCategories();
    } catch {
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  if (error) {
    return <div className="rounded-xl bg-red-50 p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditingCategory(null);
            setShowCategoryForm(true);
          }}
        >
          + New Category
        </Button>
      </div>

      {(showCategoryForm || editingCategory) && (
        <div className="mb-4">
          <CategoryForm
            initial={editingCategory ?? undefined}
            onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
            onCancel={() => {
              setShowCategoryForm(false);
              setEditingCategory(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-xl bg-white shadow-sm">
              <div
                className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50"
                onClick={() => toggleExpand(cat.id)}
              >
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`h-4 w-4 text-gray-400 transition-transform ${expanded.has(cat.id) ? "rotate-90" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                  <span className="font-medium text-gray-800">{cat.name}</span>
                  <StatusBadge variant={cat.isActive ? "active" : "inactive"} />
                  {cat.showInHeader && (
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                      Header
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {cat.subcategories.length} subcategories
                  </span>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setShowCategoryForm(false);
                      setEditingCategory(cat);
                    }}
                    className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: "category", id: cat.id, name: cat.name })}
                    className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expanded.has(cat.id) && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-2">
                  <div className="mb-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSubCategory(null);
                        setSubFormCategoryId(cat.id);
                      }}
                    >
                      + Subcategory
                    </Button>
                  </div>

                  {subFormCategoryId === cat.id && !editingSubCategory && (
                    <div className="mb-3">
                      <SubCategoryForm
                        categoryId={cat.id}
                        onSubmit={handleCreateSubCategory}
                        onCancel={() => setSubFormCategoryId(null)}
                      />
                    </div>
                  )}

                  {cat.subcategories.length === 0 ? (
                    <p className="py-3 text-center text-sm text-gray-400">
                      No subcategories
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {cat.subcategories.map((sub) => (
                        <div key={sub.id}>
                          {editingSubCategory?.id === sub.id ? (
                            <SubCategoryForm
                              categoryId={cat.id}
                              initial={sub}
                              onSubmit={handleUpdateSubCategory}
                              onCancel={() => setEditingSubCategory(null)}
                            />
                          ) : (
                            <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-700">{sub.name}</span>
                                <StatusBadge variant={sub.isActive ? "active" : "inactive"} />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingSubCategory(sub)}
                                  className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteTarget({ type: "subcategory", id: sub.id, name: sub.name })
                                  }
                                  className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {categories.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              No categories yet
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.type === "category" ? "Category" : "Subcategory"}`}
        message={
          deleteTarget?.type === "category"
            ? `Delete "${deleteTarget.name}" and all its subcategories? This cannot be undone.`
            : `Delete subcategory "${deleteTarget?.name}"? This cannot be undone.`
        }
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

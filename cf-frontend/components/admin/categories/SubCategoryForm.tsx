"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { AdminSubCategory, CreateSubCategoryRequest } from "@/types/admin";

interface SubCategoryFormProps {
  categoryId: string;
  initial?: AdminSubCategory;
  onSubmit: (data: CreateSubCategoryRequest) => Promise<void>;
  onCancel: () => void;
}

export default function SubCategoryForm({ categoryId, initial, onSubmit, onCancel }: SubCategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        categoryId,
        name: name.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        isActive,
      });
    } catch (err) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to save subcategory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h4 className="text-xs font-semibold uppercase text-gray-500">
        {initial ? "Edit Subcategory" : "New Subcategory"}
      </h4>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-[#E8B800]" />
        Active
      </label>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : initial ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { AdminCategory, CreateCategoryRequest } from "@/types/admin";

interface CategoryFormProps {
  initial?: AdminCategory;
  onSubmit: (data: CreateCategoryRequest) => Promise<void>;
  onCancel: () => void;
}

export default function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [showInHeader, setShowInHeader] = useState(initial?.showInHeader ?? false);
  const [headerOrder, setHeaderOrder] = useState(initial?.headerOrder?.toString() ?? "");
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
        name: name.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        isActive,
        showInHeader,
        headerOrder: headerOrder ? Number(headerOrder) : undefined,
      });
    } catch (err) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
        {initial ? "Edit Category" : "New Category"}
      </h3>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-[#E8B800]" />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={showInHeader} onChange={(e) => setShowInHeader(e.target.checked)} className="accent-[#E8B800]" />
          Show in Header
        </label>
      </div>

      {showInHeader && (
        <Input
          label="Header Order"
          type="number"
          value={headerOrder}
          onChange={(e) => setHeaderOrder(e.target.value)}
        />
      )}

      <div className="flex justify-end gap-3 pt-2">
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

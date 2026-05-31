"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { AdminFormSection } from "@/components/admin";
import type { BackendProduct } from "@/types/product";
import type { AdminCategory, AdminEntity, CreateProductRequest } from "@/types/admin";
import {
  apiCreateProduct,
  apiUpdateProduct,
  apiListAdminCategories,
  apiListBrands,
  apiListVendors,
  apiListCollections,
  apiUploadProductImage,
} from "@/lib/admin-api";

interface ProductFormProps {
  product?: BackendProduct;
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function getImageUploadError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Failed to upload image";
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;
  const defaultImageInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [priceCents, setPriceCents] = useState(product?.priceCents?.toString() ?? "");
  const [comparePriceCents, setComparePriceCents] = useState(
    product?.comparePriceCents?.toString() ?? "",
  );
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? "");
  const [subCategoryId, setSubCategoryId] = useState(product?.subCategory?.id ?? "");
  const [brandId, setBrandId] = useState(product?.brand?.id ?? "");
  const [vendorId, setVendorId] = useState(product?.vendor?.id ?? "");
  const [collectionId, setCollectionId] = useState(product?.collection?.id ?? "");
  const [longDescription, setLongDescription] = useState(product?.longDescription ?? "");
  const [productDetails, setProductDetails] = useState(
    product?.productDetails?.join("\n") ?? "",
  );
  const [dimensions, setDimensions] = useState(product?.dimensions?.join("\n") ?? "");
  const [careAndCleaning, setCareAndCleaning] = useState(product?.careAndCleaning ?? "");
  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>(
    product?.specifications ?? [],
  );
  const [tags, setTags] = useState(product?.tags?.join(", ") ?? "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival ?? false);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [pendingProductId, setPendingProductId] = useState(product?.id ?? "");
  const [selectedDefaultImageFile, setSelectedDefaultImageFile] = useState<File | null>(null);
  const [defaultImagePreviewUrl, setDefaultImagePreviewUrl] = useState<string | null>(null);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [brands, setBrands] = useState<AdminEntity[]>([]);
  const [vendors, setVendors] = useState<AdminEntity[]>([]);
  const [collections, setCollections] = useState<AdminEntity[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageMessage, setImageMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      apiListAdminCategories(),
      apiListBrands(),
      apiListVendors(),
      apiListCollections(),
    ]).then(([catRes, brandRes, vendorRes, colRes]) => {
      setCategories(catRes.data);
      setBrands(brandRes.data);
      setVendors(vendorRes.data);
      setCollections(colRes.data);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (defaultImagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(defaultImagePreviewUrl);
      }
    };
  }, [defaultImagePreviewUrl]);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const subcategories = selectedCategory?.subcategories ?? [];
  const displayImageUrl = defaultImagePreviewUrl || imageUrl;
  const isPersistedProduct = !!product || !!pendingProductId;

  const addSpecRow = () =>
    setSpecifications((prev) => [...prev, { label: "", value: "" }]);
  const removeSpecRow = (idx: number) =>
    setSpecifications((prev) => prev.filter((_, i) => i !== idx));
  const updateSpecRow = (idx: number, field: "label" | "value", val: string) =>
    setSpecifications((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)),
    );

  const openDefaultImagePicker = () => {
    defaultImageInputRef.current?.click();
  };

  const replaceDefaultImagePreview = (file: File | null) => {
    setDefaultImagePreviewUrl((currentPreviewUrl) => {
      if (currentPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreviewUrl);
      }
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const clearDefaultImage = () => {
    replaceDefaultImagePreview(null);
    setSelectedDefaultImageFile(null);
    setImageUrl("");
    setImageMessage(null);
    if (defaultImageInputRef.current) {
      defaultImageInputRef.current.value = "";
    }
  };

  const handleDefaultImageSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageMessage({
        type: "error",
        text: "Only JPG, JPEG, PNG, and WebP images are allowed.",
      });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageMessage({
        type: "error",
        text: "File too large. Maximum size is 5MB.",
      });
      event.target.value = "";
      return;
    }

    replaceDefaultImagePreview(file);
    setSelectedDefaultImageFile(file);
    setImageMessage({
      type: "success",
      text: "Image selected. It will upload when you save the product.",
    });
    event.target.value = "";
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!categoryId) {
      setError("Category is required");
      return;
    }
    if (!subCategoryId) {
      setError("Subcategory is required");
      return;
    }
    if (!priceCents || Number(priceCents) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setLoading(true);
    setError(null);

    const data: CreateProductRequest = {
      name: name.trim(),
      categoryId,
      subCategoryId,
      description: description.trim() || undefined,
      priceCents: Number(priceCents),
      comparePriceCents: comparePriceCents ? Number(comparePriceCents) : undefined,
      brandId: brandId || undefined,
      vendorId: vendorId || undefined,
      collectionId: collectionId || undefined,
      longDescription: longDescription.trim() || undefined,
      productDetails: productDetails
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      dimensions: dimensions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      careAndCleaning: careAndCleaning.trim() || undefined,
      specifications: specifications.filter((s) => s.label.trim() && s.value.trim()),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isActive,
      isNewArrival,
      imageUrl: imageUrl.trim() || undefined,
    };

    try {
      let savedProduct: BackendProduct;

      if (isEdit && product) {
        const result = await apiUpdateProduct(product.id, data);
        savedProduct = result.data;
      } else if (pendingProductId) {
        const result = await apiUpdateProduct(pendingProductId, data);
        savedProduct = result.data;
      } else {
        const result = await apiCreateProduct(data);
        savedProduct = result.data;
        setPendingProductId(savedProduct.id);
      }

      if (selectedDefaultImageFile) {
        setImageUploading(true);
        try {
          await apiUploadProductImage(savedProduct.id, selectedDefaultImageFile, {
            altText: name.trim(),
            isCover: true,
            syncDefault: true,
          });
          setImageMessage({ type: "success", text: "Default image uploaded." });
          replaceDefaultImagePreview(null);
          setSelectedDefaultImageFile(null);
          if (defaultImageInputRef.current) {
            defaultImageInputRef.current.value = "";
          }
        } catch (uploadError) {
          const uploadMessage = getImageUploadError(uploadError);
          setImageMessage({ type: "error", text: uploadMessage });
          setError(`Product saved, but default image upload failed. ${uploadMessage}`);
          return;
        } finally {
          setImageUploading(false);
        }
      }

      router.push("/admin/products");
    } catch (err) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <AdminFormSection title="Basic Info">
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Price (cents)"
              type="number"
              value={priceCents}
              onChange={(e) => setPriceCents(e.target.value)}
            />
            <Input
              label="Compare Price (cents)"
              type="number"
              value={comparePriceCents}
              onChange={(e) => setComparePriceCents(e.target.value)}
            />
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Classification">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Category"
              options={[
                { value: "", label: "Select category" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubCategoryId("");
              }}
            />
            <Select
              label="Subcategory"
              options={[
                { value: "", label: "Select subcategory" },
                ...subcategories.map((s) => ({ value: s.id, label: s.name })),
              ]}
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Brand"
              options={[
                { value: "", label: "None" },
                ...brands.map((b) => ({ value: b.id, label: b.name })),
              ]}
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
            />
            <Select
              label="Vendor"
              options={[
                { value: "", label: "None" },
                ...vendors.map((v) => ({ value: v.id, label: v.name })),
              ]}
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
            />
            <Select
              label="Collection"
              options={[
                { value: "", label: "None" },
                ...collections.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
            />
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Details">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Long Description</label>
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none transition-colors focus:border-[#3D6B6B]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Product Details (one per line)</label>
            <textarea
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none transition-colors focus:border-[#3D6B6B]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Dimensions (one per line)</label>
            <textarea
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none transition-colors focus:border-[#3D6B6B]"
            />
          </div>
          <Input
            label="Care & Cleaning"
            value={careAndCleaning}
            onChange={(e) => setCareAndCleaning(e.target.value)}
          />
        </div>
      </AdminFormSection>

      <AdminFormSection title="Specifications">
        <div className="space-y-3">
          {specifications.map((spec, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Input
                placeholder="Label"
                value={spec.label}
                onChange={(e) => updateSpecRow(idx, "label", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value"
                value={spec.value}
                onChange={(e) => updateSpecRow(idx, "value", e.target.value)}
                className="flex-1"
              />
              <button
                onClick={() => removeSpecRow(idx)}
                className="shrink-0 rounded p-1 text-red-400 hover:bg-red-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addSpecRow}>
            + Add Specification
          </Button>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Tags">
        <Input
          label="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="modern, wood, living-room"
        />
      </AdminFormSection>

      <AdminFormSection title="Settings">
        <div className="space-y-4">
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase text-gray-500">
                Default Image
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={defaultImageInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleDefaultImageSelected}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openDefaultImagePicker}
                  disabled={imageUploading}
                >
                  {imageUploading ? "Uploading..." : "Upload Image"}
                </Button>
                {(displayImageUrl || selectedDefaultImageFile) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearDefaultImage}
                    disabled={imageUploading}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {displayImageUrl && (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <img
                  src={displayImageUrl}
                  alt="Default product preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            )}

            <Input
              label="Default Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL or choose a file"
            />

            {imageMessage && (
              <p
                className={`text-xs ${
                  imageMessage.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {imageMessage.text}
              </p>
            )}
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-[#E8B800]"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="accent-[#E8B800]"
              />
              New Arrival
            </label>
          </div>
        </div>
      </AdminFormSection>

      <div className="flex justify-end gap-3 pb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/products")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : isPersistedProduct ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </div>
  );
}

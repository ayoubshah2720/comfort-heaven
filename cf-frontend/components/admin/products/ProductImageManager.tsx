"use client";

import { useRef, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin";
import type { BackendProductImage } from "@/types/product";
import {
  apiAddProductImage,
  apiRemoveProductImage,
  apiUploadProductImage,
} from "@/lib/admin-api";
import Image from "next/image";

interface ProductImageManagerProps {
  productId: string;
  images: BackendProductImage[];
  onUpdate: () => void;
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function getUploadError(error: unknown): string {
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

export default function ProductImageManager({
  productId,
  images,
  onUpdate,
}: ProductImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [isCover, setIsCover] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<BackendProductImage | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleAdd = async () => {
    if (!url.trim()) return;
    setAddLoading(true);
    setMessage(null);
    try {
      await apiAddProductImage(productId, {
        url: url.trim(),
        altText: altText.trim() || undefined,
        isCover,
        syncDefault: isCover,
      });
      setUrl("");
      setAltText("");
      setIsCover(false);
      setMessage({ type: "success", text: "Image added to product." });
      onUpdate();
    } catch (error) {
      setMessage({ type: "error", text: getUploadError(error) });
    } finally {
      setAddLoading(false);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Only JPG, JPEG, PNG, and WebP images are allowed.",
      });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setMessage({
        type: "error",
        text: "File too large. Maximum size is 5MB.",
      });
      event.target.value = "";
      return;
    }

    setAddLoading(true);
    setMessage(null);

    try {
      await apiUploadProductImage(productId, file, {
        altText: altText.trim() || undefined,
        isCover,
        syncDefault: isCover,
      });
      setUrl("");
      setAltText("");
      setIsCover(false);
      setMessage({ type: "success", text: "Image uploaded and added to product." });
      onUpdate();
    } catch (error) {
      setMessage({ type: "error", text: getUploadError(error) });
    } finally {
      setAddLoading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setMessage(null);
    try {
      await apiRemoveProductImage(productId, deleteTarget.id);
      setMessage({ type: "success", text: "Image removed from product." });
      onUpdate();
    } catch (error) {
      setMessage({ type: "error", text: getUploadError(error) });
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Product Images
      </h3>

      {images.length === 0 ? (
        <p className="mb-4 text-sm text-gray-400">No images yet</p>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-lg border border-gray-200">
              <Image
                src={img.url}
                alt={img.altText || "Product image"}
                className="aspect-square w-full object-cover"
                width={100}
                height={100}
                unoptimized
              />
              {img.isCover && (
                <span className="absolute left-2 top-2 rounded bg-[#E8B800] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Cover
                </span>
              )}
              <button
                onClick={() => setDeleteTarget(img)}
                className="absolute right-2 top-2 rounded-full bg-white/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-semibold uppercase text-gray-500">Add Image</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelected}
        />
        <Input label="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Input label="Alt Text" value={altText} onChange={(e) => setAltText(e.target.value)} />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={isCover}
            onChange={(e) => setIsCover(e.target.checked)}
            className="accent-[#E8B800]"
          />
          Set as cover image
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={handleAdd} disabled={addLoading || !url.trim()}>
            {addLoading ? "Working..." : "Add by URL"}
          </Button>
          <Button size="sm" variant="outline" onClick={openFilePicker} disabled={addLoading}>
            {addLoading ? "Working..." : "Upload File"}
          </Button>
        </div>
        {message && (
          <p
            className={`text-xs ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Image"
        message="Remove this image from the product?"
        confirmLabel="Remove"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

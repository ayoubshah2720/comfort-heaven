"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpTrayIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ConfirmDialog } from "@/components/admin";
import Button from "@/components/ui/Button";
import { apiDeleteUserImage, apiUploadUserImage } from "@/lib/admin-api";
import type { AdminUser } from "@/types/admin";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface UserAvatarManagerProps {
  user: AdminUser;
  onUpdated: (
    id: string,
    image: {
      profileImageUrl: string | null;
      profileImagePublicId: string | null;
    },
  ) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function getErrorMessage(error: unknown): string {
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

  return "Something went wrong. Please try again.";
}

export default function UserAvatarManager({
  user,
  onUpdated,
}: UserAvatarManagerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const currentImageUrl = previewUrl || user.profileImageUrl || null;
  const hasSavedImage = Boolean(user.profileImageUrl || user.profileImagePublicId);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function resetSelection() {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Only JPG, JPEG, PNG, and WebP images are allowed.",
      });
      resetSelection();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage({
        type: "error",
        text: "File too large. Maximum size is 5MB.",
      });
      resetSelection();
      return;
    }

    setMessage(null);
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    setUploading(true);
    setMessage(null);

    try {
      const response = await apiUploadUserImage(user.id, formData);
      onUpdated(user.id, {
        profileImageUrl: response.data.profileImageUrl ?? null,
        profileImagePublicId: response.data.profileImagePublicId ?? null,
      });
      resetSelection();
      setMessage({ type: "success", text: response.message || "Avatar updated." });
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setMessage(null);

    try {
      const response = await apiDeleteUserImage(user.id);
      onUpdated(user.id, {
        profileImageUrl: response.data.profileImageUrl ?? null,
        profileImagePublicId: response.data.profileImagePublicId ?? null,
      });
      resetSelection();
      setMessage({ type: "success", text: response.message || "Avatar removed." });
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <div className="flex min-w-[200px] flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={openFilePicker}
              className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-200 bg-gray-100"
              aria-label={`Change avatar for ${user.name}`}
            >
              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt={`${user.name} avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-[#3D6B6B] text-xs font-semibold text-white">
                  {getInitials(user.name) || <PhotoIcon className="h-5 w-5" />}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={openFilePicker}
              className="absolute -bottom-1 -right-1 rounded-full bg-[#E8B800] p-1 text-white shadow-sm transition-colors hover:bg-[#d4a700]"
              aria-label={`Edit avatar for ${user.name}`}
            >
              <PencilSquareIcon className="h-3.5 w-3.5" />
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedFile ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="gap-1"
                >
                  <ArrowUpTrayIcon className="h-3.5 w-3.5" />
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetSelection}
                  disabled={uploading}
                  className="gap-1"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={openFilePicker}
                  className="gap-1"
                >
                  <PencilSquareIcon className="h-3.5 w-3.5" />
                  Edit
                </Button>
                {hasSavedImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmOpen(true)}
                    disabled={deleting}
                    className="gap-1 text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    {deleting ? "Removing..." : "Remove"}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {selectedFile && (
          <p className="text-xs text-gray-500">
            Preview ready: {selectedFile.name}
          </p>
        )}

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
        open={confirmOpen}
        title="Remove Avatar"
        message={`Remove ${user.name}'s profile image?`}
        confirmLabel="Remove"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

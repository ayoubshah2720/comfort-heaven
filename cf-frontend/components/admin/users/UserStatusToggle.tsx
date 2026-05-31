"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/admin";
import Button from "@/components/ui/Button";
import type { AdminUser } from "@/types/admin";
import { apiDeactivateUser, apiReactivateUser } from "@/lib/admin-api";

interface UserStatusToggleProps {
  user: AdminUser;
  onUpdated: (id: string, isActive: boolean) => void;
}

export default function UserStatusToggle({ user, onUpdated }: UserStatusToggleProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (user.isActive) {
        await apiDeactivateUser(user.id);
        onUpdated(user.id, false);
      } else {
        await apiReactivateUser(user.id);
        onUpdated(user.id, true);
      }
    } catch {
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Button
        variant={user.isActive ? "ghost" : "outline"}
        size="sm"
        onClick={() => setConfirmOpen(true)}
        className={user.isActive ? "text-red-600 hover:bg-red-50" : ""}
      >
        {user.isActive ? "Deactivate" : "Activate"}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        title={user.isActive ? "Deactivate User" : "Activate User"}
        message={
          user.isActive
            ? `Are you sure you want to deactivate ${user.name}? They will not be able to log in.`
            : `Reactivate ${user.name}? They will be able to log in again.`
        }
        confirmLabel={user.isActive ? "Deactivate" : "Activate"}
        danger={user.isActive}
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

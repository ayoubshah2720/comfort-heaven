"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { DataTable, SearchInput, StatusBadge, ConfirmDialog } from "@/components/admin";
import type { Column } from "@/components/admin";
import type { AdminUser } from "@/types/admin";
import { apiListAdminUsers, apiChangeUserRole } from "@/lib/admin-api";
import UserStatusToggle from "./UserStatusToggle";
import UserAvatarManager from "./UserAvatarManager";
import Select from "@/components/ui/Select";

export default function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiListAdminUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = useCallback((q: string) => setSearch(q), []);

  const handleStatusUpdated = useCallback((id: string, isActive: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive } : u)),
    );
  }, []);

  const handleImageUpdated = useCallback(
    (
      id: string,
      image: {
        profileImageUrl: string | null;
        profileImagePublicId: string | null;
      },
    ) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...image } : u)),
      );
    },
    [],
  );

  const handleRoleChange = async () => {
    if (!roleTarget) return;
    setRoleLoading(true);
    try {
      const newRole = roleTarget.role === "ADMIN" ? "USER" : "ADMIN";
      await apiChangeUserRole(roleTarget.id, newRole);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === roleTarget.id ? { ...u, role: newRole } : u,
        ),
      );
    } catch {
      // silent
    } finally {
      setRoleLoading(false);
      setRoleTarget(null);
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.isActive) ||
        (statusFilter === "inactive" && !u.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const columns: Column<AdminUser>[] = [
    {
      key: "profile",
      label: "Profile",
      render: (u) => (
        <UserAvatarManager user={u} onUpdated={handleImageUpdated} />
      ),
    },
    { key: "name", label: "Name", render: (u) => <span className="font-medium">{u.name}</span> },
    { key: "email", label: "Email", render: (u) => u.email },
    {
      key: "role",
      label: "Role",
      render: (u) => (
        <StatusBadge variant={u.role === "ADMIN" ? "admin" : "user"} />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (u) => (
        <StatusBadge variant={u.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (u) => new Date(u.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (u) => (
        <div className="flex items-center gap-2">
          <UserStatusToggle user={u} onUpdated={handleStatusUpdated} />
          <button
            onClick={() => setRoleTarget(u)}
            className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          >
            {u.role === "ADMIN" ? "Make User" : "Make Admin"}
          </button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SearchInput placeholder="Search users..." onSearch={handleSearch} />
        </div>
        <Select
          options={[
            { value: "all", label: "All Roles" },
            { value: "ADMIN", label: "Admin" },
            { value: "USER", label: "User" },
          ]}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="!border !border-gray-200 !rounded-lg !bg-white !py-2 !px-3"
        />
        <Select
          options={[
            { value: "all", label: "All Statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="!border !border-gray-200 !rounded-lg !bg-white !py-2 !px-3"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(u) => u.id}
        loading={loading}
        emptyMessage="No users found"
      />

      <ConfirmDialog
        open={!!roleTarget}
        title="Change Role"
        message={
          roleTarget
            ? `Change ${roleTarget.name}'s role from ${roleTarget.role} to ${roleTarget.role === "ADMIN" ? "USER" : "ADMIN"}?`
            : ""
        }
        confirmLabel="Change Role"
        loading={roleLoading}
        onConfirm={handleRoleChange}
        onCancel={() => setRoleTarget(null)}
      />
    </>
  );
}

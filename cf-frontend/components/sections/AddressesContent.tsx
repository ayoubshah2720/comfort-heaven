"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchAddressesThunk,
  createAddressThunk,
  updateAddressThunk,
  deleteAddressThunk,
  setDefaultAddressThunk,
  selectAddresses,
  selectAddressesLoading,
  selectAddressesError,
} from "@/store/slices/addressesSlice";
import type { BackendAddress } from "@/types/address";
import type { CreateAddressRequest } from "@/types/address";
import ProfileSidebar from "./ProfileSidebar";
import AddressForm from "./AddressForm";
import Button from "@/components/ui/Button";

type FormMode = "closed" | "add" | "edit";

export default function AddressesContent() {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddresses);
  const loading = useAppSelector(selectAddressesLoading);
  const error = useAppSelector(selectAddressesError);

  const [formMode, setFormMode] = useState<FormMode>("closed");
  const [editingAddress, setEditingAddress] = useState<BackendAddress | null>(null);

  useEffect(() => {
    dispatch(fetchAddressesThunk());
  }, [dispatch]);

  async function handleCreate(values: CreateAddressRequest) {
    await dispatch(createAddressThunk(values)).unwrap();
    setFormMode("closed");
  }

  async function handleUpdate(values: CreateAddressRequest) {
    if (!editingAddress) return;
    await dispatch(updateAddressThunk({ id: editingAddress.id, data: values })).unwrap();
    setFormMode("closed");
    setEditingAddress(null);
  }

  function handleEditClick(address: BackendAddress) {
    setEditingAddress(address);
    setFormMode("edit");
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    await dispatch(deleteAddressThunk(id));
  }

  async function handleSetDefault(id: string) {
    await dispatch(setDefaultAddressThunk(id));
  }

  return (
    <div>
      <h1 className="text-2xl text-center mb-6">
        My{" "}
        <span className="font-bold text-[#E8B800] underline">ADDRESS</span>
      </h1>

      <div className="bg-[#E8B800] rounded px-6 py-3 flex items-center mb-8">
        <span className="text-white text-sm">Home Page / My Address</span>
      </div>

      <div className="flex gap-6">
        <ProfileSidebar activeItem="addresses" />

        <div className="flex-1 min-w-0">
          <div className="bg-[#3D6B6B] text-white px-6 py-3 font-semibold">
            Addresses
          </div>

          <div className="min-h-[200px] p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {loading && addresses.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : formMode !== "closed" ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {formMode === "add" ? "Add New Address" : "Edit Address"}
                </h3>
                <AddressForm
                  initialValues={
                    formMode === "edit" && editingAddress
                      ? {
                        label: editingAddress.label,
                        company: editingAddress.company || "",
                        address1: editingAddress.address1,
                        address2: editingAddress.address2 || "",
                        city: editingAddress.city,
                        state: editingAddress.state,
                        zipCode: editingAddress.zipCode,
                        country: editingAddress.country,
                        phone: editingAddress.phone,
                        isDefault: editingAddress.isDefault,
                      }
                      : undefined
                  }
                  onSubmit={formMode === "add" ? handleCreate : handleUpdate}
                  onCancel={() => {
                    setFormMode("closed");
                    setEditingAddress(null);
                  }}
                  submitLabel={formMode === "add" ? "Add Address" : "Update Address"}
                  loading={loading}
                />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No addresses added yet
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address: BackendAddress) => (
                  <div
                    key={address.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {address.label}
                          {address.isDefault && (
                            <span className="ml-2 text-xs bg-[#E8B800] text-white px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </p>
                        {address.company && (
                          <p className="text-sm text-gray-600 mt-1">
                            {address.company}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          {address.address1}
                        </p>
                        {address.address2 && (
                          <p className="text-sm text-gray-600">
                            {address.address2}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.country}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.phone}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!address.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(address.id)}
                            className="text-xs text-[#3D6B6B] hover:underline"
                            disabled={loading}
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEditClick(address)}
                          className="text-xs text-[#3D6B6B] hover:underline"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(address.id)}
                          className="text-xs text-red-600 hover:underline"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {formMode === "closed" && (
            <div className="px-6 pb-6">
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-[#3D6B6B] hover:bg-[#2d5454]"
                onClick={() => setFormMode("add")}
                disabled={loading}
              >
                Add New Addresses
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

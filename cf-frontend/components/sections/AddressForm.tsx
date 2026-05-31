"use client";

import { useState } from "react";
import { Input, Button } from "@/components/ui";
import type { CreateAddressRequest } from "@/types/address";

interface AddressFormProps {
  initialValues?: Partial<CreateAddressRequest>;
  onSubmit: (values: CreateAddressRequest) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

const emptyForm: CreateAddressRequest = {
  label: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "Pakistan",
  phone: "",
  isDefault: false,
};

export default function AddressForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Address",
  loading = false,
}: AddressFormProps) {
  const [form, setForm] = useState<CreateAddressRequest>({
    ...emptyForm,
    ...initialValues,
  });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, isDefault: e.target.checked }));
  }

  async function handleSubmit() {
    setError("");

    if (!form.label || !form.address1 || !form.city || !form.state || !form.zipCode || !form.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await onSubmit(form);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save address";
      setError(msg);
    }
  }

  return (
    <div className="space-y-4">
      <Input
        label="Label *"
        name="label"
        value={form.label}
        onChange={handleChange}
        placeholder="e.g. Home, Office"
        required
      />
      <Input
        label="Company"
        name="company"
        value={form.company || ""}
        onChange={handleChange}
        placeholder="Company"
      />
      <Input
        label="Address 1 *"
        name="address1"
        value={form.address1}
        onChange={handleChange}
        placeholder="Address 1"
        required
      />
      <Input
        label="Address 2"
        name="address2"
        value={form.address2 || ""}
        onChange={handleChange}
        placeholder="Address 2"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City *"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          required
        />
        <Input
          label="Zip Code *"
          name="zipCode"
          value={form.zipCode}
          onChange={handleChange}
          placeholder="Zip Code"
          required
        />
      </div>
      <Input
        label="Country"
        name="country"
        value={form.country || ""}
        onChange={handleChange}
        placeholder="Country"
      />
      <Input
        label="State / Region *"
        name="state"
        value={form.state}
        onChange={handleChange}
        placeholder="State / Region"
      />
      <Input
        label="Phone *"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
      />
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isDefault || false}
          onChange={handleCheckboxChange}
          className="accent-[#3D6B6B]"
        />
        Set as default address
      </label>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Saving..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

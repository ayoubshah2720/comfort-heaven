"use client";

import type { BackendAddress } from "@/types/address";

interface CheckoutAddressSelectorProps {
  addresses: BackendAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onAddNew: () => void;
  loading: boolean;
}

export default function CheckoutAddressSelector({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNew,
  loading,
}: CheckoutAddressSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5 text-gray-700"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">
          Shipping Address
        </h2>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-4">Loading addresses...</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <label
              key={address.id}
              className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${selectedAddressId === address.id
                  ? "border-[#3D6B6B] bg-[#3D6B6B]/5"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <input
                type="radio"
                name="savedAddress"
                value={address.id}
                checked={selectedAddressId === address.id}
                onChange={() => onSelectAddress(address.id)}
                className="accent-[#3D6B6B] mt-1"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800">
                  {address.label}
                  {address.isDefault && (
                    <span className="ml-2 text-xs bg-[#E8B800] text-white px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {address.address1}
                  {address.address2 ? `, ${address.address2}` : ""}
                </p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p className="text-sm text-gray-600">{address.phone}</p>
              </div>
            </label>
          ))}

          <button
            type="button"
            onClick={onAddNew}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-[#3D6B6B] font-semibold hover:border-[#3D6B6B] hover:bg-[#3D6B6B]/5 transition-colors"
          >
            + Add New Address
          </button>
        </div>
      )}
    </div>
  );
}

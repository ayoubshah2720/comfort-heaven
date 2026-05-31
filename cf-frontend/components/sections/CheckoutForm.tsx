"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUser, selectIsAuthenticated } from "@/store/slices/authSlice";
import { clearCart, selectCartTotal } from "@/store/slices/cartSlice";
import {
  fetchAddressesThunk,
  selectAddresses,
  selectDefaultAddress,
  selectAddressesLoading,
} from "@/store/slices/addressesSlice";
import { Input, Button } from "@/components/ui";
import CheckoutAccountOptions from "./CheckoutAccountOptions";
import CheckoutPersonalDetails from "./CheckoutPersonalDetails";
import CheckoutAddressSelector from "./CheckoutAddressSelector";
import AddressForm from "./AddressForm";
import CheckoutOrderTable from "./CheckoutOrderTable";
import { apiCheckout } from "@/lib/order-api";
import { FLAT_SHIPPING_RATE, VAT_RATE } from "@/constants";
import type { BackendOrder } from "@/types/order";
import type { AccountOption } from "./CheckoutAccountOptions";
import type { PersonalDetails } from "./CheckoutPersonalDetails";
import type { CreateAddressRequest } from "@/types/address";

type AddressMode = "saved" | "new";

interface CheckoutFormState {
  accountOption: AccountOption;
  personal: PersonalDetails;
  sameAddress: boolean;
  shippingMethod: string;
  paymentMethod: string;
  couponCode: string;
  voucherCode: string;
  orderComments: string;
  subscribeNewsletter: boolean;
  agreeSupport: boolean;
  agreeWarranty: boolean;
}

const initialState: CheckoutFormState = {
  accountOption: "guest",
  personal: { firstName: "", lastName: "", email: "", telephone: "", fax: "" },
  sameAddress: true,
  shippingMethod: "flat",
  paymentMethod: "cod",
  couponCode: "",
  voucherCode: "",
  orderComments: "",
  subscribeNewsletter: false,
  agreeSupport: false,
  agreeWarranty: false,
};

function formatPrice(cents: number): string {
  return `Rs ${(cents / 100).toLocaleString()}`;
}

export default function CheckoutForm() {
  const [form, setForm] = useState<CheckoutFormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<BackendOrder | null>(null);
  const [error, setError] = useState("");

  const [addressMode, setAddressMode] = useState<AddressMode>("saved");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [inlineAddress, setInlineAddress] = useState<CreateAddressRequest | null>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const cartTotal = useAppSelector(selectCartTotal);
  const addresses = useAppSelector(selectAddresses);
  const defaultAddress = useAppSelector(selectDefaultAddress);
  const addressesLoading = useAppSelector(selectAddressesLoading);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAddressesThunk());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const [first, ...rest] = (user.name || "").split(" ");
      setForm((prev) => ({
        ...prev,
        accountOption: "returning" as AccountOption,
        personal: {
          ...prev.personal,
          firstName: first,
          lastName: rest.join(" "),
          email: user.email,
        },
      }));
    }
  }, [isAuthenticated, user]);

  const addressInitialized = useRef(false);
  useEffect(() => {
    if (addressInitialized.current) return;
    if (addressesLoading) return;

    if (addresses.length > 0) {
      const pick = defaultAddress ?? addresses[0];
      setSelectedAddressId(pick.id);
      setAddressMode("saved");
    } else {
      setAddressMode("new");
    }
    addressInitialized.current = true;
  }, [addresses, defaultAddress, addressesLoading]);

  function handlePersonalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
  }

  async function handleInlineAddressSubmit(values: CreateAddressRequest) {
    setInlineAddress(values);
    setAddressMode("new");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { personal } = form;
    if (!personal.firstName || !personal.lastName || !personal.email || !personal.telephone) {
      setError("Please fill in all required personal details.");
      return;
    }

    if (addressMode === "saved" && !selectedAddressId) {
      setError("Please select a shipping address.");
      return;
    }
    if (addressMode === "new" && !inlineAddress) {
      setError("Please fill in and save the shipping address.");
      return;
    }

    if (!form.agreeSupport || !form.agreeWarranty) {
      setError("You must agree to Support 24/7 and Warranty And Services to proceed.");
      return;
    }

    setSubmitting(true);
    try {
      const shippingCents = Math.round(FLAT_SHIPPING_RATE * 100);
      const taxCents = Math.round(cartTotal * VAT_RATE * 100);

      const result = await apiCheckout({
        notes: form.orderComments || undefined,
        shippingCents,
        taxCents,
        discountCents: 0,
        currency: "PKR",
        ...(addressMode === "saved" && selectedAddressId
          ? { addressId: selectedAddressId }
          : {}),
        ...(addressMode === "new" && inlineAddress
          ? { shippingAddress: inlineAddress }
          : {}),
      });

      dispatch(clearCart());
      setConfirmedOrder(result.data);
      setOrderConfirmed(true);
    } catch (err) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderConfirmed) {
    return (
      <div className="text-center py-16">
        <svg viewBox="0 0 24 24" fill="none" stroke="#3D6B6B" strokeWidth="2" className="w-16 h-16 mx-auto mb-4">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        {confirmedOrder && (
          <p className="text-lg font-semibold text-[#3D6B6B] mb-2">
            Order #{confirmedOrder.orderNumber}
          </p>
        )}
        <p className="text-gray-600 mb-2">
          Thank you for your order. We will process it shortly.
        </p>
        {confirmedOrder && (
          <p className="text-gray-700 font-semibold mb-6">
            Total: {formatPrice(confirmedOrder.totalCents)}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/profile/orders"
            className="inline-block bg-[#3D6B6B] text-white font-semibold px-8 py-3 rounded hover:bg-[#2f5656] transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/"
            className="inline-block bg-[#E8B800] text-white font-semibold px-8 py-3 rounded hover:bg-[#d4a700] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <CheckoutAccountOptions
            selected={form.accountOption}
            onChange={(value) => setForm((prev) => ({ ...prev, accountOption: value }))}
          />
          <CheckoutPersonalDetails
            personal={form.personal}
            onPersonalChange={handlePersonalChange}
          />

          {/* Address Section */}
          {isAuthenticated && addressMode === "saved" && addresses.length > 0 ? (
            <CheckoutAddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={(id) => {
                setSelectedAddressId(id);
                setAddressMode("saved");
                setInlineAddress(null);
              }}
              onAddNew={() => {
                setAddressMode("new");
                setSelectedAddressId(null);
              }}
              loading={addressesLoading}
            />
          ) : (
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
              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setAddressMode("saved");
                    setInlineAddress(null);
                  }}
                  className="text-sm text-[#3D6B6B] hover:underline mb-4"
                >
                  Use a saved address instead
                </button>
              )}
              {inlineAddress ? (
                <div className="border border-[#3D6B6B] rounded-lg p-4 bg-[#3D6B6B]/5">
                  <p className="text-sm font-semibold text-gray-800">{inlineAddress.label}</p>
                  <p className="text-sm text-gray-600">{inlineAddress.address1}</p>
                  <p className="text-sm text-gray-600">
                    {inlineAddress.city}, {inlineAddress.state} {inlineAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{inlineAddress.phone}</p>
                  <button
                    type="button"
                    onClick={() => setInlineAddress(null)}
                    className="text-xs text-[#3D6B6B] hover:underline mt-2"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <AddressForm
                  onSubmit={handleInlineAddressSubmit}
                  onCancel={() => {
                    if (addresses.length > 0) {
                      setAddressMode("saved");
                    }
                  }}
                  submitLabel="Use This Address"
                />
              )}
            </div>
          )}

          {/* Same address checkbox */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.sameAddress}
              onChange={(e) => setForm((prev) => ({ ...prev, sameAddress: e.target.checked }))}
              className="accent-[#3D6B6B]"
            />
            My delivery and billing addresses are the same.
          </label>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Shipping Method */}
          <div>
            <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-700">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                Shipping Method
              </h2>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="shippingMethod"
                value="flat"
                checked={form.shippingMethod === "flat"}
                onChange={() => setForm((prev) => ({ ...prev, shippingMethod: "flat" }))}
                className="accent-[#3D6B6B]"
              />
              Flat Shipping Rate - Rs 8.00
            </label>
          </div>

          {/* Payment Method */}
          <div>
            <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-700">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                Payment Method
              </h2>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={form.paymentMethod === "cod"}
                onChange={() => setForm((prev) => ({ ...prev, paymentMethod: "cod" }))}
                className="accent-[#3D6B6B]"
              />
              Cash On Delivery
            </label>
          </div>

          {/* Coupon / Voucher */}
          <div>
            <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-700">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
              </svg>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                Do You Have A Coupon Or Voucher?
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label="Enter your coupon here"
                    value={form.couponCode}
                    onChange={(e) => setForm((prev) => ({ ...prev, couponCode: e.target.value }))}
                    placeholder="Coupon code"
                  />
                </div>
                <Button type="button" variant="outline" size="sm">
                  Apply
                </Button>
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label="Enter your voucher here"
                    value={form.voucherCode}
                    onChange={(e) => setForm((prev) => ({ ...prev, voucherCode: e.target.value }))}
                    placeholder="Voucher code"
                  />
                </div>
                <Button type="button" variant="outline" size="sm">
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Order Table */}
          <CheckoutOrderTable />

          {/* Payment Details */}
          <div>
            <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-700">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                Payment Details
              </h2>
            </div>
            <p className="text-sm text-gray-500">Payment details will be collected upon delivery.</p>
          </div>

          {/* Order Comments */}
          <div>
            <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-700">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                Add Comments About Your Order
              </h2>
            </div>
            <textarea
              value={form.orderComments}
              onChange={(e) => setForm((prev) => ({ ...prev, orderComments: e.target.value }))}
              placeholder="Write your comments here..."
              rows={4}
              className="w-full border border-gray-300 rounded p-3 text-sm text-gray-700 outline-none focus:border-[#3D6B6B] transition-colors resize-none"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.subscribeNewsletter}
                onChange={(e) => setForm((prev) => ({ ...prev, subscribeNewsletter: e.target.checked }))}
                className="accent-[#3D6B6B]"
              />
              I wish to subscribe to the newsletter.
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreeSupport}
                onChange={(e) => setForm((prev) => ({ ...prev, agreeSupport: e.target.checked }))}
                className="accent-[#3D6B6B]"
              />
              I have read and agree to the <span className="text-[#3D6B6B] underline">Support 24/7</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreeWarranty}
                onChange={(e) => setForm((prev) => ({ ...prev, agreeWarranty: e.target.checked }))}
                className="accent-[#3D6B6B]"
              />
              I have read and agree to the <span className="text-[#3D6B6B] underline">Warranty And Services</span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full uppercase tracking-wider"
            disabled={submitting}
          >
            {submitting ? "Processing..." : "Confirm Order"}
          </Button>
        </div>
      </div>
    </form>
  );
}

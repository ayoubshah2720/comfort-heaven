"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems, selectCartOrderSummary } from "@/store/slices/cartSlice";
import Button from "@/components/ui/Button";

export default function CartSummary() {
  const items = useAppSelector(selectCartItems);
  const { subtotal, vat, ecoTax, total } = useAppSelector(selectCartOrderSummary);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="max-w-sm ml-auto">
        <div className="flex justify-between py-3 border-b border-gray-200 text-sm text-gray-600">
          <span>Sub Total</span>
          <span>Rs {subtotal.toLocaleString()}.00</span>
        </div>
        <div className="flex justify-between py-3 border-b border-gray-200 text-sm text-gray-600">
          <span>VAT (15%)</span>
          <span>Rs {vat.toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-3 border-b border-gray-200 text-sm text-gray-600">
          <span>Eco Tax (-2.00)</span>
          <span>Rs {ecoTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-3 text-base font-bold text-gray-900">
          <span>TOTAL</span>
          <span>Rs {total.toLocaleString()}</span>
        </div>
      </div>

      <Link href="/checkout">
        <Button variant="primary" size="lg" className="w-full mt-6">
          Proceed To Checkout
        </Button>
      </Link>
    </div>
  );
}

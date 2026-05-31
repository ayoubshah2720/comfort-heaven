export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "FULFILLED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderProductRef {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export interface BackendOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  product: OrderProductRef;
  createdAt: string;
  updatedAt: string;
}

export interface BackendOrder {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  notes: string | null;
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  currency: string;
  refundedAmountCents: number;
  shippingLabel: string | null;
  shippingCompany: string | null;
  shippingAddress1: string | null;
  shippingAddress2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingZipCode: string | null;
  shippingCountry: string | null;
  shippingPhone: string | null;
  paidAt: string | null;
  fulfilledAt: string | null;
  cancelledAt: string | null;
  refundedAt: string | null;
  items: BackendOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutRequest {
  notes?: string;
  shippingCents?: number;
  taxCents?: number;
  discountCents?: number;
  currency?: string;
  addressId?: string;
  shippingAddress?: {
    label: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    phone: string;
  };
}

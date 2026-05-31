export interface BackendAddress {
  id: string;
  userId: string;
  label: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  label: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  phone: string;
  isDefault?: boolean;
}

export type UpdateAddressRequest = Partial<CreateAddressRequest>;

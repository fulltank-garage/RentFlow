// src/services/booking/booking.types.ts
import type { TenantSummary } from "../types/types";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "active"
  | "review"
  | "completed"
  | "cancelled";

export type PickupMethod = "branch" | "custom";
export type ReturnMethod = "branch" | "custom";

export type Booking = TenantSummary & {
  id: string;
  bookingCode: string;
  userId: string;
  carId: string;
  carName?: string;
  status: BookingStatus;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  pickupLocationValue?: string;
  returnLocationValue?: string;
  pickupMethod: PickupMethod;
  returnMethod: ReturnMethod;
  totalDays: number;
  subtotal: number;
  addons?: BookingAddon[];
  addonsTotal?: number;
  extraCharge: number;
  discount: number;
  totalAmount: number;
  note?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  updatedAt: string;
  tenantId?: string;
};

export type BookingAddon = {
  id?: string;
  key?: string;
  name: string;
  price: number;
  pricing: "perDay" | "perTrip";
  quantity: number;
  lineTotal: number;
};

export type BookingAddonPayload = {
  id?: string;
  key?: string;
  name?: string;
  title?: string;
  price: number;
  pricing: "perDay" | "perTrip";
};

export type CreateBookingPayload = {
  carId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  pickupMethod: PickupMethod;
  returnMethod: ReturnMethod;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  note?: string;
  addons?: BookingAddonPayload[];
};

export type BookingPricePreview = {
  totalDays: number;
  pricePerDay: number;
  subtotal: number;
  addons?: BookingAddon[];
  addonsTotal?: number;
  extraCharge: number;
  discount: number;
  totalAmount: number;
};

export type BookingPricePreviewPayload = {
  carId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation?: string;
  returnLocation?: string;
  addons?: BookingAddonPayload[];
};

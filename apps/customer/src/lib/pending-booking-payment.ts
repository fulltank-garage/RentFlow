import type { Booking } from "@/src/services/booking/booking.types";

type PendingBookingPaymentInput = Partial<Booking> & {
  id: string;
  bookingCode?: string;
  tenantSlug?: string;
  shopName?: string;
};

export function normalizeBookingDateForInput(value?: string | null) {
  if (!value) return "";

  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeBookingTimeForInput(value?: string | null) {
  if (!value) return "10:00";

  const timeMatch = value.match(/(?:T|\s)(\d{2}:\d{2})/);
  if (timeMatch) return timeMatch[1];

  const plainTimeMatch = value.match(/^(\d{2}:\d{2})/);
  if (plainTimeMatch) return plainTimeMatch[1];

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "10:00";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function buildPendingBookingPaymentHref(
  booking: PendingBookingPaymentInput
) {
  const params = new URLSearchParams();
  const bookingCode = booking.bookingCode || booking.id;
  const pickupLocation =
    booking.pickupLocationValue || booking.pickupLocation || "";
  const returnLocation =
    booking.returnLocationValue || booking.returnLocation || "";
  const addonIds =
    booking.addons
      ?.map((addon) => addon.id || addon.key)
      .filter((value): value is string => Boolean(value)) ?? [];

  params.set("bookingId", bookingCode);
  params.set("bookingRef", booking.id);
  params.set("amount", String(booking.totalAmount ?? 0));
  params.set("carId", booking.carId || "");
  params.set("carName", booking.carName || booking.carId || "");
  params.set("days", String(booking.totalDays || 1));
  params.set("pickupDate", normalizeBookingDateForInput(booking.pickupDate));
  params.set("returnDate", normalizeBookingDateForInput(booking.returnDate));
  params.set("pickupTime", normalizeBookingTimeForInput(booking.pickupDate));
  params.set("returnTime", normalizeBookingTimeForInput(booking.returnDate));
  params.set("pickupPoint", pickupLocation);
  params.set("returnPoint", returnLocation);
  params.set("customerName", booking.customerName || "");
  params.set("customerPhone", booking.customerPhone || "");
  params.set("subtotal", String(booking.subtotal ?? booking.totalAmount ?? 0));
  params.set("discount", String(booking.discount ?? 0));
  params.set("extraCharge", String(booking.extraCharge ?? 0));
  params.set("addons", JSON.stringify(addonIds));

  if (booking.shopName) params.set("shopName", booking.shopName);
  if (booking.tenantSlug || booking.domainSlug) {
    params.set("tenant", booking.tenantSlug || booking.domainSlug || "");
  }

  return `/payment?${params.toString()}`;
}

export function isSameBookingWindow(
  booking: Pick<Booking, "pickupDate" | "returnDate">,
  pickupDate: string,
  returnDate: string
) {
  return (
    normalizeBookingDateForInput(booking.pickupDate) === pickupDate &&
    normalizeBookingDateForInput(booking.returnDate) === returnDate
  );
}

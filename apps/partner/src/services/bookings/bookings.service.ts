import { requestPartner } from "../core/api-client.service";
import type { PartnerBooking, PartnerBookingOperation } from "./bookings.types";

export const bookingsService = {
  getBookings(status?: string) {
    return requestPartner<{ items: PartnerBooking[]; total: number }>(
      `/partner/bookings${
        status && status !== "all" ? `?status=${encodeURIComponent(status)}` : ""
      }`
    );
  },

  updateBookingStatus(bookingId: string, status: string, note?: string) {
    return requestPartner<PartnerBooking>(
      `/partner/bookings/${encodeURIComponent(bookingId)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status, note }),
      }
    );
  },

  getBookingOperations(bookingId: string) {
    return requestPartner<{ items: PartnerBookingOperation[]; total: number }>(
      `/partner/bookings/${encodeURIComponent(bookingId)}/operations`
    );
  },

  createBookingOperation(
    bookingId: string,
    payload: {
      type: PartnerBookingOperation["type"];
      checklist?: string[];
      odometer?: number;
      fuelLevel?: string;
      damageNote?: string;
      fineAmount?: number;
      staffNote?: string;
      nextStatus?: string;
    }
  ) {
    return requestPartner<{
      operation: PartnerBookingOperation;
      booking: PartnerBooking;
    }>(`/partner/bookings/${encodeURIComponent(bookingId)}/operations`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

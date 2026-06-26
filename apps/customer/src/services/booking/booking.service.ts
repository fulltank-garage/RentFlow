import api from "@/src/lib/axios";
import { getRentFlowCarTenantHeaders } from "@/src/lib/tenant";
import type { ApiResponse } from "../types/types";
import type { RentFlowCarRequestOptions } from "../types/types";
import type {
  Booking,
  BookingPricePreview,
  BookingPricePreviewPayload,
  CreateBookingPayload,
} from "./booking.types";

export const bookingApi = {
  async previewPrice(
    payload: BookingPricePreviewPayload,
    options?: RentFlowCarRequestOptions
  ) {
    const res = await api.post<ApiResponse<BookingPricePreview>>(
      "/bookings/preview",
      payload,
      {
        headers:
          options?.tenantSlug !== undefined
            ? getRentFlowCarTenantHeaders({ tenantSlug: options.tenantSlug })
            : undefined,
      }
    );
    return res.data;
  },

  async createBooking(
    payload: CreateBookingPayload,
    options?: RentFlowCarRequestOptions
  ) {
    const res = await api.post<ApiResponse<Booking>>("/bookings", payload, {
      headers:
        options?.tenantSlug !== undefined
          ? getRentFlowCarTenantHeaders({ tenantSlug: options.tenantSlug })
          : undefined,
    });
    return res.data;
  },

  async getMyBookings(options?: RentFlowCarRequestOptions) {
    const res = await api.get<ApiResponse<Booking[]>>("/bookings/me", {
      headers:
        options?.tenantSlug !== undefined
          ? getRentFlowCarTenantHeaders({ tenantSlug: options.tenantSlug })
          : undefined,
    });
    return res.data;
  },

  async getBookingById(bookingId: string, options?: RentFlowCarRequestOptions) {
    const res = await api.get<ApiResponse<Booking>>(`/bookings/${bookingId}`, {
      headers:
        options?.tenantSlug !== undefined
          ? getRentFlowCarTenantHeaders({ tenantSlug: options.tenantSlug })
          : undefined,
    });
    return res.data;
  },

  async cancelBooking(bookingId: string, options?: RentFlowCarRequestOptions) {
    const res = await api.patch<ApiResponse<Booking>>(
      `/bookings/${bookingId}/cancel`,
      undefined,
      {
        headers:
          options?.tenantSlug !== undefined
            ? getRentFlowCarTenantHeaders({ tenantSlug: options.tenantSlug })
            : undefined,
      }
    );
    return res.data;
  },
};

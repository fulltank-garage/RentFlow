import api from "@/src/lib/axios";
import { resolveRentFlowCarAssetUrl } from "@/src/lib/runtime-api-url";
import { getRentFlowCarTenantHeaders } from "@/src/lib/tenant";
import type { ApiResponse } from "../types/types";
import type { RentFlowCarRequestOptions } from "../types/types";
import type { CreatePaymentPayload, Payment } from "./payments.types";

function normalizePayment(payment: Payment): Payment {
  return {
    ...payment,
    slipUrl: resolveRentFlowCarAssetUrl(payment.slipUrl),
  };
}

export const paymentsApi = {
  async createPayment(
    payload: CreatePaymentPayload,
    options?: RentFlowCarRequestOptions
  ) {
    const res = await api.post<ApiResponse<Payment>>("/payments", payload, {
      headers:
        options?.tenantSlug !== undefined
          ? getRentFlowCarTenantHeaders({ tenantSlug: options.tenantSlug })
          : undefined,
    });
    return { ...res.data, data: normalizePayment(res.data.data) };
  },

  async getPaymentByBookingId(
    bookingId: string,
    options?: RentFlowCarRequestOptions
  ) {
    const res = await api.get<ApiResponse<Payment>>(
      `/payments/booking/${bookingId}`,
      {
        headers:
          options?.tenantSlug !== undefined
            ? getRentFlowCarTenantHeaders({ tenantSlug: options.tenantSlug })
            : undefined,
      }
    );
    return { ...res.data, data: normalizePayment(res.data.data) };
  },
};

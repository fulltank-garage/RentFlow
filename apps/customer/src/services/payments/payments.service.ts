import api from "@/src/lib/axios";
import { resolveRentFlowAssetUrl } from "@/src/lib/runtime-api-url";
import { getRentFlowTenantHeaders } from "@/src/lib/tenant";
import type { ApiResponse } from "../types/types";
import type { RentFlowRequestOptions } from "../types/types";
import type { CreatePaymentPayload, Payment } from "./payments.types";

function normalizePayment(payment: Payment): Payment {
  return {
    ...payment,
    slipUrl: resolveRentFlowAssetUrl(payment.slipUrl),
  };
}

export const paymentsApi = {
  async createPayment(
    payload: CreatePaymentPayload,
    options?: RentFlowRequestOptions
  ) {
    const res = await api.post<ApiResponse<Payment>>("/payments", payload, {
      headers:
        options?.tenantSlug !== undefined
          ? getRentFlowTenantHeaders({ tenantSlug: options.tenantSlug })
          : undefined,
    });
    return { ...res.data, data: normalizePayment(res.data.data) };
  },

  async getPaymentByBookingId(
    bookingId: string,
    options?: RentFlowRequestOptions
  ) {
    const res = await api.get<ApiResponse<Payment>>(
      `/payments/booking/${bookingId}`,
      {
        headers:
          options?.tenantSlug !== undefined
            ? getRentFlowTenantHeaders({ tenantSlug: options.tenantSlug })
            : undefined,
      }
    );
    return { ...res.data, data: normalizePayment(res.data.data) };
  },
};

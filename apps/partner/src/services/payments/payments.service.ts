import {
  requestPartner,
  resolvePartnerAssetUrl,
} from "../core/api-client.service";
import { tenantService } from "../tenant/tenant.service";
import type { PartnerPayment } from "./payments.types";

function resolvePartnerPaymentSlipUrl(value?: string | null, tenantSlug?: string) {
  const rawValue = value?.trim() || "";
  if (!rawValue) return "";

  try {
    const parsed = /^https?:\/\//i.test(rawValue)
      ? new URL(rawValue)
      : new URL(
          rawValue.startsWith("/") ? rawValue : `/${rawValue}`,
          "http://rentflow.local"
        );

    if (parsed.pathname.startsWith("/payment-slips/")) {
      if (tenantSlug && !parsed.searchParams.has("tenant")) {
        parsed.searchParams.set("tenant", tenantSlug);
      }
      return `/api/rentflow${parsed.pathname}${parsed.search}`;
    }
  } catch {
    return resolvePartnerAssetUrl(rawValue);
  }

  return resolvePartnerAssetUrl(rawValue);
}

function normalizePayment(
  payment: PartnerPayment,
  tenantSlug?: string
): PartnerPayment {
  return {
    ...payment,
    slipUrl: resolvePartnerPaymentSlipUrl(payment.slipUrl, tenantSlug),
  };
}

export const paymentsService = {
  async getPayments(status?: string) {
    const [response, tenant] = await Promise.all([
      requestPartner<{ items: PartnerPayment[]; total: number }>(
        `/partner/payments${
          status && status !== "all" ? `?status=${encodeURIComponent(status)}` : ""
        }`
      ),
      tenantService.getMyTenant().catch(() => null),
    ]);
    return {
      ...response,
      items: response.items.map((payment) =>
        normalizePayment(payment, tenant?.domainSlug)
      ),
    };
  },

  verifyPayment(paymentId: string) {
    return requestPartner<null>(
      `/partner/payments/${encodeURIComponent(paymentId)}/verify`,
      {
        method: "PATCH",
        body: JSON.stringify({}),
      }
    );
  },

  refundPayment(paymentId: string, refundAmount?: number) {
    return requestPartner<null>(
      `/partner/payments/${encodeURIComponent(paymentId)}/refund`,
      {
        method: "PATCH",
        body: JSON.stringify({ refundAmount }),
      }
    );
  },

  settlePayment(paymentId: string) {
    return requestPartner<null>(
      `/partner/payments/${encodeURIComponent(paymentId)}/settle`,
      {
        method: "PATCH",
        body: JSON.stringify({}),
      }
    );
  },
};

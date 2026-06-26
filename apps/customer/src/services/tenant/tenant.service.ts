import api from "@/src/lib/axios";
import { resolveRentFlowCarAssetUrl } from "@/src/lib/runtime-api-url";
import type { ApiResponse } from "../types/types";
import type { TenantProfile } from "./tenant.types";

function normalizeTenantProfile(tenant: TenantProfile): TenantProfile {
  const promoImageUrls = (tenant.promoImageUrls || [])
    .map((url) => resolveRentFlowCarAssetUrl(url))
    .filter(Boolean) as string[];
  const promoImageUrl =
    resolveRentFlowCarAssetUrl(tenant.promoImageUrl) || promoImageUrls[0];

  return {
    ...tenant,
    logoUrl: resolveRentFlowCarAssetUrl(tenant.logoUrl),
    promoImageUrl,
    promoImageUrls,
    lineOaQrCodeUrl: resolveRentFlowCarAssetUrl(tenant.lineOaQrCodeUrl),
  };
}

export const tenantApi = {
  async resolveTenant() {
    const res = await api.get<ApiResponse<TenantProfile>>("/tenants/resolve");
    return {
      ...res.data,
      data: normalizeTenantProfile(res.data.data),
    };
  },

  async listTenants() {
    const res = await api.get<
      ApiResponse<{ items: TenantProfile[]; total: number }>
    >("/tenants", {
      params: { marketplace: "true" },
    });

    return {
      ...res.data,
      data: {
        items: (res.data.data.items || []).map(normalizeTenantProfile),
        total: res.data.data.total || 0,
      },
    };
  },
};

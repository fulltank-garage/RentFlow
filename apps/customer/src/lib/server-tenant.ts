import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import {
  getRentFlowSiteMode,
  getRentFlowTenantHeaders,
  getRentFlowTenantSlug,
} from "@/src/lib/tenant";
import { getRentFlowApiBaseUrl, resolveRentFlowAssetUrl } from "@/src/lib/runtime-api-url";
import type { ApiResponse } from "@/src/services/types/types";
import type { TenantProfile } from "@/src/services/tenant/tenant.types";

export async function getRentFlowRequestHost() {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    process.env.NEXT_PUBLIC_RENTFLOW_TENANT_HOST ||
    ""
  );
}

export const getInitialRentFlowTenantProfile = cache(
  async (host: string): Promise<TenantProfile | null> => {
    if (getRentFlowSiteMode(host) !== "storefront") {
      return null;
    }

    const tenantSlug = getRentFlowTenantSlug(host);
    const requestHeaders = getRentFlowTenantHeaders({
      host,
      tenantSlug,
    });

    try {
      const response = await fetch(`${getRentFlowApiBaseUrl()}/tenants/resolve`, {
        cache: "no-store",
        headers: requestHeaders,
      });

      if (!response.ok) {
        return null;
      }

      const payload =
        (await response.json()) as ApiResponse<TenantProfile | null>;
      const tenant = payload.data;
      if (!tenant) {
        return null;
      }

      return {
        ...tenant,
        logoUrl: resolveRentFlowAssetUrl(tenant.logoUrl),
        promoImageUrl: resolveRentFlowAssetUrl(tenant.promoImageUrl),
        lineOaQrCodeUrl: resolveRentFlowAssetUrl(tenant.lineOaQrCodeUrl),
        promoImageUrls: (tenant.promoImageUrls || [])
          .map((url) => resolveRentFlowAssetUrl(url))
          .filter(Boolean) as string[],
      };
    } catch {
      return null;
    }
  }
);

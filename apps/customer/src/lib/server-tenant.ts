import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import {
  getRentFlowCarSiteMode,
  getRentFlowCarTenantHeaders,
  getRentFlowCarTenantSlug,
} from "@/src/lib/tenant";
import { getRentFlowCarApiBaseUrl, resolveRentFlowCarAssetUrl } from "@/src/lib/runtime-api-url";
import type { ApiResponse } from "@/src/services/types/types";
import type { TenantProfile } from "@/src/services/tenant/tenant.types";

export async function getRentFlowCarRequestHost() {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    process.env.NEXT_PUBLIC_RENTFLOW_TENANT_HOST ||
    ""
  );
}

export const getInitialRentFlowCarTenantProfile = cache(
  async (host: string): Promise<TenantProfile | null> => {
    if (getRentFlowCarSiteMode(host) !== "storefront") {
      return null;
    }

    const tenantSlug = getRentFlowCarTenantSlug(host);
    const requestHeaders = getRentFlowCarTenantHeaders({
      host,
      tenantSlug,
    });

    try {
      const response = await fetch(`${getRentFlowCarApiBaseUrl()}/tenants/resolve`, {
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
        logoUrl: resolveRentFlowCarAssetUrl(tenant.logoUrl),
        promoImageUrl: resolveRentFlowCarAssetUrl(tenant.promoImageUrl),
        promoImageUrls: (tenant.promoImageUrls || [])
          .map((url) => resolveRentFlowCarAssetUrl(url))
          .filter(Boolean) as string[],
      };
    } catch {
      return null;
    }
  }
);

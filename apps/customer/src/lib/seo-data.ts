import {
  getRentFlowCarApiBaseUrl,
  resolveRentFlowCarAssetUrl,
} from "./runtime-api-url";
import {
  getRentFlowCarTenantHeaders,
  getRentFlowCarTenantSlug,
} from "./tenant";
import { normalizeCar } from "../services/cars/cars.mapper";
import type { Car, CarsApiResponse } from "../services/cars/cars.types";
import type { ApiResponse } from "../services/types/types";
import type { TenantProfile } from "../services/tenant/tenant.types";

function normalizeTenantProfile(tenant: TenantProfile): TenantProfile {
  return {
    ...tenant,
    logoUrl: resolveRentFlowCarAssetUrl(tenant.logoUrl),
    promoImageUrl: resolveRentFlowCarAssetUrl(tenant.promoImageUrl),
    promoImageUrls: tenant.promoImageUrls
      ?.map(resolveRentFlowCarAssetUrl)
      .filter(Boolean),
    lineOaQrCodeUrl: resolveRentFlowCarAssetUrl(tenant.lineOaQrCodeUrl),
  };
}

export async function getRentFlowCarSeoCars(options?: {
  host?: string;
  limit?: number;
  marketplace?: boolean;
}) {
  const tenantSlug = options?.host
    ? getRentFlowCarTenantSlug(options.host)
    : undefined;
  const headers = options?.marketplace
    ? { "X-RentFlowCar-Marketplace": "true" }
    : getRentFlowCarTenantHeaders({
        host: options?.host,
        tenantSlug,
      });

  try {
    const url = new URL("/cars", getRentFlowCarApiBaseUrl());
    if (options?.marketplace) url.searchParams.set("marketplace", "true");
    url.searchParams.set("limit", String(options?.limit || 100));

    const response = await fetch(url, {
      cache: "no-store",
      headers,
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as CarsApiResponse;
    return (payload.items || []).map(normalizeCar);
  } catch {
    return [];
  }
}

export async function getRentFlowCarSeoCarById(
  carId: string,
  options?: { host?: string }
): Promise<Car | null> {
  const cars = await getRentFlowCarSeoCars({
    host: options?.host,
    marketplace: !options?.host,
    limit: 200,
  });

  return cars.find((car) => car.id === carId) || null;
}

export async function getRentFlowCarSeoTenants() {
  try {
    const url = new URL("/tenants", getRentFlowCarApiBaseUrl());
    url.searchParams.set("marketplace", "true");

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as ApiResponse<{
      items: TenantProfile[];
      total: number;
    }>;

    return (payload.data?.items || []).map(normalizeTenantProfile);
  } catch {
    return [];
  }
}

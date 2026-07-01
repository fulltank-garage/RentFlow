import type { MetadataRoute } from "next";

import {
  getRentFlowCarPublicRootDomain,
  getRentFlowCarSitemapBaseUrl,
} from "@/src/lib/seo";
import {
  getRentFlowCarSeoCars,
  getRentFlowCarSeoTenants,
} from "@/src/lib/seo-data";

const staticRoutes = [
  "",
  "/cars",
  "/shops",
  "/features",
  "/reviews",
  "/contact",
  "/help",
  "/privacy",
  "/terms",
];

const classRoutes = [
  "/classes/economy",
  "/classes/sedan",
  "/classes/suv",
  "/classes/van",
];

function getTenantSitemapUrl(tenant: {
  domainSlug: string;
  publicDomain?: string;
}, rootDomain: string) {
  if (tenant.publicDomain) {
    try {
      return new URL(tenant.publicDomain.includes("://")
        ? tenant.publicDomain
        : `https://${tenant.publicDomain}`).toString();
    } catch {
      // Fall through to the RentFlowCar subdomain.
    }
  }

  return `https://${tenant.domainSlug}.${rootDomain}/`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getRentFlowCarSitemapBaseUrl();
  const rootDomain = getRentFlowCarPublicRootDomain();
  const now = new Date();
  const [cars, tenants] = await Promise.all([
    getRentFlowCarSeoCars({ marketplace: true, limit: 200 }),
    getRentFlowCarSeoTenants(),
  ]);

  const staticEntries = [...staticRoutes, ...classRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  const carEntries = cars.map((car) => ({
    url: `${baseUrl}/cars/${encodeURIComponent(car.id)}`,
    lastModified: car.updatedAt ? new Date(car.updatedAt) : now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const tenantEntries = tenants
    .filter((tenant) => tenant.domainSlug)
    .map((tenant) => ({
      url: getTenantSitemapUrl(tenant, rootDomain),
      lastModified: tenant.updatedAt ? new Date(tenant.updatedAt) : now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

  return [...staticEntries, ...carEntries, ...tenantEntries];
}

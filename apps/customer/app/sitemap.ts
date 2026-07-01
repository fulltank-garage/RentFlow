import type { MetadataRoute } from "next";

import { getRentFlowCarSitemapBaseUrl } from "@/src/lib/seo";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getRentFlowCarSitemapBaseUrl();
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}

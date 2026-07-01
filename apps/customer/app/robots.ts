import type { MetadataRoute } from "next";

import { getRentFlowCarSitemapBaseUrl } from "@/src/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getRentFlowCarSitemapBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/payment", "/profile", "/my-bookings"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

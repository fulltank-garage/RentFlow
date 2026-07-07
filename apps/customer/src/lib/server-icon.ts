import "server-only";

import { readFile } from "fs/promises";
import path from "path";

import { getInitialRentFlowCarTenantProfile } from "@/src/lib/server-tenant";
import { getRentFlowCarTenantHeaders } from "@/src/lib/tenant";
import { getRentFlowCarApiBaseUrl, resolveRentFlowCarAssetUrl } from "@/src/lib/runtime-api-url";
import type { ApiResponse } from "@/src/services/types/types";
import type { TenantProfile } from "@/src/services/tenant/tenant.types";

function headerValue(headers: Headers, name: string) {
  return headers.get(name)?.trim() || "";
}

function requestOrigin(headers: Headers) {
  const host = headerValue(headers, "x-forwarded-host") || headerValue(headers, "host");
  const proto = headerValue(headers, "x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

async function fallbackIconResponse() {
  const file = await readFile(path.join(process.cwd(), "public", "RentFlowCarIcon.png"));
  return new Response(file, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

async function getTenantProfileBySlug(tenantSlug: string) {
  const slug = tenantSlug.trim().toLowerCase();
  if (!slug) return null;

  try {
    const response = await fetch(`${getRentFlowCarApiBaseUrl()}/tenants/resolve`, {
      cache: "no-store",
      headers: getRentFlowCarTenantHeaders({ tenantSlug: slug }),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as ApiResponse<TenantProfile | null>;
    const tenant = payload.data;
    if (!tenant) return null;

    return {
      ...tenant,
      logoUrl: resolveRentFlowCarAssetUrl(tenant.logoUrl),
    };
  } catch {
    return null;
  }
}

export async function rentFlowTenantIconResponse(request: Request) {
  const requestHeaders = request.headers;
  const host = headerValue(requestHeaders, "x-forwarded-host") || headerValue(requestHeaders, "host");
  const requestUrl = new URL(request.url);
  const tenantSlug = requestUrl.searchParams.get("tenant") || "";
  const tenant =
    (await getTenantProfileBySlug(tenantSlug)) ||
    (await getInitialRentFlowCarTenantProfile(host));
  const logoUrl = tenant?.logoUrl?.trim();

  if (!logoUrl) {
    return fallbackIconResponse();
  }

  try {
    const sourceUrl = new URL(logoUrl, requestOrigin(requestHeaders));
    const upstream = await fetch(sourceUrl, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) {
      return fallbackIconResponse();
    }

    const contentType =
      upstream.headers.get("content-type") || "image/png";
    return new Response(upstream.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return fallbackIconResponse();
  }
}

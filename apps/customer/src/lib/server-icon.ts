import "server-only";

import { readFile } from "fs/promises";
import path from "path";

import { getInitialRentFlowTenantProfile } from "@/src/lib/server-tenant";

function headerValue(headers: Headers, name: string) {
  return headers.get(name)?.trim() || "";
}

function requestOrigin(headers: Headers) {
  const host = headerValue(headers, "x-forwarded-host") || headerValue(headers, "host");
  const proto = headerValue(headers, "x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

async function fallbackIconResponse() {
  const file = await readFile(path.join(process.cwd(), "public", "RentFlowIcon.png"));
  return new Response(file, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
}

export async function rentFlowTenantIconResponse(request: Request) {
  const requestHeaders = request.headers;
  const host = headerValue(requestHeaders, "x-forwarded-host") || headerValue(requestHeaders, "host");
  const tenant = await getInitialRentFlowTenantProfile(host);
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
        "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return fallbackIconResponse();
  }
}

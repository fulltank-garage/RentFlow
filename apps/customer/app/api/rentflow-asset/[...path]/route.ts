import { NextRequest, NextResponse } from "next/server";

import { getRentFlowCarApiBaseUrl } from "@/src/lib/runtime-api-url";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function buildAssetUrl(path: string[], requestUrl: string) {
  const url = new URL(requestUrl);
  const assetPath = path.map((part) => encodeURIComponent(part)).join("/");
  const targetUrl = new URL(`/${assetPath}`, getRentFlowCarApiBaseUrl());
  targetUrl.search = url.search;
  return targetUrl;
}

async function proxyRentFlowCarAsset(
  request: NextRequest,
  context: RouteContext,
  method: "GET" | "HEAD"
) {
  const { path = [] } = await context.params;

  if (!path.length) {
    return NextResponse.json(
      { success: false, message: "ไม่พบไฟล์รูปภาพ" },
      { status: 404 }
    );
  }

  const targetUrl = buildAssetUrl(path, request.url);
  const headers = new Headers({
    Accept: request.headers.get("accept") || "*/*",
  });
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch) {
    headers.set("If-None-Match", ifNoneMatch);
  }

  const upstream = await fetch(targetUrl, {
    cache: "no-store",
    headers,
    method: method === "HEAD" ? "GET" : "GET",
  });

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  const cacheControl = upstream.headers.get("cache-control");
  const etag = upstream.headers.get("etag");
  const contentLength = upstream.headers.get("content-length");

  if (contentType) responseHeaders.set("content-type", contentType);
  responseHeaders.set(
    "cache-control",
    cacheControl || "public, max-age=31536000, immutable"
  );
  if (etag) responseHeaders.set("etag", etag);
  if (contentLength) responseHeaders.set("content-length", contentLength);
  responseHeaders.set("x-content-type-options", "nosniff");

  if (upstream.status === 304) {
    return new NextResponse(null, { status: 304, headers: responseHeaders });
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { success: false, message: "ไม่พบไฟล์รูปภาพ" },
      { status: upstream.status }
    );
  }

  if (method === "HEAD") {
    return new NextResponse(null, { status: 200, headers: responseHeaders });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRentFlowCarAsset(request, context, "GET");
}

export async function HEAD(request: NextRequest, context: RouteContext) {
  return proxyRentFlowCarAsset(request, context, "HEAD");
}

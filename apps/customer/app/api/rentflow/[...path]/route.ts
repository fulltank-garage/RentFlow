import { NextRequest, NextResponse } from "next/server";
import { getRentFlowCarApiBaseUrl } from "@/src/lib/runtime-api-url";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function stripCookieDomain(cookie: string) {
  return cookie
    .split(";")
    .filter((part) => !part.trim().toLowerCase().startsWith("domain="))
    .join(";");
}

function appendSetCookie(response: NextResponse, upstream: Response) {
  const headersWithCookies = upstream.headers as Headers & {
    getSetCookie?: () => string[];
  };
  const cookies =
    headersWithCookies.getSetCookie?.() ??
    upstream.headers
      .get("set-cookie")
      ?.split(/,(?=\s*[^;,]+=)/)
      .map((cookie) => cookie.trim())
      .filter(Boolean) ??
    [];

  cookies.forEach((cookie) => {
    response.headers.append("set-cookie", stripCookieDomain(cookie));
  });
}

async function proxyRentFlowCarApi(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const apiBaseUrl = getRentFlowCarApiBaseUrl();
  const targetUrl = new URL(path.join("/"), `${apiBaseUrl}/`);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  HOP_BY_HOP_HEADERS.forEach((header) => headers.delete(header));

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
    cache: "no-store",
  });
  const responseBody = await upstream.arrayBuffer();

  const responseHeaders = new Headers(upstream.headers);
  HOP_BY_HOP_HEADERS.forEach((header) => responseHeaders.delete(header));
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("set-cookie");

  const response = new NextResponse(responseBody, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });

  appendSetCookie(response, upstream);
  return response;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRentFlowCarApi(request, context);
}

export async function HEAD(request: NextRequest, context: RouteContext) {
  return proxyRentFlowCarApi(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRentFlowCarApi(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRentFlowCarApi(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRentFlowCarApi(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRentFlowCarApi(request, context);
}

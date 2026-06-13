import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "rentflow_admin_session";

function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(
    /\/$/,
    ""
  );
}

function readUpstreamSession(setCookieHeaders: string[]) {
  for (const value of setCookieHeaders) {
    const match = value.match(/(?:^|,\s*)rentflow_admin_session=([^;,\s]+)/);
    if (match?.[1]) return decodeURIComponent(match[1]);
  }
  return "";
}

async function proxyAdminRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const upstreamUrl = new URL(`/${path.join("/")}`, apiBaseUrl());
  request.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.set(key, value);
  });

  const headers = new Headers();
  headers.set("X-RentFlow-App", "admin");

  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Cookie", `${SESSION_COOKIE}=${encodeURIComponent(token)}`);
  }

  const method = request.method.toUpperCase();
  const response = await fetch(upstreamUrl, {
    method,
    headers,
    body:
      method === "GET" || method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const responseContentType = response.headers.get("content-type");
  if (responseContentType) {
    responseHeaders.set("Content-Type", responseContentType);
  }

  const proxied = new NextResponse(await response.arrayBuffer(), {
    status: response.status,
    headers: responseHeaders,
  });

  const setCookies = response.headers.getSetCookie?.() || [];
  const sessionToken = readUpstreamSession(setCookies);
  if (sessionToken) {
    proxied.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  if (path.join("/") === "auth/logout") {
    proxied.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
  }

  return proxied;
}

export const GET = proxyAdminRequest;
export const POST = proxyAdminRequest;
export const PUT = proxyAdminRequest;
export const PATCH = proxyAdminRequest;
export const DELETE = proxyAdminRequest;

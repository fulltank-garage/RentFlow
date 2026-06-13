import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_RENTFLOW_ROOT_DOMAIN || "rentflowcar.xyz";

export function proxy(request: NextRequest) {
  const host = request.nextUrl.hostname.toLowerCase().replace(/\.$/, "");
  const wwwHost = `www.${ROOT_DOMAIN}`;

  if (host === wwwHost) {
    const url = request.nextUrl.clone();
    url.hostname = ROOT_DOMAIN;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

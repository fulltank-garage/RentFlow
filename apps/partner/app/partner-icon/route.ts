import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import {
  PARTNER_DEFAULT_BROWSER_ICON,
  PARTNER_STORE_KEY,
  getPartnerBrowserIcon,
  parsePartnerStoreProfileCookie,
} from "@/src/lib/partner-browser-identity";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FALLBACK_CONTENT_TYPE = "image/png";

async function fallbackIconResponse() {
  const file = await readFile(
    path.join(process.cwd(), "public", "RentFlowCarIcon.png")
  );

  return new NextResponse(file, {
    headers: {
      "Content-Type": FALLBACK_CONTENT_TYPE,
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
}

export async function GET(request: NextRequest) {
  const profile = parsePartnerStoreProfileCookie(
    request.cookies.get(PARTNER_STORE_KEY)?.value
  );
  const iconUrl = getPartnerBrowserIcon(profile);

  if (!iconUrl || iconUrl === PARTNER_DEFAULT_BROWSER_ICON) {
    return fallbackIconResponse();
  }

  try {
    const sourceUrl = new URL(iconUrl, request.nextUrl.origin);
    const response = await fetch(sourceUrl, { cache: "no-store" });

    if (!response.ok || !response.body) {
      return fallbackIconResponse();
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || FALLBACK_CONTENT_TYPE,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return fallbackIconResponse();
  }
}

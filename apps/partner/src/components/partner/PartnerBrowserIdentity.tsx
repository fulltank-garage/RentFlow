"use client";

import * as React from "react";
import {
  readStoreProfile,
  writeStoreProfile,
  type PartnerStoreProfile,
} from "@/src/lib/partner-store";
import {
  PARTNER_DEFAULT_BROWSER_ICON,
  getPartnerBrowserIcon,
  getPartnerBrowserIconVersion,
  getPartnerBrowserTitle,
} from "@/src/lib/partner-browser-identity";
import { tenantService } from "@/src/services/tenant/tenant.service";

function withCacheVersion(url: string, version?: string) {
  if (!version || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  try {
    const nextUrl = new URL(url, window.location.origin);
    nextUrl.searchParams.set("rf_icon_v", version);
    return nextUrl.toString();
  } catch {
    return url;
  }
}

function upsertIconLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"][data-rentflow-partner-icon="true"]`;
  let link = document.head.querySelector<HTMLLinkElement>(selector);

  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    link.dataset.rentflowPartnerIcon = "true";
    document.head.appendChild(link);
  }

  link.href = href;
}

function applyPartnerIdentity(profile: PartnerStoreProfile | null) {
  const title = getPartnerBrowserTitle(profile);
  const icon = withCacheVersion(
    getPartnerBrowserIcon(profile),
    getPartnerBrowserIconVersion(profile)
  );

  document.title = title;
  document
    .querySelectorAll<HTMLLinkElement>(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    )
    .forEach((link) => {
      if (
        link.href.includes(PARTNER_DEFAULT_BROWSER_ICON) ||
        link.href.includes("/partner-icon") ||
        link.dataset.rentflowPartnerIcon === "true"
      ) {
        link.href = icon;
      }
    });
  upsertIconLink("icon", icon);
  upsertIconLink("shortcut icon", icon);
  upsertIconLink("apple-touch-icon", icon);
}

export default function PartnerBrowserIdentity() {
  React.useEffect(() => {
    let cancelled = false;

    const syncFromCookie = () => {
      applyPartnerIdentity(readStoreProfile());
    };

    syncFromCookie();

    tenantService
      .getMyTenant()
      .then((tenant) => {
        if (cancelled) return;

        writeStoreProfile({
          tenantId: tenant.id,
          shopName: tenant.shopName,
          domainSlug: tenant.domainSlug,
          storefrontDomain: tenant.publicDomain,
          ownerEmail: tenant.ownerEmail,
          status: tenant.status,
          plan: tenant.plan,
          logoUrl: tenant.logoUrl || null,
          promoImageUrl: tenant.promoImageUrl || null,
          promoImageUrls: tenant.promoImageUrls || [],
          contactPhone: tenant.contactPhone || "",
          facebookPageUrl: tenant.facebookPageUrl || "",
          lineOaQrCodeUrl: tenant.lineOaQrCodeUrl || null,
          createdAt: tenant.createdAt,
          updatedAt: tenant.updatedAt,
        });
      })
      .catch(() => {
        if (!cancelled) {
          syncFromCookie();
        }
      });

    window.addEventListener("storage", syncFromCookie);
    window.addEventListener("rentflow-store-profile-updated", syncFromCookie);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", syncFromCookie);
      window.removeEventListener(
        "rentflow-store-profile-updated",
        syncFromCookie
      );
    };
  }, []);

  return null;
}

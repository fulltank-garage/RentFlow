import { PARTNER_STORE_KEY, type PartnerStoreProfile } from "./partner-store";

export const PARTNER_DEFAULT_BROWSER_TITLE = "RentFlow ศูนย์จัดการร้าน";
export const PARTNER_DEFAULT_BROWSER_ICON = "/RentFlowIcon.png";

export function parsePartnerStoreProfileCookie(value?: string | null) {
  if (!value) return null;

  try {
    return JSON.parse(value) as PartnerStoreProfile;
  } catch {
    return null;
  }
}

export function getPartnerBrowserTitle(profile: PartnerStoreProfile | null) {
  const shopName = profile?.shopName?.trim();
  return shopName ? `${shopName} ศูนย์จัดการร้าน` : PARTNER_DEFAULT_BROWSER_TITLE;
}

export function getPartnerBrowserIcon(profile: PartnerStoreProfile | null) {
  return profile?.logoUrl?.trim() || PARTNER_DEFAULT_BROWSER_ICON;
}

export function getPartnerBrowserIconVersion(profile: PartnerStoreProfile | null) {
  return profile?.updatedAt || profile?.tenantId || profile?.domainSlug || "";
}

export { PARTNER_STORE_KEY };

import { resolveRentFlowAssetUrl } from "@/src/lib/runtime-api-url";
import type { Review } from "./reviews.types";

export function normalizeReview(raw: Partial<Review> & { id: string }): Review {
  return {
    id: raw.id,
    firstName: raw.firstName || "",
    lastName: raw.lastName || "",
    rating: Number(raw.rating || 0),
    comment: raw.comment || "",
    createdAt: raw.createdAt || "",
    updatedAt: raw.updatedAt,
    tenantId: raw.tenantId,
    shopName: raw.shopName,
    domainSlug: raw.domainSlug,
    publicDomain: raw.publicDomain,
    logoUrl: resolveRentFlowAssetUrl(raw.logoUrl),
  };
}

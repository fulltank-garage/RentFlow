import type {
  Car,
  CarImageUploadItem,
  CarsApiResponse,
  RawCarImageUploadItem,
} from "./cars.types";
import { resolveRentFlowCarAssetUrl } from "@/src/lib/runtime-api-url";

export function normalizeCar(
  raw: Partial<Car> & { id: string; name: string }
): Car {
  const imageUrl = resolveRentFlowCarAssetUrl(raw.imageUrl || raw.image || "");
  const images = raw.images?.map(resolveRentFlowCarAssetUrl).filter(Boolean);
  const primaryImageUrl = imageUrl || images?.[0] || "";

  return {
    id: raw.id,
    name: raw.name,
    brand: raw.brand || "",
    model: raw.model || "",
    year: raw.year || 0,
    type: (raw.type || "Sedan") as Car["type"],
    seats: raw.seats || 0,
    transmission: (raw.transmission || "Auto") as Car["transmission"],
    fuel: (raw.fuel || "Gasoline") as Car["fuel"],
    pricePerDay: raw.pricePerDay || 0,
    image: primaryImageUrl || undefined,
    imageUrl: primaryImageUrl,
    grade: raw.grade,
    images: images?.length ? images : primaryImageUrl ? [primaryImageUrl] : undefined,
    description: raw.description,
    locationId: raw.locationId,
    status: raw.status,
    isAvailable: raw.isAvailable ?? true,
    unitCount: raw.unitCount,
    reservedUnits: raw.reservedUnits,
    availableUnits: raw.availableUnits,
    createdAt: raw.createdAt || "",
    updatedAt: raw.updatedAt || "",
    tenantId: raw.tenantId,
    shopName: raw.shopName,
    domainSlug: raw.domainSlug,
    publicDomain: raw.publicDomain,
    logoUrl: resolveRentFlowCarAssetUrl(raw.logoUrl),
    promoImageUrl: resolveRentFlowCarAssetUrl(raw.promoImageUrl),
    promoImageUrls: raw.promoImageUrls?.map(resolveRentFlowCarAssetUrl).filter(Boolean),
    bookingMode: raw.bookingMode,
    chatThresholdTHB: raw.chatThresholdTHB,
    lineOfficialAccount: raw.lineOfficialAccount,
  };
}

export function normalizeCarsResponse(raw: CarsApiResponse) {
  return {
    items: (raw.items ?? []).map(normalizeCar),
    total: raw.total ?? 0,
  };
}

export function normalizeUploadedCarImage(
  raw: RawCarImageUploadItem
): CarImageUploadItem {
  return {
    ...raw,
    imageUrl: resolveRentFlowCarAssetUrl(raw.imageUrl),
  };
}

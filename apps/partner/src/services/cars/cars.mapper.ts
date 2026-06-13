import { resolvePartnerAssetUrl } from "../core/api-client.service";
import type { PartnerCar } from "./cars.types";

export function resolveApiAssetUrl(value?: string) {
  return resolvePartnerAssetUrl(value);
}

export function normalizePartnerCar(car: PartnerCar): PartnerCar {
  const imageUrl = resolveApiAssetUrl(car.imageUrl || car.image);
  const images = car.images?.map(resolveApiAssetUrl).filter(Boolean);

  return {
    ...car,
    image: imageUrl,
    imageUrl,
    images: images?.length ? images : imageUrl ? [imageUrl] : [],
  };
}

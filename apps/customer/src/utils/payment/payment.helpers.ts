export type Method = "promptpay" | "card" | "transfer";

type AddonLike = {
  id: string;
  price: number;
  pricing: "perDay" | "perTrip";
};

export function safeParseAddonIds(raw: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((x) => typeof x === "string" && x.trim().length > 0);
  } catch {
    return [];
  }
}

export function calcAddonsTotal(
  addons: AddonLike[],
  addonIds: string[],
  days: number
) {
  let total = 0;
  const selectedIds = new Set(addonIds);

  for (const addon of addons) {
    if (!selectedIds.has(addon.id)) continue;

    total +=
      addon.pricing === "perDay"
        ? addon.price * Math.max(1, days)
        : addon.price;
  }

  return total;
}

export function getCarSubTotal(
  car: { pricePerDay: number } | undefined,
  days: number
) {
  if (!car || days <= 0) return 0;
  return car.pricePerDay * days;
}

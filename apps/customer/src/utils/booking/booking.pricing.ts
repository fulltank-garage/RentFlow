import type { StorefrontAddon } from "@/src/services/addons/addons.types";

export function calcAddonsTotal(
  addons: StorefrontAddon[],
  selectedAddonIds: string[],
  days: number
) {
  let total = 0;
  const selectedIds = new Set(selectedAddonIds);

  for (const addon of addons) {
    if (!selectedIds.has(addon.id)) continue;
    total += addon.pricing === "perDay" ? addon.price * Math.max(1, days) : addon.price;
  }

  return total;
}

export function getSelectedAddonTitles(
  addons: StorefrontAddon[],
  selectedAddonIds: string[]
) {
  const selectedIds = new Set(selectedAddonIds);
  return addons
    .filter((addon) => selectedIds.has(addon.id))
    .map((addon) => addon.name);
}

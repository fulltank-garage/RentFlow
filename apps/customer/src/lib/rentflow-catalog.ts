import type { Branch } from "@/src/services/branches/branches.types";
import type { Car, CarType } from "@/src/services/cars/cars.types";

export type LocationOption = {
  label: string;
  value: string;
};

export type CatalogCarClass = {
  slug: string;
  title: string;
  desc: string;
  tag: string;
  type: CarType;
  image: string;
  count: number;
};

const PRESENTATION_ORDER = ["Economy", "Sedan", "SUV", "Van"] as const;
const CAR_TYPE_LABEL_MAP: Record<string, string> = {
  economy: "ประหยัด",
  eco: "ประหยัด",
  budget: "ประหยัด",
  sedan: "ซีดาน",
  suv: "เอสยูวี",
  van: "รถตู้",
  mpv: "รถตู้",
};
const LOCATION_LABEL_MAP: Record<string, string> = {
  bangkok: "กรุงเทพฯ",
  pattaya: "พัทยา",
  phuket: "ภูเก็ต",
  chiangmai: "เชียงใหม่",
  "chiang-mai": "เชียงใหม่",
  khonkaen: "ขอนแก่น",
  "khon-kaen": "ขอนแก่น",
  korat: "นครราชสีมา",
  nakhonratchasima: "นครราชสีมา",
  "nakhon-ratchasima": "นครราชสีมา",
  udonthani: "อุดรธานี",
  "udon-thani": "อุดรธานี",
  suratthani: "สุราษฎร์ธานี",
  "surat-thani": "สุราษฎร์ธานี",
  huahin: "หัวหิน",
  "hua-hin": "หัวหิน",
};

const CAR_TYPE_SLUG_MAP: Record<CarType, string> = {
  Economy: "economy",
  Sedan: "sedan",
  SUV: "suv",
  Van: "van",
};

const CAR_TYPE_IMAGE_MAP: Record<CarType, string> = {
  Economy: "/car-types/economy.svg",
  Sedan: "/car-types/sedan.svg",
  SUV: "/car-types/suv.svg",
  Van: "/car-types/van.svg",
};

const CAR_TYPE_META: Record<
  CarType,
  Omit<CatalogCarClass, "count" | "image">
> = {
  Economy: {
    slug: CAR_TYPE_SLUG_MAP.Economy,
    title: "ประหยัด",
    desc: "รถคุ้มค่า ใช้งานง่าย เหมาะกับการเดินทางประจำวัน",
    tag: "ประหยัด",
    type: "Economy",
  },
  Sedan: {
    slug: CAR_TYPE_SLUG_MAP.Sedan,
    title: "ซีดาน",
    desc: "รถเก๋งนั่งสบาย เหมาะกับการเดินทางในเมืองและต่างจังหวัด",
    tag: "ซีดาน",
    type: "Sedan",
  },
  SUV: {
    slug: CAR_TYPE_SLUG_MAP.SUV,
    title: "เอสยูวี",
    desc: "พื้นที่กว้าง นั่งสบาย เหมาะกับครอบครัวหรือสัมภาระเยอะ",
    tag: "เอสยูวี",
    type: "SUV",
  },
  Van: {
    slug: CAR_TYPE_SLUG_MAP.Van,
    title: "รถตู้",
    desc: "รองรับผู้โดยสารหลายคน เหมาะกับทริปกลุ่มและการเดินทางเป็นทีม",
    tag: "รถตู้",
    type: "Van",
  },
};

export function getCarTypeLabel(type?: string | null) {
  const normalized = type?.trim().toLowerCase();

  if (!normalized) {
    return "-";
  }

  return CAR_TYPE_LABEL_MAP[normalized] || type || "-";
}

export function getCarTypeImage(type?: string | null) {
  const normalized = type?.trim().toLowerCase();

  if (!normalized) {
    return "/RentFlow.png";
  }

  const matchedType = PRESENTATION_ORDER.find(
    (item) => item.toLowerCase() === normalized
  );

  return matchedType ? CAR_TYPE_IMAGE_MAP[matchedType] : "/RentFlow.png";
}

export function buildCarTypes(cars: Car[]): Car["type"][] {
  const seen = new Set<Car["type"]>();

  for (const car of cars) {
    if (car.type) {
      seen.add(car.type);
    }
  }

  return [...seen].sort((a, b) => {
    const aIndex = PRESENTATION_ORDER.indexOf(a as (typeof PRESENTATION_ORDER)[number]);
    const bIndex = PRESENTATION_ORDER.indexOf(b as (typeof PRESENTATION_ORDER)[number]);

    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export function formatLocationLabel(value: string) {
  const normalized = value.trim().toLowerCase();

  if (LOCATION_LABEL_MAP[normalized]) {
    return LOCATION_LABEL_MAP[normalized];
  }

  return value
    .split("-")
    .filter(Boolean)
    .map((part) => LOCATION_LABEL_MAP[part.toLowerCase()] || (part.charAt(0).toUpperCase() + part.slice(1)))
    .join(" ");
}

export function buildLocationOptions(branches: Branch[]): LocationOption[] {
  const byValue = new Map<string, LocationOption>();
  const byBranchId = new Map<string, LocationOption>();

  branches
    .filter((branch) => branch.name || branch.locationId || branch.id)
    .forEach((branch) => {
      const branchId = branch.id?.trim();
      const locationId = branch.locationId?.trim();
      const branchName = branch.name?.trim() || "";
      const rawName = branch.rawName?.trim() || "";
      const looksGeneratedName =
        /^brn[_-]/i.test(branchName) || /^brn[_-]/i.test(rawName);
      const looksGeneratedLocation = /^brn[_-]/i.test(locationId || "");
      const label =
        branchName && !looksGeneratedName
          ? branchName
          : locationId && !looksGeneratedLocation
            ? formatLocationLabel(locationId)
            : branch.address?.trim()
              ? branch.address.trim()
            : "สาขาหลัก";
      const value = locationId || branchId || branchName || rawName;
      if (!value || byValue.has(value)) return;

      const option = { label, value };
      byValue.set(value, option);
      if (branchId) {
        byBranchId.set(branchId, option);
      }
    });

  for (const option of byBranchId.values()) {
    byValue.set(option.value, option);
  }

  return Array.from(byValue.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

export function buildCarClasses(cars: Car[]): CatalogCarClass[] {
  const byType = new Map<CarType, Car[]>();

  for (const car of cars) {
    if (!car.type) continue;

    const list = byType.get(car.type) ?? [];
    list.push(car);
    byType.set(car.type, list);
  }

  return PRESENTATION_ORDER
    .filter((type) => (byType.get(type) ?? []).length > 0)
    .map((type) => {
      const items = byType.get(type) ?? [];

      return {
        ...CAR_TYPE_META[type],
        image: CAR_TYPE_IMAGE_MAP[type],
        count: items.length,
      };
    });
}

export function getCarClassBySlug(cars: Car[], slug: string) {
  const classes = buildCarClasses(cars);
  const meta = classes.find((item) => item.slug === slug) ?? null;

  return {
    meta,
    cars: meta ? cars.filter((car) => car.type === meta.type) : [],
  };
}

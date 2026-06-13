import api from "@/src/lib/axios";
import { getRentFlowTenantHeaders } from "@/src/lib/tenant";
import type { ApiResponse, RentFlowRequestOptions } from "../types/types";
import type {
  StorefrontAddon,
  StorefrontAddonListResponse,
} from "./addons.types";

function normalizeAddonUnit(unit?: string): "perDay" | "perTrip" {
  switch ((unit || "").trim().toLowerCase()) {
    case "day":
    case "daily":
    case "per_day":
    case "perday":
      return "perDay";
    default:
      return "perTrip";
  }
}

function normalizeAddon(addon: StorefrontAddon): StorefrontAddon {
  return {
    ...addon,
    pricing: normalizeAddonUnit(addon.unit),
  };
}

export const addonsApi = {
  async getAddons(options?: RentFlowRequestOptions) {
    const res = await api.get<ApiResponse<StorefrontAddonListResponse>>("/addons", {
      headers:
        options?.tenantSlug !== undefined
          ? getRentFlowTenantHeaders({ tenantSlug: options.tenantSlug })
          : undefined,
    });

    const data = res.data.data;
    return {
      ...res.data,
      data: {
        items: (data?.items ?? []).map(normalizeAddon),
        total: data?.total ?? 0,
      },
    };
  },
};

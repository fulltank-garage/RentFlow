import api from "@/src/lib/axios";
import type { ApiResponse } from "../types/types";
import type { StorefrontPage } from "./storefront.types";

export const storefrontApi = {
  async getHomePage(options?: { marketplace?: boolean; tenantSlug?: string }) {
    const res = await api.get<ApiResponse<StorefrontPage>>("/storefront/page", {
      params: {
        page: "home",
        marketplace: options?.marketplace ? "true" : undefined,
        tenant: options?.tenantSlug,
      },
      headers: options?.marketplace
        ? { "X-RentFlow-Marketplace": "true" }
        : undefined,
    });
    return res.data.data;
  },
};

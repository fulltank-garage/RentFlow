import api from "@/src/lib/axios";
import { getRentFlowTenantHeaders } from "@/src/lib/tenant";
import type { ApiResponse } from "../types/types";
import type { RentFlowRequestOptions } from "../types/types";
import type {
  AvailabilityResult,
  CheckAvailabilityPayload,
} from "./availability.types";

export const availabilityApi = {
  async check(
    payload: CheckAvailabilityPayload,
    options?: RentFlowRequestOptions
  ) {
    const res = await api.post<ApiResponse<AvailabilityResult>>(
      "/availability/check",
      payload,
      {
        headers:
          options?.tenantSlug !== undefined
            ? getRentFlowTenantHeaders({ tenantSlug: options.tenantSlug })
            : undefined,
      }
    );
    return res.data;
  },

  async getUnavailableDates(carId: string, options?: RentFlowRequestOptions) {
    const res = await api.get<ApiResponse<string[]>>(
      `/availability/${carId}/unavailable-dates`,
      {
        headers:
          options?.tenantSlug !== undefined
            ? getRentFlowTenantHeaders({ tenantSlug: options.tenantSlug })
            : undefined,
      }
    );
    return res.data;
  },
};

import api from "@/src/lib/axios";
import { getRentFlowCarTenantHeaders } from "@/src/lib/tenant";
import type { ApiResponse } from "../types/types";
import type { RentFlowCarRequestOptions } from "../types/types";
import type {
  AvailabilityResult,
  CheckAvailabilityPayload,
} from "./availability.types";

export const availabilityApi = {
  async check(
    payload: CheckAvailabilityPayload,
    options?: RentFlowCarRequestOptions
  ) {
    const res = await api.post<ApiResponse<AvailabilityResult>>(
      "/availability/check",
      payload,
      {
        headers:
          options?.tenantSlug !== undefined
            ? getRentFlowCarTenantHeaders({ tenantSlug: options.tenantSlug })
            : undefined,
      }
    );
    return res.data;
  },

  async getUnavailableDates(carId: string, options?: RentFlowCarRequestOptions) {
    const res = await api.get<ApiResponse<string[]>>(
      `/availability/${carId}/unavailable-dates`,
      {
        headers:
          options?.tenantSlug !== undefined
            ? getRentFlowCarTenantHeaders({ tenantSlug: options.tenantSlug })
            : undefined,
      }
    );
    return res.data;
  },
};

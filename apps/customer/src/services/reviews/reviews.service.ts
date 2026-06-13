import api from "@/src/lib/axios";
import { getRentFlowTenantHeaders } from "@/src/lib/tenant";
import type { ApiResponse } from "../types/types";
import type { RentFlowRequestOptions } from "../types/types";
import { normalizeReview } from "./reviews.mapper";
import type {
  CreateReviewPayload,
  Review,
  ReviewListResponse,
} from "./reviews.types";

export const reviewsApi = {
  async getReviews(options?: RentFlowRequestOptions) {
    const res = await api.get<ApiResponse<ReviewListResponse>>("/reviews", {
      params: {
        marketplace: options?.marketplace ? "true" : undefined,
      },
      headers:
        options?.tenantSlug !== undefined
          ? getRentFlowTenantHeaders({ tenantSlug: options.tenantSlug })
          : undefined,
    });

    return {
      ...res.data,
      data: {
        items: (res.data.data?.items ?? []).map(normalizeReview),
        total: res.data.data?.total ?? 0,
      },
    };
  },

  async createReview(
    payload: CreateReviewPayload,
    options?: RentFlowRequestOptions
  ) {
    const res = await api.post<ApiResponse<Review>>("/reviews", payload, {
      headers:
        options?.tenantSlug !== undefined
          ? getRentFlowTenantHeaders({ tenantSlug: options.tenantSlug })
          : undefined,
    });

    return {
      ...res.data,
      data: normalizeReview(res.data.data),
    };
  },
};

import api from "@/src/lib/axios";
import { resolveRentFlowCarAssetUrl } from "@/src/lib/runtime-api-url";
import { getRentFlowCarTenantHeaders } from "@/src/lib/tenant";
import type { ApiResponse } from "../types/types";
import type { RentFlowCarRequestOptions } from "../types/types";
import type { Branch } from "./branches.types";

function normalizeBranch(branch: Branch): Branch {
  return {
    ...branch,
    logoUrl: resolveRentFlowCarAssetUrl(branch.logoUrl),
    promoImageUrl: resolveRentFlowCarAssetUrl(branch.promoImageUrl),
  };
}

export const branchesApi = {
  async getBranches(options?: RentFlowCarRequestOptions) {
    const res = await api.get<ApiResponse<Branch[]>>("/branches", {
      params: {
        marketplace: options?.marketplace ? "true" : undefined,
      },
      headers:
        options?.tenantSlug !== undefined
          ? getRentFlowCarTenantHeaders({ tenantSlug: options.tenantSlug })
          : undefined,
    });
    return {
      ...res.data,
      data: (res.data.data ?? []).map(normalizeBranch),
    };
  },

  async getBranchById(branchId: string, options?: RentFlowCarRequestOptions) {
    const res = await api.get<ApiResponse<Branch>>(`/branches/${branchId}`, {
      headers:
        options?.tenantSlug !== undefined
          ? getRentFlowCarTenantHeaders({ tenantSlug: options.tenantSlug })
          : undefined,
    });
    return {
      ...res.data,
      data: normalizeBranch(res.data.data),
    };
  },
};

import api from "@/src/lib/axios";
import { resolveRentFlowAssetUrl } from "@/src/lib/runtime-api-url";
import { getRentFlowTenantHeaders } from "@/src/lib/tenant";
import type { ApiResponse } from "../types/types";
import type { RentFlowRequestOptions } from "../types/types";
import type { Branch } from "./branches.types";

function normalizeBranch(branch: Branch): Branch {
  return {
    ...branch,
    logoUrl: resolveRentFlowAssetUrl(branch.logoUrl),
    promoImageUrl: resolveRentFlowAssetUrl(branch.promoImageUrl),
  };
}

export const branchesApi = {
  async getBranches(options?: RentFlowRequestOptions) {
    const res = await api.get<ApiResponse<Branch[]>>("/branches", {
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
      data: (res.data.data ?? []).map(normalizeBranch),
    };
  },

  async getBranchById(branchId: string, options?: RentFlowRequestOptions) {
    const res = await api.get<ApiResponse<Branch>>(`/branches/${branchId}`, {
      headers:
        options?.tenantSlug !== undefined
          ? getRentFlowTenantHeaders({ tenantSlug: options.tenantSlug })
          : undefined,
    });
    return {
      ...res.data,
      data: normalizeBranch(res.data.data),
    };
  },
};

import api from "@/src/lib/axios";
import { getRentFlowSiteMode } from "@/src/lib/tenant";

import type { StorefrontAssistantResult } from "./ai.types";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const aiService = {
  async askStorefrontAssistant(query: string) {
    const siteMode = getRentFlowSiteMode();
    const response = await api.post<ApiEnvelope<StorefrontAssistantResult>>(
      "/ai/storefront-assistant",
      { query },
      {
        timeout: 60000,
        headers:
          siteMode === "marketplace"
            ? { "X-RentFlow-Marketplace": "true" }
            : undefined,
      }
    );

    return response.data.data;
  },
};

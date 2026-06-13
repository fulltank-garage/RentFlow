import api from "@/src/lib/axios";
import { resolveRentFlowAssetUrl } from "@/src/lib/runtime-api-url";
import type { ApiResponse } from "@/src/services/types/types";

import type { PlatformPublicSettings } from "./platform.types";

function normalizePlatformSettings(
  settings: PlatformPublicSettings
): PlatformPublicSettings {
  return {
    ...settings,
    promoImageUrl: resolveRentFlowAssetUrl(settings.promoImageUrl),
  };
}

export const platformApi = {
  async getPublicSettings() {
    const res = await api.get<ApiResponse<PlatformPublicSettings>>(
      "/platform/settings/public"
    );
    return normalizePlatformSettings(res.data.data);
  },
};

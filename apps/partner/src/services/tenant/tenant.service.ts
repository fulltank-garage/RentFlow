import {
  RentFlowCarApiError,
  requestPartner,
  resolvePartnerAssetUrl,
} from "../core/api-client.service";
import type { PartnerTenant } from "./tenant.types";

type SaveMyTenantInput = {
  shopName: string;
  domainSlug: string;
  logoUrl?: string | null;
  promoImageUrl?: string | null;
  promoImageUrls?: string[] | null;
  contactPhone?: string;
  facebookPageUrl?: string;
  lineOaQrCodeUrl?: string | null;
  logoFile?: File | null;
  promoImageFile?: File | null;
  promoImageFiles?: File[];
  lineOaQrCodeFile?: File | null;
  promptPayId?: string;
  promptPayType?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  clearPromoImages?: boolean;
};

type GetMyTenantOptions = {
  force?: boolean;
};

const tenantCache = {
  item: null as PartnerTenant | null,
  expiresAt: 0,
  inFlight: null as Promise<PartnerTenant> | null,
};

const TENANT_CACHE_TTL_MS = 60_000;

function normalizeTenant(tenant: PartnerTenant): PartnerTenant {
  const promoImageUrls = (tenant.promoImageUrls || [])
    .map((url) => resolvePartnerAssetUrl(url))
    .filter(Boolean) as string[];
  const promoImageUrl = resolvePartnerAssetUrl(tenant.promoImageUrl) || promoImageUrls[0];

  return {
    ...tenant,
    logoUrl: resolvePartnerAssetUrl(tenant.logoUrl),
    promoImageUrl,
    promoImageUrls,
    lineOaQrCodeUrl: resolvePartnerAssetUrl(tenant.lineOaQrCodeUrl),
  };
}

function cacheTenant(tenant: PartnerTenant) {
  tenantCache.item = tenant;
  tenantCache.expiresAt = Date.now() + TENANT_CACHE_TTL_MS;
  return tenant;
}

function clearTenantCache() {
  tenantCache.item = null;
  tenantCache.expiresAt = 0;
  tenantCache.inFlight = null;
}

async function saveTenantAsJson(input: SaveMyTenantInput) {
  const tenant = await requestPartner<PartnerTenant>("/tenants/me", {
    method: "POST",
    body: JSON.stringify({
      shopName: input.shopName,
      domainSlug: input.domainSlug,
      contactPhone: input.contactPhone ?? "",
      promptPayId: input.promptPayId ?? "",
      promptPayType: input.promptPayType ?? "",
      bankName: input.bankName ?? "",
      bankAccountName: input.bankAccountName ?? "",
      bankAccountNumber: input.bankAccountNumber ?? "",
      facebookPageUrl: input.facebookPageUrl ?? "",
      ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl } : {}),
      ...(input.promoImageUrl !== undefined
        ? { promoImageUrl: input.promoImageUrl }
        : {}),
      ...(input.promoImageUrls !== undefined
        ? { promoImageUrls: input.promoImageUrls }
        : {}),
      ...(input.lineOaQrCodeUrl !== undefined
        ? { lineOaQrCodeUrl: input.lineOaQrCodeUrl }
        : {}),
      ...(input.clearPromoImages !== undefined
        ? { clearPromoImages: input.clearPromoImages }
        : {}),
    }),
  });
  return cacheTenant(normalizeTenant(tenant));
}

export const tenantService = {
  async getMyTenant(options?: GetMyTenantOptions) {
    if (!options?.force && tenantCache.item && Date.now() < tenantCache.expiresAt) {
      return tenantCache.item;
    }

    if (!options?.force && tenantCache.inFlight) {
      return tenantCache.inFlight;
    }

    const request = requestPartner<PartnerTenant>("/tenants/me")
      .then((tenant) => cacheTenant(normalizeTenant(tenant)))
      .finally(() => {
        tenantCache.inFlight = null;
      });

    tenantCache.inFlight = request;
    return request;
  },

  async saveMyTenant(input: SaveMyTenantInput) {
    clearTenantCache();
    const hasMediaChange =
      input.logoFile ||
      input.promoImageFile ||
      input.lineOaQrCodeFile ||
      (input.promoImageFiles && input.promoImageFiles.length > 0) ||
      input.logoUrl !== undefined ||
      input.promoImageUrl !== undefined ||
      input.promoImageUrls !== undefined ||
      input.lineOaQrCodeUrl !== undefined ||
      input.clearPromoImages;

    if (hasMediaChange) {
      const formData = new FormData();
      formData.append("shopName", input.shopName);
      formData.append("domainSlug", input.domainSlug);
      formData.append("contactPhone", input.contactPhone ?? "");
      formData.append("promptPayId", input.promptPayId ?? "");
      formData.append("promptPayType", input.promptPayType ?? "");
      formData.append("bankName", input.bankName ?? "");
      formData.append("bankAccountName", input.bankAccountName ?? "");
      formData.append("bankAccountNumber", input.bankAccountNumber ?? "");
      formData.append("facebookPageUrl", input.facebookPageUrl ?? "");

      if (input.logoFile) {
        formData.append("logo", input.logoFile);
      } else if (input.logoUrl !== undefined) {
        formData.append("logoUrl", input.logoUrl ?? "");
      }

      if (input.promoImageFile) {
        formData.append("promoImage", input.promoImageFile);
      }
      if (input.promoImageFiles?.length) {
        input.promoImageFiles.forEach((file) => {
          formData.append("promoImages", file);
        });
      }
      if (input.promoImageUrls?.length) {
        input.promoImageUrls.forEach((url) => {
          formData.append("promoImageUrls", url);
        });
      } else if (input.promoImageUrl !== undefined) {
        formData.append("promoImageUrl", input.promoImageUrl ?? "");
      }
      if (input.clearPromoImages) {
        formData.append("clearPromoImages", "true");
      }

      if (input.lineOaQrCodeFile) {
        formData.append("lineOaQrCode", input.lineOaQrCodeFile);
      } else if (input.lineOaQrCodeUrl !== undefined) {
        formData.append("lineOaQrCodeUrl", input.lineOaQrCodeUrl ?? "");
      }

      try {
        const tenant = await requestPartner<PartnerTenant>("/tenants/me", {
          method: "POST",
          body: formData,
        });
        return cacheTenant(normalizeTenant(tenant));
      } catch (error) {
        const canRetryAsJson =
          error instanceof RentFlowCarApiError &&
          error.status === 400 &&
          error.message.includes("ข้อมูลร้านไม่ถูกต้อง") &&
          (input.logoUrl !== undefined ||
            input.promoImageUrl !== undefined ||
            input.promoImageUrls !== undefined ||
            input.lineOaQrCodeUrl !== undefined);

        if (canRetryAsJson) {
          return saveTenantAsJson(input);
        }

        throw error;
      }
    }

    return saveTenantAsJson(input);
  },
};

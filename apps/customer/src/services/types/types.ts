export type { ApiResponse } from "@/src/shared/types/api";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
};

export type TenantSummary = {
  tenantId?: string;
  shopName?: string;
  domainSlug?: string;
  publicDomain?: string;
  facebookPageUrl?: string;
  contactPhone?: string;
  logoUrl?: string;
  promoImageUrl?: string;
  promoImageUrls?: string[];
  bookingMode?: "payment" | "chat" | string;
  chatThresholdTHB?: number;
};

export type RentFlowCarRequestOptions = {
  tenantSlug?: string;
  marketplace?: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

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
  logoUrl?: string;
  promoImageUrl?: string;
  promoImageUrls?: string[];
  bookingMode?: "payment" | "chat" | string;
  chatThresholdTHB?: number;
};

export type LineOfficialAccountSummary = {
  displayName?: string;
  basicId?: string;
  pictureUrl?: string;
  chatUrl?: string;
  shareUrl?: string;
  isConnected?: boolean;
};

export type RentFlowRequestOptions = {
  tenantSlug?: string;
  marketplace?: boolean;
};

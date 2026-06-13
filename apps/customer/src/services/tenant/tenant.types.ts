export type TenantProfile = {
  id: string;
  shopName: string;
  domainSlug: string;
  publicDomain: string;
  logoUrl?: string;
  promoImageUrl?: string;
  promoImageUrls?: string[];
  contactPhone?: string;
  facebookPageUrl?: string;
  lineOaQrCodeUrl?: string;
  status?: string;
  bookingMode?: "payment" | "chat" | string;
  chatThresholdTHB?: number;
  plan?: string;
  createdAt?: string;
  updatedAt?: string;
};

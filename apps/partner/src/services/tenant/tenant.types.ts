export type PartnerTenant = {
  id: string;
  ownerEmail?: string;
  shopName: string;
  domainSlug: string;
  publicDomain: string;
  logoUrl?: string;
  promoImageUrl?: string;
  promoImageUrls?: string[];
  contactPhone?: string;
  facebookPageUrl?: string;
  lineOaQrCodeUrl?: string;
  status: string;
  plan: string;
  createdAt?: string;
  updatedAt?: string;
};

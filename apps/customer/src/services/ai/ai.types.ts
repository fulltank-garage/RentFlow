export type StorefrontAssistantCriteria = {
  rawQuery: string;
  carType?: string;
  minSeats?: number;
  budgetPerDay?: number;
  prioritizeBudget?: boolean;
  prioritizeComfort?: boolean;
};

export type StorefrontAssistantRecommendation = {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: string;
  seats: number;
  transmission: string;
  fuel: string;
  pricePerDay: number;
  image?: string;
  shopName?: string;
  domainSlug?: string;
  publicDomain?: string;
  reasons: string[];
};

export type StorefrontAssistantResult = {
  provider: string;
  mode: "marketplace" | "storefront";
  summary: string;
  criteria: StorefrontAssistantCriteria;
  quickHints: string[];
  recommendedCars: StorefrontAssistantRecommendation[];
  generatedAt: string;
};

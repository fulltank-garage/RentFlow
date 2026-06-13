export type StorefrontAddon = {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit: string;
  pricing: "perDay" | "perTrip";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type StorefrontAddonListResponse = {
  items: StorefrontAddon[];
  total: number;
};

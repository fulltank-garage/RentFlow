// src/services/branches/branches.types.ts
import type { TenantSummary } from "../types/types";

export type Branch = TenantSummary & {
  id: string;
  name: string;
  rawName?: string;
  address: string;
  phone?: string;
  locationId?: string;
  lat?: number;
  lng?: number;
  openTime?: string;
  closeTime?: string;
  isActive: boolean;
};

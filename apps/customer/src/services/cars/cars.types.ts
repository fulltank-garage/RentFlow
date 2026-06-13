import type {
  LineOfficialAccountSummary,
  TenantSummary,
} from "../types/types";

export type CarType = "Economy" | "Sedan" | "SUV" | "Van";
export type Transmission = "Auto" | "Manual";
export type Fuel = "Gasoline" | "Hybrid" | "EV";
export type Grade = 1 | 2 | 3 | 4;

export type Car = TenantSummary & {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: CarType;
  seats: number;
  transmission: Transmission;
  fuel: Fuel;
  pricePerDay: number;
  image?: string;
  imageUrl: string;
  grade?: Grade;
  images?: string[];
  description?: string;
  locationId?: string;
  status?: string;
  isAvailable: boolean;
  unitCount?: number;
  reservedUnits?: number;
  availableUnits?: number;
  createdAt: string;
  updatedAt: string;
  lineOfficialAccount?: LineOfficialAccountSummary;
};

export type CarsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  type?: CarType | "All";
  transmission?: Transmission;
  fuel?: Fuel;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  locationId?: string;
  startDate?: string;
  endDate?: string;
};

export type CarImageUploadItem = {
  id: string;
  carId: string;
  imageUrl: string;
  sortOrder: number;
  fileName?: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
};

export type CarImagesUploadResponse = {
  items: CarImageUploadItem[];
  total: number;
};

export type SortKey = "price_asc" | "price_desc";

export type GetCarsParams = {
  q?: string;
  type?: string;
  location?: string;
  pickupDate?: string;
  returnDate?: string;
  sort?: SortKey;
};

export type GetCarsResponse = {
  items: Car[];
  total: number;
};

export type CarsApiResponse = {
  items: Array<Partial<Car> & { id: string; name: string }>;
  total: number;
};

export type RawCarImageUploadItem = Omit<CarImageUploadItem, "imageUrl"> & {
  imageUrl?: string;
};

export type CheckAvailabilityPayload = {
  carId: string;
  pickupDate: string;
  returnDate: string;
};

export type AvailabilityResult = {
  carId: string;
  available: boolean;
  unitCount?: number;
  reservedUnits?: number;
  availableUnits?: number;
  unavailableDates?: string[];
};

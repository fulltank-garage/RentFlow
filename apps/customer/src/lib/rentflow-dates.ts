export function getTodayLocalDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function normalizeDateInput(value?: string | null) {
  const date = value?.trim().slice(0, 10) || "";
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

export function clampPickupDateToToday(value?: string | null) {
  const date = normalizeDateInput(value);
  const today = getTodayLocalDate();
  if (!date) return "";
  return date < today ? today : date;
}

export function getMinReturnDate(pickupDate?: string | null) {
  const today = getTodayLocalDate();
  const pickup = clampPickupDateToToday(pickupDate);
  return pickup && pickup > today ? pickup : today;
}

export function clampReturnDateToPickup(value?: string | null, pickupDate?: string | null) {
  const date = normalizeDateInput(value);
  if (!date) return "";

  const minReturnDate = getMinReturnDate(pickupDate);
  return date < minReturnDate ? minReturnDate : date;
}

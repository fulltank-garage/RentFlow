export function toTHBText(n: number) {
  return `${Math.max(0, Math.round(n)).toLocaleString("th-TH")} บาท`;
}

export function normCarId(v: string) {
  try {
    return decodeURIComponent(String(v ?? "")).trim();
  } catch {
    return String(v ?? "").trim();
  }
}

import { formatTHB } from "@/src/constants/money";
import { formatBookingDateTimeParts } from "@/src/lib/booking-datetime";

type BuildChatMessageParams = {
  bookingCode?: string;
  shopName?: string;
  carName?: string;
  carId: string;
  finalPickupPoint: string;
  pickupDate: string;
  pickupTime: string;
  finalReturnPoint: string;
  returnDate: string;
  returnTime: string;
  days: number;
  addonTitles: string[];
  subtotal?: number;
  discount?: number;
  extraCharge?: number;
  amount: number;
  fullName: string;
  phone: string;
};

export function buildChatMessage(params: BuildChatMessageParams) {
  const addonsText = params.addonTitles.length ? params.addonTitles.join(", ") : "-";

  return [
    "สวัสดีครับ ต้องการจองรถผ่านแชท",
    params.bookingCode ? `รหัสการจอง: ${params.bookingCode}` : null,
    params.shopName ? `ร้าน: ${params.shopName}` : null,
    `รถ: ${params.carName || "-"} (${params.carId || "-"})`,
    `รับรถ: ${params.finalPickupPoint || "-"} ${formatBookingDateTimeParts(
      params.pickupDate,
      params.pickupTime
    )}`.trim(),
    `คืนรถ: ${params.finalReturnPoint || "-"} ${formatBookingDateTimeParts(
      params.returnDate,
      params.returnTime
    )}`.trim(),
    `จำนวนวัน: ${params.days || 0} วัน`,
    `บริการเสริม: ${addonsText}`,
    typeof params.subtotal === "number" ? `ยอดก่อนส่วนลด: ${formatTHB(params.subtotal)}` : null,
    typeof params.discount === "number" && params.discount > 0
      ? `ส่วนลด: -${formatTHB(params.discount)}`
      : null,
    typeof params.extraCharge === "number" && params.extraCharge > 0
      ? `ค่าใช้จ่ายเพิ่มเติม: ${formatTHB(params.extraCharge)}`
      : null,
    `ยอดรวม: ${formatTHB(params.amount)}`,
    `ชื่อผู้จอง: ${params.fullName || "-"}`,
    `เบอร์: ${params.phone || "-"}`,
  ].filter(Boolean).join("\n");
}

export function buildChatHref(baseUrl: string, message: string) {
  const trimmedBaseUrl = baseUrl.trim();
  const encoded = encodeURIComponent(message);
  if (!trimmedBaseUrl) return "";

  if (/m\.me|messenger\.com/i.test(trimmedBaseUrl)) {
    const separator = trimmedBaseUrl.includes("?") ? "&" : "?";
    return `${trimmedBaseUrl}${separator}ref=rentflow_booking`;
  }

  if (/line\.me|lin\.ee/i.test(trimmedBaseUrl)) {
    const separator = trimmedBaseUrl.includes("?") ? "&" : "?";
    return `${trimmedBaseUrl}${separator}text=${encoded}`;
  }

  const separator = trimmedBaseUrl.includes("?") ? "&" : "?";
  return `${trimmedBaseUrl}${separator}text=${encoded}`;
}

export async function copyChatMessage(message: string) {
  if (typeof window === "undefined" || !message) return false;
  try {
    await window.navigator.clipboard.writeText(message);
    return true;
  } catch {
    return false;
  }
}

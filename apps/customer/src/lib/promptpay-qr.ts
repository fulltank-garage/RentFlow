import QRCode from "qrcode";

type PromptPayType = "phone" | "national_id" | "tax_id" | "e_wallet" | string;

function formatTag(tag: string, value: string) {
  return `${tag}${value.length.toString().padStart(2, "0")}${value}`;
}

function crc16CcittFalse(value: string) {
  let crc = 0xffff;
  for (let index = 0; index < value.length; index += 1) {
    crc ^= value.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function digitsOnly(value?: string) {
  return (value || "").replace(/\D/g, "");
}

function buildProxyValue(type: PromptPayType, rawId: string) {
  const id = digitsOnly(rawId);
  if (!id) return "";

  if (type === "phone") {
    if (id.length !== 10 || !id.startsWith("0")) return "";
    return formatTag("01", `0066${id.slice(1)}`);
  }

  if (type === "national_id" || type === "tax_id") {
    if (id.length !== 13) return "";
    return formatTag("02", id);
  }

  if (type === "e_wallet") {
    if (id.length !== 15) return "";
    return formatTag("03", id);
  }

  return "";
}

export function canBuildPromptPayPayload(type?: PromptPayType, promptPayId?: string) {
  return Boolean(buildProxyValue(type || "phone", promptPayId || ""));
}

export function buildPromptPayPayload({
  amount,
  promptPayId,
  promptPayType,
}: {
  amount: number;
  promptPayId?: string;
  promptPayType?: PromptPayType;
}) {
  const proxyValue = buildProxyValue(promptPayType || "phone", promptPayId || "");
  if (!proxyValue || amount <= 0) return "";

  const merchantAccountInfo = formatTag(
    "29",
    `${formatTag("00", "A000000677010111")}${proxyValue}`
  );

  const withoutCrc = [
    formatTag("00", "01"),
    formatTag("01", "11"),
    merchantAccountInfo,
    formatTag("53", "764"),
    formatTag("54", amount.toFixed(2)),
    formatTag("58", "TH"),
    "6304",
  ].join("");

  return `${withoutCrc}${crc16CcittFalse(withoutCrc)}`;
}

export async function buildPromptPayQrDataUrl(payload: string) {
  if (!payload) return "";
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 2,
    scale: 8,
    color: {
      dark: "#01122c",
      light: "#ffffff",
    },
  });
}

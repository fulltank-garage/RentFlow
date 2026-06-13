export function formatBookingDateTime(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const timeMatch =
    value.match(/T(\d{2}:\d{2}(?::\d{2})?)/) ??
    value.match(/\b(\d{2}:\d{2}(?::\d{2})?)\b/);
  const rawTime = timeMatch?.[1] ?? null;
  const hasExplicitTime = Boolean(rawTime);
  const isDefaultMidnight =
    rawTime === "00:00" || rawTime === "00:00:00";

  const dateText = new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  if (!hasExplicitTime || isDefaultMidnight) {
    return dateText;
  }

  const timeText = new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${dateText} เวลา ${timeText} น.`;
}

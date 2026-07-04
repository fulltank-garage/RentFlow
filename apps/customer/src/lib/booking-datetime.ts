function getDateParts(value?: string) {
  if (!value) return null;

  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
    };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function getTimeText(value?: string, fallbackTime?: string) {
  if (value && /[zZ]$|[+-]\d{2}:?\d{2}$/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const timeText = `${hours}:${minutes}`;
      return timeText === "00:00" ? "" : timeText;
    }
  }

  const rawTime =
    value?.match(/(?:T|\s)(\d{2}:\d{2})(?::\d{2})?/)?.[1] ??
    value?.match(/^(\d{2}:\d{2})(?::\d{2})?$/)?.[1] ??
    fallbackTime?.match(/^(\d{2}:\d{2})(?::\d{2})?$/)?.[1] ??
    null;

  if (!rawTime || rawTime === "00:00") return "";
  return rawTime;
}

export function formatBookingDate(value?: string) {
  if (!value) return "-";

  const parts = getDateParts(value);
  if (!parts) return value;

  const date = new Date(parts.year, parts.month - 1, parts.day);
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatBookingDateTime(value?: string, fallbackTime?: string) {
  if (!value) return "-";

  const dateText = formatBookingDate(value);
  if (dateText === value) return value;

  const timeText = getTimeText(value, fallbackTime);
  if (!timeText) return dateText;

  return `${dateText} เวลา ${timeText} น.`;
}

export function formatBookingDateTimeParts(
  dateValue?: string,
  timeValue?: string
) {
  if (!dateValue) return "-";
  return formatBookingDateTime(dateValue, timeValue);
}

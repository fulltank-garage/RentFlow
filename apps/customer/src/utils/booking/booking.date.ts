export function parseDateTime(date: string, time: string) {
    if (!date || !time) return null;
    const dt = new Date(`${date}T${time}:00`);
    return Number.isFinite(dt.getTime()) ? dt : null;
  }
  
  export function diffDaysCeil(start: Date, end: Date) {
    const ms = end.getTime() - start.getTime();
    if (ms <= 0) return 0;
    const days = Math.ceil(ms / 86400000);
    return Math.max(1, days);
  }
export function formatTHB(n: number) {
    const value = Number.isFinite(n) ? n : 0;
    const num = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(value);
    return `${num} บาท`;
}
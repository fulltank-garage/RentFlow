export type PartnerNavGroup =
  | "Operations"
  | "Sales"
  | "Finance"
  | "Analytics"
  | "Settings";

export type PartnerNavItem = {
  label: string;
  href: string;
  group: PartnerNavGroup;
  badge?: string;
};

export const PARTNER_NAV: PartnerNavItem[] = [
  { label: "ภาพรวม", href: "/partner/dashboard", group: "Operations" },
  { label: "ข้อมูลร้าน", href: "/partner/store-setup", group: "Operations" },
  { label: "แต่งหน้าร้าน", href: "/partner/store-builder", group: "Operations" },
  { label: "รถให้เช่า", href: "/partner/cars", group: "Operations" },
  { label: "สาขารับรถ", href: "/partner/locations", group: "Operations" },
  { label: "รายการจอง", href: "/partner/bookings", group: "Sales" },
  { label: "รายชื่อลูกค้า", href: "/partner/customers", group: "Sales" },
  { label: "รายการชำระเงิน", href: "/partner/payments", group: "Finance" },
  { label: "ตารางเช่ารถ", href: "/partner/calendar", group: "Analytics" },
  { label: "คูปองส่วนลด", href: "/partner/promotions", group: "Analytics" },
  { label: "บริการเสริม", href: "/partner/addons", group: "Analytics" },
  { label: "สรุปรายงาน", href: "/partner/reports", group: "Analytics" },
  { label: "เชื่อมต่อ LINE", href: "/partner/line", group: "Settings" },
  { label: "ผู้ช่วย AI", href: "/partner/ai", group: "Settings", badge: "ใหม่" },
  { label: "ช่วยเหลือ", href: "/partner/support", group: "Settings" },
];

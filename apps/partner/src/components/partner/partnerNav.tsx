export type PartnerNavGroup =
  | "Operations"
  | "Sales"
  | "Finance"
  | "Analytics"
  | "Settings";

export type PartnerNavIcon =
  | "dashboard"
  | "store"
  | "builder"
  | "car"
  | "location"
  | "bookings"
  | "customers"
  | "payments"
  | "calendar"
  | "promotions"
  | "addons"
  | "reports"
  | "line"
  | "ai"
  | "support";

export type PartnerNavItem = {
  label: string;
  href: string;
  group: PartnerNavGroup;
  icon: PartnerNavIcon;
  badge?: string;
};

export const PARTNER_NAV: PartnerNavItem[] = [
  { label: "ภาพรวม", href: "/partner/dashboard", group: "Operations", icon: "dashboard" },
  { label: "ข้อมูลร้าน", href: "/partner/store-setup", group: "Operations", icon: "store" },
  { label: "แต่งหน้าร้าน", href: "/partner/store-builder", group: "Operations", icon: "builder" },
  { label: "รถให้เช่า", href: "/partner/cars", group: "Operations", icon: "car" },
  { label: "สาขารับรถ", href: "/partner/locations", group: "Operations", icon: "location" },
  { label: "รายการจอง", href: "/partner/bookings", group: "Sales", icon: "bookings" },
  { label: "รายชื่อลูกค้า", href: "/partner/customers", group: "Sales", icon: "customers" },
  { label: "รายการชำระเงิน", href: "/partner/payments", group: "Finance", icon: "payments" },
  { label: "ตารางเช่ารถ", href: "/partner/calendar", group: "Analytics", icon: "calendar" },
  { label: "คูปองส่วนลด", href: "/partner/promotions", group: "Analytics", icon: "promotions" },
  { label: "บริการเสริม", href: "/partner/addons", group: "Analytics", icon: "addons" },
  { label: "สรุปรายงาน", href: "/partner/reports", group: "Analytics", icon: "reports" },
  { label: "เชื่อมต่อ LINE", href: "/partner/line", group: "Settings", icon: "line" },
  { label: "ผู้ช่วย AI", href: "/partner/ai", group: "Settings", icon: "ai", badge: "ใหม่" },
  { label: "ช่วยเหลือ", href: "/partner/support", group: "Settings", icon: "support" },
];

export type NavItem = {
    label: string;
    href: string;
};

export const NAV: NavItem[] = [
    { label: "ร้านทั้งหมด", href: "/shops" },
    { label: "ดูรถทั้งหมด", href: "/cars" },
    { label: "ทำไมต้องเรา", href: "/features" },
    { label: "การจองของฉัน", href: "/my-bookings" },
    { label: "ช่วยเหลือ", href: "/help" },
    { label: "ติดต่อ", href: "/contact" },
];

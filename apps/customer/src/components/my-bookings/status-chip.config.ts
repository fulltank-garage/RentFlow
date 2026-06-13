"use client";

import type { BookingStatus } from "@/src/services/booking/booking.types";

type StatusChipConfig = {
  label: string;
  className: string;
};

const baseClassName =
  "!h-11 !rounded-full !border-0 !px-4 !shadow-none [&_.MuiChip-label]:!px-0 [&_.MuiChip-label]:!text-base [&_.MuiChip-label]:!font-black [&_.MuiChip-label]:!tracking-[-0.04em]";

export const BOOKING_STATUS_CHIP_MAP: Record<BookingStatus, StatusChipConfig> = {
  pending: {
    label: "รอดำเนินการ",
    className: `${baseClassName} !bg-orange-600 !text-white`,
  },
  confirmed: {
    label: "ยืนยันแล้ว",
    className: `${baseClassName} !bg-blue-700 !text-white`,
  },
  paid: {
    label: "ชำระแล้ว",
    className: `${baseClassName} !bg-green-500 !text-white`,
  },
  active: {
    label: "กำลังเช่า",
    className: `${baseClassName} !bg-green-500 !text-white`,
  },
  review: {
    label: "รอตรวจสอบ",
    className: `${baseClassName} !bg-orange-600 !text-white`,
  },
  completed: {
    label: "เสร็จสิ้น",
    className: `${baseClassName} !bg-slate-800 !text-white`,
  },
  cancelled: {
    label: "ยกเลิก",
    className: `${baseClassName} !bg-rose-500 !text-white`,
  },
};

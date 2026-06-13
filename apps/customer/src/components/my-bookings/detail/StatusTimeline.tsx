"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";
import type { BookingStatus } from "@/src/hooks/my-bookings/useMyBookingDetailPage";

function StepDot({ active }: { active: boolean }) {
  return (
    <Box
      className={[
        "h-3 w-3 rounded-full border",
        active ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white",
      ].join(" ")}
    />
  );
}

export default function StatusTimeline({ status }: { status: BookingStatus }) {
  if (status === "cancelled") {
    return (
      <Box className="flex items-center gap-2">
        <StepDot active />
        <Typography className="text-xs text-rose-700">รายการถูกยกเลิก</Typography>
      </Box>
    );
  }

  const steps = [
    { key: "pending" as const, label: "สร้างรายการ" },
    { key: "confirmed" as const, label: "ยืนยันการจอง" },
    { key: "paid" as const, label: "ชำระเงิน" },
    { key: "completed" as const, label: "เสร็จสิ้น" },
  ];

  const activeIndex =
    status === "pending"
      ? 0
      : status === "confirmed"
      ? 1
      : status === "paid"
      ? 2
      : status === "completed"
      ? 3
      : 2;

  return (
    <Box className="flex items-center gap-3">
      {steps.map((s, i) => {
        const active = i <= activeIndex;

        return (
          <React.Fragment key={s.key}>
            <Box className="flex items-center gap-2">
              <StepDot active={active} />
              <Typography
                className={[
                  "text-xs",
                  active ? "text-slate-900" : "text-slate-500",
                ].join(" ")}
              >
                {s.label}
              </Typography>
            </Box>

            {i !== steps.length - 1 && (
              <Box
                className={[
                  "h-px w-10",
                  i < activeIndex ? "bg-slate-900" : "bg-slate-200",
                ].join(" ")}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
}

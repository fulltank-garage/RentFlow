"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";
import { getCarTypeLabel } from "@/src/lib/rentflow-catalog";

type Props = {
  detail: {
    name: string;
    type: string;
    seats: number;
    transmission: string;
    fuel: string;
  };
};

export default function CarDetailOverview({ detail }: Props) {
  return (
    <Box className="apple-card p-5!">
      <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
        รายละเอียดรถ
      </Typography>
      <Typography className="apple-body-sm mt-2 leading-relaxed text-[var(--rf-apple-muted)]">
        รถรุ่น{" "}
        <span className="font-semibold text-[var(--rf-apple-ink)]">{detail.name}</span>{" "}
        เหมาะสำหรับการใช้งานประเภท{" "}
        <span className="font-semibold text-[var(--rf-apple-ink)]">
          {getCarTypeLabel(detail.type)}
        </span>{" "}
        รองรับ{" "}
        <span className="font-semibold text-[var(--rf-apple-ink)]">
          {detail.seats} ที่นั่ง
        </span>{" "}
        พร้อมระบบ{" "}
        <span className="font-semibold text-[var(--rf-apple-ink)]">
          {detail.transmission}
        </span>{" "}
        และเชื้อเพลิง{" "}
        <span className="font-semibold text-[var(--rf-apple-ink)]">{detail.fuel}</span>.
      </Typography>
    </Box>
  );
}

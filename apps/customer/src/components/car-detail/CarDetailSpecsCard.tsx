"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";
import { getCarTypeLabel } from "@/src/lib/rentflow-catalog";

type Props = {
  detail: {
    type: string;
    seats: number;
    transmission: string;
    fuel: string;
  };
};

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box className="flex items-center justify-between">
      <Typography className="apple-body-sm text-slate-600">{label}</Typography>
      <Typography className="apple-body-sm font-semibold text-slate-900">{value}</Typography>
    </Box>
  );
}

export default function CarDetailSpecsCard({ detail }: Props) {
  return (
    <Box className="apple-card p-5!">
      <Typography className="apple-card-title font-semibold text-slate-900">
        สรุปสเปค
      </Typography>

      <Box className="apple-body-sm mt-3 grid gap-2 text-slate-700">
        <SpecRow label="ประเภท" value={getCarTypeLabel(detail.type)} />
        <SpecRow label="ที่นั่ง" value={detail.seats} />
        <SpecRow label="เกียร์" value={detail.transmission} />
        <SpecRow label="เชื้อเพลิง" value={detail.fuel} />
      </Box>
    </Box>
  );
}

"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";

function IncludedCard({
  positive,
  title,
  desc,
}: {
  positive: boolean;
  title: string;
  desc: string;
}) {
  const bgClass = positive
    ? "bg-[var(--rf-apple-surface-soft)]"
    : "bg-white";

  return (
    <Box className={`rounded-[22px] p-4 ${bgClass}`}>
      <Box>
        <Typography
          className="apple-card-title font-semibold text-slate-900"
          component="div"
        >
          {title}
        </Typography>
        <Typography className="apple-label-text mt-1 text-slate-600" component="div">
          {desc}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CarDetailIncludedSection() {
  return (
    <Box className="apple-card p-5!">
      <Typography className="apple-card-title font-semibold text-slate-900">
        สิ่งที่รวมในราคา
      </Typography>

      <Box className="mt-3 grid gap-3 sm:grid-cols-2">
        <IncludedCard
          positive
          title="ตรวจเช็คสภาพรถก่อนส่งมอบ"
          desc="เช็คระบบพื้นฐานและทำความสะอาดก่อนรับรถ"
        />
        <IncludedCard
          positive
          title="บริการช่วยเหลือเบื้องต้น"
          desc="ติดต่อทีมงานได้ในเวลาทำการ"
        />
        <IncludedCard
          positive={false}
          title="ค่าน้ำมัน"
          desc="ปกติคิดตามนโยบาย (รับเท่าไรคืนเท่านั้น)"
        />
        <IncludedCard
          positive={false}
          title="ค่าปรับคืนรถเกินเวลา"
          desc="ขึ้นกับเงื่อนไขจริงของผู้ให้บริการ"
        />
      </Box>
    </Box>
  );
}

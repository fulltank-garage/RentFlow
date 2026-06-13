"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";

export default function CarDetailTermsSection() {
  return (
    <Box className="apple-card p-5!">
      <Typography className="text-sm font-semibold text-slate-900">
        เงื่อนไขการเช่า
      </Typography>
      <Box
        component="ul"
        className="mt-3 space-y-2 pl-5 text-sm text-slate-600"
      >
        <Box component="li">เตรียมบัตรประชาชน/พาสปอร์ต และใบขับขี่ตัวจริง</Box>
        <Box component="li">รับ-คืนรถตามวันและเวลาที่เลือกในหน้า “จองรถ”</Box>
        <Box component="li">
          การมัดจำ/ประกันและค่าธรรมเนียมขึ้นกับผู้ให้บริการ (ปรับได้)
        </Box>
        <Box component="li">
          แนะนำถ่ายรูปสภาพรถก่อนออกเดินทางเพื่อความชัดเจน
        </Box>
      </Box>
    </Box>
  );
}

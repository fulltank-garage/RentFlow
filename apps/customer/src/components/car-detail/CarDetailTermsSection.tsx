"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";

const rentalTerms = [
  {
    title: "เอกสารที่ต้องใช้",
    desc: "เตรียมบัตรประชาชนหรือพาสปอร์ต พร้อมใบขับขี่ตัวจริงในวันที่รับรถ",
  },
  {
    title: "เวลารับและคืนรถ",
    desc: "รับ-คืนรถตามวัน เวลา และสาขาที่เลือกไว้ในหน้าจองรถ หากต้องการเปลี่ยนแปลงควรติดต่อร้านล่วงหน้า",
  },
  {
    title: "มัดจำและค่าธรรมเนียม",
    desc: "ยอดมัดจำ ประกัน และค่าธรรมเนียมเพิ่มเติมขึ้นกับเงื่อนไขของผู้ให้บริการแต่ละร้าน",
  },
  {
    title: "ตรวจสภาพก่อนเดินทาง",
    desc: "แนะนำให้ถ่ายรูปรอบคัน ระดับน้ำมัน และเลขไมล์ก่อนออกเดินทางเพื่อความชัดเจนทั้งสองฝ่าย",
  },
];

export default function CarDetailTermsSection() {
  return (
    <Box className="apple-card p-5! sm:p-6!">
      <Box className="flex flex-col gap-1.5">
        <Typography className="apple-card-title font-semibold text-(--rf-apple-ink)">
          เงื่อนไขการเช่า
        </Typography>
        <Typography className="text-sm text-(--rf-apple-muted)">
          ตรวจสอบข้อมูลสำคัญก่อนยืนยันการจอง เพื่อให้วันรับรถเป็นไปอย่างราบรื่น
        </Typography>
      </Box>

      <Box className="mt-4 grid gap-3 sm:grid-cols-2">
        {rentalTerms.map((term, index) => (
          <Box
            key={term.title}
            className="rounded-[22px] border border-black/10 bg-(--rf-apple-surface-soft) p-4"
          >
            <Box className="flex items-start gap-3">
              <Box className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--rf-apple-blue) text-sm font-bold text-white">
                {index + 1}
              </Box>
              <Box className="min-w-0">
                <Typography className="text-sm font-semibold text-(--rf-apple-ink)">
                  {term.title}
                </Typography>
                <Typography className="mt-1 text-sm leading-6 text-(--rf-apple-muted)">
                  {term.desc}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box className="mt-4 rounded-[22px] border border-(--rf-apple-border) bg-white px-4 py-3">
        <Typography className="text-sm font-semibold text-(--rf-apple-ink)">
          หมายเหตุ
        </Typography>
        <Typography className="mt-1 text-sm leading-6 text-(--rf-apple-muted)">
          เงื่อนไขจริงอาจแตกต่างกันตามร้านและรุ่นรถ โปรดตรวจสอบยอดชำระ มัดจำ
          และรายละเอียดประกันกับร้านอีกครั้งก่อนรับรถ
        </Typography>
      </Box>
    </Box>
  );
}

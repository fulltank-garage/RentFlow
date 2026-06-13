"use client";

import Link from "next/link";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";

export default function ContactFormCard() {
  return (
    <Box>
      <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
        เตรียมข้อมูลก่อนติดต่อ
      </Typography>
      <Typography className="apple-body-sm mt-1 text-[var(--rf-apple-muted)]">
        เพื่อให้ทีมงานช่วยตรวจสอบได้เร็วขึ้น กรุณาเตรียมรายละเอียดต่อไปนี้
      </Typography>

      <Box className="mt-5 space-y-4">
        <Box className="apple-card rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4">
          <Typography className="apple-card-title font-semibold text-[var(--rf-apple-ink)]">
            ข้อมูลที่ควรแจ้ง
          </Typography>
          <Box className="apple-body-sm mt-3 space-y-2 text-[var(--rf-apple-muted)]">
            <Typography>1. รหัสการจองหรือชื่อผู้จอง</Typography>
            <Typography>2. วันรับรถ วันคืนรถ และสาขาที่เกี่ยวข้อง</Typography>
            <Typography>3. รายละเอียดปัญหาหรือคำขอที่ต้องการให้ช่วย</Typography>
            <Typography>4. เบอร์โทรที่สะดวกให้ทีมงานติดต่อกลับ</Typography>
          </Box>
        </Box>

        <Box className="apple-card rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4">
          <Typography className="apple-card-title font-semibold text-[var(--rf-apple-ink)]">
            จัดการรายการจอง
          </Typography>
          <Typography className="apple-body-sm mt-2 text-[var(--rf-apple-muted)]">
            หากต้องการตรวจสอบสถานะหรือรายละเอียดการจอง สามารถเปิดหน้ารายการจองของคุณได้ทันที
          </Typography>

          <Box className="mt-4 flex flex-wrap gap-2">
            <Button
              component={Link}
              href="/my-bookings"
              variant="contained"
              className="rounded-full! font-semibold!"
            >
              ดูรายการจองของฉัน
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

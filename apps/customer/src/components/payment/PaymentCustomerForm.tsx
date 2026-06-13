"use client";

import * as React from "react";
import { Box, TextField, Typography } from "@mui/material";

type Props = {
  fullName: string;
  setFullName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  roundedFieldSX: object;
};

export default function PaymentCustomerForm({
  fullName,
  setFullName,
  phone,
  setPhone,
  roundedFieldSX,
}: Props) {
  return (
    <>
      <Typography className="apple-card-title font-semibold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
        ข้อมูลผู้ชำระเงิน
      </Typography>
      <Typography className="apple-body-sm mt-1 text-[var(--rf-apple-muted)]">
        กรอกข้อมูลติดต่อสำหรับยืนยันรายการและการประสานงานกรณีจำเป็น
      </Typography>

      <Box className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextField
          id="payment-customer-full-name"
          name="fullName"
          label="ชื่อ-นามสกุล"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          sx={roundedFieldSX}
        />
        <TextField
          id="payment-customer-phone"
          name="phone"
          label="เบอร์โทร"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          sx={roundedFieldSX}
        />
      </Box>

      <Box className="mt-4 rounded-[22px] bg-[var(--rf-apple-surface-soft)] px-4 py-3">
        <Typography className="apple-label-text leading-6 text-[var(--rf-apple-muted)]">
          ใช้สำหรับอ้างอิงการชำระเงินและการติดต่อกลับจากร้าน
        </Typography>
      </Box>
    </>
  );
}

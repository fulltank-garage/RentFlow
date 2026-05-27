"use client";

import * as React from "react";
import Image from "next/image";
import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import { rentFlowSelectMenuProps } from "@/src/components/common/selectMenuProps";
import type { Method } from "@/src/utils/payment/payment.helpers";
import { formatTHB } from "@/src/constants/money";

type Props = {
  method: Method;
  setMethod: (value: Method) => void;
  amount: number;
  cardDetails: {
    cardNumber: string;
    cardHolder: string;
    cardExpiry: string;
    cardCvv: string;
  };
  setCardDetails: React.Dispatch<
    React.SetStateAction<{
      cardNumber: string;
      cardHolder: string;
      cardExpiry: string;
      cardCvv: string;
    }>
  >;
  slipFile: File | null;
  setSlipFile: (file: File | null) => void;
  roundedFieldSX: object;
};

export default function PaymentMethodSection({
  method,
  setMethod,
  amount,
  cardDetails,
  setCardDetails,
  slipFile,
  setSlipFile,
  roundedFieldSX,
}: Props) {
  return (
    <>
      <Typography className="apple-card-title font-semibold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
        วิธีชำระเงิน
      </Typography>
      <Typography className="apple-body-sm mt-1 text-[var(--rf-apple-muted)]">
        เลือกช่องทางที่สะดวกที่สุดสำหรับการชำระรายการนี้
      </Typography>

      <Box className="mt-4">
        <TextField
          select
          id="payment-method"
          name="paymentMethod"
          label="เลือกวิธี"
          value={method}
          onChange={(e) => setMethod(e.target.value as Method)}
          fullWidth
          InputLabelProps={{ htmlFor: undefined }}
          SelectProps={{ MenuProps: rentFlowSelectMenuProps }}
          sx={roundedFieldSX}
        >
          <MenuItem value="promptpay">PromptPay QR</MenuItem>
          <MenuItem value="card">บัตรเครดิต/เดบิต</MenuItem>
          <MenuItem value="transfer">โอนผ่านธนาคาร</MenuItem>
        </TextField>
      </Box>

      <Box className="mt-5 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
        {method === "promptpay" ? (
          <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Box className="flex flex-col gap-2.5">
              <Typography className="apple-card-title font-semibold text-slate-900">
                สแกนเพื่อชำระเงิน
              </Typography>
              <Typography className="apple-body-sm text-slate-600">
                จำนวนเงิน:{" "}
                <span className="font-semibold text-slate-900">
                  {formatTHB(amount)}
                </span>
              </Typography>
            </Box>

            <Box className="relative h-36 w-36 overflow-hidden rounded-[18px] bg-white">
              <Image
                src="/QR-CODE.jpg"
                alt="PromptPay QR"
                fill
                className="object-contain p-2"
              />
            </Box>
          </Box>
        ) : null}

        {method === "card" ? (
          <Box className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="payment-card-number"
              name="cardNumber"
              label="หมายเลขบัตร"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={(e) =>
                setCardDetails((prev) => ({
                  ...prev,
                  cardNumber: e.target.value,
                }))
              }
              fullWidth
              sx={roundedFieldSX}
            />
            <TextField
              id="payment-card-holder"
              name="cardHolder"
              label="ชื่อบนบัตร"
              placeholder="NAME SURNAME"
              value={cardDetails.cardHolder}
              onChange={(e) =>
                setCardDetails((prev) => ({
                  ...prev,
                  cardHolder: e.target.value,
                }))
              }
              fullWidth
              sx={roundedFieldSX}
            />
            <TextField
              id="payment-card-expiry"
              name="cardExpiry"
              label="หมดอายุ (MM/YY)"
              placeholder="12/30"
              value={cardDetails.cardExpiry}
              onChange={(e) =>
                setCardDetails((prev) => ({
                  ...prev,
                  cardExpiry: e.target.value,
                }))
              }
              fullWidth
              sx={roundedFieldSX}
            />
            <TextField
              id="payment-card-cvv"
              name="cardCvv"
              label="CVV"
              placeholder="123"
              value={cardDetails.cardCvv}
              onChange={(e) =>
                setCardDetails((prev) => ({
                  ...prev,
                  cardCvv: e.target.value,
                }))
              }
              fullWidth
              sx={roundedFieldSX}
            />
            <Typography className="apple-label-text leading-6 text-slate-500 sm:col-span-2">
              ระบบจะบันทึกเฉพาะข้อมูลที่จำเป็นต่อการยืนยันรายการ และไม่เก็บ CVV หลังยืนยัน
            </Typography>
          </Box>
        ) : null}

        {method === "transfer" ? (
          <Box className="grid gap-4">
            <Box className="rounded-[18px] bg-white p-4">
              <Box className="flex flex-col gap-2.5">
                <Typography className="apple-card-title font-semibold text-slate-900">
                  โอนเข้าบัญชี
                </Typography>
                <Typography className="apple-body-sm text-slate-600">
                  ธนาคาร: กสิกรไทย • เลขบัญชี: 123-4-56789-0 • ชื่อบัญชี:
                  RentFlow Co.,Ltd.
                </Typography>
                <Typography className="apple-body-sm text-slate-600">
                  จำนวนเงิน:{" "}
                  <span className="font-semibold text-slate-900">
                    {formatTHB(amount)}
                  </span>
                </Typography>
              </Box>
            </Box>

            <Button
              component="label"
              variant="outlined"
              className="rounded-full! sm:w-fit"
            >
              {slipFile ? "เปลี่ยนไฟล์สลิป" : "แนบสลิปโอนเงิน"}
              <input
                id="payment-slip-upload"
                name="paymentSlip"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setSlipFile(e.target.files?.[0] ?? null)}
              />
            </Button>

            {slipFile ? (
              <Typography className="apple-label-text text-slate-600">
                ไฟล์:{" "}
                <span className="font-semibold text-slate-900">
                  {slipFile.name}
                </span>
              </Typography>
            ) : (
              <Typography className="apple-label-text text-slate-500">
                * จำเป็นต้องแนบสลิปเพื่อยืนยัน
              </Typography>
            )}
          </Box>
        ) : null}
      </Box>

      <Box className="mt-4 rounded-[22px] bg-[var(--rf-apple-surface-soft)] px-4 py-3">
        <Typography className="apple-label-text leading-6 text-[var(--rf-apple-muted)]">
          เมื่อชำระเงินแล้ว กรุณาตรวจสอบความถูกต้องของยอดและหลักฐานให้ครบถ้วน
          เพื่อช่วยให้การตรวจสอบสถานะเป็นไปได้รวดเร็วขึ้น
        </Typography>
      </Box>
    </>
  );
}

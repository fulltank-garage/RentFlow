"use client";

import * as React from "react";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { Alert, Box, Button, Typography } from "@mui/material";
import { formatTHB } from "@/src/constants/money";

type Props = {
  amount: number;
  shopName?: string;
  promptPayId?: string;
  promptPayType?: string;
  promptPayQrDataUrl?: string;
  hasPromptPaySettings?: boolean;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  hasBankTransferSettings?: boolean;
  slipFile: File | null;
  setSlipFile: (file: File | null) => void;
};

function promptPayTypeLabel(type?: string) {
  switch (type) {
    case "phone":
      return "เบอร์มือถือ";
    case "national_id":
      return "เลขบัตรประชาชน";
    case "tax_id":
      return "เลขผู้เสียภาษี";
    case "e_wallet":
      return "e-Wallet";
    default:
      return "พร้อมเพย์";
  }
}

function maskPromptPayId(value?: string) {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 3)}${"•".repeat(Math.max(digits.length - 6, 3))}${digits.slice(-3)}`;
}

function formatBankAccountNumber(value?: string) {
  return (value || "").replace(/\D/g, "").replace(/(\d{3})(?=\d)/g, "$1 ");
}

export default function PaymentMethodSection({
  amount,
  shopName,
  promptPayId,
  promptPayType,
  promptPayQrDataUrl,
  hasPromptPaySettings,
  bankName,
  bankAccountName,
  bankAccountNumber,
  hasBankTransferSettings,
  slipFile,
  setSlipFile,
}: Props) {
  const [copied, setCopied] = React.useState(false);
  const canShowLockedQr = Boolean(hasPromptPaySettings && promptPayQrDataUrl);
  const receiverName = bankAccountName?.trim() || shopName || "ร้านเช่ารถ";
  const cleanBankAccountNumber = (bankAccountNumber || "").replace(/\D/g, "");

  const handleCopyBankAccount = React.useCallback(async () => {
    if (!cleanBankAccountNumber) return;

    try {
      await navigator.clipboard.writeText(cleanBankAccountNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [cleanBankAccountNumber]);

  return (
    <>
      <Typography className="apple-card-title font-semibold tracking-[-0.03em] text-(--rf-apple-ink)">
        สแกน QR หรือโอนผ่านบัญชี
      </Typography>
      <Typography className="apple-body-sm mt-1 text-(--rf-apple-muted)">
        ชำระด้วย QR พร้อมเพย์ล็อกยอด หรือโอนเข้าบัญชีธนาคารของร้าน แล้วแนบสลิปเพื่อให้ร้านตรวจสอบ
      </Typography>

      <Box className="mt-5 rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
        <Box className="grid gap-4">
          <Box className="grid gap-4 rounded-[18px] bg-white p-4 md:grid-cols-[minmax(0,1fr)_168px] md:items-center">
            <Box className="grid gap-3">
              <Box className="rounded-[18px] bg-(--rf-apple-surface-soft) p-4">
                <Typography className="apple-label-text font-semibold text-(--rf-apple-muted)">
                  ยอดที่ต้องชำระ
                </Typography>
                <Typography className="mt-1 text-2xl font-black text-(--rf-brand-dark)">
                  {formatTHB(amount)}
                </Typography>
              </Box>

              <Box className="grid gap-1.5 text-(--rf-apple-muted)">
                <Typography className="apple-body-sm">
                  ร้านผู้รับเงิน:{" "}
                  <span className="font-black text-(--rf-apple-ink)">
                    {receiverName}
                  </span>
                </Typography>
                {hasPromptPaySettings ? (
                  <>
                    <Typography className="apple-body-sm">
                      ประเภทพร้อมเพย์:{" "}
                      <span className="font-semibold text-(--rf-apple-ink)">
                        {promptPayTypeLabel(promptPayType)}
                      </span>
                    </Typography>
                    <Typography className="apple-body-sm">
                      เลขพร้อมเพย์:{" "}
                      <span className="font-black text-(--rf-apple-ink)">
                        {maskPromptPayId(promptPayId)}
                      </span>
                    </Typography>
                  </>
                ) : hasBankTransferSettings ? (
                  <Typography className="apple-body-sm font-semibold text-(--rf-apple-ink)">
                    โอนผ่านบัญชีธนาคารด้านล่างได้เลย
                  </Typography>
                ) : (
                  <Alert severity="warning" className="rounded-[18px]!">
                    ร้านนี้ยังไม่ได้ตั้งค่าช่องทางรับชำระเงิน กรุณาติดต่อร้านเพื่อยืนยันช่องทางชำระเงิน
                  </Alert>
                )}
              </Box>
            </Box>

            <Box className="relative mx-auto grid h-40 w-40 place-items-center overflow-hidden rounded-[18px] bg-white p-2 md:mx-0">
              {canShowLockedQr ? (
                <Box
                  component="img"
                  src={promptPayQrDataUrl}
                  alt="QR พร้อมเพย์ล็อกยอด"
                  className="h-full w-full object-contain"
                />
              ) : (
                <Box className="grid h-full w-full place-items-center rounded-[14px] bg-(--rf-apple-surface-soft) p-3 text-center">
                  <Typography className="apple-label-text font-semibold leading-6 text-(--rf-apple-muted)">
                    {hasBankTransferSettings ? "โอนผ่านบัญชี" : "ยังไม่พร้อมสร้าง QR"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {hasBankTransferSettings ? (
            <Box className="grid gap-3 rounded-[18px] bg-white p-4">
              <Typography className="apple-card-title font-semibold text-(--rf-apple-ink)">
                โอนผ่านบัญชีธนาคาร
              </Typography>
              <Box className="grid gap-2 rounded-[16px] bg-(--rf-apple-surface-soft) p-4">
                <Box className="flex items-start justify-between gap-3">
                  <Typography className="apple-label-text font-semibold text-(--rf-apple-muted)">
                    ธนาคาร
                  </Typography>
                  <Typography className="apple-body-sm text-right font-bold text-(--rf-apple-ink)">
                    {bankName}
                  </Typography>
                </Box>
                <Box className="flex items-start justify-between gap-3">
                  <Typography className="apple-label-text font-semibold text-(--rf-apple-muted)">
                    ชื่อบัญชี
                  </Typography>
                  <Typography className="apple-body-sm text-right font-bold text-(--rf-apple-ink)">
                    {bankAccountName}
                  </Typography>
                </Box>
                <Box className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Typography className="apple-label-text font-semibold text-(--rf-apple-muted)">
                    เลขบัญชี
                  </Typography>
                  <Box className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Typography className="apple-body-sm font-black tracking-[0.02em] text-(--rf-apple-ink)">
                      {formatBankAccountNumber(bankAccountNumber)}
                    </Typography>
                    <Button
                      type="button"
                      size="small"
                      variant="outlined"
                      startIcon={<ContentCopyRoundedIcon fontSize="small" />}
                      className="rounded-full!"
                      disabled={!cleanBankAccountNumber}
                      onClick={handleCopyBankAccount}
                      sx={{ textTransform: "none" }}
                    >
                      {copied ? "คัดลอกแล้ว" : "คัดลอก"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : null}

          <Box className="grid gap-3 rounded-[18px] bg-white p-4">
            <Typography className="apple-card-title font-semibold text-(--rf-apple-ink)">
              แนบสลิปการชำระเงิน
            </Typography>
            <Typography className="apple-body-sm text-(--rf-apple-muted)">
              ใช้รูปสลิปจากพร้อมเพย์หรือการโอนผ่านธนาคารได้เหมือนกัน
            </Typography>

            <Button
              component="label"
              variant="outlined"
              className="rounded-full! sm:w-fit"
            >
              {slipFile ? "เปลี่ยนไฟล์สลิป" : "แนบสลิปชำระเงิน"}
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
              <Typography className="apple-label-text text-(--rf-apple-muted)">
                ไฟล์:{" "}
                <span className="font-semibold text-(--rf-apple-ink)">
                  {slipFile.name}
                </span>
              </Typography>
            ) : (
              <Typography className="apple-label-text text-(--rf-apple-muted)">
                * จำเป็นต้องแนบสลิปก่อนยืนยันการชำระเงิน
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

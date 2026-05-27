"use client";

import Link from "next/link";
import { Box, Button, Card, CardContent, Divider, Typography } from "@mui/material";
import type { Car } from "@/src/services/cars/cars.types";
import { formatTHB } from "@/src/constants/money";
import StableImage from "@/src/components/common/StableImage";

type Props = {
  car?: Car | null;
  carId: string;
  finalPickupPoint: string;
  pickupDate: string;
  pickupTime: string;
  finalReturnPoint: string;
  returnDate: string;
  returnTime: string;
  days: number;
  addonsTotal: number;
  pricing: {
    discountPct: number;
    subTotal: number;
    discount: number;
    total: number;
  } | null;
  amount: number;
  formId?: string;
  showChatBooking?: boolean;
  forceChatBooking?: boolean;
  hasChatChannel?: boolean;
  canSubmit?: boolean;
  loading?: boolean;
  checkingAvailability?: boolean;
  carAvailable?: boolean;
};

export function BookingMobileCarCard({ car }: { car?: Car | null }) {
  if (!car) {
    return null;
  }

  return (
    <Card
      elevation={0}
      sx={{ boxShadow: "none" }}
      className="apple-card order-1 sm:hidden"
    >
      <CardContent className="p-4!">
        <Typography className="apple-card-title font-semibold text-slate-900">
          จองรถคันนี้
        </Typography>

        <Divider className="my-4! border-black/10!" />

        <StableImage
          className="aspect-4/3 rounded-[18px] bg-[var(--rf-apple-surface-soft)]"
          src={car.image || "/RentFlow.png"}
          alt={car.name}
          sizes="100vw"
          imageClassName="object-contain"
        />

        <Typography className="apple-card-title mt-4 truncate font-semibold text-slate-900">
          {car.name}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function BookingSummaryCard({
  car,
  carId,
  finalPickupPoint,
  pickupDate,
  pickupTime,
  finalReturnPoint,
  returnDate,
  returnTime,
  days,
  addonsTotal,
  pricing,
  amount,
  formId,
  showChatBooking = false,
  forceChatBooking = false,
  hasChatChannel = true,
  canSubmit = false,
  loading = false,
  checkingAvailability = false,
  carAvailable = true,
}: Props) {
  const submitDisabled = !canSubmit || loading || checkingAvailability || !carAvailable;

  return (
    <Card
      elevation={0}
      sx={{ boxShadow: "none" }}
      className="apple-card order-3 self-start sm:order-none lg:sticky lg:top-16 lg:col-span-5 lg:h-[calc(100svh-88px)]"
    >
      <CardContent className="p-4! sm:p-5! lg:flex lg:h-full lg:flex-col">
        <Typography className="apple-card-title font-semibold text-slate-900">
          สรุปการจอง
        </Typography>
        <Typography className="apple-label-text mt-1 text-slate-500">
          ตรวจสอบรถ จุดรับ-คืน และยอดรวมก่อนชำระเงิน
        </Typography>

        <Divider className="my-5! border-black/10!" />

        {!car ? (
          <Box className="rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4">
            <Typography className="apple-body-sm text-slate-700">
              ไม่พบข้อมูลรถ (รหัสรถ: <span className="font-semibold">{carId || "-"}</span>)
            </Typography>
            <Typography className="apple-label-text mt-2 text-slate-500">
              กรุณากลับไปเลือกจากหน้า “รถทั้งหมด”
            </Typography>

            <Link href="/cars" className="mt-4 inline-block">
              <Button
                variant="outlined"
                className="rounded-full!"
              >
                กลับไปเลือกรถ
              </Button>
            </Link>
          </Box>
        ) : (
          <Box className="rounded-[18px]! bg-[var(--rf-apple-surface-soft)] p-4! sm:p-5! lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
            <Box>
              <StableImage
                className="aspect-4/3 rounded-[18px] sm:aspect-4/3 lg:h-[clamp(120px,20svh,220px)] lg:shrink-0 lg:aspect-auto"
                src={car.image || "/RentFlow.png"}
                alt={car.name}
                sizes="(min-width: 1200px) 34vw, (min-width: 640px) 50vw, 100vw"
                imageClassName="object-contain"
              />

              <Box className="mt-3 flex items-start justify-between gap-3">
                <Box className="min-w-0">
                  <Typography className="apple-card-title truncate font-semibold text-slate-900">
                    {car.name}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="apple-body-sm mb-2! mt-4 space-y-2 lg:min-h-0">
              <Box className="flex items-center justify-between">
                <Typography className="text-slate-600">ราคา/วัน</Typography>
                <Typography className="font-semibold text-slate-900">
                  {formatTHB(car.pricePerDay)} / วัน
                </Typography>
              </Box>

              <Box className="flex items-start justify-between gap-3">
                <Typography className="text-slate-600">รับรถ</Typography>
                <Box className="text-right">
                  <Typography component="div" className="font-semibold text-slate-900">
                    {finalPickupPoint || "-"}
                  </Typography>
                  <Typography component="div" className="apple-label-text font-normal text-slate-500">
                    {pickupDate && pickupTime ? `${pickupDate} ${pickupTime}` : "-"}
                  </Typography>
                </Box>
              </Box>

              <Box className="flex items-start justify-between gap-3">
                <Typography className="text-slate-600">คืนรถ</Typography>
                <Box className="text-right">
                  <Typography component="div" className="font-semibold text-slate-900">
                    {finalReturnPoint || "-"}
                  </Typography>
                  <Typography component="div" className="apple-label-text font-normal text-slate-500">
                    {returnDate && returnTime ? `${returnDate} ${returnTime}` : "-"}
                  </Typography>
                </Box>
              </Box>

              <Box className="flex items-center justify-between">
                <Typography className="text-slate-600">จำนวนวัน</Typography>
                <Typography className="font-semibold text-slate-900">
                  {days > 0 ? `${days} วัน` : "-"}
                </Typography>
              </Box>

              <Box className="flex items-center justify-between">
                <Box>
                  <Typography className="text-slate-600">
                    บริการเสริมที่เลือก
                  </Typography>
                  {addonsTotal > 0 ? (
                    <Typography className="apple-label-text text-slate-500">
                      รวมอยู่ในยอดชำระแล้ว
                    </Typography>
                  ) : null}
                </Box>
                <Typography className="font-semibold text-slate-900">
                  {addonsTotal > 0 ? formatTHB(addonsTotal) : "-"}
                </Typography>
              </Box>

              {pricing ? (
                <>
                  <Box className="flex items-center justify-between">
                    <Typography className="text-slate-600">ยอดก่อนส่วนลด</Typography>
                    <Typography className="font-semibold text-slate-900">
                      {formatTHB(pricing.subTotal)}
                    </Typography>
                  </Box>

                  {pricing.discountPct > 0 ? (
                    <Box className="flex items-center justify-between">
                      <Typography className="text-slate-600">
                        ส่วนลด ({pricing.discountPct}%)
                      </Typography>
                      <Typography className="font-semibold text-emerald-700">
                        -{formatTHB(pricing.discount)}
                      </Typography>
                    </Box>
                  ) : null}
                </>
              ) : null}

              <Box className="flex items-center justify-between">
                <Typography className="text-slate-600">ยอดรวม</Typography>
                <Typography className="apple-card-title font-bold text-slate-900">
                  {amount > 0 ? formatTHB(amount) : "-"}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {car ? (
          <Box className="mt-4 space-y-3 sm:hidden">
            {showChatBooking ? (
              <Box
                className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
                sx={{
                  backgroundImage:
                    "radial-gradient(520px 160px at 18% 0%, rgba(251,191,36,0.22), transparent 60%)",
                }}
              >
                <Typography className="text-sm font-bold text-amber-900">
                  {forceChatBooking
                    ? "ร้านนี้รับจองผ่านแชทก่อน"
                    : "ยอดรวมค่อนข้างสูง — แนะนำจองผ่านแชท"}
                </Typography>
                <Typography className="mt-1 text-xs text-amber-800">
                  {forceChatBooking
                    ? "ระบบจะบันทึกคำขอจองและคัดลอกสรุปการจองให้ก่อนเปิดแชท"
                    : "ต่อรองราคา/ขอเงื่อนไขพิเศษ หรือประเมินค่าส่งเพิ่มเติมได้"}
                </Typography>
                <Typography className="apple-label-text mt-2 text-amber-700">
                  * เมื่อ Messenger เปิดขึ้น ให้วางข้อความสรุปที่คัดลอกไว้แล้วส่งให้ร้านได้ทันที
                </Typography>

                <Button
                  type="submit"
                  form={formId}
                  variant="contained"
                  disabled={submitDisabled || !hasChatChannel}
                  className="mt-4 w-full rounded-xl! font-semibold!"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#f59e0b",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#d97706",
                      boxShadow: "none",
                    },
                    py: 1.25,
                  }}
                >
                  {loading
                    ? "กำลังเตรียมแชท..."
                    : forceChatBooking
                      ? "จองผ่านแชท"
                      : "จองผ่านแชท (แนะนำ)"}
                </Button>
                {!hasChatChannel ? (
                  <Typography className="mt-3 text-xs text-amber-800">
                    ร้านนี้ยังไม่ได้ตั้งค่าปุ่มเปิดแชท ลูกค้ายังส่งคำขอจองให้ร้านติดต่อกลับได้
                  </Typography>
                ) : null}
              </Box>
            ) : null}

            <Button
              type="submit"
              form={formId}
              variant="contained"
              disabled={submitDisabled}
              className="w-full rounded-xl! px-6! py-3! font-semibold!"
              sx={{
                textTransform: "none",
                backgroundColor: "#059669",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#047857",
                  boxShadow: "none",
                },
                "&:disabled": {
                  backgroundColor: "#e5e7eb",
                  color: "#9ca3af",
                  boxShadow: "none",
                },
              }}
            >
              {checkingAvailability
                ? "กำลังตรวจสอบสถานะรถ..."
                : loading
                  ? forceChatBooking
                    ? "กำลังส่งคำขอจอง..."
                    : "กำลังไปหน้าชำระเงิน..."
                  : forceChatBooking
                    ? "จองผ่านแชท"
                    : "จองและไปชำระเงินทันที"}
            </Button>

            <Typography className="text-xs text-slate-500">
              * เลือกข้อมูลให้ถูกต้องก่อนดำเนินการต่อ
            </Typography>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
}

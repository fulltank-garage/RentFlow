"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Button, Chip, Container, Typography } from "@mui/material";
import BookingReceiptCard from "@/src/components/booking/BookingReceiptCard";
import BookingFlowScreen from "@/src/components/booking/BookingFlowScreen";
import BookingFlowSteps from "@/src/components/booking/BookingFlowSteps";
import BookingSuccessPageSkeleton from "@/src/components/booking/BookingSuccessPageSkeleton";
import { formatTHB } from "@/src/constants/money";
import usePageReady from "@/src/hooks/usePageReady";

export default function BookingSuccessPage({
  bookingId,
  amount,
  tenantSlug,
  carName,
  customerName,
  customerPhone,
  pickupDate,
  returnDate,
  pickupPoint,
  returnPoint,
  shopName,
  bookingMode = "chat",
}: {
  bookingId: string;
  amount: number;
  tenantSlug?: string;
  carName?: string;
  customerName?: string;
  customerPhone?: string;
  pickupDate?: string;
  returnDate?: string;
  pickupPoint?: string;
  returnPoint?: string;
  shopName?: string;
  bookingMode?: string;
}) {
  const ready = usePageReady({ disableDuringFlowTransition: true });
  const isChatBooking = bookingMode === "chat";

  if (!ready) {
    return <BookingSuccessPageSkeleton />;
  }

  const myBookingsHref = tenantSlug
    ? `/my-bookings?tenant=${encodeURIComponent(tenantSlug)}`
    : "/my-bookings";

  return (
    <Box className="apple-page">
      <BookingFlowScreen>
        <Container maxWidth="lg" className="apple-section">
          <BookingFlowSteps
            currentStep="success"
            mode={isChatBooking ? "chat" : "payment"}
            className="mb-8"
          />

          <Box className="mx-auto max-w-3xl text-center">
            <Box className="flex flex-col items-center gap-4">
              <Typography
                className="apple-heading apple-section-title"
              >
                {isChatBooking ? "ส่งคำขอจองแล้ว" : "จองสำเร็จ"}
              </Typography>
              <Typography className="apple-subtitle text-lg">
                {isChatBooking
                  ? "ร้านจะติดต่อกลับเพื่อยืนยันรายละเอียดก่อนดำเนินการขั้นถัดไป"
                  : "ระบบบันทึกรายการของคุณเรียบร้อยแล้ว สามารถตรวจสอบสถานะและรายละเอียดเพิ่มเติมได้จากหน้าการจองของฉัน"}
              </Typography>

              <Box className="mt-2 flex flex-wrap justify-center gap-3">
                <Chip
                  size="small"
                  label={`รหัสการจอง: ${bookingId || "BK-XXXX"}`}
                  className="apple-pill text-[var(--rf-apple-muted)]!"
                />
                <Chip
                  size="small"
                  label={`${isChatBooking ? "ยอดประมาณการ" : "ยอดชำระ"}: ${formatTHB(amount || 0)}`}
                  className="apple-pill text-[var(--rf-apple-muted)]!"
                />
              </Box>
            </Box>
          </Box>

          <Box className="apple-card apple-card-no-hover mx-auto mt-10 max-w-3xl p-5 md:p-6">
            <Box className="rounded-[26px] bg-[var(--rf-apple-surface-soft)] p-5">
              <Typography className="text-sm font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
                ขั้นตอนถัดไป
              </Typography>
              <Typography className="mt-3 text-sm leading-6 text-[var(--rf-apple-muted)]">
                {isChatBooking
                  ? "คำขอจองถูกส่งให้ร้านเรียบร้อยแล้ว เก็บรหัสการจองไว้สำหรับอ้างอิง และรอร้านติดต่อกลับเพื่อยืนยันเงื่อนไขก่อนชำระเงิน"
                  : "การจองของคุณถูกส่งเข้าระบบเรียบร้อยแล้ว เก็บรหัสการจองไว้สำหรับอ้างอิง ตรวจสอบสถานะจากหน้าการจองของฉัน และเตรียมเอกสารที่จำเป็นก่อนวันรับรถได้เลย"}
              </Typography>
            </Box>

            <Box className="mt-6 grid gap-4 md:grid-cols-2">
              <Box className="rounded-[26px] bg-[var(--rf-apple-surface-soft)] p-5">
                <Typography className="text-sm font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
                  ตรวจสอบรายการ
                </Typography>
                <Typography className="mt-3 text-sm leading-6 text-[var(--rf-apple-muted)]">
                  ดูสถานะการจอง วันรับ-คืนรถ
                  และข้อมูลสรุปทั้งหมดได้จากหน้าเดียวตลอดเวลา
                </Typography>
              </Box>

              <Box className="rounded-[26px] bg-[var(--rf-apple-surface-soft)] p-5">
                <Typography className="text-sm font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
                  เตรียมตัวก่อนรับรถ
                </Typography>
                <Typography className="mt-3 text-sm leading-6 text-[var(--rf-apple-muted)]">
                  หากต้องการแก้ไขรายละเอียดหรือตรวจสอบข้อมูลเพิ่มเติม
                  สามารถติดต่อทีมงานได้ทันที
                </Typography>
              </Box>
            </Box>

            <Box className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                component={Link}
                href={myBookingsHref}
                variant="contained"
                className="rounded-full! px-5! font-semibold!"
              >
                ไปที่การจองของฉัน
              </Button>
              <Button
                component={Link}
                href="/contact"
                variant="outlined"
                className="rounded-full! px-5! font-semibold!"
              >
                ติดต่อทีมงาน
              </Button>
            </Box>
          </Box>

          {!isChatBooking ? (
            <BookingReceiptCard
              bookingId={bookingId}
              amount={amount}
              carName={carName}
              customerName={customerName}
              customerPhone={customerPhone}
              pickupDate={pickupDate}
              returnDate={returnDate}
              pickupPoint={pickupPoint}
              returnPoint={returnPoint}
              shopName={shopName}
            />
          ) : null}
        </Container>
      </BookingFlowScreen>
    </Box>
  );
}

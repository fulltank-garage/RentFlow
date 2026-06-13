"use client";

import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
  Button,
  Alert,
  Chip,
} from "@mui/material";
import BookingFlowScreen from "@/src/components/booking/BookingFlowScreen";
import BookingFlowSteps from "@/src/components/booking/BookingFlowSteps";
import PaymentPageSkeleton from "@/src/components/payment/PaymentPageSkeleton";
import PaymentBookingSummaryCard from "@/src/components/payment/PaymentBookingSummaryCard";
import PaymentCustomerForm from "@/src/components/payment/PaymentCustomerForm";
import PaymentMethodSection from "@/src/components/payment/PaymentMethodSection";
import usePaymentPage from "@/src/hooks/payment/usePaymentPage";
import { formatTHB } from "@/src/constants/money";

export default function PaymentPage() {
  const payment = usePaymentPage();

  if (!payment.ready) {
    return <PaymentPageSkeleton />;
  }

  return (
    <Box className="apple-page">
      <BookingFlowScreen>
        <Container maxWidth="lg" className="apple-section">
          <BookingFlowSteps currentStep="payment" className="mb-8" />

          <Box className="apple-section-intro max-w-3xl">
            <Box className="flex flex-col gap-4">
              <Typography
                className="apple-heading apple-section-title"
              >
                ชำระเงิน
              </Typography>
              <Typography className="apple-subtitle text-lg">
                ตรวจสอบข้อมูลผู้ชำระเงิน เลือกวิธีชำระ และยืนยันรายการได้ในหน้าเดียว
              </Typography>
            </Box>

            <Box className="mt-6 flex flex-wrap justify-center gap-3">
              <Chip
                size="small"
                label={`รหัสการจอง: ${payment.bookingId}`}
                className="apple-pill text-[var(--rf-apple-muted)]!"
              />
              <Chip
                size="small"
                label={`ยอดชำระ: ${formatTHB(payment.amount)}`}
                className="apple-pill text-[var(--rf-apple-muted)]!"
              />
            </Box>
          </Box>

          <Box className="mt-10 grid gap-5 lg:grid-cols-12 lg:gap-6">
            <PaymentBookingSummaryCard
              bookingId={payment.bookingId}
              carId={payment.carId}
              car={payment.car}
              days={payment.days}
              pickupDate={payment.pickupDate}
              returnDate={payment.returnDate}
              pickupPoint={payment.pickupPoint}
              returnPoint={payment.returnPoint}
              pickupTime={payment.pickupTime}
              returnTime={payment.returnTime}
              amount={payment.amount}
              addonIds={payment.addonIds}
              addonOptions={payment.addonOptions}
              addonsTotal={payment.addonsTotal}
              carSubTotal={payment.carSubTotal}
              carNet={payment.carNet}
              carDiscount={payment.carDiscount}
              discountPct={payment.discountPct}
              extraCharge={payment.extraCharge}
            />

            <Card
              elevation={0}
              className="apple-card order-1 lg:order-2 lg:col-span-7"
            >
              <CardContent className="p-5! md:p-6!">
                <Box className="apple-card apple-card-no-hover rounded-[26px] bg-[var(--rf-apple-surface-soft)] p-4! md:p-5!">
                  <Typography className="text-sm font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
                    ก่อนยืนยันการชำระเงิน
                  </Typography>
                  <Typography className="mt-2 text-sm leading-6 text-[var(--rf-apple-muted)]">
                    ตรวจสอบชื่อผู้ชำระเงิน ช่องทางการติดต่อ และวิธีชำระให้ถูกต้อง
                    เมื่อยืนยันแล้วระบบจะบันทึกข้อมูลเพื่อตรวจสอบสถานะการชำระเงินต่อไป
                  </Typography>
                </Box>

                {payment.done ? (
                  <Alert
                    severity="success"
                    className="mt-5 rounded-[22px]!"
                  >
                    ยืนยันการชำระเงินสำเร็จ กำลังพาไปหน้าสรุปการจอง
                  </Alert>
                ) : null}

                {payment.error ? (
                  <Alert severity="error" className="mt-5 rounded-[22px]!">
                    {payment.error}
                  </Alert>
                ) : null}

                <Divider className="my-6! border-black/10!" />

                <PaymentCustomerForm
                  fullName={payment.fullName}
                  setFullName={payment.setFullName}
                  phone={payment.phone}
                  setPhone={payment.setPhone}
                  roundedFieldSX={payment.roundedFieldSX}
                />

                <Divider className="my-6! border-black/10!" />

                <PaymentMethodSection
                  method={payment.method}
                  setMethod={payment.setMethod}
                  amount={payment.amount}
                  cardDetails={payment.cardDetails}
                  setCardDetails={payment.setCardDetails}
                  slipFile={payment.slipFile}
                  setSlipFile={payment.setSlipFile}
                  roundedFieldSX={payment.roundedFieldSX}
                />

                <Stack
                  direction="row"
                  spacing={1.5}
                  className="mt-6 flex-wrap items-center"
                >
                  <Button
                    variant="contained"
                    disabled={!payment.canPay}
                    onClick={payment.handleConfirm}
                    className="rounded-full! px-5! py-2.5! font-semibold! sm:min-w-[220px]"
                    sx={{
                      textTransform: "none",
                      backgroundColor: "rgb(15 23 42)",
                    }}
                  >
                    {payment.loading ? "กำลังยืนยัน..." : "ยืนยันการชำระเงิน"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </BookingFlowScreen>
    </Box>
  );
}

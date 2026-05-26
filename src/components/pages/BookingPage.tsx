"use client";

import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import BookingPageSkeleton from "@/src/components/booking/BookingPageSkeleton";
import BookingFlowScreen from "@/src/components/booking/BookingFlowScreen";
import BookingFlowSteps from "@/src/components/booking/BookingFlowSteps";
import BookingSummaryCard from "@/src/components/booking/BookingSummaryCard";
import BookingForm from "@/src/components/booking/BookingForm";
import useBooking from "@/src/hooks/booking/useBooking";

export default function BookingPage() {
  const booking = useBooking();

  if (!booking.ready) {
    return <BookingPageSkeleton />;
  }

  return (
    <Box className="apple-page">
      <BookingFlowScreen>
        <Container maxWidth="lg" className="apple-section">
          <BookingFlowSteps
            currentStep="booking"
            mode={booking.forceChatBooking ? "chat" : "payment"}
            className="mb-8"
          />

          <Box className="apple-section-intro max-w-3xl">
            <Typography
              className="apple-heading apple-page-title"
            >
              จองรถ
            </Typography>
            <Typography className="apple-subtitle mt-3 text-lg">
              เลือกจุดรับ-คืนรถ วันเวลา และข้อมูลผู้จอง
            </Typography>
          </Box>

          <Box className="mt-10 grid gap-5 lg:grid-cols-12 lg:gap-6">
            <BookingSummaryCard
              car={booking.car}
              carId={booking.carId}
              finalPickupPoint={booking.finalPickupPoint}
              pickupDate={booking.pickupDate}
              pickupTime={booking.pickupTime}
              finalReturnPoint={booking.finalReturnPoint}
              returnDate={booking.returnDate}
              returnTime={booking.returnTime}
              days={booking.days}
              addonsTotal={booking.addonsTotal}
              pricing={booking.pricing}
              amount={booking.amount}
            />

            <Card
              elevation={0}
              sx={{ boxShadow: "none" }}
              className="apple-card lg:col-span-7"
            >
              <CardContent className="p-4!">
                <Typography className="text-base font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
                  ข้อมูลการจอง
                </Typography>
                <Typography className="mt-1 text-sm text-[var(--rf-apple-muted)]">
                  เลือกจุดรับ-คืนรถ วันเวลา และกรอกข้อมูลผู้จอง
                </Typography>

                <Divider className="my-5! border-black/10!" />

                <BookingForm
                  fieldSX={booking.fieldSX}
                  error={booking.error}
                  setError={booking.setError}
                  onSubmit={booking.onSubmit}
                  fullName={booking.fullName}
                  setFullName={booking.setFullName}
                  phone={booking.phone}
                  setPhone={booking.setPhone}
                  merchantBranchesEnabled={booking.merchantBranchesEnabled}
                  branchOptions={booking.branchOptions}
                  pickupBranch={booking.pickupBranch}
                  setPickupBranch={booking.setPickupBranch}
                  returnBranch={booking.returnBranch}
                  setReturnBranch={booking.setReturnBranch}
                  pickupOther={booking.pickupOther}
                  setPickupOther={booking.setPickupOther}
                  returnOther={booking.returnOther}
                  setReturnOther={booking.setReturnOther}
                  pickupFreeText={booking.pickupFreeText}
                  setPickupFreeText={booking.setPickupFreeText}
                  returnFreeText={booking.returnFreeText}
                  setReturnFreeText={booking.setReturnFreeText}
                  pickupDate={booking.pickupDate}
                  setPickupDate={booking.setPickupDate}
                  pickupTime={booking.pickupTime}
                  setPickupTime={booking.setPickupTime}
                  returnDate={booking.returnDate}
                  setReturnDate={booking.setReturnDate}
                  returnTime={booking.returnTime}
                  setReturnTime={booking.setReturnTime}
                  unavailableDates={booking.unavailableDates}
                  addonOptions={booking.addonOptions}
                  selectedAddonIds={booking.selectedAddonIds}
                  addonsTotal={booking.addonsTotal}
                  handleAddonChange={booking.handleAddonChange}
                  startDT={booking.startDT}
                  endDT={booking.endDT}
                  timeInvalid={booking.timeInvalid}
                  showChatBooking={booking.showChatBooking}
                  forceChatBooking={booking.forceChatBooking}
                  hasChatChannel={booking.hasChatChannel}
                  carAvailable={booking.carAvailable}
                  checkingAvailability={booking.checkingAvailability}
                  availabilityMessage={booking.availabilityMessage}
                  canSubmit={booking.canSubmit}
                  loading={booking.loading}
                  carExists={!!booking.car}
                />
              </CardContent>
            </Card>
          </Box>
        </Container>
      </BookingFlowScreen>
    </Box>
  );
}

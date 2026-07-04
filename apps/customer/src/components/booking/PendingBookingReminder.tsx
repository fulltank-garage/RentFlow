"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Button, Container, Typography } from "@mui/material";
import { formatTHB } from "@/src/constants/money";
import { buildPendingBookingPaymentHref } from "@/src/lib/pending-booking-payment";
import { getCachedSessionUser } from "@/src/services/auth/auth.service";
import { bookingApi } from "@/src/services/booking/booking.service";
import type { Booking } from "@/src/services/booking/booking.types";

type Props = {
  tenantSlug?: string;
  waitForTenant?: boolean;
};

export default function PendingBookingReminder({
  tenantSlug,
  waitForTenant = false,
}: Props) {
  const pathname = usePathname();
  const [pendingBooking, setPendingBooking] = React.useState<Booking | null>(
    null
  );
  const [paymentHref, setPaymentHref] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;

    if (waitForTenant && !tenantSlug) {
      setPendingBooking(null);
      setPaymentHref("");
      return;
    }

    if (!getCachedSessionUser()) {
      setPendingBooking(null);
      setPaymentHref("");
      return;
    }

    bookingApi
      .getMyBookings({ tenantSlug })
      .then((res) => {
        if (cancelled) return;

        const nextPending =
          res.data
            .filter((booking) => booking.status === "pending")
            .sort(
              (a, b) =>
                new Date(b.updatedAt || b.createdAt).getTime() -
                new Date(a.updatedAt || a.createdAt).getTime()
            )[0] || null;

        setPendingBooking(nextPending);
        setPaymentHref(
          nextPending
            ? buildPendingBookingPaymentHref({
                ...nextPending,
                tenantSlug: tenantSlug || nextPending.domainSlug,
              })
            : ""
        );
      })
      .catch(() => {
        if (cancelled) return;
        setPendingBooking(null);
        setPaymentHref("");
      });

    return () => {
      cancelled = true;
    };
  }, [tenantSlug, waitForTenant]);

  if (
    pathname === "/payment" ||
    pathname === "/booking/success" ||
    !pendingBooking ||
    !paymentHref
  ) {
    return null;
  }

  return (
    <Box
      className="relative z-30 bg-transparent"
      sx={{
        position: "sticky",
        top: { xs: "52px", md: "44px" },
        marginTop: "-1px",
        zIndex: (theme) => theme.zIndex.modal + 10,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 1.25, md: 1.5 },
          "@media (min-width: 1200px)": {
            maxWidth: "1360px",
            paddingLeft: "24px",
            paddingRight: "24px",
          },
        }}
      >
        <Box
          className="relative flex flex-col gap-4 overflow-hidden rounded-[28px] border bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          sx={{
            borderColor:
              "color-mix(in srgb, var(--rf-brand) 38%, var(--rf-apple-border))",
            animation:
              "pendingBookingReminderIn .34s cubic-bezier(0.22, 1, 0.36, 1)",
            "@keyframes pendingBookingReminderIn": {
              from: {
                opacity: 0,
                transform: "translateY(-10px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
            },
          }}
        >
          <Box className="min-w-0">
            <Typography className="apple-card-title font-black text-(--rf-apple-ink)">
              คุณมีรายการจองที่ยังไม่ได้ชำระเงิน
            </Typography>
            <Typography className="apple-body-sm mt-1 text-(--rf-apple-muted)">
              {pendingBooking.carName || pendingBooking.carId} • ยอดรวม{" "}
              <span className="font-black text-(--rf-brand-dark)">
                {formatTHB(pendingBooking.totalAmount)}
              </span>
            </Typography>
          </Box>

          <Box className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              component={Link}
              href={paymentHref}
              variant="contained"
              className="rounded-full! px-6!"
              sx={{
                backgroundColor: "var(--rf-brand) !important",
                color: "var(--white) !important",
                "&:hover": {
                  backgroundColor: "var(--rf-brand-dark) !important",
                },
              }}
            >
              ชำระเงินต่อ
            </Button>
            <Button
              component={Link}
              href="/my-bookings"
              variant="outlined"
              className="rounded-full! px-6!"
            >
              ดูการจองของฉัน
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

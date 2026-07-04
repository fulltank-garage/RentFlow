"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import { formatTHB } from "@/src/constants/money";
import type { Booking } from "@/src/hooks/my-bookings/useMyBookingsPage";
import { formatBookingDateTime } from "@/src/lib/booking-datetime";
import StatusChip from "./StatusChip";

type Props = {
  data: Booking[];
};

export default function MyBookingsList({ data }: Props) {
  if (data.length === 0) {
    return (
      <Box className="rounded-[30px] border border-black/10 bg-white p-10 text-center sm:p-12">
        <Typography className="apple-card-title font-semibold text-(--rf-apple-ink)">
          ไม่พบรายการจอง
        </Typography>
        <Typography className="apple-body-sm mt-1 text-(--rf-apple-muted)">
          ลองเปลี่ยนคำค้นหา หรือเลือกสถานะอื่น
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="grid gap-4 md:grid-cols-2 lg:block lg:space-y-4">
      {data.map((b) => (
        <Box
          key={b.id}
          className="apple-card p-4 sm:p-5"
        >
          <Box className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <Box className="min-w-0">
              <Box className="min-w-0 lg:flex lg:items-baseline lg:gap-2">
                <Typography className="apple-body-copy shrink-0 font-black text-(--rf-apple-ink)">
                  รหัสจองของคุณ
                </Typography>
                <Typography className="apple-card-title mt-1 truncate font-semibold text-(--rf-apple-ink) lg:mt-0">
                  {b.id}
                </Typography>
              </Box>

              <Box className="mt-2 flex flex-col gap-2">
                <Typography className="apple-body-sm truncate font-semibold text-(--rf-apple-ink)">
                  <span className="font-medium text-(--rf-apple-muted)">
                    รุ่นรถที่จอง{" "}
                  </span>
                  {b.carName}
                </Typography>
                <Typography className="apple-label-text text-(--rf-apple-muted)">
                  วันรับรถ:{" "}
                  <span className="font-semibold text-(--rf-apple-ink)">
                    {formatBookingDateTime(b.pickupDate)}
                  </span>
                </Typography>
                <Typography className="apple-label-text text-(--rf-apple-muted)">
                  วันคืนรถ:{" "}
                  <span className="font-semibold text-(--rf-apple-ink)">
                    {formatBookingDateTime(b.returnDate)}
                  </span>
                </Typography>
              </Box>
            </Box>

            <Box className="flex w-full flex-col gap-2 lg:w-auto lg:items-stretch">
              <Box className="flex w-full flex-col items-stretch gap-2 lg:flex-row lg:flex-nowrap lg:justify-end">
                <Box
                  className="flex h-11 w-full items-center justify-between gap-2 rounded-full border px-4 lg:w-auto lg:flex-none lg:px-4"
                  sx={{
                    borderColor:
                      "color-mix(in srgb, var(--rf-brand-dark) 24%, transparent)",
                    backgroundColor:
                      "color-mix(in srgb, var(--rf-brand) 13%, var(--white))",
                    boxShadow:
                      "0 8px 18px color-mix(in srgb, var(--rf-brand-dark) 8%, transparent)",
                  }}
                >
                  <Typography className="apple-body-sm font-bold text-(--rf-apple-ink)">
                    ยอดรวม
                  </Typography>
                  <Typography className="text-base font-black leading-none text-(--rf-brand-dark)">
                    {formatTHB(b.totalPrice)}
                  </Typography>
                </Box>

                <StatusChip
                  s={b.status}
                  className="flex! w-full! justify-center! lg:w-auto! lg:flex-none! lg:px-6! [&_.MuiChip-label]:w-full! [&_.MuiChip-label]:text-center!"
                />
              </Box>

              <Button
                component={Link}
                href={`/my-bookings/${encodeURIComponent(b.id)}`}
                variant="outlined"
                className="w-full! rounded-full!"
              >
                ดูรายละเอียดการจองของคุณ
              </Button>

              {b.paymentHref || b.resumeHref ? (
                <Button
                  component={Link}
                  href={b.paymentHref || b.resumeHref || "/my-bookings"}
                  variant="contained"
                  className="w-full! rounded-full! font-semibold!"
                >
                  {b.paymentHref ? "ชำระเงินต่อ" : "กลับไปทำรายการต่อ"}
                </Button>
              ) : null}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

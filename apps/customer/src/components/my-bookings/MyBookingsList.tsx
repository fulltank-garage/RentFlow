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
    <Box className="space-y-4">
      {data.map((b) => (
        <Box
          key={b.id}
          className="apple-card p-4 sm:p-5"
        >
          <Box className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <Box className="min-w-0">
              <Typography className="apple-card-title truncate font-semibold text-(--rf-apple-ink)">
                {b.carName} <span className="text-(--rf-apple-muted)">•</span>{" "}
                <span className="text-(--rf-apple-muted)">{b.id}</span>
              </Typography>

              <Box className="mt-2 flex flex-col gap-2">
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

            <Box className="flex flex-col gap-2 md:items-end">
              <Box className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4! md:justify-end md:gap-2">
                <Box className="flex items-center justify-between gap-1 rounded-full bg-(--rf-apple-surface-soft) px-3 py-2">
                  <Typography className="apple-body-sm text-(--rf-apple-muted)">
                    ยอดรวม
                  </Typography>
                  <Typography className="apple-body-sm font-bold text-(--rf-apple-ink)">
                    {formatTHB(b.totalPrice)}
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  href={`/my-bookings/${encodeURIComponent(b.id)}`}
                  variant="outlined"
                  className="rounded-full! sm:min-w-[124px]"
                >
                  ดูรายละเอียด
                </Button>

                {b.resumeHref ? (
                  <Button
                    component={Link}
                    href={b.resumeHref}
                    variant="contained"
                    className="rounded-full! font-semibold! sm:min-w-[164px]"
                  >
                    กลับไปที่การจอง
                  </Button>
                ) : null}
              </Box>

              <StatusChip
                s={b.status}
                className="flex! w-full! justify-center! md:w-auto! md:min-w-[168px]! md:px-7! lg:min-w-[184px]! lg:px-8! [&_.MuiChip-label]:w-full! [&_.MuiChip-label]:text-center!"
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

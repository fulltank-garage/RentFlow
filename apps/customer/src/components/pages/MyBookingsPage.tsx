"use client";

import * as React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import MyBookingsFilters from "@/src/components/my-bookings/MyBookingsFilters";
import MyBookingsList from "@/src/components/my-bookings/MyBookingsList";
import MyBookingsPageSkeleton from "@/src/components/my-bookings/MyBookingsPageSkeleton";
import useMyBookingsPage from "@/src/hooks/my-bookings/useMyBookingsPage";

export default function MyBookingsPage() {
  const bookings = useMyBookingsPage();

  if (!bookings.ready || bookings.isCheckingAuth || !bookings.isAuthenticated) {
    return <MyBookingsPageSkeleton />;
  }

  return (
    <Box className="apple-page">
    <Container maxWidth="lg" className="apple-section">
      <Box className="apple-section-intro max-w-3xl">
        <Box className="flex flex-col gap-3">
          <Typography
            className="apple-heading apple-page-title"
          >
            การจองของฉัน
          </Typography>
          <Typography className="apple-subtitle text-lg">
            ดูสถานะการจอง ยอดรวม และรายละเอียดการรับ-คืนรถ
          </Typography>
        </Box>
      </Box>

      <Box className="apple-card mt-10 p-5">
        <MyBookingsFilters
          q={bookings.q}
          onQChange={bookings.setQ}
          status={bookings.status}
          onStatusChange={bookings.setStatus}
        />

        <Divider className="my-5! border-black/10!" />

        <MyBookingsList
          data={bookings.data}
          onReset={bookings.handleReset}
        />
      </Box>
    </Container>
    </Box>
  );
}

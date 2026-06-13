"use client";

import * as React from "react";
import { Box, Container, Divider, Skeleton, Typography } from "@mui/material";

function HeaderSkeleton() {
  return (
    <Box className="mx-auto max-w-3xl text-center">
      <Box className="flex flex-col gap-3">
        <Typography className="apple-heading">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              mx: "auto",
              width: { xs: 230, md: 360 },
              height: { xs: 56, md: 78 },
              borderRadius: "16px",
              transform: "none",
            }}
          />
        </Typography>
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            mx: "auto",
            width: { xs: "100%", sm: 420 },
            maxWidth: "100%",
            height: 26,
            borderRadius: "12px",
            transform: "none",
          }}
        />
      </Box>
    </Box>
  );
}

function FiltersSkeleton() {
  return (
    <Box className="grid gap-4 md:grid-cols-12 md:items-center">
      <Box className="md:col-span-8">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: "100%", height: 40, borderRadius: "10px" }}
        />
      </Box>

      <Box className="md:col-span-4">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: "100%", height: 40, borderRadius: "10px" }}
        />
      </Box>
    </Box>
  );
}

function BookingItemSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-4">
      <Box className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <Box className="min-w-0 flex-1 space-y-2.5">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "72%",
              height: 22,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "46%",
              height: 16,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "44%",
              height: 16,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>

        <Box className="flex flex-col gap-2 md:items-end">
          <Box className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4! md:justify-end md:gap-2">
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{ width: 168, height: 40, borderRadius: "999px" }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{ width: 132, height: 44, borderRadius: "999px" }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{ width: 176, height: 44, borderRadius: "999px" }}
            />
          </Box>

          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ width: "100%", maxWidth: 184, height: 44, borderRadius: "999px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default function MyBookingsPageSkeleton() {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <HeaderSkeleton />

        <Box className="apple-card apple-card-no-hover mt-10 p-5">
          <FiltersSkeleton />

          <Divider className="my-5! border-black/10!" />

          <Box className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <BookingItemSkeleton key={`my-booking-skeleton-${index}`} />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

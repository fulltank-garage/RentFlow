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
    <Box className="apple-card apple-card-no-hover p-4 sm:p-5">
      <Box className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <Box className="min-w-0 flex-1">
          <Box className="min-w-0 lg:flex lg:items-baseline lg:gap-2">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 124,
                height: 24,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                mt: { xs: 0.25, lg: 0 },
                width: { xs: "72%", sm: "64%", md: "72%", lg: 245 },
                height: 28,
                borderRadius: "8px",
                transform: "none",
              }}
            />
          </Box>

          <Box className="mt-2 flex flex-col gap-2">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: { xs: "72%", sm: "58%", md: "72%", lg: 220 },
                height: 20,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: { xs: "88%", sm: "64%", md: "88%", lg: 245 },
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: { xs: "88%", sm: "64%", md: "88%", lg: 245 },
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
          </Box>
        </Box>

        <Box className="flex w-full flex-col gap-2 lg:w-auto lg:items-stretch">
          <Box className="flex w-full flex-col items-stretch gap-2 lg:flex-row lg:flex-nowrap lg:justify-end">
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{
                width: { xs: "100%", lg: 132 },
                height: 44,
                borderRadius: "999px",
              }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{
                width: { xs: "100%", lg: 118 },
                height: 44,
                borderRadius: "999px",
              }}
            />
          </Box>

          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ width: "100%", height: 44, borderRadius: "999px" }}
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

          <Box className="grid gap-4 md:grid-cols-2 lg:block lg:space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <BookingItemSkeleton key={`my-booking-skeleton-${index}`} />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

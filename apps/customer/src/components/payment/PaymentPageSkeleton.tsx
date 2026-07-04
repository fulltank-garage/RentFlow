"use client";

import * as React from "react";
import { Box, Container, Skeleton } from "@mui/material";
import BookingFlowScreen from "@/src/components/booking/BookingFlowScreen";
import BookingFlowStepsSkeleton from "@/src/components/booking/BookingFlowStepsSkeleton";

const textSkeletonSx = {
  borderRadius: "8px",
  transform: "none",
};

function LineSkeleton({
  width,
  height = 18,
}: {
  width: number | string | Record<string, number | string>;
  height?: number | Record<string, number | string>;
}) {
  return (
    <Skeleton
      variant="text"
      animation="wave"
      sx={{ width, height, ...textSkeletonSx }}
    />
  );
}

function HeaderSkeleton() {
  return (
    <>
      <BookingFlowStepsSkeleton className="mb-8" mode="payment" />

      <Box className="apple-section-intro max-w-3xl">
        <Box className="flex w-full flex-col items-center gap-4">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: { xs: 168, sm: 188, md: 218 },
              height: { xs: 48, sm: 54, md: 62 },
              borderRadius: "16px",
              transform: "none",
            }}
          />
          <LineSkeleton
            width={{ xs: "100%", sm: 640, md: 720 }}
            height={{ xs: 25, md: 28 }}
          />
        </Box>
      </Box>
    </>
  );
}

function BookingLocationRowsSkeleton() {
  return (
    <Box className="mt-3 rounded-[18px] bg-white p-3">
      <Box className="grid gap-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <React.Fragment key={`payment-location-skeleton-${index}`}>
            {index > 0 ? <Box className="h-px bg-black/10" /> : null}
            <Box className="flex items-start justify-between gap-3">
              <LineSkeleton width={58} />
              <Box className="flex min-w-0 flex-col items-end gap-1">
                <LineSkeleton width={{ xs: 128, sm: 148 }} />
                <LineSkeleton width={{ xs: 134, sm: 168 }} height={16} />
              </Box>
            </Box>
          </React.Fragment>
        ))}

        <Box className="flex items-center justify-between pt-1">
          <LineSkeleton width={54} height={16} />
          <LineSkeleton width={42} height={16} />
        </Box>
      </Box>
    </Box>
  );
}

function SummaryCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover order-1 p-4 sm:p-5 md:p-6 lg:col-span-5">
      <LineSkeleton width={126} height={24} />
      <Box className="mt-1 grid gap-1">
        <LineSkeleton width="92%" height={18} />
        <LineSkeleton width="66%" height={18} />
      </Box>

      <Box className="mt-4 rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
        <Box className="flex items-center justify-between gap-3">
          <LineSkeleton width={84} />
          <LineSkeleton width={{ xs: 130, sm: 170 }} height={24} />
        </Box>

        <BookingLocationRowsSkeleton />

        <Box className="mt-3 grid gap-2.5">
          {Array.from({ length: 2 }).map((_, index) => (
            <Box
              key={`payment-price-row-skeleton-${index}`}
              className="flex items-center justify-between gap-3"
            >
              <LineSkeleton width={index === 0 ? 110 : 88} />
              <LineSkeleton width={index === 0 ? 82 : 96} />
            </Box>
          ))}

          <Box className="mt-1 flex items-center justify-between gap-3">
            <LineSkeleton width={82} height={20} />
            <LineSkeleton width={112} height={28} />
          </Box>
        </Box>
      </Box>

      <Box className="my-5 h-px bg-black/10" />

      <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: "100%",
            aspectRatio: "4 / 3",
            borderRadius: "18px",
          }}
        />

        <Box className="mt-3 grid gap-2">
          <LineSkeleton width="70%" height={24} />
          <LineSkeleton width="92%" height={18} />
        </Box>
      </Box>
    </Box>
  );
}

function InstructionCardSkeleton() {
  return (
    <Box
      className="apple-card apple-card-no-hover rounded-[26px] border p-4 md:p-5"
      sx={{
        borderColor:
          "color-mix(in srgb, var(--rf-brand) 32%, var(--rf-apple-border))",
        backgroundColor:
          "color-mix(in srgb, var(--rf-brand) 7%, var(--white))",
      }}
    >
      <LineSkeleton width={{ xs: 190, sm: 230 }} height={24} />
      <Box className="mt-3 grid gap-2">
        <LineSkeleton width="100%" height={20} />
        <LineSkeleton width="92%" height={20} />
        <LineSkeleton width={{ xs: "74%", sm: "60%" }} height={20} />
      </Box>
    </Box>
  );
}

function CustomerFormSkeleton() {
  return (
    <>
      <LineSkeleton width={150} height={24} />
      <Box className="mt-1 grid gap-1">
        <LineSkeleton width="94%" height={18} />
        <LineSkeleton width={{ xs: "72%", sm: "52%" }} height={18} />
      </Box>

      <Box className="mt-4 grid gap-4 sm:grid-cols-2">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ height: 56, borderRadius: "18px" }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ height: 56, borderRadius: "18px" }}
        />
      </Box>
    </>
  );
}

function PaymentDestinationSkeleton() {
  return (
    <Box className="mt-5 rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
      <Box className="grid gap-4">
        <Box className="grid gap-4 rounded-[18px] bg-white p-4 md:grid-cols-[minmax(0,1fr)_168px] md:items-center">
          <Box className="grid gap-3">
            <Box className="rounded-[18px] bg-(--rf-apple-surface-soft) p-4">
              <LineSkeleton width={112} height={16} />
              <Box className="mt-1">
                <LineSkeleton width={150} height={32} />
              </Box>
            </Box>

            <Box className="grid gap-2">
              <LineSkeleton width="86%" height={18} />
              <LineSkeleton width="72%" height={18} />
              <LineSkeleton width="68%" height={18} />
            </Box>
          </Box>

          <Box className="relative mx-auto grid h-40 w-40 place-items-center overflow-hidden rounded-[18px] bg-white p-2 md:mx-0">
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "14px",
              }}
            />
          </Box>
        </Box>

        <Box className="grid gap-3 rounded-[18px] bg-white p-4">
          <LineSkeleton width={190} height={24} />
          <Box className="grid gap-3 rounded-[16px] bg-(--rf-apple-surface-soft) p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Box
                key={`payment-bank-row-skeleton-${index}`}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <LineSkeleton width={index === 0 ? 64 : 78} height={16} />
                <Box className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <LineSkeleton width={index === 2 ? 150 : 128} height={18} />
                  {index === 2 ? (
                    <Skeleton
                      variant="rounded"
                      animation="wave"
                      sx={{ width: 92, height: 32, borderRadius: "999px" }}
                    />
                  ) : null}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="grid gap-3 rounded-[18px] bg-white p-4">
          <LineSkeleton width={160} height={24} />
          <LineSkeleton width="92%" height={18} />
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              width: { xs: "100%", sm: 178 },
              height: 40,
              borderRadius: "999px",
            }}
          />
          <LineSkeleton width={{ xs: "80%", sm: 250 }} height={16} />
        </Box>
      </Box>
    </Box>
  );
}

function PaymentMethodSkeleton() {
  return (
    <>
      <LineSkeleton width={{ xs: 220, sm: 285 }} height={24} />
      <Box className="mt-1 grid gap-1">
        <LineSkeleton width="100%" height={18} />
        <LineSkeleton width={{ xs: "74%", sm: "62%" }} height={18} />
      </Box>
      <PaymentDestinationSkeleton />
    </>
  );
}

function PaymentFormSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover order-2 p-5 md:p-6 lg:col-span-7">
      <InstructionCardSkeleton />

      <Box className="my-6 h-px bg-black/10" />

      <CustomerFormSkeleton />

      <Box className="my-6 h-px bg-black/10" />

      <PaymentMethodSkeleton />

      <Box className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            width: { xs: "100%", sm: 220 },
            height: 44,
            borderRadius: "999px",
          }}
        />
      </Box>
    </Box>
  );
}

export default function PaymentPageSkeleton() {
  return (
    <Box className="apple-page">
      <BookingFlowScreen>
        <Container maxWidth="lg" className="apple-section">
          <HeaderSkeleton />

          <Box className="mt-10 grid gap-5 lg:grid-cols-12 lg:gap-6">
            <SummaryCardSkeleton />
            <PaymentFormSkeleton />
          </Box>
        </Container>
      </BookingFlowScreen>
    </Box>
  );
}

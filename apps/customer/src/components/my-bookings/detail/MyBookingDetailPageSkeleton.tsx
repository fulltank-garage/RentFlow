"use client";

import { Box, Container, Divider, Skeleton } from "@mui/material";

function TextSkeleton({
  width,
  height = 18,
}: {
  width: number | string | Record<string, number | string>;
  height?: number;
}) {
  return (
    <Skeleton
      variant="text"
      animation="wave"
      sx={{
        width,
        height,
        borderRadius: "10px",
        transform: "none",
      }}
    />
  );
}

function PillSkeleton({ width = 120 }: { width?: number }) {
  return (
    <Skeleton
      variant="rounded"
      animation="wave"
      sx={{ width, height: 36, borderRadius: "999px" }}
    />
  );
}

function ActionButtonSkeleton({
  variant = "outlined",
}: {
  variant?: "contained" | "outlined";
}) {
  return (
    <Skeleton
      variant="rounded"
      animation="wave"
      sx={{
        width: "100%",
        height: 44,
        borderRadius: "999px",
        bgcolor:
          variant === "contained"
            ? "var(--rf-apple-ink)"
            : "rgba(15, 23, 42, 0.08)",
      }}
    />
  );
}

function InfoTileSkeleton() {
  return (
    <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
      <TextSkeleton width={86} height={16} />
      <TextSkeleton width="78%" height={20} />
      <TextSkeleton width="58%" height={16} />
    </Box>
  );
}

function PageHeaderSkeleton() {
  return (
    <Box className="apple-section-intro mx-auto max-w-3xl text-center">
      <Box className="flex flex-col items-center gap-4">
        <TextSkeleton width={{ xs: 260, md: 420 }} height={72} />
        <TextSkeleton width={{ xs: "92%", sm: 560 }} height={26} />
      </Box>
    </Box>
  );
}

function BookingOverviewSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover overflow-hidden p-0">
      <Box className="bg-(--rf-apple-surface-soft) p-5 md:p-6">
        <Box className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Box className="min-w-0 flex-1">
            <TextSkeleton width={130} height={20} />
            <TextSkeleton width={{ xs: "78%", sm: 300 }} height={34} />
          </Box>
          <Box className="shrink-0">
            <PillSkeleton width={112} />
          </Box>
        </Box>
      </Box>

      <Box className="p-5 md:p-6">
        <Box className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoTileSkeleton />
          <InfoTileSkeleton />
        </Box>

        <Divider className="my-5! border-black/10!" />

        <Box className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoTileSkeleton />
          <InfoTileSkeleton />
        </Box>
      </Box>
    </Box>
  );
}

function CustomerCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5 md:p-6">
      <TextSkeleton width={130} height={24} />
      <Box className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoTileSkeleton />
        <InfoTileSkeleton />
      </Box>
    </Box>
  );
}

function PaymentCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover overflow-hidden p-0">
      <Box className="bg-(--rf-brand-dark) p-5 md:p-6">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 132,
            height: 16,
            borderRadius: "10px",
            transform: "none",
            bgcolor: "rgba(255,255,255,0.22)",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            mt: 0.5,
            width: 190,
            height: 42,
            borderRadius: "14px",
            transform: "none",
            bgcolor: "rgba(255,255,255,0.24)",
          }}
        />
      </Box>

      <Box className="p-5 md:p-6">
        <TextSkeleton width={120} height={24} />
        <Box className="mt-4 rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
          <Box className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Box
                key={`payment-row-skeleton-${index}`}
                className="flex items-center justify-between gap-3"
              >
                <TextSkeleton width={86} height={18} />
                <TextSkeleton width={92} height={18} />
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="mt-4 grid gap-2">
          <ActionButtonSkeleton variant="contained" />
          <ActionButtonSkeleton />
        </Box>
      </Box>
    </Box>
  );
}

function PrepCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5 md:p-6">
      <TextSkeleton width={140} height={24} />
      <Box className="mt-4 grid gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={`prep-row-skeleton-${index}`}
            className="rounded-[18px] bg-(--rf-apple-surface-soft) px-4 py-3"
          >
            <TextSkeleton width={index === 2 ? "82%" : "94%"} height={18} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function MyBookingDetailPageSkeleton() {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <PageHeaderSkeleton />

        <Box className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Box className="space-y-5">
            <BookingOverviewSkeleton />
            <CustomerCardSkeleton />
          </Box>

          <Box className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <PaymentCardSkeleton />
            <PrepCardSkeleton />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

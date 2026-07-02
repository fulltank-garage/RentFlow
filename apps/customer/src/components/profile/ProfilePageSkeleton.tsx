"use client";

import * as React from "react";
import { Box, Container, Skeleton } from "@mui/material";

function HeadingSkeleton() {
  return (
    <Box className="apple-section-intro mb-10 max-w-3xl md:mb-12">
      <Box className="flex flex-col gap-3">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            mx: "auto",
            width: { xs: 220, md: 320 },
            height: { xs: 56, md: 78 },
            borderRadius: "16px",
            transform: "none",
          }}
        />

      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          mx: "auto",
          mt: 1.5,
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

function FieldSkeleton() {
  return (
    <Box className="rounded-[22px] bg-[var(--rf-apple-surface-soft)] px-4 py-4 md:px-5 md:py-4.5">
      <Box className="space-y-2.5">
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 92,
          height: 18,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: "72%",
          height: 28,
          borderRadius: "10px",
          transform: "none",
        }}
      />
      </Box>
    </Box>
  );
}

function AvatarFieldSkeleton() {
  return (
    <Box className="rounded-[22px] bg-[var(--rf-apple-surface-soft)] px-4 py-4 md:px-5">
      <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Box className="flex min-w-0 items-center gap-4">
          <Skeleton
            variant="circular"
            animation="wave"
            sx={{ width: 64, height: 64, flexShrink: 0 }}
          />

          <Box className="min-w-0 flex-1 space-y-2.5">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 92,
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 160,
                maxWidth: "100%",
                height: 28,
                borderRadius: "10px",
                transform: "none",
              }}
            />
          </Box>
        </Box>

        <Box className="flex flex-wrap gap-2">
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ width: 92, height: 40, borderRadius: "999px" }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ width: 76, height: 40, borderRadius: "999px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}

function SectionSkeleton({
  titleWidth,
  columns = "md:grid-cols-2",
  fields = 4,
  showAvatar = false,
  showDescription = false,
  showAction = false,
}: {
  titleWidth: number;
  columns?: string;
  fields?: number;
  showAvatar?: boolean;
  showDescription?: boolean;
  showAction?: boolean;
}) {
  return (
    <Box className="apple-card p-5! md:p-6!">
      <Box className="mb-5">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: titleWidth,
            height: 28,
            borderRadius: "10px",
            transform: "none",
          }}
        />
        {showDescription ? (
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              mt: 1,
              width: 260,
              maxWidth: "100%",
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        ) : null}
      </Box>

      <Box className={`grid gap-3 ${columns}`}>
        {showAvatar ? (
          <Box>
            <AvatarFieldSkeleton />
          </Box>
        ) : null}
        {Array.from({ length: fields }).map((_, index) => (
          <FieldSkeleton key={`profile-field-skeleton-${titleWidth}-${index}`} />
        ))}
      </Box>

      {showAction ? (
        <Box className="mt-4 flex justify-end">
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ width: 170, height: 44, borderRadius: "999px" }}
          />
        </Box>
      ) : null}
    </Box>
  );
}

function ActionCardSkeleton() {
  return (
    <Box className="apple-card p-5 md:p-6">
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 132,
          height: 28,
          borderRadius: "10px",
          transform: "none",
        }}
      />

      <Box className="mt-5 grid gap-3">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: "100%", height: 44, borderRadius: "999px" }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: "100%", height: 44, borderRadius: "999px" }}
        />
      </Box>

      <Box className="my-4 h-px bg-black/10" />

      <Box className="space-y-3 pt-1">
        <Box className="flex items-center justify-between">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 54,
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 72,
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>
      </Box>

      <Box className="my-4 h-px bg-black/10" />

      <Box className="pt-1">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: "100%", height: 44, borderRadius: "999px" }}
        />
      </Box>
    </Box>
  );
}

export default function ProfilePageSkeleton() {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <HeadingSkeleton />

        <Box className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
          <Box className="grid gap-5">
            <SectionSkeleton
              titleWidth={118}
              columns="grid-cols-1"
              fields={3}
              showAvatar
            />
            <SectionSkeleton
              titleWidth={102}
              columns="grid-cols-1"
              fields={3}
              showDescription
              showAction
            />
          </Box>

          <Box className="order-first space-y-5 lg:order-none">
            <ActionCardSkeleton />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

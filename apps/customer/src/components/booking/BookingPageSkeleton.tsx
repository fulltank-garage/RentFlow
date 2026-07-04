"use client";

import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Skeleton,
} from "@mui/material";
import BookingFlowStepsSkeleton from "@/src/components/booking/BookingFlowStepsSkeleton";

type BookingSkeletonMode = "payment" | "chat";

function HeaderSkeleton({ mode }: { mode?: BookingSkeletonMode | null }) {
  return (
    <>
      {mode ? <BookingFlowStepsSkeleton mode={mode} className="mb-8" /> : null}

      <Box className="mx-auto max-w-3xl text-center">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            mx: "auto",
            width: { xs: 180, md: 260 },
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
            width: { xs: "100%", sm: 360 },
            maxWidth: "100%",
            height: 28,
            borderRadius: "12px",
            transform: "none",
          }}
        />
      </Box>
    </>
  );
}

function SummaryTopSkeleton() {
  return (
    <Box className="space-y-2.5">
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 96,
          height: 22,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 230,
          maxWidth: "100%",
          height: 18,
          borderRadius: "8px",
          transform: "none",
        }}
      />
    </Box>
  );
}

function SummaryImageSkeleton() {
  return (
    <Box className="relative aspect-4/3 overflow-hidden rounded-[18px] bg-white">
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 0,
        }}
      />
    </Box>
  );
}

function SummaryRowSkeleton({
  leftWidth,
  rightWidth,
  twoLines = false,
}: {
  leftWidth: number | string;
  rightWidth: number | string;
  twoLines?: boolean;
}) {
  return (
    <Box className="flex items-start justify-between gap-3">
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: leftWidth,
          height: 18,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Box className="flex flex-col items-end gap-2">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: rightWidth,
            height: 18,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        {twoLines ? (
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width:
                typeof rightWidth === "number" ? Math.max(rightWidth - 22, 56) : rightWidth,
              height: 16,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
}

function SummarySkeleton() {
  return (
    <Card
      elevation={0}
      sx={{ boxShadow: "none" }}
      className="apple-card apple-card-no-hover order-3 self-start sm:order-0 lg:sticky lg:top-16 lg:col-span-5 lg:h-[calc(100svh-88px)]"
    >
      <CardContent className="p-4! sm:p-5! lg:flex lg:h-full lg:flex-col">
        <SummaryTopSkeleton />

        <Divider className="my-5! border-black/10!" />

        <Box className="rounded-[18px]! bg-(--rf-apple-surface-soft) p-4! sm:p-5! lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
          <SummaryImageSkeleton />

          <Box className="mt-4 space-y-2.5">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: "68%",
                height: 24,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: "92%",
                height: 16,
                borderRadius: "8px",
                transform: "none",
              }}
            />
          </Box>

          <Box className="mt-5 space-y-2">
            <SummaryRowSkeleton leftWidth={60} rightWidth={96} />
            <SummaryRowSkeleton leftWidth={44} rightWidth={122} twoLines />
            <SummaryRowSkeleton leftWidth={44} rightWidth={122} twoLines />
            <SummaryRowSkeleton leftWidth={56} rightWidth={58} />
            <SummaryRowSkeleton leftWidth={110} rightWidth={72} />
            <SummaryRowSkeleton leftWidth={92} rightWidth={84} />
            <SummaryRowSkeleton leftWidth={52} rightWidth={104} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function MobileCarCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{ boxShadow: "none" }}
      className="apple-card apple-card-no-hover order-1 sm:hidden"
    >
      <CardContent className="p-4!">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 132,
            height: 24,
            borderRadius: "8px",
            transform: "none",
          }}
        />

        <Divider className="my-4! border-black/10!" />

        <SummaryImageSkeleton />

        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            mt: 3,
            width: "68%",
            height: 24,
            borderRadius: "8px",
            transform: "none",
          }}
        />
      </CardContent>
    </Card>
  );
}

function InputSkeleton({ height = 40 }: { height?: number }) {
  return (
    <Skeleton
      variant="rounded"
      animation="wave"
      sx={{
        width: "100%",
        height,
        borderRadius: "18px",
      }}
    />
  );
}

function CheckboxRowSkeleton() {
  return (
    <Box className="flex items-start gap-3 py-1.5">
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{
          width: 22,
          height: 22,
          borderRadius: "6px",
          mt: "2px",
          flexShrink: 0,
        }}
      />

      <Box className="flex w-full items-start justify-between gap-3">
        <Box className="min-w-0 flex-1 space-y-2">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "54%",
              height: 20,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "70%",
              height: 16,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>

        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 86,
            height: 20,
            borderRadius: "8px",
            transform: "none",
            flexShrink: 0,
          }}
        />
      </Box>
    </Box>
  );
}

function ChatSuggestSkeleton() {
  return (
    <Box
      className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
      sx={{
        backgroundImage:
          "radial-gradient(520px 160px at 18% 0%, rgba(251,191,36,0.22), transparent 60%)",
      }}
    >
      <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Box className="min-w-0 flex-1 space-y-2.5">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 220,
              height: 20,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: { xs: "100%", sm: 290 },
              maxWidth: "100%",
              height: 16,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 224,
              height: 14,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>

        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            width: { xs: "100%", sm: 220 },
            height: 44,
            borderRadius: "14px",
            flexShrink: 0,
          }}
        />
      </Box>
    </Box>
  );
}

function FormSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{ boxShadow: "none" }}
      className="apple-card apple-card-no-hover order-2 sm:order-0 lg:col-span-7"
    >
      <CardContent className="p-4!">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 120,
            height: 24,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            mt: 1,
            width: 290,
            maxWidth: "100%",
            height: 18,
            borderRadius: "8px",
            transform: "none",
          }}
        />

        <Divider className="my-5! border-black/10!" />

        <Box className="grid gap-4">
          <Box className="grid gap-4 sm:grid-cols-2">
            <InputSkeleton />
            <InputSkeleton />
          </Box>

          <Box>
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 96,
                height: 20,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                mt: 1,
                width: 320,
                maxWidth: "100%",
                height: 16,
                borderRadius: "8px",
                transform: "none",
              }}
            />

            <Box className="mt-4 grid gap-4 sm:grid-cols-2">
              <Box className="grid gap-3">
                <InputSkeleton />
                <InputSkeleton />
              </Box>
              <Box className="grid gap-3">
                <InputSkeleton />
                <InputSkeleton />
              </Box>
            </Box>
          </Box>

          <Box className="grid gap-4 sm:grid-cols-2">
            <InputSkeleton />
            <InputSkeleton />
            <InputSkeleton />
            <InputSkeleton />
          </Box>

          <Divider className="border-slate-200!" />

          <Box>
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 90,
                height: 20,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                mt: 1,
                width: 360,
                maxWidth: "100%",
                height: 16,
                borderRadius: "8px",
                transform: "none",
              }}
            />

            <Box className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Box className="space-y-2.5">
                <CheckboxRowSkeleton />
                <CheckboxRowSkeleton />
                <CheckboxRowSkeleton />
              </Box>

              <Divider className="my-4! border-slate-200!" />

              <Box className="flex items-center justify-between">
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 164,
                    height: 18,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 64,
                    height: 18,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
              </Box>
            </Box>
          </Box>

          <ChatSuggestSkeleton />

          <Box className="mt-6 space-y-4">
            <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{
                  width: 240,
                  maxWidth: "100%",
                  height: 48,
                  borderRadius: "14px",
                }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 220,
                  height: 16,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function BookingPageSkeleton({
  mode,
}: {
  mode?: BookingSkeletonMode | null;
}) {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <HeaderSkeleton mode={mode} />

        <Box className="mt-10 grid gap-5 lg:grid-cols-12 lg:items-start lg:gap-6">
          <MobileCarCardSkeleton />
          <SummarySkeleton />
          <FormSkeleton />
        </Box>
      </Container>
    </Box>
  );
}

"use client";

import { Box, Container, Skeleton } from "@mui/material";
import BookingFlowStepsSkeleton from "@/src/components/booking/BookingFlowStepsSkeleton";

type BookingSuccessPageSkeletonProps = {
  mode?: "payment" | "chat";
};

export default function BookingSuccessPageSkeleton({
  mode = "chat",
}: BookingSuccessPageSkeletonProps) {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <BookingFlowStepsSkeleton className="mb-8" mode={mode} />

        <Box className="mx-auto max-w-3xl text-center">
          <Box className="flex flex-col items-center gap-4">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
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
                width: { xs: "100%", sm: 480 },
                maxWidth: "100%",
                height: 26,
                borderRadius: "12px",
                transform: "none",
              }}
            />

            <Box className="mt-2 flex flex-wrap justify-center gap-3">
              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{ width: 190, height: 28, borderRadius: "999px" }}
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{ width: 150, height: 28, borderRadius: "999px" }}
              />
            </Box>
          </Box>
        </Box>

        <Box className="apple-card apple-card-no-hover mt-10 w-full p-5 md:p-6">
          <Box className="rounded-[26px] bg-(--rf-apple-surface-soft) p-5">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 110,
                height: 26,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Box className="mt-4 flex flex-col gap-2.5">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: "100%",
                  height: 21,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: "82%",
                  height: 21,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
            </Box>
          </Box>

          <Box className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Box
                key={`booking-success-card-skeleton-${index}`}
                className="rounded-[26px] bg-(--rf-apple-surface-soft) p-5"
              >
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 88,
                    height: 26,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
                <Box className="mt-4 flex flex-col gap-2.5">
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      width: "100%",
                      height: 21,
                      borderRadius: "8px",
                      transform: "none",
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      width: "76%",
                      height: 21,
                      borderRadius: "8px",
                      transform: "none",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Box className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{ width: 180, height: 44, borderRadius: "999px" }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{ width: 180, height: 44, borderRadius: "999px" }}
            />
          </Box>
        </Box>

        <Box className="apple-card apple-card-no-hover mt-8 w-full p-5 md:p-6">
          <Box className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <Box className="min-w-0">
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 150,
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
                    width: 280,
                    maxWidth: "100%",
                    height: 18,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
            </Box>

            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{ width: 180, height: 44, borderRadius: "999px" }}
            />
          </Box>

          <Box className="mt-6 rounded-[28px] bg-(--rf-apple-surface-soft) p-5 md:p-6">
            <Box className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <Box
                  key={`receipt-skeleton-${index}`}
                  className="rounded-[22px] bg-white px-4 py-4"
                >
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      width: 72,
                      height: 16,
                      borderRadius: "8px",
                      transform: "none",
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      mt: 1.5,
                      width: "88%",
                      height: 24,
                      borderRadius: "8px",
                      transform: "none",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

"use client";

import * as React from "react";
import { Box, Container, Skeleton } from "@mui/material";
import BookingFlowStepsSkeleton from "@/src/components/booking/BookingFlowStepsSkeleton";

function HeaderSkeleton() {
  return (
    <>
      <BookingFlowStepsSkeleton className="mb-8" />

      <Box className="mx-auto max-w-3xl text-center">
        <Box className="flex flex-col items-center gap-4">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
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
              width: { xs: "100%", sm: 460 },
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
              sx={{ width: 170, height: 28, borderRadius: "999px" }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}

function SummaryCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover order-2 p-6 lg:order-1 lg:col-span-5">
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

      <Box className="mt-4 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
        <Box className="flex items-center justify-between gap-3">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 70,
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 85,
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>

        <Box className="mt-3 rounded-[18px] bg-white p-3">
          <Box className="grid gap-3">
            <Box className="flex items-start justify-between gap-3">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 55,
                  height: 18,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
              <Box className="flex flex-col items-end gap-1">
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 120,
                    height: 18,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 95,
                    height: 16,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
              </Box>
            </Box>

            <Box className="h-px bg-black/10" />

            <Box className="flex items-start justify-between gap-3">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 55,
                  height: 18,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
              <Box className="flex flex-col items-end gap-1">
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 120,
                    height: 18,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 95,
                    height: 16,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
              </Box>
            </Box>

            <Box className="flex items-center justify-between pt-1">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 45,
                  height: 16,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 40,
                  height: 16,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box className="mt-4 flex items-center justify-between gap-3">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 95,
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 85,
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>

        <Box className="mt-3 flex items-center justify-between gap-3">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 80,
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 95,
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>

        <Box className="mt-3 rounded-[18px] bg-emerald-50 px-4 py-3">
          <Box className="flex items-center justify-between">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 90,
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 110,
                height: 24,
                borderRadius: "8px",
                transform: "none",
              }}
            />
          </Box>
        </Box>

        <Box className="mt-4 space-y-2.5">
          <Box className="h-px bg-black/10" />
          <Box className="flex items-center justify-between">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 70,
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 70,
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
          </Box>

          <Box className="space-y-2.5">
            {Array.from({ length: 2 }).map((_, i) => (
              <Box key={i} className="flex items-start justify-between gap-3">
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 120,
                    height: 16,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 65,
                    height: 16,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="mt-4 flex items-center justify-between gap-3">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 60,
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 95,
              height: 24,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>
      </Box>

      <Box className="my-5 h-px bg-black/10" />

      <Box className="rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: "100%",
            height: 180,
            borderRadius: "12px",
          }}
        />

        <Box className="mt-4 flex flex-col gap-2.5">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "68%",
              height: 20,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "90%",
              height: 16,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>

        <Box className="my-4 h-px bg-black/10" />

        <Box className="flex items-center justify-between">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 50,
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 75,
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>

        <Box className="pt-1">
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              mt: 2,
              width: "100%",
              height: 40,
              borderRadius: "12px",
            }}
          />
        </Box>
      </Box>

      <Box className="my-5 h-px bg-black/10" />

      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: "75%",
          height: 16,
          borderRadius: "8px",
          transform: "none",
        }}
      />
    </Box>
  );
}

function PaymentFormSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover order-1 p-6 lg:order-2 lg:col-span-7">
      <Box className="rounded-[26px] bg-[var(--rf-apple-surface-soft)] p-4 md:p-5">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 128,
            height: 20,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Box className="mt-3 flex flex-col gap-2.5">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "100%",
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "86%",
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>
      </Box>

      <Box className="mt-5 pb-1">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            width: "100%",
            height: 52,
            borderRadius: "12px",
          }}
        />
      </Box>

      <Box className="mt-4 flex flex-col gap-2.5">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 110,
            height: 20,
            borderRadius: "8px",
            transform: "none",
          }}
        />
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

      <Box className="mt-4">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ height: 56, borderRadius: "18px" }}
        />
      </Box>

      <Box className="my-6 h-px bg-black/10" />

      <Skeleton
        variant="text"
        animation="wave"
        sx={{ width: 95, height: 20, borderRadius: "8px", transform: "none" }}
      />

      <Box className="mt-4">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ height: 56, borderRadius: "18px" }}
        />
      </Box>

      <Box className="mt-5 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
        <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Box className="flex flex-1 flex-col gap-1.5">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 110,
                height: 20,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 150,
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
          </Box>

          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              width: 144,
              height: 144,
              borderRadius: "18px",
            }}
          />
        </Box>
      </Box>

      <Box className="mt-6 pt-1">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            width: { xs: "100%", sm: 220 },
            height: 42,
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
      <Container maxWidth="lg" className="apple-section">
        <HeaderSkeleton />

        <Box className="mt-10 grid gap-6 lg:grid-cols-12">
          <SummaryCardSkeleton />
          <PaymentFormSkeleton />
        </Box>
      </Container>
    </Box>
  );
}

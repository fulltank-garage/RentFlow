"use client";

import * as React from "react";
import { Box, Container, Skeleton } from "@mui/material";

function HeroSkeleton() {
  return (
    <Box className="lg:col-span-7">
      <Box className="apple-card apple-card-no-hover overflow-hidden">
        <Box className="aspect-[16/10] min-h-[260px]">
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
      </Box>
    </Box>
  );
}

function SummaryCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5 lg:col-span-5">
      <Box className="flex flex-col gap-2.5">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "70%",
            height: 34,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "88%",
            height: 20,
            borderRadius: "8px",
            transform: "none",
          }}
        />
      </Box>

      <Box className="mt-3">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            width: 160,
            height: 32,
            borderRadius: "999px",
          }}
        />
      </Box>

      <Box className="my-5 h-px bg-black/10" />

      <Box className="rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-5">
        <Box className="flex flex-col gap-2.5">
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
          <Box className="flex items-end gap-2">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 170,
                height: 44,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 40,
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box className="mt-5 grid gap-2">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: "100%", height: 42, borderRadius: "999px" }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: "100%", height: 42, borderRadius: "999px" }}
        />
      </Box>
    </Box>
  );
}

function OverviewSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5">
      <Box className="flex flex-col gap-2.5">
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
            width: "92%",
            height: 18,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "78%",
            height: 18,
            borderRadius: "8px",
            transform: "none",
          }}
        />
      </Box>
    </Box>
  );
}

function IncludedCardSkeleton() {
  return (
    <Box className="rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
      <Box className="flex flex-col gap-2.5">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "62%",
            height: 20,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "95%",
            height: 16,
            borderRadius: "8px",
            transform: "none",
          }}
        />
      </Box>
    </Box>
  );
}

function IncludedSectionSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5">
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

      <Box className="mt-3 grid gap-3 sm:grid-cols-2">
        <IncludedCardSkeleton />
        <IncludedCardSkeleton />
        <IncludedCardSkeleton />
        <IncludedCardSkeleton />
      </Box>
    </Box>
  );
}

function TermsSectionSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5 sm:p-6">
      <Box className="flex flex-col gap-2">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 170,
            height: 34,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "78%",
            height: 18,
            borderRadius: "8px",
            transform: "none",
          }}
        />
      </Box>

      <Box className="mt-4 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Box
            key={index}
            className="rounded-[22px] border border-black/10 bg-[var(--rf-apple-surface-soft)] p-4"
          >
            <Box className="flex items-start gap-3">
              <Skeleton
                variant="circular"
                animation="wave"
                sx={{ width: 32, height: 32, flexShrink: 0 }}
              />
              <Box className="min-w-0 flex-1">
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: "52%",
                    height: 20,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: "96%",
                    height: 18,
                    borderRadius: "8px",
                    transform: "none",
                    mt: 0.5,
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: "74%",
                    height: 18,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box className="mt-4 rounded-[22px] border border-[var(--rf-apple-border)] bg-white px-4 py-3">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 80,
            height: 20,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "92%",
            height: 18,
            borderRadius: "8px",
            transform: "none",
            mt: 0.5,
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "66%",
            height: 18,
            borderRadius: "8px",
            transform: "none",
          }}
        />
      </Box>
    </Box>
  );
}

function SpecsCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5">
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 80,
          height: 20,
          borderRadius: "8px",
          transform: "none",
        }}
      />

      <Box className="mt-3 grid gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Box key={i} className="flex items-center justify-between">
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
                width: 70,
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function CarDetailPageSkeleton() {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <Box className="apple-section-intro max-w-3xl">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "min(420px, 80vw)",
              height: { xs: 58, sm: 76, lg: 92 },
              borderRadius: "14px",
              transform: "none",
              mx: "auto",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "min(620px, 86vw)",
              height: { xs: 28, sm: 34 },
              borderRadius: "10px",
              transform: "none",
              mx: "auto",
              mt: 1.5,
            }}
          />
        </Box>

        <Box className="mt-8 grid gap-5 lg:grid-cols-12 lg:gap-6">
          <HeroSkeleton />
          <SummaryCardSkeleton />
        </Box>

        <Box className="mt-8 grid gap-6 lg:grid-cols-12">
          <Box className="space-y-6 lg:col-span-8">
            <OverviewSkeleton />
            <IncludedSectionSkeleton />
            <TermsSectionSkeleton />
          </Box>

          <Box className="space-y-6 lg:col-span-4">
            <SpecsCardSkeleton />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

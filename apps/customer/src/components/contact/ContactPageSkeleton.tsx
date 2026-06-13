"use client";

import * as React from "react";
import { Box, Container, Skeleton } from "@mui/material";

function HeaderSkeleton() {
  return (
    <Box className="mx-auto max-w-3xl text-center">
      <Box className="flex flex-col gap-3">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            mx: "auto",
            width: { xs: 170, md: 280 },
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
            width: { xs: "100%", sm: 360 },
            maxWidth: "100%",
            height: 28,
            borderRadius: "12px",
            transform: "none",
          }}
        />
      </Box>
    </Box>
  );
}

function ChipsSkeleton() {
  return (
    <Box className="mt-8 flex flex-wrap justify-center gap-3">
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{ width: 132, height: 32, borderRadius: "999px" }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{ width: 168, height: 32, borderRadius: "999px" }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{
          width: 284,
          maxWidth: "100%",
          height: 32,
          borderRadius: "999px",
        }}
      />
    </Box>
  );
}

function BranchInfoRowSkeleton() {
  return (
    <Box>
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 70,
          height: 16,
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
    </Box>
  );
}

function ContactInfoSkeleton() {
  return (
    <Box>
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 118,
          height: 22,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          mt: 1,
          width: 248,
          maxWidth: "100%",
          height: 18,
          borderRadius: "8px",
          transform: "none",
        }}
      />

      <Box className="mt-5 space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Box
            key={`contact-branch-skeleton-${index}`}
            className="rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4"
          >
            <Box className="flex flex-wrap items-start justify-between gap-3">
              <Box className="space-y-2">
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 112,
                    height: 20,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 80,
                    height: 16,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
              </Box>

              <Box className="flex flex-wrap gap-2">
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  sx={{ width: 88, height: 24, borderRadius: "999px" }}
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  sx={{ width: 110, height: 24, borderRadius: "999px" }}
                />
              </Box>
            </Box>

            <Box className="mt-4 space-y-3">
              <BranchInfoRowSkeleton />
              <BranchInfoRowSkeleton />
              <BranchInfoRowSkeleton />
            </Box>
          </Box>
        ))}
      </Box>

      <Box className="mt-5 rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 26,
            height: 16,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Box className="mt-2.5 space-y-2.5">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "100%",
              height: 16,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "84%",
              height: 16,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

function ContactPreparationSkeleton() {
  return (
    <Box>
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 164,
          height: 22,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          mt: 1,
          width: 308,
          maxWidth: "100%",
          height: 18,
          borderRadius: "8px",
          transform: "none",
        }}
      />

      <Box className="mt-5 space-y-4">
        <Box className="rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 118,
              height: 20,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Box className="mt-3 space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`contact-prepare-line-${index}`}
                variant="text"
                animation="wave"
                sx={{
                  width: index === 3 ? "76%" : "100%",
                  height: 18,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
            ))}
          </Box>
        </Box>

        <Box className="rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 108,
              height: 20,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Box className="mt-3 space-y-2.5">
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
                width: "78%",
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
          </Box>

          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              mt: 4,
              width: 172,
              height: 40,
              borderRadius: "999px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default function ContactPageSkeleton() {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <HeaderSkeleton />
        <ChipsSkeleton />

        <Box className="mt-10 grid gap-5 lg:grid-cols-12">
          <Box className="lg:col-span-5">
            <ContactInfoSkeleton />
          </Box>

          <Box className="lg:col-span-7">
            <ContactPreparationSkeleton />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

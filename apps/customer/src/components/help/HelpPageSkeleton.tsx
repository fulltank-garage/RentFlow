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
            width: { xs: 220, md: 360 },
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
            width: { xs: "100%", sm: 620 },
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
        sx={{ width: 158, height: 32, borderRadius: "999px" }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{ width: 164, height: 32, borderRadius: "999px" }}
      />
    </Box>
  );
}

function StepCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5">
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: "56%",
          height: 22,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Box className="mt-3 space-y-2.5">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "96%",
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
            height: 18,
            borderRadius: "8px",
            transform: "none",
          }}
        />
      </Box>
    </Box>
  );
}

function BranchInfoRowSkeleton() {
  return (
    <Box className="grid gap-2">
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
          width: "90%",
          height: 18,
          borderRadius: "8px",
          transform: "none",
        }}
      />
    </Box>
  );
}

function DirectoryCardSkeleton() {
  return (
    <Box>
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 146,
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
          width: 260,
          maxWidth: "100%",
          height: 18,
          borderRadius: "8px",
          transform: "none",
        }}
      />

      <Box className="mt-5 space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Box
            key={`help-branch-skeleton-${index}`}
            className="rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4"
          >
            <Box className="flex flex-wrap items-start justify-between gap-3">
              <Box className="space-y-2">
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
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 82,
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
                  sx={{ width: 86, height: 24, borderRadius: "999px" }}
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  sx={{ width: 104, height: 24, borderRadius: "999px" }}
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
            width: 28,
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

function CtaSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover mt-10 p-5">
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 168,
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
          width: 320,
          maxWidth: "100%",
          height: 18,
          borderRadius: "8px",
          transform: "none",
        }}
      />

      <Box className="mt-4 flex flex-wrap gap-2">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: 118, height: 38, borderRadius: "999px" }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: 104, height: 38, borderRadius: "999px" }}
        />
      </Box>
    </Box>
  );
}

export default function HelpPageSkeleton() {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <HeaderSkeleton />
        <ChipsSkeleton />

        <Box className="apple-shelf mt-6 md:grid md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <StepCardSkeleton key={`help-step-skeleton-${index}`} />
          ))}
        </Box>

        <Box className="mt-6">
          <DirectoryCardSkeleton />
        </Box>

        <CtaSkeleton />
      </Container>
    </Box>
  );
}

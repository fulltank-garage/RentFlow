"use client";

import * as React from "react";
import { Box, Container, Skeleton } from "@mui/material";

function HeaderSkeleton() {
  return (
    <Box className="apple-section-intro max-w-3xl">
      <Box className="flex flex-col gap-3">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            mx: "auto",
            width: { xs: 150, md: 205 },
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

function SectionHeadingSkeleton({
  titleWidth,
  descriptionWidth,
}: {
  titleWidth: number;
  descriptionWidth: number;
}) {
  return (
    <>
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: titleWidth,
          maxWidth: "100%",
          height: 26,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          mt: 1,
          width: descriptionWidth,
          maxWidth: "100%",
          height: 20,
          borderRadius: "8px",
          transform: "none",
        }}
      />
    </>
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
      <SectionHeadingSkeleton titleWidth={132} descriptionWidth={370} />

      <Box className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={`contact-branch-skeleton-${index}`}
            className="apple-card relative flex h-full flex-col rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4"
          >
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 1,
                width: 86,
                height: 24,
                borderRadius: "999px",
              }}
            />

            <Box className="flex items-start">
              <Box className="min-w-0 pr-32">
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: index === 0 ? 180 : index === 1 ? 152 : 136,
                    maxWidth: "100%",
                    height: 28,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    mt: 0.5,
                    width: 118,
                    height: 16,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
              </Box>
            </Box>

            <Box className="mt-4 flex flex-1 flex-col gap-3 border-t border-[var(--rf-apple-border)] pt-4">
              <BranchInfoRowSkeleton />
              <BranchInfoRowSkeleton />
              <BranchInfoRowSkeleton />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function ContactPreparationSkeleton() {
  return (
    <Box>
      <SectionHeadingSkeleton titleWidth={214} descriptionWidth={620} />

      <Box className="mt-5 space-y-4">
        <Box className="apple-card rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 148,
              height: 26,
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

        <Box className="apple-card rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 188,
              height: 26,
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

        <Box className="mt-10 space-y-8">
          <ContactPreparationSkeleton />
          <ContactInfoSkeleton />
        </Box>
      </Container>
    </Box>
  );
}

"use client";

import * as React from "react";
import { Box, Container, Skeleton } from "@mui/material";

function SectionHeadingSkeleton({
  titleWidth,
  descWidth,
}: {
  titleWidth: number | string;
  descWidth: number | string;
}) {
  return (
    <Box className="flex flex-col gap-2.5">
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: titleWidth,
          height: 28,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: descWidth,
          maxWidth: "100%",
          height: 20,
          borderRadius: "8px",
          transform: "none",
        }}
      />
    </Box>
  );
}

function HeaderSkeleton() {
  return (
    <Box className="mx-auto max-w-3xl text-center">
      <Box className="flex flex-col gap-3">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            mx: "auto",
            width: { xs: 250, md: 420 },
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

function HeroBadgesSkeleton() {
  return (
    <Box
      className="mt-8 flex flex-nowrap justify-center gap-1.5 overflow-hidden sm:gap-2"
      sx={{
        "& .MuiSkeleton-root": {
          flex: "0 1 auto",
          minWidth: 0,
        },
      }}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton
          key={`feature-badge-skeleton-${index}`}
          variant="rounded"
          animation="wave"
          sx={{
            width: {
              xs: [64, 70, 68, 74, 64][index] ?? 68,
              sm: [96, 112, 96, 108, 92][index] ?? 96,
            },
            height: 32,
            borderRadius: "999px",
          }}
        />
      ))}
    </Box>
  );
}

function FeatureCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5">
      <Box className="min-w-0 space-y-2.5">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "52%",
              height: 24,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "96%",
              height: 20,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "74%",
              height: 20,
              borderRadius: "8px",
              transform: "none",
            }}
          />
      </Box>
    </Box>
  );
}

function StepCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5">
      <Box className="flex items-start gap-3">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            width: 36,
            height: 36,
            borderRadius: "999px",
            flexShrink: 0,
          }}
        />

        <Box className="min-w-0 flex-1 space-y-2.5">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "44%",
              height: 22,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "94%",
              height: 20,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "72%",
              height: 20,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

function TrustCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5">
      <Box className="space-y-2.5">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "58%",
            height: 24,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "95%",
            height: 20,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "76%",
            height: 20,
            borderRadius: "8px",
            transform: "none",
          }}
        />
      </Box>
    </Box>
  );
}

function CTASectionSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover mt-10 p-5">
      <Box className="space-y-2.5">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 112,
            height: 22,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 360,
            maxWidth: "100%",
            height: 20,
            borderRadius: "8px",
            transform: "none",
          }}
        />
      </Box>

      <Box className="mt-4 flex flex-wrap gap-2">
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: 128, height: 38, borderRadius: "999px" }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: 114, height: 38, borderRadius: "999px" }}
        />
      </Box>
    </Box>
  );
}

function SkeletonHorizontalHintShelf({
  children,
  itemCount,
}: {
  children: React.ReactNode;
  itemCount: number;
}) {
  return (
    <Box className="relative">
      <Box
        className="apple-shelf apple-shelf-wide mt-4 md:grid md:grid-cols-2"
        sx={{
          "@media (max-width: 767px)": {
            paddingRight: "18vw",
            "& > *": {
              flexBasis: "min(78vw, 21rem)",
            },
          },
        }}
      >
        {children}
      </Box>

      {itemCount > 1 ? (
        <Box aria-hidden className="mt-3 flex justify-center gap-1.5 md:hidden">
          {Array.from({ length: itemCount }).map((_, index) => (
            <Box
              key={`feature-skeleton-scroll-dot-${index}`}
              className="h-1.5 rounded-full"
              sx={{
                width: index === 0 ? 18 : 6,
                backgroundColor:
                  index === 0
                    ? "var(--secondary-navy)"
                    : "rgba(1,18,44,0.18)",
              }}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

function FeaturesGridSkeleton() {
  return (
    <Box className="mt-8">
      <Box className="flex items-end justify-between gap-3">
        <SectionHeadingSkeleton titleWidth={168} descWidth={360} />
      </Box>

      <SkeletonHorizontalHintShelf itemCount={6}>
        {Array.from({ length: 6 }).map((_, index) => (
          <FeatureCardSkeleton key={`feature-card-skeleton-${index}`} />
        ))}
      </SkeletonHorizontalHintShelf>
    </Box>
  );
}

function StepsSectionSkeleton() {
  return (
    <Box className="mt-10">
      <SectionHeadingSkeleton titleWidth={138} descWidth={420} />

      <SkeletonHorizontalHintShelf itemCount={4}>
        {Array.from({ length: 4 }).map((_, index) => (
          <StepCardSkeleton key={`feature-step-skeleton-${index}`} />
        ))}
      </SkeletonHorizontalHintShelf>
    </Box>
  );
}

function TrustSectionSkeleton() {
  return (
    <Box className="mt-10">
      <SectionHeadingSkeleton titleWidth={232} descWidth={340} />

      <SkeletonHorizontalHintShelf itemCount={4}>
        {Array.from({ length: 4 }).map((_, index) => (
          <TrustCardSkeleton key={`feature-trust-skeleton-${index}`} />
        ))}
      </SkeletonHorizontalHintShelf>
    </Box>
  );
}

export default function FeaturesPageSkeleton() {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <HeaderSkeleton />
        <HeroBadgesSkeleton />
        <FeaturesGridSkeleton />
        <StepsSectionSkeleton />
        <TrustSectionSkeleton />
        <CTASectionSkeleton />
      </Container>
    </Box>
  );
}

"use client";

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
            width: { xs: 220, md: 300 },
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
        sx={{ width: 118, height: 32, borderRadius: "999px" }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{ width: 148, height: 32, borderRadius: "999px" }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{ width: 156, height: 32, borderRadius: "999px" }}
      />
    </Box>
  );
}

function GuideCardSkeleton() {
  return (
    <Box className="apple-card flex h-full flex-col p-5">
      <Skeleton
        variant="circular"
        animation="wave"
        sx={{ width: 40, height: 40, borderRadius: "999px" }}
      />
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          mt: 2,
          width: "64%",
          height: 24,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Box className="mt-3 space-y-2">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{ width: "96%", height: 18, borderRadius: "8px", transform: "none" }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{ width: "78%", height: 18, borderRadius: "8px", transform: "none" }}
        />
      </Box>
    </Box>
  );
}

function FaqCardSkeleton() {
  return (
    <Box className="apple-card p-5">
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: "70%",
          height: 24,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Box className="mt-3 space-y-2">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{ width: "100%", height: 18, borderRadius: "8px", transform: "none" }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{ width: "82%", height: 18, borderRadius: "8px", transform: "none" }}
        />
      </Box>
    </Box>
  );
}

function SectionHeaderSkeleton({
  titleWidth,
  descriptionWidth,
}: {
  titleWidth: number;
  descriptionWidth: number;
}) {
  return (
    <Box>
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: titleWidth,
          maxWidth: "100%",
          height: 34,
          borderRadius: "10px",
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
    </Box>
  );
}

function CtaSkeleton() {
  return (
    <Box className="apple-card mt-10 p-5">
      <Box className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Box className="min-w-0 flex-1">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: { xs: "82%", sm: 280 },
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
              width: { xs: "100%", sm: 620 },
              maxWidth: "100%",
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              mt: 0.75,
              width: { xs: "76%", sm: 500 },
              maxWidth: "100%",
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>

        <Box className="flex flex-wrap gap-2">
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ width: 92, height: 36, borderRadius: "999px" }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ width: 146, height: 36, borderRadius: "999px" }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ width: 104, height: 36, borderRadius: "999px" }}
          />
        </Box>
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

        <Box className="mt-10">
          <SectionHeaderSkeleton titleWidth={150} descriptionWidth={650} />
          <Box className="mt-5 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <GuideCardSkeleton key={`help-guide-skeleton-${index}`} />
            ))}
          </Box>
        </Box>

        <Box className="mt-10">
          <SectionHeaderSkeleton titleWidth={172} descriptionWidth={620} />
          <Box className="mt-5 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <FaqCardSkeleton key={`help-faq-skeleton-${index}`} />
            ))}
          </Box>
        </Box>

        <CtaSkeleton />
      </Container>
    </Box>
  );
}

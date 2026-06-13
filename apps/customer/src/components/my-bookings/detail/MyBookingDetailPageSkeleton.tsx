"use client";

import { Box, Container, Divider, Skeleton } from "@mui/material";

function HeaderSkeleton() {
  return (
    <Box className="mx-auto max-w-3xl text-center">
      <Box className="flex flex-col items-center gap-4">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: { xs: 260, md: 420 },
            maxWidth: "100%",
            height: { xs: 56, md: 78 },
            borderRadius: "16px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
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

function TopCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover mt-10 p-5! md:p-6!">
      <Box className="flex flex-col gap-5">
        <Box className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <Box className="min-w-0 flex-1 space-y-3">
            <Box className="space-y-2">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 84,
                  height: 16,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: "52%",
                  height: 34,
                  borderRadius: "10px",
                  transform: "none",
                }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: "42%",
                  height: 18,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
            </Box>

            <Box className="flex flex-wrap items-start gap-2">
              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{ width: 132, height: 44, borderRadius: "999px" }}
              />
              <Box className="grid gap-1">
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 220,
                    height: 18,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 214,
                    height: 18,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box className="flex flex-wrap items-center gap-2">
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{ width: 92, height: 36, borderRadius: "999px" }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{ width: 118, height: 36, borderRadius: "999px" }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{ width: 124, height: 36, borderRadius: "999px" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function SectionCardSkeleton({
  rows = 2,
  columns = 2,
}: {
  rows?: number;
  columns?: 2 | 3;
}) {
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
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          mt: 1,
          width: 220,
          maxWidth: "100%",
          height: 18,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Divider className="my-4! border-black/10!" />

      <Box
        className={`grid grid-cols-1 gap-4 ${
          columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {Array.from({ length: rows }).map((_, index) => (
          <Box
            key={`detail-section-row-${columns}-${index}`}
            className="space-y-2.5 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4"
          >
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 76,
                height: 16,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: "76%",
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: "58%",
                height: 16,
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

function TermsSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5">
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 95,
          height: 20,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Divider className="my-4! border-black/10!" />

      <Box className="space-y-2">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "84%",
            height: 18,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "80%",
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

function PriceCardSkeleton() {
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
      <Divider className="my-4! border-black/10!" />

      <Box className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={`detail-price-row-${index}`}
            className="flex items-center justify-between"
          >
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
                width: 84,
                height: 18,
                borderRadius: "8px",
                transform: "none",
              }}
            />
          </Box>
        ))}

        <Divider className="my-3! border-black/10!" />

        <Box className="flex items-center justify-between">
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
              width: 100,
              height: 22,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>
      </Box>

      <Box className="mt-4 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "94%",
            height: 16,
            borderRadius: "8px",
            transform: "none",
          }}
        />
      </Box>

      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{ mt: 2, width: "100%", height: 36, borderRadius: "999px" }}
      />
    </Box>
  );
}

function HelpCardSkeleton() {
  return (
    <Box className="apple-card apple-card-no-hover p-5">
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: 88,
          height: 20,
          borderRadius: "8px",
          transform: "none",
        }}
      />
      <Divider className="my-4! border-black/10!" />
      <Box className="space-y-2.5">
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
            width: "76%",
            height: 18,
            borderRadius: "8px",
            transform: "none",
          }}
        />
      </Box>

      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{ mt: 3, width: "100%", height: 36, borderRadius: "999px" }}
      />
    </Box>
  );
}

export default function MyBookingDetailPageSkeleton() {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <HeaderSkeleton />
        <TopCardSkeleton />

        <Box className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Box className="space-y-5 md:col-span-2">
            <SectionCardSkeleton rows={2} columns={2} />
            <SectionCardSkeleton rows={3} columns={3} />
            <TermsSkeleton />
          </Box>

          <Box className="space-y-5">
            <PriceCardSkeleton />
            <HelpCardSkeleton />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

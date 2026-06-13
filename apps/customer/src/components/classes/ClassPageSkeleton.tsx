"use client";

import {
  Box,
  Container,
  Card,
  CardActions,
  CardContent,
  Skeleton,
} from "@mui/material";

function HeaderSkeleton() {
  return (
    <Box className="mx-auto max-w-3xl text-center">
      <Box className="flex flex-col gap-3">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            mx: "auto",
            width: { xs: 210, md: 320 },
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
            width: { xs: 180, sm: 240 },
            maxWidth: "100%",
            height: 24,
            borderRadius: "10px",
            transform: "none",
          }}
        />
      </Box>
    </Box>
  );
}

function CarCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{ boxShadow: "none" }}
      className="apple-card apple-card-no-hover"
    >
      <Box className="relative h-52 w-full overflow-hidden bg-[var(--rf-apple-surface-soft)] sm:h-56">
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

      <CardContent className="p-5! sm:p-6!">
        <Box className="space-y-2.5">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "66%",
              height: 28,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "92%",
              height: 20,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        </Box>

        <Box className="mt-3 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
          <Box className="flex items-end gap-2">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 74,
                height: 20,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 104,
                height: 32,
                borderRadius: "8px",
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 28,
                height: 20,
                borderRadius: "8px",
                transform: "none",
              }}
            />
          </Box>
        </Box>
      </CardContent>

      <CardActions
        sx={{ p: { xs: "0px 20px 20px", sm: "0px 16px 16px" } }}
        className="flex-col gap-2 sm:flex-row"
      >
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: "100%", height: 40, borderRadius: "999px", flex: 1 }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: "100%", height: 40, borderRadius: "999px", flex: 1 }}
        />
      </CardActions>
    </Card>
  );
}

export default function ClassPageSkeleton() {
  return (
    <Box className="apple-page text-slate-900">
      <Container maxWidth="lg" className="apple-section">
        <HeaderSkeleton />

        <Box className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CarCardSkeleton key={`class-card-skeleton-${index}`} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

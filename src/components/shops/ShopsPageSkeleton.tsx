"use client";

import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Skeleton,
  Typography,
} from "@mui/material";

function HeaderSkeleton() {
  return (
    <Box className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
      <Box className="flex flex-col items-center gap-3">
        <Typography className="apple-heading">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: { xs: 210, md: 320 },
              height: { xs: 56, md: 78 },
              borderRadius: "16px",
              transform: "none",
            }}
          />
        </Typography>

        <Typography className="apple-subtitle">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: { xs: 300, sm: 560 },
              maxWidth: "100%",
              height: 28,
              borderRadius: "12px",
              transform: "none",
            }}
          />
        </Typography>
      </Box>

      <Chip
        size="small"
        variant="outlined"
        label={
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: 42,
              height: 16,
              borderRadius: "50px",
              transform: "none",
            }}
          />
        }
        className="apple-pill w-min!"
        sx={{
          "& .MuiChip-label": {
            px: 1,
            display: "flex",
            alignItems: "center",
          },
        }}
      />
    </Box>
  );
}

function ShopCardSkeleton() {
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

        <Box className="absolute bottom-4 left-4 right-4 space-y-2.5">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "58%",
              height: 32,
              borderRadius: "8px",
              transform: "none",
              bgcolor: "rgba(255,255,255,0.55)",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "46%",
              height: 18,
              borderRadius: "8px",
              transform: "none",
              bgcolor: "rgba(255,255,255,0.42)",
            }}
          />
        </Box>
      </Box>

      <CardContent className="p-4! sm:p-5!">
        <Box className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={`shop-chip-skeleton-${index}`}
              variant="rounded"
              animation="wave"
              sx={{
                width: 68,
                height: 24,
                borderRadius: "999px",
              }}
            />
          ))}
        </Box>

        <Box className="mt-4 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
          <Box className="flex items-end justify-between gap-3">
            <Box className="grid gap-1.5">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 86,
                  height: 18,
                  borderRadius: "6px",
                  transform: "none",
                }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 58,
                  height: 24,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
            </Box>
            <Box className="grid gap-1.5">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 58,
                  height: 18,
                  borderRadius: "6px",
                  transform: "none",
                }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 92,
                  height: 24,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box className="mt-5 pt-1">
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              width: "100%",
              height: 40,
              borderRadius: "999px",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ShopsPageSkeleton() {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <HeaderSkeleton />

        <Box className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ShopCardSkeleton key={`shop-page-skeleton-${index}`} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

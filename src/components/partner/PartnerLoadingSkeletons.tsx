"use client";

import * as React from "react";
import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

function Line({
  width = "100%",
  height = 18,
}: {
  width?: string | number;
  height?: number;
}) {
  return (
    <Skeleton
      variant="rounded"
      width={width}
      height={height}
      sx={{ borderRadius: 999, bgcolor: "rgba(148, 163, 184, 0.22)" }}
    />
  );
}

function SoftBlock({
  height,
  className = "",
}: {
  height: number;
  className?: string;
}) {
  return (
    <Skeleton
      variant="rounded"
      height={height}
      className={className}
      sx={{ borderRadius: 4, bgcolor: "rgba(148, 163, 184, 0.18)" }}
    />
  );
}

export function PartnerStatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Box className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} elevation={0} className="partner-card rounded-[30px]!">
          <CardContent className="p-5!">
            <Line width="42%" height={14} />
            <Line width="64%" height={34} />
            <Line width="78%" height={14} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export function PartnerDashboardSkeleton() {
  return (
    <Box className="partner-page">
      <Box className="partner-page-header">
        <Line width={220} height={44} />
        <Line width="min(620px, 80%)" height={18} />
      </Box>

      <PartnerStatCardsSkeleton />

      <Box className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} elevation={0} className="partner-card rounded-[30px]!">
            <CardContent className="p-5!">
              <Line width="34%" height={22} />
              <Stack spacing={2.25} className="mt-5">
                {Array.from({ length: 5 }).map((__, row) => (
                  <Box key={row}>
                    <Stack direction="row" className="mb-2 items-center justify-between">
                      <Line width={78} height={14} />
                      <Line width={128} height={14} />
                    </Stack>
                    <Line height={10} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <PartnerListSkeleton rows={3} />
    </Box>
  );
}

export function PartnerListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card elevation={0} className="partner-card rounded-[30px]!">
      <CardContent className="p-0!">
        <PartnerListRowsSkeleton rows={rows} />
      </CardContent>
    </Card>
  );
}

export function PartnerListRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <Box
          key={index}
          className="border-b border-slate-100 p-4 last:border-b-0 md:p-5"
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            className="items-start justify-between"
          >
            <Stack spacing={1.25} className="w-full min-w-0 flex-1">
              <Line width="32%" height={18} />
              <Line width="58%" height={14} />
              <Line width="44%" height={14} />
            </Stack>
            <Stack direction="row" spacing={1} className="w-full md:w-auto">
              <Line width={112} height={46} />
              <Line width={96} height={46} />
            </Stack>
          </Stack>
        </Box>
      ))}
    </>
  );
}

export function PartnerCarListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Card elevation={0} className="partner-card rounded-[30px]!">
      <CardContent className="p-0!">
        <PartnerCarRowsSkeleton rows={rows} />
      </CardContent>
    </Card>
  );
}

export function PartnerCarRowsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <Box
          key={index}
          className="border-b border-slate-100 p-4 last:border-b-0 md:p-5"
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            className="items-start justify-between"
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} className="w-full min-w-0 flex-1">
              <SoftBlock height={160} className="w-full sm:w-56" />
              <Stack spacing={1.25} className="min-w-0 flex-1">
                <Line width={140} height={22} />
                <Line width="46%" height={24} />
                <Line width="68%" height={15} />
                <Line width="58%" height={15} />
                <Line width="34%" height={28} />
                <Line width="42%" height={12} />
              </Stack>
            </Stack>
            <Stack spacing={1} className="w-full md:w-28">
              <Line height={46} />
              <Line height={46} />
            </Stack>
          </Stack>
        </Box>
      ))}
    </>
  );
}

export function PartnerGridCardsSkeleton({
  count = 6,
  columns = "md:grid-cols-2 xl:grid-cols-3",
}: {
  count?: number;
  columns?: string;
}) {
  return (
    <Box className={`grid gap-4 ${columns}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} elevation={0} className="partner-card rounded-[30px]!">
          <CardContent className="p-5!">
            <Line width="46%" height={22} />
            <Line width="82%" height={14} />
            <SoftBlock height={92} className="mt-4" />
            <Line width="100%" height={46} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export function PartnerFormSkeleton() {
  return (
    <Card elevation={0} className="partner-card rounded-[30px]!">
      <CardContent className="p-5! md:p-6!">
        <Line width="36%" height={24} />
        <Line width="68%" height={15} />
        <Box className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Line key={index} height={58} />
          ))}
        </Box>
        <Line width={160} height={46} />
      </CardContent>
    </Card>
  );
}

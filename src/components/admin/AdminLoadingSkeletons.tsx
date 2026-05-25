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

function SoftBlock({ height }: { height: number }) {
  return (
    <Skeleton
      variant="rounded"
      height={height}
      sx={{ borderRadius: 4, bgcolor: "rgba(148, 163, 184, 0.18)" }}
    />
  );
}

export function AdminStatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Box className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} elevation={0} className="admin-card rounded-3xl!">
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

export function AdminDashboardSkeleton() {
  return (
    <>
      <AdminStatCardsSkeleton />
      <Box className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminListSkeleton rows={4} />
        <Card elevation={0} className="admin-card rounded-3xl!">
          <CardContent className="p-5!">
            <Line width="48%" height={22} />
            <Line width="72%" height={14} />
            <Stack spacing={3} className="mt-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index}>
                  <Stack direction="row" justifyContent="space-between">
                    <Line width={120} height={14} />
                    <Line width={54} height={14} />
                  </Stack>
                  <Line height={8} />
                </Box>
              ))}
            </Stack>
            <SoftBlock height={120} />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export function AdminListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card elevation={0} className="admin-card rounded-3xl!">
      <CardContent className="p-5!">
        <Line width="34%" height={22} />
        <Line width="52%" height={14} />
        <AdminListRowsSkeleton rows={rows} className="mt-5" />
      </CardContent>
    </Card>
  );
}

export function AdminListRowsSkeleton({
  rows = 5,
  className = "",
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <Stack spacing={1.5} className={className}>
      {Array.from({ length: rows }).map((_, index) => (
        <Box
          key={index}
          className="grid gap-3 rounded-2xl border border-[var(--rf-admin-line)] bg-slate-50 p-4 md:grid-cols-[1fr_auto]"
        >
          <Stack spacing={1}>
            <Line width="42%" height={18} />
            <Line width="78%" height={14} />
          </Stack>
          <Stack spacing={1} className="md:items-end">
            <Line width={108} height={18} />
            <Line width={84} height={12} />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

export function AdminTenantCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      <AdminStatCardsSkeleton />
      <Box className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} elevation={0} className="admin-card rounded-[32px]!">
            <CardContent className="grid gap-5 p-5!">
              <Stack direction="row" spacing={2} className="items-start">
                <Skeleton
                  variant="rounded"
                  width={96}
                  height={96}
                  sx={{ borderRadius: 7.5, bgcolor: "rgba(148, 163, 184, 0.18)" }}
                />
                <Stack spacing={1.25} className="min-w-0 flex-1">
                  <Line width="68%" height={24} />
                  <Line width="92%" height={14} />
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Line width={110} height={46} />
                <Line width={150} height={46} />
              </Stack>
              <SoftBlock height={116} />
              <Line height={46} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
}

export function AdminFormSkeleton() {
  return (
    <Card elevation={0} className="admin-card rounded-3xl!">
      <CardContent className="p-5! md:p-6!">
        <AdminFormBodySkeleton />
      </CardContent>
    </Card>
  );
}

export function AdminFormBodySkeleton() {
  return (
    <>
      <Line width="36%" height={24} />
      <Line width="68%" height={15} />
      <Box className="mt-6 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Line key={index} height={58} />
        ))}
      </Box>
      <Line width={160} height={46} />
    </>
  );
}

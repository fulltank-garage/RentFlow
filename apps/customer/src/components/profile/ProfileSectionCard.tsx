"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";

export default function ProfileSectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box className="apple-card p-5! md:p-6!">
      <Box className="mb-5 flex items-center gap-3">
        {icon ? (
          <Box className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--rf-apple-surface-soft)] text-[var(--rf-apple-blue)]">
            {icon}
          </Box>
        ) : null}
        <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
          {title}
        </Typography>
      </Box>

      <Box className="grid gap-4">{children}</Box>
    </Box>
  );
}

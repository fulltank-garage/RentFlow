"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

type Props = {
  title: string;
  message: string;
  helperText?: string;
  compact?: boolean;
  className?: string;
};

export default function DataLoadErrorCard({
  title,
  message,
  helperText = "กรุณาลองรีเฟรชหน้าอีกครั้ง หากยังพบปัญหาให้ติดต่อทีมงาน",
  compact = false,
  className = "",
}: Props) {
  return (
    <Box
      role="status"
      className={`rounded-[26px] border border-red-200 bg-red-50/70 text-left shadow-none ${compact ? "p-4" : "p-6 sm:p-7"} ${className}`}
    >
      <Box className="flex items-start gap-3">
        <Box className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-red-600 shadow-[inset_0_0_0_1px_rgba(220,38,38,0.12)]">
          <ReportProblemOutlinedIcon fontSize="small" />
        </Box>

        <Box className="min-w-0">
          <Typography className="text-sm font-black text-red-900 sm:text-base">
            {title}
          </Typography>
          <Typography className="mt-1 text-sm leading-6 text-red-800">
            {message}
          </Typography>
          {helperText ? (
            <Typography className="mt-2 text-xs leading-5 text-red-700/80">
              {helperText}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

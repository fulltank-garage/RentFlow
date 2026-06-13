"use client";

import * as React from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import { rentFlowSelectMenuProps } from "@/src/components/common/selectMenuProps";
import type { BookingStatus } from "@/src/hooks/my-bookings/useMyBookingsPage";

type Props = {
  q: string;
  onQChange: (value: string) => void;
  status: BookingStatus | "all";
  onStatusChange: (value: BookingStatus | "all") => void;
};

export default function MyBookingsFilters({
  q,
  onQChange,
  status,
  onStatusChange,
}: Props) {
  const fieldSX = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
    },
  };

  return (
    <Box className="grid gap-4 md:grid-cols-12 md:items-center">
      <Box className="md:col-span-8">
        <TextField
          id="my-bookings-search"
          name="bookingSearch"
          label="ค้นหา (รหัส/ชื่อรถ)"
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          size="small"
          fullWidth
          variant="outlined"
          sx={fieldSX}
        />
      </Box>

      <Box className="md:col-span-4">
        <TextField
          select
          id="my-bookings-status"
          name="bookingStatus"
          label="สถานะ"
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as BookingStatus | "all")
          }
          size="small"
          fullWidth
          variant="outlined"
          InputLabelProps={{ htmlFor: undefined }}
          SelectProps={{ MenuProps: rentFlowSelectMenuProps }}
          sx={fieldSX}
        >
          <MenuItem value="all">ทั้งหมด</MenuItem>
          <MenuItem value="pending">รอดำเนินการ</MenuItem>
          <MenuItem value="confirmed">ยืนยันแล้ว</MenuItem>
          <MenuItem value="paid">ชำระแล้ว</MenuItem>
          <MenuItem value="completed">เสร็จสิ้น</MenuItem>
          <MenuItem value="cancelled">ยกเลิก</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
}

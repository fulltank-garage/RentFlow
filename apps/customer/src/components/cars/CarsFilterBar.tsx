"use client";

import * as React from "react";
import { Box, TextField, MenuItem, Button } from "@mui/material";
import DataLoadErrorCard from "@/src/components/common/DataLoadErrorCard";
import { rentFlowSelectMenuProps } from "@/src/components/common/selectMenuProps";
import {
  getCarTypeLabel,
  type LocationOption,
} from "@/src/lib/rentflow-catalog";
import { getMinReturnDate, getTodayLocalDate } from "@/src/lib/rentflow-dates";
import type { CarType, SortKey } from "@/src/services/cars/cars.types";

type Props = {
  q: string;
  type: CarType | "all";
  sort: SortKey;
  location: string;
  pickupDate: string;
  returnDate: string;
  carTypes: readonly CarType[];
  locations: readonly LocationOption[];
  carTypesError?: string | null;
  locationsError?: string | null;
  onQChange: (value: string) => void;
  onTypeChange: (value: CarType | "all") => void;
  onSortChange: (value: SortKey) => void;
  onLocationChange: (value: string) => void;
  onPickupDateChange: (value: string) => void;
  onReturnDateChange: (value: string) => void;
  onReset: () => void;
};

export default function CarsFilterBar({
  q,
  type,
  sort,
  location,
  pickupDate,
  returnDate,
  carTypes,
  locations,
  carTypesError,
  locationsError,
  onQChange,
  onTypeChange,
  onSortChange,
  onLocationChange,
  onPickupDateChange,
  onReturnDateChange,
  onReset,
}: Props) {
  const today = getTodayLocalDate();
  const minReturnDate = getMinReturnDate(pickupDate);
  const fieldSX = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "18px",
    },
  };

  return (
    <Box className="apple-card mt-8 p-4 sm:p-5">
      <Box className="mb-4 flex flex-col gap-2">
        <Box className="apple-card-title font-semibold text-[var(--rf-apple-ink)]">
          ค้นหาและกรองรถ
        </Box>
        <Box className="apple-body-sm text-[var(--rf-apple-muted)]">
          ปรับสาขา ช่วงวัน และประเภทรถให้ตรงกับการเดินทางของคุณ
        </Box>
      </Box>

      {locationsError || carTypesError ? (
        <Box className="mb-4 grid gap-3 md:grid-cols-2">
          {locationsError ? (
            <DataLoadErrorCard
              title="โหลดรายการสาขาสำหรับตัวกรองไม่ได้"
              message={locationsError}
              helperText="ตัวกรองสาขาจะแสดงเฉพาะตัวเลือกทั้งหมดชั่วคราว"
              compact
            />
          ) : null}

          {carTypesError ? (
            <DataLoadErrorCard
              title="โหลดรายการประเภทรถสำหรับตัวกรองไม่ได้"
              message={carTypesError}
              helperText="ตัวกรองประเภทรถจะแสดงเฉพาะตัวเลือกทั้งหมดชั่วคราว"
              compact
            />
          ) : null}
        </Box>
      ) : null}

      <Box className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <TextField
          id="cars-filter-search"
          name="search"
          label="ค้นหารถ"
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          size="small"
          fullWidth
          variant="outlined"
          sx={fieldSX}
        />

        <TextField
          select
          id="cars-filter-type"
          name="type"
          label="ประเภทรถ"
          value={type}
          onChange={(e) => onTypeChange(e.target.value as CarType | "all")}
          size="small"
          fullWidth
          variant="outlined"
          InputLabelProps={{ htmlFor: undefined }}
          SelectProps={{ MenuProps: rentFlowSelectMenuProps }}
          sx={fieldSX}
        >
          <MenuItem value="all">ทั้งหมด</MenuItem>
          {carTypes.map((carType) => (
            <MenuItem key={carType} value={carType}>
              {getCarTypeLabel(carType)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          id="cars-filter-location"
          name="location"
          label="สาขารับรถ"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          size="small"
          fullWidth
          variant="outlined"
          InputLabelProps={{ htmlFor: undefined }}
          SelectProps={{ MenuProps: rentFlowSelectMenuProps }}
          sx={fieldSX}
        >
          <MenuItem value="">ทั้งหมด</MenuItem>
          {locations.map((loc) => (
            <MenuItem key={loc.value} value={loc.value}>
              {loc.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          id="cars-filter-pickup-date"
          name="pickupDate"
          label="วันรับรถ"
          value={pickupDate}
          onChange={(e) => onPickupDateChange(e.target.value)}
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: today }}
          variant="outlined"
          sx={fieldSX}
        />

        <TextField
          type="date"
          id="cars-filter-return-date"
          name="returnDate"
          label="วันคืนรถ"
          value={returnDate}
          onChange={(e) => onReturnDateChange(e.target.value)}
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: minReturnDate }}
          variant="outlined"
          sx={fieldSX}
        />
      </Box>

      <Box className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextField
          select
          id="cars-filter-sort"
          name="sort"
          label="เรียงตาม"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          size="small"
          fullWidth
          variant="outlined"
          InputLabelProps={{ htmlFor: undefined }}
          SelectProps={{ MenuProps: rentFlowSelectMenuProps }}
          sx={fieldSX}
        >
          <MenuItem value="price_asc">ราคาต่ำ → สูง</MenuItem>
          <MenuItem value="price_desc">ราคาสูง → ต่ำ</MenuItem>
        </TextField>

        <Button
          variant="outlined"
          className="rounded-full! py-2.5!"
          onClick={onReset}
        >
          รีเซ็ตตัวกรอง
        </Button>
      </Box>
    </Box>
  );
}

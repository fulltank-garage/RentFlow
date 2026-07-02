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
  type: CarType | "all";
  sort: SortKey;
  location: string;
  pickupDate: string;
  returnDate: string;
  carTypes: readonly CarType[];
  locations: readonly LocationOption[];
  carTypesError?: string | null;
  locationsError?: string | null;
  onTypeChange: (value: CarType | "all") => void;
  onSortChange: (value: SortKey) => void;
  onLocationChange: (value: string) => void;
  onPickupDateChange: (value: string) => void;
  onReturnDateChange: (value: string) => void;
  onReset: () => void;
};

export default function CarsFilterBar({
  type,
  sort,
  location,
  pickupDate,
  returnDate,
  carTypes,
  locations,
  carTypesError,
  locationsError,
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
  const floatingSelectLabelClass =
    "pointer-events-none absolute left-3 top-0 z-10 -translate-y-1/2 bg-white px-1 text-[11px] leading-none text-[var(--rf-apple-muted)]";
  const openDatePicker = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.showPicker?.();
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

      <Box className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-[minmax(180px,1.15fr)_minmax(150px,0.9fr)_minmax(150px,0.9fr)_minmax(150px,0.85fr)_minmax(150px,0.85fr)_minmax(150px,auto)] xl:items-stretch">
        <Box className="relative col-span-2 xl:order-4 xl:col-span-1">
          <Box
            component="span"
            id="cars-filter-type-label"
            className={floatingSelectLabelClass}
          >
            ประเภทรถ
          </Box>
          <TextField
            select
            id="cars-filter-type"
            name="type"
            value={type}
            onChange={(e) => onTypeChange(e.target.value as CarType | "all")}
            size="small"
            fullWidth
            variant="outlined"
            SelectProps={{
              MenuProps: rentFlowSelectMenuProps,
              SelectDisplayProps: {
                "aria-labelledby": "cars-filter-type-label cars-filter-type",
              },
              inputProps: {
                "aria-label": "ประเภทรถ",
              },
            }}
            sx={fieldSX}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            {carTypes.map((carType) => (
              <MenuItem key={carType} value={carType}>
                {getCarTypeLabel(carType)}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box className="relative col-span-2 xl:order-1 xl:col-span-1">
          <Box
            component="span"
            id="cars-filter-location-label"
            className={floatingSelectLabelClass}
          >
            สาขารับรถ
          </Box>
          <TextField
            select
            id="cars-filter-location"
            name="location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            size="small"
            fullWidth
            variant="outlined"
            SelectProps={{
              displayEmpty: true,
              MenuProps: rentFlowSelectMenuProps,
              SelectDisplayProps: {
                "aria-labelledby":
                  "cars-filter-location-label cars-filter-location",
              },
              inputProps: {
                "aria-label": "สาขารับรถ",
              },
              renderValue: (selected) =>
                selected ? (
                  locations.find((loc) => loc.value === selected)?.label ||
                  String(selected)
                ) : (
                  <Box component="span" className="text-[var(--rf-apple-muted)]">
                    กรุณาเลือกสาขา
                  </Box>
                ),
            }}
            sx={fieldSX}
          >
            <MenuItem value="">กรุณาเลือกสาขา</MenuItem>
            {locations.map((loc) => (
              <MenuItem key={loc.value} value={loc.value}>
                {loc.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <TextField
          type="date"
          id="cars-filter-pickup-date"
          name="pickupDate"
          className="xl:order-2"
          label="วันรับรถ"
          value={pickupDate}
          onChange={(e) => onPickupDateChange(e.target.value)}
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: today,
            onClick: openDatePicker,
            style: { cursor: "pointer" },
          }}
          variant="outlined"
          sx={fieldSX}
        />

        <TextField
          type="date"
          id="cars-filter-return-date"
          name="returnDate"
          className="xl:order-3"
          label="วันคืนรถ"
          value={returnDate}
          onChange={(e) => onReturnDateChange(e.target.value)}
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: minReturnDate,
            onClick: openDatePicker,
            style: { cursor: "pointer" },
          }}
          variant="outlined"
          sx={fieldSX}
        />

        <Box className="relative col-span-2 xl:order-5 xl:col-span-1">
          <Box
            component="span"
            id="cars-filter-sort-label"
            className={floatingSelectLabelClass}
          >
            เรียงตาม
          </Box>
          <TextField
            select
            id="cars-filter-sort"
            name="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            size="small"
            fullWidth
            variant="outlined"
            SelectProps={{
              MenuProps: rentFlowSelectMenuProps,
              SelectDisplayProps: {
                "aria-labelledby": "cars-filter-sort-label cars-filter-sort",
              },
              inputProps: {
                "aria-label": "เรียงตาม",
              },
            }}
            sx={fieldSX}
          >
            <MenuItem value="price_asc">ราคาต่ำ → สูง</MenuItem>
            <MenuItem value="price_desc">ราคาสูง → ต่ำ</MenuItem>
          </TextField>
        </Box>

        <Button
          variant="outlined"
          className="col-span-2 min-h-10! w-full rounded-full! border-[var(--rf-apple-border)]! bg-[var(--rf-apple-surface-soft)]! px-6! py-2.5! text-sm! text-[var(--rf-apple-ink)]! transition-[background-color,border-color,box-shadow] duration-200 hover:border-[var(--rf-apple-border-strong)]! hover:bg-white! hover:shadow-[var(--rf-apple-shadow-soft)]! xl:order-6 xl:col-span-1 xl:w-auto"
          sx={{
            minWidth: "150px !important",
            whiteSpace: "nowrap",
          }}
          onClick={onReset}
        >
          รีเซ็ตตัวกรอง
        </Button>
      </Box>
    </Box>
  );
}

"use client";

import * as React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

type Props = {
  fieldSX: object;
  pickupDate: string;
  setPickupDate: (value: string) => void;
  pickupTime: string;
  setPickupTime: (value: string) => void;
  returnDate: string;
  setReturnDate: (value: string) => void;
  returnTime: string;
  setReturnTime: (value: string) => void;
  timeInvalid: boolean;
  unavailableDates: string[];
  loadingUnavailableDates: boolean;
};

type CalendarDay = {
  key: string;
  date: Date;
  inMonth: boolean;
};

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function parseDateKey(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isFinite(date.getTime()) ? date : null;
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function buildCalendarDays(monthDate: Date): CalendarDay[] {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const start = addDays(firstDay, -firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    return {
      key: toDateKey(date),
      date,
      inMonth: date.getMonth() === monthDate.getMonth(),
    };
  });
}

function isBetween(dateKey: string, startKey: string, endKey: string) {
  return dateKey > startKey && dateKey < endKey;
}

function hasUnavailableInRange(
  startKey: string,
  endKey: string,
  unavailableSet: Set<string>
) {
  let cursor = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  if (!cursor || !end) return false;

  while (cursor.getTime() <= end.getTime()) {
    if (unavailableSet.has(toDateKey(cursor))) return true;
    cursor = addDays(cursor, 1);
  }

  return false;
}

function CalendarMonth({
  monthDate,
  todayKey,
  pickupDate,
  returnDate,
  unavailableSet,
  onSelectDate,
}: {
  monthDate: Date;
  todayKey: string;
  pickupDate: string;
  returnDate: string;
  unavailableSet: Set<string>;
  onSelectDate: (dateKey: string) => void;
}) {
  const days = React.useMemo(() => buildCalendarDays(monthDate), [monthDate]);

  return (
    <Box className="min-w-0">
      <Typography className="apple-body-sm mb-3 text-center font-semibold text-slate-900">
        {THAI_MONTHS[monthDate.getMonth()]} {monthDate.getFullYear() + 543}
      </Typography>

      <Box className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <Typography
            key={day}
            className="py-1 text-center text-[11px] font-semibold text-slate-500"
          >
            {day}
          </Typography>
        ))}

        {days.map((day) => {
          const isPast = day.key < todayKey;
          const isUnavailable = unavailableSet.has(day.key);
          const isPickup = day.key === pickupDate;
          const isReturn = day.key === returnDate;
          const isInRange =
            Boolean(pickupDate && returnDate) &&
            isBetween(day.key, pickupDate, returnDate);
          const disabled = isPast || isUnavailable || !day.inMonth;

          return (
            <button
              key={day.key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(day.key)}
              className={[
                "relative min-h-12 rounded-2xl border px-1 py-2 text-center transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
                day.inMonth ? "text-slate-900" : "text-transparent",
                isInRange && !isUnavailable
                  ? "border-blue-100 bg-blue-50"
                  : "border-transparent bg-white",
                isPickup || isReturn
                  ? "border-blue-600 bg-blue-600 text-white shadow-[0_12px_26px_rgba(37,99,235,0.22)]"
                  : "",
                isUnavailable && day.inMonth
                  ? "border-red-100 bg-red-50 text-red-700"
                  : "",
                isPast && day.inMonth ? "bg-slate-50 text-slate-300" : "",
                disabled ? "cursor-not-allowed" : "hover:scale-[1.015] hover:bg-slate-50",
              ].join(" ")}
              aria-label={`${day.date.getDate()} ${THAI_MONTHS[day.date.getMonth()]} ${
                isUnavailable ? "ไม่ว่าง" : "ว่าง"
              }`}
            >
              <span className="block text-sm font-semibold">{day.date.getDate()}</span>
              {day.inMonth ? (
                <span
                  className={[
                    "mt-1 block text-[10px] font-semibold",
                    isPickup || isReturn
                      ? "text-white/90"
                      : isUnavailable
                        ? "text-red-600"
                        : isPast
                          ? "text-slate-300"
                          : "text-emerald-600",
                  ].join(" ")}
                >
                  {isUnavailable ? "ไม่ว่าง" : isPast ? "-" : "ว่าง"}
                </span>
              ) : null}
            </button>
          );
        })}
      </Box>
    </Box>
  );
}

export default function BookingDateTime({
  fieldSX,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  returnDate,
  setReturnDate,
  returnTime,
  setReturnTime,
  timeInvalid,
  unavailableDates,
  loadingUnavailableDates,
}: Props) {
  const todayKey = React.useMemo(() => toDateKey(new Date()), []);
  const unavailableSet = React.useMemo(
    () => new Set(unavailableDates.map((date) => date.slice(0, 10))),
    [unavailableDates]
  );
  const selectedBaseDate = parseDateKey(pickupDate) || new Date();
  const [visibleMonth, setVisibleMonth] = React.useState(
    () => new Date(selectedBaseDate.getFullYear(), selectedBaseDate.getMonth(), 1)
  );

  React.useEffect(() => {
    const next = parseDateKey(pickupDate);
    if (!next) return;
    setVisibleMonth(new Date(next.getFullYear(), next.getMonth(), 1));
  }, [pickupDate]);

  const handleSelectDate = React.useCallback(
    (dateKey: string) => {
      if (unavailableSet.has(dateKey) || dateKey < todayKey) return;

      if (!pickupDate || (pickupDate && returnDate)) {
        setPickupDate(dateKey);
        setReturnDate("");
        return;
      }

      if (dateKey < pickupDate) {
        setPickupDate(dateKey);
        setReturnDate("");
        return;
      }

      if (hasUnavailableInRange(pickupDate, dateKey, unavailableSet)) {
        setPickupDate(dateKey);
        setReturnDate("");
        return;
      }

      setReturnDate(dateKey);
    },
    [pickupDate, returnDate, setPickupDate, setReturnDate, todayKey, unavailableSet]
  );

  const rangeLabel =
    pickupDate && returnDate
      ? `${pickupDate} ถึง ${returnDate}`
      : pickupDate
        ? `รับรถ ${pickupDate} แล้วเลือกวันคืนรถ`
        : "เลือกวันรับรถก่อน แล้วเลือกวันคืนรถ";

  return (
    <Box className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_44px_rgba(15,23,42,0.06)] sm:p-5">
      <Box className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <Box>
          <Typography className="apple-card-title font-semibold text-slate-900">
            เลือกวันรับ-คืนรถ
          </Typography>
          <Typography className="apple-label-text mt-1 text-slate-500">
            {rangeLabel}
          </Typography>
        </Box>
        <Box className="flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            ว่าง
          </span>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            ไม่ว่าง
          </span>
          {loadingUnavailableDates ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              กำลังอัปเดต
            </span>
          ) : null}
        </Box>
      </Box>

      <Box className="mt-5 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outlined"
          onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
          className="rounded-full!"
          sx={{ minWidth: 96, textTransform: "none" }}
        >
          ก่อนหน้า
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
          className="rounded-full!"
          sx={{ minWidth: 96, textTransform: "none" }}
        >
          ถัดไป
        </Button>
      </Box>

      <Box className="mt-5 grid gap-5 xl:grid-cols-2">
        {[visibleMonth, addMonths(visibleMonth, 1)].map((monthDate) => (
          <CalendarMonth
            key={`${monthDate.getFullYear()}-${monthDate.getMonth()}`}
            monthDate={monthDate}
            todayKey={todayKey}
            pickupDate={pickupDate}
            returnDate={returnDate}
            unavailableSet={unavailableSet}
            onSelectDate={handleSelectDate}
          />
        ))}
      </Box>

      <Box className="mt-5 grid gap-4 sm:grid-cols-2">
        <TextField
          id="booking-pickup-time"
          name="pickupTime"
          label="เวลารับรถ"
          type="time"
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
          fullWidth
          size="small"
          sx={fieldSX}
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }}
        />

        <TextField
          id="booking-return-time"
          name="returnTime"
          label="เวลาคืนรถ"
          type="time"
          value={returnTime}
          onChange={(e) => setReturnTime(e.target.value)}
          fullWidth
          size="small"
          sx={fieldSX}
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }}
          error={!!pickupDate && !!returnDate && timeInvalid}
          helperText={
            pickupDate && returnDate && timeInvalid
              ? "วัน/เวลาคืนรถต้องไม่ก่อนวัน/เวลารับรถ"
              : " "
          }
        />
      </Box>
    </Box>
  );
}

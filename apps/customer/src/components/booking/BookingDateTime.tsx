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
  className,
}: {
  monthDate: Date;
  todayKey: string;
  pickupDate: string;
  returnDate: string;
  unavailableSet: Set<string>;
  onSelectDate: (dateKey: string) => void;
  className?: string;
}) {
  const days = React.useMemo(() => buildCalendarDays(monthDate), [monthDate]);

  return (
    <Box className={["min-w-0", className].filter(Boolean).join(" ")}>
      <Typography className="apple-body-sm mb-3 text-center font-semibold text-slate-900">
        {THAI_MONTHS[monthDate.getMonth()]} {monthDate.getFullYear() + 543}
      </Typography>

      <Box className="grid grid-cols-7 gap-x-0 gap-y-1">
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
          const isPickup = day.inMonth && day.key === pickupDate;
          const isReturn = day.inMonth && day.key === returnDate;
          const isInRange =
            Boolean(pickupDate && returnDate) &&
            isBetween(day.key, pickupDate, returnDate);
          const isSelected = isPickup || isReturn;
          const disabled = isPast || isUnavailable || !day.inMonth;

          return (
            <Box
              key={day.key}
              className={[
                "relative min-h-12",
                isInRange && day.inMonth && !isUnavailable
                  ? "before:absolute before:inset-x-0 before:top-1/2 before:h-8 before:-translate-y-1/2 before:bg-sky-100"
                  : "",
                isPickup && returnDate
                  ? "before:absolute before:top-1/2 before:right-0 before:h-8 before:w-1/2 before:-translate-y-1/2 before:bg-sky-100"
                  : "",
                isReturn && pickupDate
                  ? "before:absolute before:top-1/2 before:left-0 before:h-8 before:w-1/2 before:-translate-y-1/2 before:bg-sky-100"
                  : "",
              ].join(" ")}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(day.key)}
                className={[
                  "relative z-10 h-full min-h-12 w-full rounded-2xl border px-1 py-2 text-center transition-colors duration-200",
                  "focus:outline-none",
                  day.inMonth ? "text-slate-900" : "text-transparent",
                  isSelected
                    ? "border-sky-300 bg-white text-slate-900 shadow-[inset_0_0_0_3px_rgba(186,230,253,0.75)]"
                    : isInRange && day.inMonth && !isUnavailable
                      ? "rounded-none border-transparent bg-sky-100 text-slate-700"
                    : "border-transparent bg-white",
                  isUnavailable && day.inMonth
                    ? "border-red-100 bg-red-50 text-red-700"
                    : "",
                  isPast && day.inMonth ? "bg-slate-50 text-slate-300" : "",
                  disabled ? "cursor-not-allowed" : "hover:border-slate-200 hover:bg-slate-50",
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
                      isUnavailable
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
            </Box>
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

      if (!pickupDate) {
        setPickupDate(dateKey);
        setReturnDate("");
        return;
      }

      if (dateKey < pickupDate) {
        setPickupDate(dateKey);
        setReturnDate("");
        return;
      }

      if (dateKey === pickupDate) {
        setPickupDate("");
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
    [pickupDate, setPickupDate, setReturnDate, todayKey, unavailableSet]
  );

  const rangeLabel =
    pickupDate && returnDate
      ? `${pickupDate} ถึง ${returnDate}`
      : pickupDate
        ? `รับรถ ${pickupDate} แล้วเลือกวันคืนรถ`
        : "เลือกวันรับรถก่อน แล้วเลือกวันคืนรถ";

  return (
    <Box className="rounded-[28px] border border-black/10 bg-white px-4 pt-4 pb-0 shadow-[var(--rf-apple-shadow-soft)]">
      <Box className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <Box>
          <Typography className="apple-card-title font-semibold text-slate-900">
            เลือกวันรับ-คืนรถ
          </Typography>
          <Typography className="apple-label-text mt-1 text-slate-500">
            {rangeLabel}
          </Typography>
        </Box>
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
            className={
              monthDate.getMonth() === addMonths(visibleMonth, 1).getMonth()
                ? "hidden xl:block"
                : undefined
            }
          />
        ))}
      </Box>

      <Box className="mt-5 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outlined"
          onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
          className="rounded-full!"
          sx={{ minWidth: 96, textTransform: "none" }}
        >
          เดือนก่อนหน้า
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
          className="rounded-full!"
          sx={{ minWidth: 96, textTransform: "none" }}
        >
          เดือนถัดไป
        </Button>
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

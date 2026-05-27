"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { toTHBText } from "@/src/utils/car-detail/carDetail.format";
import { getCarTypeLabel } from "@/src/lib/rentflow-catalog";

type Props = {
  detail: {
    id: string;
    name: string;
    type: string;
    seats: number;
    transmission: string;
    fuel: string;
    pricePerDay: number;
    isAvailable: boolean;
    status?: string;
    unitCount?: number;
    availableUnits?: number;
    domainSlug?: string;
    bookingMode?: string;
  };
};

export default function CarDetailSummaryCard({ detail }: Props) {
  const router = useRouter();
  const availableUnits =
    typeof detail.availableUnits === "number"
      ? detail.availableUnits
      : detail.isAvailable
        ? Math.max(detail.unitCount || 1, 1)
        : 0;
  const isUnavailable = !detail.isAvailable || availableUnits <= 0;
  const unavailableLabel =
    detail.status === "rented" ? "ถูกเช่าแล้ว" : "ถูกจองแล้ว";

  return (
    <Card
      elevation={0}
      sx={{ boxShadow: "none" }}
      className="apple-card lg:col-span-5"
    >
      <CardContent className="p-4! sm:p-5!">
        <Box className="flex items-start justify-between gap-3">
          <Box className="min-w-0">
            <Typography className="apple-card-title-lg truncate font-black tracking-[-0.04em] text-[var(--rf-apple-ink)]">
              {detail.name}
            </Typography>
            <Typography className="mt-2 text-sm text-[var(--rf-apple-muted)]">
              {getCarTypeLabel(detail.type)} • {detail.seats} ที่นั่ง • {detail.transmission} •{" "}
              {detail.fuel}
            </Typography>
          </Box>
        </Box>

        <Box className="mt-3 flex items-center gap-2">
          <Chip
            size="small"
            label={isUnavailable ? unavailableLabel : "ตรวจเช็คก่อนส่งมอบ"}
            variant="outlined"
            className="apple-pill text-[var(--rf-apple-muted)]!"
          />
        </Box>

        <Divider className="my-5! border-black/10!" />

        <Box className="rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-5">
          <Typography className="text-sm text-[var(--rf-apple-muted)]">
            ราคาเริ่มต้น
          </Typography>
          <Box className="mt-1 flex items-end gap-2">
            <Typography className="apple-price-text font-extrabold tracking-[-0.04em] text-[var(--rf-apple-ink)]">
              {toTHBText(detail.pricePerDay)}
            </Typography>
            <Typography className="text-sm font-medium text-[var(--rf-apple-muted)]">
              / วัน
            </Typography>
          </Box>
          {!isUnavailable && (detail.unitCount || 0) > 1 ? (
            <Typography className="mt-3 text-sm font-semibold text-[var(--rf-apple-muted)]">
              เหลือให้จอง {availableUnits} จาก {detail.unitCount} คัน
            </Typography>
          ) : null}
        </Box>

        <Box className="mt-5 grid gap-2">
          <Button
            fullWidth
            variant="contained"
            className="rounded-full! py-2.5! font-semibold!"
            disabled={isUnavailable}
            onClick={() =>
              !isUnavailable
                ? router.push(
                    `/booking?carId=${encodeURIComponent(detail.id)}${
                      detail.domainSlug
                        ? `&tenant=${encodeURIComponent(detail.domainSlug)}`
                        : ""
                    }&bookingMode=${
                      detail.bookingMode === "payment" ? "payment" : "chat"
                    }`
                  )
                : undefined
            }
          >
            {isUnavailable ? unavailableLabel : "จองคันนี้"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            className="rounded-full! py-2.5!"
            onClick={() => router.push("/cars")}
          >
            ดูรถคันอื่น
          </Button>
        </Box>

        {isUnavailable ? (
          <Typography className="mt-3 text-sm font-medium text-[var(--rf-apple-muted)]">
            รถคันนี้{unavailableLabel} กรุณาเลือกรถคันอื่นหรือกลับมาตรวจสอบอีกครั้งภายหลัง
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}

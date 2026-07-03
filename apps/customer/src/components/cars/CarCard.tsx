"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import type { Car } from "@/src/services/cars/cars.types";
import { formatTHB } from "@/src/constants/money";
import { getCarTypeLabel } from "@/src/lib/rentflow-catalog";
import { getRentFlowCarStorefrontHref } from "@/src/lib/tenant";

type Props = {
    car: Car;
    showShop?: boolean;
};

export default function CarCard({ car, showShop = false }: Props) {
  const tenantQuery = car.domainSlug
    ? `?tenant=${encodeURIComponent(car.domainSlug)}`
    : "";
  const carHref = `/cars/${encodeURIComponent(car.id)}${tenantQuery}`;
  const bookingHref = `/booking?carId=${encodeURIComponent(car.id)}${
    car.domainSlug ? `&tenant=${encodeURIComponent(car.domainSlug)}` : ""
  }&bookingMode=${car.bookingMode === "payment" ? "payment" : "chat"}`;
  const shopHref = car.domainSlug
    ? getRentFlowCarStorefrontHref(car.domainSlug)
    : "";
  const availableUnits =
    typeof car.availableUnits === "number"
      ? car.availableUnits
      : car.isAvailable
        ? Math.max(car.unitCount || 1, 1)
        : 0;
  const isBooked = car.isAvailable === false || availableUnits <= 0;
  const unavailableLabel = car.status === "rented" ? "ถูกเช่าแล้ว" : "ถูกจองแล้ว";

  return (
    <Card
      elevation={0}
      sx={{ boxShadow: "none" }}
      className="apple-card group"
    >
      <Box className="relative h-52 w-full overflow-hidden bg-(--rf-apple-surface-soft) sm:h-56">
        <Box
          component="img"
          src={car.imageUrl || car.image || "/RentFlowCar.png"}
          alt={car.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.18,0.9,0.22,1)] group-hover:scale-[1.012]"
        />
        {isBooked ? (
          <Box className="absolute left-4 top-4 z-1">
            <Chip
              label={unavailableLabel}
              className="apple-pill bg-white/92! font-bold! text-(--rf-apple-ink)!"
            />
          </Box>
        ) : null}
        {isBooked ? (
          <Box className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 to-transparent px-5 py-4">
            <Typography className="text-sm font-semibold text-white">
              รถคันนี้{unavailableLabel} ยังไม่สามารถกดจองได้ในตอนนี้
            </Typography>
          </Box>
        ) : null}
      </Box>

      <CardContent className="p-5 sm:p-6">
        <Box className="flex items-start justify-between gap-3">
          <Box className="min-w-0">
            <Typography className="apple-card-title truncate font-bold tracking-[-0.03em] text-(--rf-apple-ink)">
              {car.name}
            </Typography>
            <Typography className="mt-1 text-sm text-(--rf-apple-muted)">
              {getCarTypeLabel(car.type)} • {car.seats} ที่นั่ง • {car.transmission} • {car.fuel}
            </Typography>
          </Box>
        </Box>

        {showShop && car.shopName ? (
          <Box
            component={shopHref ? "a" : "span"}
            href={shopHref || undefined}
            className="mt-5 block rounded-[22px] bg-(--rf-apple-surface-soft) p-4 text-(--rf-apple-muted) no-underline transition hover:bg-white"
          >
            <Box className="flex flex-wrap items-end gap-x-2 gap-y-1">
              <Typography className="text-base font-black tracking-[-0.02em] text-(--rf-apple-muted)">
                ร้านให้เช่า
              </Typography>
              <Typography className="apple-card-title-lg truncate font-black tracking-[-0.04em] text-(--rf-apple-ink)">
                {car.shopName}
              </Typography>
            </Box>
          </Box>
        ) : null}

        <Box className="mt-3 rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
          <Box className="flex items-end gap-2">
            <Typography className="text-sm text-(--rf-apple-muted)">
              ราคาเริ่มต้น
            </Typography>

            <Typography className="apple-price-text font-extrabold tracking-[-0.04em] text-(--rf-apple-ink)">
              {formatTHB(car.pricePerDay)}
            </Typography>

            <Typography className="text-sm text-(--rf-apple-muted)">
              /วัน
            </Typography>
          </Box>
          {!isBooked && (car.unitCount || 0) > 1 ? (
            <Typography className="mt-2 text-sm font-semibold text-(--rf-apple-muted)">
              เหลือให้จอง {availableUnits} จาก {car.unitCount} คัน
            </Typography>
          ) : null}
        </Box>
      </CardContent>

      <CardActions
        sx={{
          p: { xs: "0px 20px 20px", sm: "0px 16px 16px" },
          "& .MuiButton-root": {
            flex: "1 1 0",
            minWidth: 0,
            px: { xs: 1, sm: 2 },
            whiteSpace: "nowrap",
          },
        }}
        className="flex-row gap-2"
      >
        <Button
          component={Link}
          href={carHref}
          variant="outlined"
          fullWidth
          className="rounded-full!"
        >
          ดูรายละเอียด
        </Button>

        <Button
          component={isBooked ? "button" : Link}
          href={isBooked ? undefined : bookingHref}
          variant="contained"
          fullWidth
          disabled={isBooked}
          className="rounded-full! font-semibold!"
        >
          {isBooked ? unavailableLabel : "จองเลย"}
        </Button>
      </CardActions>
    </Card>
  );
}

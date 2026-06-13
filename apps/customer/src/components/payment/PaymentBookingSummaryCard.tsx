"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import type { StorefrontAddon } from "@/src/services/addons/addons.types";
import type { Car } from "@/src/services/cars/cars.types";
import { formatTHB } from "@/src/constants/money";
import StableImage from "@/src/components/common/StableImage";
import { getCarTypeLabel } from "@/src/lib/rentflow-catalog";

type Props = {
  bookingId: string;
  carId: string;
  car?: Car;
  days: number;
  pickupDate: string;
  returnDate: string;
  pickupPoint: string;
  returnPoint: string;
  pickupTime: string;
  returnTime: string;
  amount: number;
  addonIds: string[];
  addonOptions: StorefrontAddon[];
  addonsTotal: number;
  carSubTotal: number;
  carNet: number;
  carDiscount: number;
  discountPct: number;
  extraCharge: number;
};

export default function PaymentBookingSummaryCard({
  bookingId,
  carId,
  car,
  days,
  pickupDate,
  returnDate,
  pickupPoint,
  returnPoint,
  pickupTime,
  returnTime,
  amount,
  addonIds,
  addonOptions,
  addonsTotal,
  carSubTotal,
  carNet,
  carDiscount,
  discountPct,
  extraCharge,
}: Props) {
  return (
    <Card
      elevation={0}
      className="apple-card order-2 lg:order-1 lg:col-span-5"
    >
      <CardContent className="p-4! sm:p-5! md:p-6!">
        <Typography className="apple-card-title font-semibold tracking-[-0.03em] text-slate-900">
          สรุปการจอง
        </Typography>
        <Typography className="apple-body-sm mt-1 text-[var(--rf-apple-muted)]">
          ตรวจสอบรายละเอียดรถ ช่วงเวลา และยอดรวมก่อนยืนยันการชำระเงิน
        </Typography>

        <Box className="mt-4 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
          <Box className="flex items-center justify-between">
            <Typography className="text-sm text-slate-600">
              รหัสการจอง
            </Typography>
            <Typography className="apple-body-sm font-semibold text-slate-900">
              {bookingId}
            </Typography>
          </Box>

          {(pickupPoint || returnPoint || pickupDate || returnDate) && (
            <Box className="mt-3 rounded-[18px] bg-white p-3">
              <Box className="grid gap-2">
                <Box className="flex items-start justify-between gap-3">
                  <Typography className="apple-label-text font-semibold text-slate-600">
                    จุดรับรถ
                  </Typography>
                  <Box className="text-right">
                    <Typography
                      component="div"
                      className="apple-body-sm font-bold text-slate-900"
                    >
                      {pickupPoint || "-"}
                    </Typography>
                    <Typography
                      component="div"
                      className="apple-label-text text-slate-500"
                    >
                      {pickupDate
                        ? `${pickupDate}${pickupTime ? ` ${pickupTime}` : ""}`
                        : "-"}
                    </Typography>
                  </Box>
                </Box>

                <Divider className="border-black/10!" />

                <Box className="flex items-start justify-between gap-3">
                  <Typography className="apple-label-text font-semibold text-slate-600">
                    จุดคืนรถ
                  </Typography>
                  <Box className="text-right">
                    <Typography
                      component="div"
                      className="apple-body-sm font-bold text-slate-900"
                    >
                      {returnPoint || "-"}
                    </Typography>
                    <Typography
                      component="div"
                      className="apple-label-text text-slate-500"
                    >
                      {returnDate
                        ? `${returnDate}${returnTime ? ` ${returnTime}` : ""}`
                        : "-"}
                    </Typography>
                  </Box>
                </Box>

                <Box className="flex items-center justify-between pt-1">
                  <Typography className="apple-label-text text-slate-600">
                    จำนวนวัน
                  </Typography>
                  <Typography className="apple-label-text font-bold text-slate-900">
                    {days ? `${days} วัน` : "-"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {carSubTotal > 0 ? (
            <>
              <Box className="mt-3 flex items-center justify-between">
                <Typography className="apple-body-sm text-slate-600">
                  ราคาเต็ม (รถ)
                </Typography>
                <Typography
                  component="div"
                  className="apple-body-sm font-semibold text-slate-500 line-through"
                >
                  {formatTHB(carSubTotal)}
                </Typography>
              </Box>

              <Box className="mt-2 flex items-center justify-between">
                <Typography className="apple-body-sm text-slate-600">
                  ยอดรถสุทธิ
                </Typography>
                <Typography className="apple-body-sm font-bold text-slate-900">
                  {formatTHB(carNet)}
                </Typography>
              </Box>

              {carDiscount > 0 ? (
                <Box className="mt-3 rounded-[18px] bg-emerald-50 px-4 py-3">
                  <Box className="flex items-center justify-between">
                    <Typography className="apple-body-sm font-bold text-emerald-900">
                      คุณประหยัดไป
                    </Typography>
                    <Typography className="apple-card-title font-black text-emerald-800">
                      -{formatTHB(carDiscount)} ({discountPct}%)
                    </Typography>
                  </Box>
                </Box>
              ) : null}

              {addonIds.length > 0 ? (
                <Box className="mt-3 space-y-2">
                  <Divider className="mb-2! border-black/10!" />

                  <Box className="flex items-center justify-between">
                    <Typography className="apple-body-sm font-semibold text-slate-800">
                      บริการเสริมที่เลือก
                    </Typography>
                    <Typography className="apple-body-sm font-bold text-slate-900">
                      {formatTHB(addonsTotal)}
                    </Typography>
                  </Box>

                  <Typography className="apple-label-text text-slate-500">
                    รวมอยู่ในยอดชำระของรายการนี้แล้ว
                  </Typography>

                  <Box className="space-y-2">
                    {addonIds.map((addonId) => {
                      const addon = addonOptions.find((item) => item.id === addonId);
                      if (!addon) return null;

                      const priceText =
                        addon.pricing === "perDay"
                          ? `${formatTHB(addon.price)} / วัน`
                          : `${formatTHB(addon.price)} / ครั้ง`;

                      return (
                        <Box
                          key={addon.id}
                          className="flex items-start justify-between gap-3"
                        >
                          <Typography className="apple-label-text text-slate-600">
                            • {addon.name}
                          </Typography>
                          <Typography className="apple-label-text whitespace-nowrap font-semibold text-slate-700">
                            {priceText}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              ) : null}

              {extraCharge > 0 ? (
                <Box className="mt-3 flex items-center justify-between">
                  <Typography className="apple-body-sm text-slate-600">
                    ค่าบริการเพิ่ม
                  </Typography>
                  <Typography className="apple-body-sm font-semibold text-slate-900">
                    {formatTHB(extraCharge)}
                  </Typography>
                </Box>
              ) : null}

              <Box className="mt-3 flex items-center justify-between">
                <Typography className="apple-body-sm text-slate-600">
                  ยอดชำระ
                </Typography>
                <Typography className="apple-card-title font-bold text-slate-900">
                  {formatTHB(amount)}
                </Typography>
              </Box>
            </>
          ) : (
            <Box className="mt-2 flex items-center justify-between">
              <Typography className="apple-body-sm text-slate-600">
                ยอดชำระ
              </Typography>
              <Typography className="apple-card-title font-bold text-slate-900">
                {formatTHB(amount)}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider className="my-5! border-black/10!" />

        {car ? (
          <Box className="rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
            <StableImage
              className="aspect-4/3 rounded-[18px]"
              src={car.image || "/RentFlow.png"}
              alt={car.name}
              sizes="(min-width: 1200px) 34vw, (min-width: 640px) 50vw, 100vw"
              imageClassName="object-cover"
            />

            <Box className="mt-3 flex items-start justify-between gap-3">
              <Box className="min-w-0">
                <Typography className="apple-card-title truncate font-semibold text-slate-900">
                  {car.name}
                </Typography>
                <Typography className="apple-label-text mt-1 text-slate-600">
                  {getCarTypeLabel(car.type)} • {car.seats} ที่นั่ง • {car.transmission} •{" "}
                  {car.fuel}
                </Typography>
              </Box>
            </Box>

            <Divider className="my-4! border-black/10!" />

            <Box className="flex items-center justify-between">
              <Typography className="apple-body-sm text-slate-600">
                ราคา/วัน
              </Typography>
              <Typography className="apple-body-sm font-semibold text-slate-900">
                {formatTHB(car.pricePerDay)}
              </Typography>
            </Box>

            <Link
              href={`/cars/${encodeURIComponent(car.id)}`}
              className="mt-4 block"
            >
              <Button
                fullWidth
                variant="outlined"
                className="rounded-full!"
                sx={{ textTransform: "none" }}
              >
                ดูรายละเอียดรถ
              </Button>
            </Link>
          </Box>
        ) : (
          <Box className="rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
            <Typography className="apple-body-sm text-slate-600">
              ไม่พบข้อมูลรถ (carId:{" "}
              <span className="font-semibold">{carId || "-"}</span>)
            </Typography>

            <Link href="/cars" className="mt-3 inline-block">
              <Button
                variant="outlined"
                className="rounded-full!"
                sx={{ textTransform: "none" }}
              >
                กลับไปเลือกรถ
              </Button>
            </Link>
          </Box>
        )}

        <Divider className="my-5! border-black/10!" />

        <Box className="rounded-[22px] bg-[var(--rf-apple-surface-soft)] px-4 py-3">
          <Typography className="apple-label-text leading-6 text-slate-500">
            แนะนำ: หากชำระแล้วไม่ขึ้นสถานะ ให้ติดต่อทีมงานพร้อมรหัสการจอง
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

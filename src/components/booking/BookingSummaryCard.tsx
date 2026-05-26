"use client";

import Link from "next/link";
import { Box, Button, Card, CardContent, Divider, Typography } from "@mui/material";
import type { Car } from "@/src/services/cars/cars.types";
import { formatTHB } from "@/src/constants/money";
import StableImage from "@/src/components/common/StableImage";
import { getCarTypeLabel } from "@/src/lib/rentflow-catalog";

type Props = {
  car?: Car | null;
  carId: string;
  finalPickupPoint: string;
  pickupDate: string;
  pickupTime: string;
  finalReturnPoint: string;
  returnDate: string;
  returnTime: string;
  days: number;
  addonsTotal: number;
  pricing: {
    discountPct: number;
    subTotal: number;
    discount: number;
    total: number;
  } | null;
  amount: number;
};

export default function BookingSummaryCard({
  car,
  carId,
  finalPickupPoint,
  pickupDate,
  pickupTime,
  finalReturnPoint,
  returnDate,
  returnTime,
  days,
  addonsTotal,
  pricing,
  amount,
}: Props) {
  return (
    <Card
      elevation={0}
      sx={{ boxShadow: "none" }}
      className="apple-card self-start lg:sticky lg:top-16 lg:col-span-5 lg:h-[calc(100svh-128px)]"
    >
      <CardContent className="p-4! sm:p-5! lg:flex lg:h-full lg:flex-col">
        <Typography className="apple-card-title font-semibold text-slate-900">
          สรุปการจอง
        </Typography>
        <Typography className="apple-label-text mt-1 text-slate-500">
          ตรวจสอบรถ จุดรับ-คืน และยอดรวมก่อนชำระเงิน
        </Typography>

        <Divider className="my-5! border-black/10!" />

        {!car ? (
          <Box className="rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4">
            <Typography className="apple-body-sm text-slate-700">
              ไม่พบข้อมูลรถ (รหัสรถ: <span className="font-semibold">{carId || "-"}</span>)
            </Typography>
            <Typography className="apple-label-text mt-2 text-slate-500">
              กรุณากลับไปเลือกจากหน้า “รถทั้งหมด”
            </Typography>

            <Link href="/cars" className="mt-4 inline-block">
              <Button
                variant="outlined"
                className="rounded-full!"
              >
                กลับไปเลือกรถ
              </Button>
            </Link>
          </Box>
        ) : (
          <Box className="rounded-[18px]! bg-[var(--rf-apple-surface-soft)] p-4! sm:p-5! lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
            <StableImage
              className="aspect-4/3 rounded-[18px] lg:h-[clamp(180px,28svh,300px)] lg:shrink-0 lg:aspect-auto"
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
                  {getCarTypeLabel(car.type)} • {car.seats} ที่นั่ง • {car.transmission} • {car.fuel}
                </Typography>
              </Box>
            </Box>

            <Box className="apple-body-sm mb-2! mt-4 space-y-2 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
              <Box className="flex items-center justify-between">
                <Typography className="text-slate-600">ราคา/วัน</Typography>
                <Typography className="font-semibold text-slate-900">
                  {formatTHB(car.pricePerDay)} / วัน
                </Typography>
              </Box>

              <Box className="flex items-start justify-between gap-3">
                <Typography className="text-slate-600">รับรถ</Typography>
                <Box className="text-right">
                  <Typography component="div" className="font-semibold text-slate-900">
                    {finalPickupPoint || "-"}
                  </Typography>
                  <Typography component="div" className="apple-label-text font-normal text-slate-500">
                    {pickupDate && pickupTime ? `${pickupDate} ${pickupTime}` : "-"}
                  </Typography>
                </Box>
              </Box>

              <Box className="flex items-start justify-between gap-3">
                <Typography className="text-slate-600">คืนรถ</Typography>
                <Box className="text-right">
                  <Typography component="div" className="font-semibold text-slate-900">
                    {finalReturnPoint || "-"}
                  </Typography>
                  <Typography component="div" className="apple-label-text font-normal text-slate-500">
                    {returnDate && returnTime ? `${returnDate} ${returnTime}` : "-"}
                  </Typography>
                </Box>
              </Box>

              <Box className="flex items-center justify-between">
                <Typography className="text-slate-600">จำนวนวัน</Typography>
                <Typography className="font-semibold text-slate-900">
                  {days > 0 ? `${days} วัน` : "-"}
                </Typography>
              </Box>

              <Box className="flex items-center justify-between">
                <Box>
                  <Typography className="text-slate-600">
                    บริการเสริมที่เลือก
                  </Typography>
                  {addonsTotal > 0 ? (
                    <Typography className="apple-label-text text-slate-500">
                      รวมอยู่ในยอดชำระแล้ว
                    </Typography>
                  ) : null}
                </Box>
                <Typography className="font-semibold text-slate-900">
                  {addonsTotal > 0 ? formatTHB(addonsTotal) : "-"}
                </Typography>
              </Box>

              {pricing ? (
                <>
                  <Box className="flex items-center justify-between">
                    <Typography className="text-slate-600">ยอดก่อนส่วนลด</Typography>
                    <Typography className="font-semibold text-slate-900">
                      {formatTHB(pricing.subTotal)}
                    </Typography>
                  </Box>

                  {pricing.discountPct > 0 ? (
                    <Box className="flex items-center justify-between">
                      <Typography className="text-slate-600">
                        ส่วนลด ({pricing.discountPct}%)
                      </Typography>
                      <Typography className="font-semibold text-emerald-700">
                        -{formatTHB(pricing.discount)}
                      </Typography>
                    </Box>
                  ) : null}
                </>
              ) : null}

              <Box className="flex items-center justify-between">
                <Typography className="text-slate-600">ยอดรวม</Typography>
                <Typography className="apple-card-title font-bold text-slate-900">
                  {amount > 0 ? formatTHB(amount) : "-"}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

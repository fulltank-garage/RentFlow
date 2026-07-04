"use client";

import * as React from "react";
import Link from "next/link";
import { formatTHB } from "@/src/constants/money";
import { formatBookingDateTime } from "@/src/lib/booking-datetime";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import StatusChip from "@/src/components/my-bookings/detail/StatusChip";
import MyBookingDetailPageSkeleton from "@/src/components/my-bookings/detail/MyBookingDetailPageSkeleton";
import useMyBookingDetailPage from "@/src/hooks/my-bookings/useMyBookingDetailPage";

export default function MyBookingDetailPage() {
  const booking = useMyBookingDetailPage();
  const local = booking.local;
  const receiptHref = React.useMemo(() => {
    if (!local) return "/booking/success";

    const params = new URLSearchParams();
    params.set("bookingId", local.bookingRef || local.id);
    params.set("amount", String(local.totalPrice || 0));
    params.set("carName", local.carName);
    params.set("customerName", local.customerName || "");
    params.set("customerPhone", local.phone || "");
    params.set("pickupDate", local.pickupDate);
    params.set("returnDate", local.returnDate);
    params.set("pickupPoint", local.pickupLocation || "");
    params.set("returnPoint", local.returnLocation || "");
    if (local.shopName) params.set("shopName", local.shopName);
    return `/booking/success?${params.toString()}`;
  }, [local]);

  if (!booking.ready || booking.isCheckingAuth || !booking.isAuthenticated) {
    return <MyBookingDetailPageSkeleton />;
  }

  if (!booking.id) return null;

  if (!local) {
    return (
      <Box className="apple-page">
        <Container maxWidth="lg" className="apple-section">
          <Box className="mx-auto max-w-3xl text-center">
            <Box className="flex flex-col gap-4">
              <Typography className="apple-heading apple-section-title">
                ไม่พบรายการจอง
              </Typography>
              <Typography className="apple-subtitle text-lg">
                ไม่พบข้อมูลสำหรับรหัสการจองนี้ โปรดลองกลับไปตรวจสอบจากหน้ารายการจองอีกครั้ง
              </Typography>
            </Box>

            <Box className="mt-6 flex justify-center">
              <Chip
                size="small"
                label={`รหัสที่ค้นหา: ${booking.id}`}
                className="apple-pill text-(--rf-apple-muted)!"
              />
            </Box>
          </Box>

          <Box className="apple-card apple-card-no-hover mx-auto mt-10 max-w-2xl p-6 text-center">
            <Typography className="text-sm leading-6 text-(--rf-apple-muted)">
              หากเพิ่งทำรายการ อาจใช้เวลาเล็กน้อยก่อนข้อมูลจะแสดงในระบบ
            </Typography>

            <Box className="mt-5 flex justify-center">
              <Button
                component={Link}
                href="/my-bookings"
                variant="outlined"
                className="rounded-full!"
              >
                กลับไปหน้ารายการจอง
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  const p = booking.pricing;

  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <Box className="apple-section-intro max-w-3xl">
          <Box className="flex flex-col gap-4">
            <Typography className="apple-heading apple-section-title">
              รายละเอียดการจอง
            </Typography>
            <Typography className="apple-subtitle text-lg">
              ตรวจสอบรหัสจอง รถที่จอง วันรับ-คืนรถ ข้อมูลผู้จอง และยอดชำระได้ในหน้าเดียว
            </Typography>
          </Box>
        </Box>

        <Box className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Box className="space-y-5">
            <Paper elevation={0} className="apple-card overflow-hidden p-0">
              <Box className="bg-(--rf-apple-surface-soft) p-5 md:p-6">
                <Box className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <Box className="min-w-0">
                    <Typography className="apple-body-copy font-black text-(--rf-apple-ink)">
                      รหัสจองของคุณ
                    </Typography>
                    <Typography className="apple-card-title-lg mt-2 truncate font-black tracking-[-0.04em] text-(--rf-apple-ink)">
                      {local.id}
                    </Typography>
                  </Box>

                  <Box className="shrink-0">
                    <StatusChip s={local.status} />
                  </Box>
                </Box>
              </Box>

              <Box className="p-5 md:p-6">
                <Box className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                    <Typography className="apple-label-text font-semibold text-(--rf-apple-muted)">
                      รุ่นรถที่จอง
                    </Typography>
                    <Typography className="apple-body-copy mt-1 font-black text-(--rf-apple-ink)">
                      {local.carName}
                    </Typography>
                  </Box>

                  <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                    <Typography className="apple-label-text font-semibold text-(--rf-apple-muted)">
                      ร้านให้เช่า
                    </Typography>
                    <Typography className="apple-body-copy mt-1 font-black text-(--rf-apple-ink)">
                      {local.shopName ?? "-"}
                    </Typography>
                  </Box>
                </Box>

                <Divider className="my-5! border-black/10!" />

                <Box className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                    <Typography className="apple-label-text font-semibold text-(--rf-apple-muted)">
                      วันรับรถ
                    </Typography>
                    <Typography className="apple-body-copy mt-1 font-bold text-(--rf-apple-ink)">
                      {formatBookingDateTime(local.pickupDate)}
                    </Typography>
                    <Typography className="apple-body-sm mt-2 text-(--rf-apple-muted)">
                      {local.pickupLocation ?? "-"}
                    </Typography>
                  </Box>

                  <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                    <Typography className="apple-label-text font-semibold text-(--rf-apple-muted)">
                      วันคืนรถ
                    </Typography>
                    <Typography className="apple-body-copy mt-1 font-bold text-(--rf-apple-ink)">
                      {formatBookingDateTime(local.returnDate)}
                    </Typography>
                    <Typography className="apple-body-sm mt-2 text-(--rf-apple-muted)">
                      {local.returnLocation ?? "-"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={0} className="apple-card p-5 md:p-6">
              <Typography className="apple-card-title font-bold text-(--rf-apple-ink)">
                ข้อมูลผู้จอง
              </Typography>
              <Box className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                  <Typography className="apple-label-text font-semibold text-(--rf-apple-muted)">
                    ชื่อผู้จอง
                  </Typography>
                  <Typography className="apple-body-copy mt-1 font-bold text-(--rf-apple-ink)">
                    {local.customerName ?? "-"}
                  </Typography>
                </Box>

                <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                  <Typography className="apple-label-text font-semibold text-(--rf-apple-muted)">
                    เบอร์โทร
                  </Typography>
                  <Typography className="apple-body-copy mt-1 font-bold text-(--rf-apple-ink)">
                    {local.phone ?? "-"}
                  </Typography>
                </Box>

                {local.notes ? (
                  <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4 sm:col-span-2">
                    <Typography className="apple-label-text font-semibold text-(--rf-apple-muted)">
                      หมายเหตุ
                    </Typography>
                    <Typography className="apple-body-sm mt-1 text-(--rf-apple-ink)">
                      {local.notes}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Paper>
          </Box>

          <Box className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Paper elevation={0} className="apple-card overflow-hidden p-0">
              <Box className="bg-(--rf-brand-dark) p-5 text-white md:p-6">
                <Typography className="apple-label-text font-semibold text-white/75">
                  ยอดรวมที่ต้องชำระ
                </Typography>
                <Typography className="mt-1 text-3xl font-black tracking-[-0.04em] text-white">
                  {formatTHB(p.total)}
                </Typography>
              </Box>

              <Box className="p-5 md:p-6">
                <Typography className="apple-card-title font-bold text-(--rf-apple-ink)">
                  สรุปยอดชำระ
                </Typography>

                <Box className="mt-4 rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                  <Box className="space-y-3">
                    <Box className="flex items-center justify-between gap-3">
                      <Typography className="apple-body-sm text-(--rf-apple-muted)">
                        ค่าเช่ารถ
                      </Typography>
                      <Typography className="apple-body-sm font-semibold text-(--rf-apple-ink)">
                        {formatTHB(p.subtotal)}
                      </Typography>
                    </Box>

                    {p.extraCharge > 0 ? (
                      <Box className="flex items-center justify-between gap-3">
                        <Typography className="apple-body-sm text-(--rf-apple-muted)">
                          ค่าบริการเพิ่ม
                        </Typography>
                        <Typography className="apple-body-sm font-semibold text-(--rf-apple-ink)">
                          {formatTHB(p.extraCharge)}
                        </Typography>
                      </Box>
                    ) : null}

                    {p.discount > 0 ? (
                      <Box className="flex items-center justify-between gap-3">
                        <Typography className="apple-body-sm text-(--rf-apple-muted)">
                          ส่วนลด
                        </Typography>
                        <Typography className="apple-body-sm font-semibold text-(--rf-brand-dark)">
                          -{formatTHB(p.discount)}
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                </Box>

                <Box className="mt-4 grid gap-2">
                  <Button
                    component={Link}
                    href={receiptHref}
                    fullWidth
                    variant="contained"
                    className="rounded-full! bg-slate-900! hover:bg-slate-800!"
                    disabled={local.status === "pending" || local.status === "cancelled"}
                  >
                    ดูใบยืนยันการจอง
                  </Button>

                  <Button
                    variant="outlined"
                    className="rounded-full!"
                    onClick={() => booking.router.back()}
                  >
                    กลับไปหน้ารายการจอง
                  </Button>

                  {booking.canCancel ? (
                    <Button
                      variant="outlined"
                      className="rounded-full! border-rose-200! text-rose-700! hover:border-rose-300!"
                      onClick={() => booking.setOpenCancel(true)}
                    >
                      ยกเลิกการจอง
                    </Button>
                  ) : null}
                </Box>
              </Box>
            </Paper>

            <Paper elevation={0} className="apple-card p-5 md:p-6">
              <Typography className="apple-card-title font-bold text-(--rf-apple-ink)">
                สิ่งที่ต้องเตรียม
              </Typography>
              <Box className="mt-4 grid gap-3">
                {[
                  "เตรียมใบขับขี่และบัตรประชาชนในวันรับรถ",
                  "ตรวจสอบวัน เวลา และสาขาก่อนออกเดินทาง",
                  "หากต้องการเปลี่ยนข้อมูล กรุณาติดต่อทีมงานก่อนวันรับรถ",
                ].map((item) => (
                  <Box
                    key={item}
                    className="rounded-[18px] bg-(--rf-apple-surface-soft) px-4 py-3"
                  >
                    <Typography className="apple-body-sm text-(--rf-apple-muted)">
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>

        <Dialog
          open={booking.openCancel}
          onClose={() => booking.setOpenCancel(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle className="text-base font-semibold">
            ยืนยันการยกเลิกการจอง
          </DialogTitle>

          <DialogContent>
            <Typography className="text-sm text-slate-600">
              ต้องการยกเลิกรายการ{" "}
              <span className="font-semibold text-slate-900">{local.id}</span>{" "}
              ใช่หรือไม่?
            </Typography>

            <Box className="mt-3 rounded-[18px] bg-rose-50 p-3">
              <Typography className="text-xs text-rose-700">
                เมื่อยกเลิกแล้ว จะไม่สามารถกู้คืนสถานะเดิมได้
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions className="p-4">
            <Button
              variant="outlined"
              className="rounded-full!"
              onClick={() => booking.setOpenCancel(false)}
            >
              ย้อนกลับ
            </Button>
            <Button
              variant="contained"
              className="rounded-full! bg-rose-600! hover:bg-rose-700!"
              onClick={booking.doCancel}
            >
              ยกเลิกการจอง
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

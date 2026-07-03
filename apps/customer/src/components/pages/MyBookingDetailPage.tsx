"use client";

import * as React from "react";
import Link from "next/link";
import { formatTHB } from "@/src/constants/money";
import { formatBookingDateTime } from "@/src/lib/booking-datetime";
import {
  Box,
  Container,
  Typography,
  Divider,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import StatusChip from "@/src/components/my-bookings/detail/StatusChip";
import StatusTimeline from "@/src/components/my-bookings/detail/StatusTimeline";
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

  if (
    !booking.ready ||
    booking.isCheckingAuth ||
    !booking.isAuthenticated
  ) {
    return <MyBookingDetailPageSkeleton />;
  }

  if (!booking.id) return null;

  if (!local) {
    return (
      <Box className="apple-page">
        <Container maxWidth="lg" className="apple-section">
          <Box className="mx-auto max-w-3xl text-center">
            <Box className="flex flex-col gap-4">
              <Typography
                className="apple-heading apple-section-title"
              >
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
            <Typography
              className="apple-heading apple-section-title"
            >
              รายละเอียดการจอง
            </Typography>
            <Typography className="apple-subtitle text-lg">
              ตรวจสอบข้อมูลการรับ-คืนรถ สถานะรายการ และสรุปราคาได้ในหน้าเดียว
            </Typography>
          </Box>
        </Box>

        <Box className="apple-card mt-10 p-5! md:p-6!">
          <Box className="flex flex-col gap-5">
            <Box className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <Box className="space-y-3">
                <Box>
                  <Typography className="text-xs font-semibold uppercase tracking-[0.16em] text-(--rf-apple-muted)">
                    ภาพรวมรายการ
                  </Typography>
                  <Typography className="apple-card-title-lg mt-2 font-black tracking-[-0.04em] text-(--rf-apple-ink)">
                    {local.carName}
                  </Typography>
                  <Typography className="mt-2 text-sm text-(--rf-apple-muted)">
                    รหัสการจอง:{" "}
                    <span className="font-semibold text-(--rf-apple-ink)">
                      {local.id}
                    </span>
                  </Typography>
                </Box>

                <Box className="flex flex-wrap items-center gap-2">
                  <StatusChip s={local.status} />
                  <Box className="flex flex-col gap-2 text-left">
                    <Typography className="text-sm text-(--rf-apple-muted)">
                      วันรับรถ:{" "}
                      <span className="font-semibold text-(--rf-apple-ink)">
                        {formatBookingDateTime(local.pickupDate)}
                      </span>
                    </Typography>
                    <Typography className="text-sm text-(--rf-apple-muted)">
                      วันคืนรถ:{" "}
                      <span className="font-semibold text-(--rf-apple-ink)">
                        {formatBookingDateTime(local.returnDate)}
                      </span>
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outlined"
                  className="rounded-full!"
                  onClick={() => booking.router.back()}
                >
                  ย้อนกลับ
                </Button>

                <Button
                  variant="outlined"
                  className="rounded-full! border-rose-200! text-rose-700! hover:border-rose-300!"
                  disabled={!booking.canCancel}
                  onClick={() => booking.setOpenCancel(true)}
                >
                  ยกเลิกการจอง
                </Button>

                <Button
                  component={Link}
                  href="/contact"
                  variant="contained"
                  className="rounded-full! bg-slate-900! hover:bg-slate-800!"
                >
                  ติดต่อแอดมิน
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Box className="space-y-5 md:col-span-2">
            <Paper elevation={0} className="apple-card p-5">
              <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                <StatusTimeline status={local.status} />
              </Box>

              <Divider className="my-4! border-black/10!" />

              <Typography className="text-sm font-semibold tracking-[-0.03em] text-slate-900">
                ข้อมูลรับ-คืนรถ
              </Typography>
              <Typography className="mt-1 text-sm text-(--rf-apple-muted)">
                ดูสถานที่และวันที่สำหรับการรับรถและคืนรถของรายการนี้
              </Typography>
              <Divider className="my-4! border-black/10!" />

              <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                  <Typography className="text-xs text-slate-500">
                    สถานที่รับรถ
                  </Typography>
                  <Typography className="mt-1 text-sm font-semibold text-slate-900">
                    {local.pickupLocation ?? "-"}
                  </Typography>
                  <Typography className="mt-2 text-xs text-slate-600">
                    วันที่รับรถ: {formatBookingDateTime(local.pickupDate)}
                  </Typography>
                </Box>

                <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                  <Typography className="text-xs text-slate-500">
                    สถานที่คืนรถ
                  </Typography>
                  <Typography className="mt-1 text-sm font-semibold text-slate-900">
                    {local.returnLocation ?? "-"}
                  </Typography>
                  <Typography className="mt-2 text-xs text-slate-600">
                    วันที่คืนรถ: {formatBookingDateTime(local.returnDate)}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={0} className="apple-card p-5">
              <Typography className="text-sm font-semibold tracking-[-0.03em] text-slate-900">
                ข้อมูลผู้จอง
              </Typography>
              <Typography className="mt-1 text-sm text-(--rf-apple-muted)">
                ข้อมูลอ้างอิงสำหรับผู้จองและการประสานงาน
              </Typography>
              <Divider className="my-4! border-black/10!" />

              <Box className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                  <Typography className="text-xs text-slate-500">ชื่อ</Typography>
                  <Typography className="mt-1 text-sm font-semibold text-slate-900">
                    {local.customerName ?? "-"}
                  </Typography>
                </Box>

                <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                  <Typography className="text-xs text-slate-500">เบอร์โทร</Typography>
                  <Typography className="mt-1 text-sm font-semibold text-slate-900">
                    {local.phone ?? "-"}
                  </Typography>
                </Box>

                <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                  <Typography className="text-xs text-slate-500">หมายเหตุ</Typography>
                  <Typography className="mt-1 text-sm font-semibold text-slate-900">
                    {local.notes ?? "-"}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={0} className="apple-card p-5">
              <Typography className="text-sm font-semibold tracking-[-0.03em] text-slate-900">
                เงื่อนไขสำคัญ
              </Typography>
              <Typography className="mt-1 text-sm text-(--rf-apple-muted)">
                ข้อมูลสำคัญที่ควรทราบก่อนถึงวันรับรถ
              </Typography>
              <Divider className="my-4! border-black/10!" />

              <Box className="grid gap-3">
                {[
                  "โปรดนำใบขับขี่และบัตรประชาชนมาแสดงตอนรับรถ",
                  "การยกเลิกอาจมีค่าธรรมเนียมตามเงื่อนไขบริษัท",
                  "หากต้องการเปลี่ยนวันรับ-คืนรถ ให้ติดต่อแอดมิน",
                ].map((item) => (
                  <Box
                    key={item}
                    className="rounded-[22px] bg-(--rf-apple-surface-soft) px-4 py-3"
                  >
                    <Typography className="text-sm text-slate-600">
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>

          <Box className="space-y-5">
            <Paper elevation={0} className="apple-card p-5">
              <Typography className="text-sm font-semibold tracking-[-0.03em] text-slate-900">
                สรุปราคา
              </Typography>
              <Typography className="mt-1 text-sm text-(--rf-apple-muted)">
                ตรวจสอบยอดรวมและเอกสารยืนยันของรายการนี้
              </Typography>
              <Divider className="my-4! border-black/10!" />

              <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                <Box className="space-y-2">
                  <Box className="flex items-center justify-between">
                    <Typography className="text-sm text-slate-600">
                      ค่าเช่ารถ
                    </Typography>
                    <Typography className="text-sm text-slate-900">
                      {formatTHB(p.subtotal)}
                    </Typography>
                  </Box>

                  {p.extraCharge > 0 ? (
                    <Box className="flex items-center justify-between">
                      <Typography className="text-sm text-slate-600">
                        ค่าบริการเพิ่ม
                      </Typography>
                      <Typography className="text-sm text-slate-900">
                        {formatTHB(p.extraCharge)}
                      </Typography>
                    </Box>
                  ) : null}

                  {p.discount > 0 ? (
                    <Box className="flex items-center justify-between">
                      <Typography className="text-sm text-slate-600">
                        ส่วนลด
                      </Typography>
                      <Typography className="text-sm text-emerald-700">
                        -{formatTHB(p.discount)}
                      </Typography>
                    </Box>
                  ) : null}

                  <Divider className="my-3! border-black/10!" />

                  <Box className="flex items-center justify-between">
                    <Typography className="text-sm font-semibold text-slate-900">
                      ยอดรวม
                    </Typography>
                    <Typography className="text-base font-bold text-slate-900">
                      {formatTHB(p.total)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box className="mt-4 rounded-[22px]! bg-(--rf-apple-surface-soft) p-4">
                <Typography className="text-xs leading-6 text-slate-600">
                  ใบเสร็จหรือเอกสารยืนยันจะพร้อมหลังสถานะ “ยืนยันแล้ว”
                </Typography>
              </Box>

              <Box className="mt-4 flex gap-2">
                <Button
                  component={Link}
                  href={receiptHref}
                  fullWidth
                  variant="outlined"
                  className="rounded-full!"
                  disabled={local.status === "pending" || local.status === "cancelled"}
                >
                  ดาวน์โหลดใบยืนยัน
                </Button>
              </Box>
            </Paper>

            <Paper elevation={0} className="apple-card p-5">
              <Typography className="text-sm font-semibold tracking-[-0.03em] text-slate-900">
                การช่วยเหลือ
              </Typography>
              <Typography className="mt-1 text-sm text-(--rf-apple-muted)">
                ติดต่อทีมงานได้ทันทีหากต้องการแก้ไขข้อมูลหรือมีปัญหาระหว่างการใช้งาน
              </Typography>
              <Divider className="my-4! border-black/10!" />
              <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                <Typography className="text-sm text-slate-600">
                  หากพบปัญหาเรื่องการรับรถ คืนรถ หรืออยากเปลี่ยนข้อมูล
                  กรุณาติดต่อแอดมินเพื่อให้ทีมงานช่วยดูแลต่อ
                </Typography>
              </Box>

              <Box className="mt-3">
                <Button
                  component={Link}
                  href="/contact"
                  variant="contained"
                  className="rounded-full! bg-slate-900! hover:bg-slate-800!"
                  fullWidth
                >
                  ไปที่ศูนย์ช่วยเหลือ
                </Button>
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

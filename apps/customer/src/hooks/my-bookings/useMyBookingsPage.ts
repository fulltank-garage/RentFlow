"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRentFlowCarRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowCarRealtimeRefresh";
import usePageReady from "@/src/hooks/usePageReady";
import { getErrorStatus } from "@/src/lib/api-error";
import { buildPendingBookingPaymentHref } from "@/src/lib/pending-booking-payment";
import { getRentFlowCarTenantSlug } from "@/src/lib/tenant";
import { clearCachedSessionUser } from "@/src/services/auth/auth.service";
import { bookingApi } from "@/src/services/booking/booking.service";
import type { BookingAddon as BookingAddonItem } from "@/src/services/booking/booking.types";
import { getCars } from "@/src/services/cars/cars.service";
import { usersApi } from "@/src/services/users/users.service";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "active"
  | "review"
  | "chat"
  | "completed"
  | "cancelled";

export type Booking = {
  id: string;
  carId: string;
  carName: string;
  shopName?: string;
  tenantSlug?: string;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status: BookingStatus;
  bookingMode?: "payment" | "chat" | string;
  pickupLocation?: string;
  returnLocation?: string;
  pickupLocationValue?: string;
  returnLocationValue?: string;
  pickupMethod?: "branch" | "custom";
  returnMethod?: "branch" | "custom";
  customerName?: string;
  customerPhone?: string;
  note?: string;
  addons?: BookingAddonItem[];
  resumeHref?: string;
  paymentHref?: string;
};

export default function useMyBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ready = usePageReady();
  const tenantSlug = searchParams.get("tenant") || getRentFlowCarTenantSlug() || undefined;

  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<BookingStatus | "all">("all");
  const [rows, setRows] = React.useState<Booking[]>([]);
  const [reloadTick, setReloadTick] = React.useState(0);

  const refreshFromRealtime = React.useCallback(() => {
    setReloadTick((current) => current + 1);
  }, []);

  useRentFlowCarRealtimeRefresh({
    events: [
      "booking.created",
      "booking.updated",
      "booking.cancelled",
      "payment.created",
      "payment.updated",
      "notification.new",
    ],
    onRefresh: refreshFromRealtime,
    tenantSlug,
  });

  React.useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      try {
        await usersApi.getMe();

        const [bookingsRes, carsRes] = await Promise.all([
          bookingApi.getMyBookings({ tenantSlug }),
          getCars(undefined, {
            marketplace: !tenantSlug,
            tenantSlug,
          }).catch(() => ({ items: [] })),
        ]);

        if (cancelled) return;

        const carMap = new Map(carsRes.items.map((car) => [car.id, car]));

        setRows(
          bookingsRes.data.map((booking) => {
            const car = carMap.get(booking.carId);
            const bookingTenantSlug =
              car?.domainSlug || booking.domainSlug || tenantSlug;
            const carName = booking.carName || car?.name || booking.carId;
            const shopName = car?.shopName || booking.shopName;
            const bookingMode = booking.bookingMode || car?.bookingMode;
            const isPaymentBooking = bookingMode === "payment";

            return {
              id: booking.bookingCode,
              carId: booking.carId,
              carName,
              shopName,
              tenantSlug: bookingTenantSlug,
              pickupDate: booking.pickupDate,
              returnDate: booking.returnDate,
              totalPrice: booking.totalAmount,
              status: booking.status,
              bookingMode,
              pickupLocation: booking.pickupLocation,
              returnLocation: booking.returnLocation,
              pickupLocationValue: booking.pickupLocationValue,
              returnLocationValue: booking.returnLocationValue,
              pickupMethod: booking.pickupMethod,
              returnMethod: booking.returnMethod,
              customerName: booking.customerName,
              customerPhone: booking.customerPhone,
              note: booking.note,
              addons: booking.addons,
              paymentHref:
                isPaymentBooking && booking.status === "pending"
                  ? buildPendingBookingPaymentHref({
                      ...booking,
                      carName,
                      shopName,
                      tenantSlug: bookingTenantSlug,
                    })
                  : undefined,
            };
          })
        );
        setIsAuthenticated(true);
      } catch (err: unknown) {
        if (cancelled) return;

        if (getErrorStatus(err) === 401) {
          clearCachedSessionUser();
          router.replace(
            `/login?redirect=${encodeURIComponent(
              tenantSlug ? `/my-bookings?tenant=${tenantSlug}` : "/my-bookings"
            )}`
          );
          return;
        }

        setRows([]);
        setIsAuthenticated(true);
      } finally {
        if (!cancelled) {
          setIsCheckingAuth(false);
        }
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [reloadTick, router, tenantSlug]);

  const data = React.useMemo(() => {
    return rows.filter((b) => {
      const s = q.trim().toLowerCase();

      const matchQ =
        !s ||
        b.id.toLowerCase().includes(s) ||
        b.carName.toLowerCase().includes(s);

      const matchS = status === "all" ? true : b.status === status;

      return matchQ && matchS;
    });
  }, [q, rows, status]);

  const handleReset = React.useCallback(() => {
    setQ("");
    setStatus("all");
  }, []);

  return {
    ready,
    isCheckingAuth,
    isAuthenticated,
    q,
    setQ,
    status,
    setStatus,
    data,
    handleReset,
  };
}

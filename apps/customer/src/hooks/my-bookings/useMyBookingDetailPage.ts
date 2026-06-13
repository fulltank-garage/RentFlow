"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useRentFlowRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowRealtimeRefresh";
import usePageReady from "@/src/hooks/usePageReady";
import { getErrorStatus } from "@/src/lib/api-error";
import { clearCachedSessionUser } from "@/src/services/auth/auth.service";
import { bookingApi } from "@/src/services/booking/booking.service";
import { getCarById } from "@/src/services/cars/cars.service";
import { usersApi } from "@/src/services/users/users.service";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "active"
  | "review"
  | "completed"
  | "cancelled";

export type Booking = {
  id: string;
  bookingRef: string;
  carId: string;
  carName: string;
  shopName?: string;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status: BookingStatus;
  pickupLocation?: string;
  returnLocation?: string;
  customerName?: string;
  phone?: string;
  notes?: string;
  subtotal: number;
  extraCharge: number;
  discount: number;
};

export default function useMyBookingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const ready = usePageReady();

  const id = typeof params?.id === "string" ? params.id : "";
  const tenantSlug = searchParams.get("tenant") || undefined;
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);
  const [local, setLocal] = React.useState<Booking | null>(null);
  const [reloadTick, setReloadTick] = React.useState(0);

  const refreshFromRealtime = React.useCallback(
    (event: { entityId?: string; data?: Record<string, unknown> }) => {
      const bookingId = String(event.data?.id || event.entityId || "");
      const bookingCode = String(event.data?.bookingCode || "");
      if (!bookingId || bookingId === id || bookingCode === id) {
        setReloadTick((current) => current + 1);
      }
    },
    [id]
  );

  useRentFlowRealtimeRefresh({
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

    async function loadBooking() {
      if (!id) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        await usersApi.getMe();

        const bookingRes = await bookingApi.getBookingById(id, { tenantSlug });
        const booking = bookingRes.data;
        const car = await getCarById(booking.carId, { tenantSlug }).catch(
          () => null
        );

        if (cancelled) return;

        setLocal({
          id: booking.bookingCode,
          bookingRef: booking.id,
          carId: booking.carId,
          carName: booking.carName || car?.name || booking.carId,
          shopName: booking.shopName || car?.shopName,
          pickupDate: booking.pickupDate,
          returnDate: booking.returnDate,
          totalPrice: booking.totalAmount,
          status: booking.status,
          pickupLocation: booking.pickupLocation,
          returnLocation: booking.returnLocation,
          customerName: booking.customerName,
          phone: booking.customerPhone,
          notes: booking.note,
          subtotal: booking.subtotal,
          extraCharge: booking.extraCharge,
          discount: booking.discount,
        });
        setIsAuthenticated(true);
      } catch (err: unknown) {
        if (cancelled) return;

        if (getErrorStatus(err) === 401) {
          clearCachedSessionUser();
          router.replace(
            `/login?redirect=${encodeURIComponent(
              tenantSlug
                ? `/my-bookings/${id}?tenant=${tenantSlug}`
                : `/my-bookings/${id}`
            )}`
          );
          return;
        }

        setLocal(null);
        setIsAuthenticated(true);
      } finally {
        if (!cancelled) {
          setIsCheckingAuth(false);
        }
      }
    }

    loadBooking();

    return () => {
      cancelled = true;
    };
  }, [id, reloadTick, router, tenantSlug]);

  const canCancel =
    local?.status === "pending" ||
    local?.status === "confirmed" ||
    local?.status === "paid";

  const pricing = React.useMemo(
    () => ({
      subtotal: local?.subtotal ?? 0,
      extraCharge: local?.extraCharge ?? 0,
      discount: local?.discount ?? 0,
      total: local?.totalPrice ?? 0,
    }),
    [local?.discount, local?.extraCharge, local?.subtotal, local?.totalPrice]
  );

  const doCancel = React.useCallback(async () => {
    if (!local) return;

    try {
      const res = await bookingApi.cancelBooking(local.bookingRef, {
        tenantSlug,
      });
      setLocal((prev) =>
        prev
          ? {
              ...prev,
              status: res.data.status,
            }
          : prev
      );
      setOpenCancel(false);
    } catch {
      setOpenCancel(false);
    }
  }, [local, tenantSlug]);

  return {
    ready,
    isCheckingAuth,
    isAuthenticated,
    id,
    local,
    openCancel,
    setOpenCancel,
    canCancel,
    pricing,
    doCancel,
    router,
  };
}

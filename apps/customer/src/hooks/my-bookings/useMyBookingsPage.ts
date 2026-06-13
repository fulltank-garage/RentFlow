"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRentFlowRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowRealtimeRefresh";
import usePageReady from "@/src/hooks/usePageReady";
import { getErrorStatus } from "@/src/lib/api-error";
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
};

function normalizeDateForInput(value?: string) {
  if (!value) return "";
  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildResumeBookingHref(booking: {
  carId: string;
  tenantSlug?: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation?: string;
  returnLocation?: string;
  pickupLocationValue?: string;
  returnLocationValue?: string;
  pickupMethod?: "branch" | "custom";
  returnMethod?: "branch" | "custom";
  customerName?: string;
  customerPhone?: string;
  addons?: BookingAddonItem[];
}) {
  const params = new URLSearchParams();

  params.set("carId", booking.carId);
  params.set("pickupDate", normalizeDateForInput(booking.pickupDate));
  params.set("returnDate", normalizeDateForInput(booking.returnDate));

  if (booking.tenantSlug) {
    params.set("tenant", booking.tenantSlug);
  }

  const pickupLocation =
    booking.pickupLocationValue || booking.pickupLocation || "";
  const returnLocation =
    booking.returnLocationValue || booking.returnLocation || "";

  if (pickupLocation) {
    params.set("pickupLocation", pickupLocation);
  }

  if (returnLocation) {
    params.set("returnLocation", returnLocation);
  }

  if (booking.pickupMethod) {
    params.set("pickupMethod", booking.pickupMethod);
  }

  if (booking.returnMethod) {
    params.set("returnMethod", booking.returnMethod);
  }

  if (booking.customerName) {
    params.set("fullName", booking.customerName);
  }

  if (booking.customerPhone) {
    params.set("phone", booking.customerPhone);
  }

  const addonIds =
    booking.addons
      ?.map((addon) => addon.id || addon.key)
      .filter((value): value is string => Boolean(value)) ?? [];
  if (addonIds.length) {
    params.set("addons", JSON.stringify(addonIds));
  }

  return `/booking?${params.toString()}`;
}

export default function useMyBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ready = usePageReady();
  const tenantSlug = searchParams.get("tenant") || undefined;

  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<BookingStatus | "all">("all");
  const [rows, setRows] = React.useState<Booking[]>([]);
  const [reloadTick, setReloadTick] = React.useState(0);

  const refreshFromRealtime = React.useCallback(() => {
    setReloadTick((current) => current + 1);
  }, []);

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

    async function loadBookings() {
      try {
        await usersApi.getMe();

        const [bookingsRes, carsRes] = await Promise.all([
          bookingApi.getMyBookings({ tenantSlug }),
          getCars(undefined, { tenantSlug }).catch(() => ({ items: [] })),
        ]);

        if (cancelled) return;

        const carMap = new Map(carsRes.items.map((car) => [car.id, car]));

        setRows(
          bookingsRes.data.map((booking) => ({
            id: booking.bookingCode,
            carId: booking.carId,
            carName:
              booking.carName || carMap.get(booking.carId)?.name || booking.carId,
            shopName: carMap.get(booking.carId)?.shopName || booking.shopName,
            tenantSlug:
              carMap.get(booking.carId)?.domainSlug ||
              booking.domainSlug ||
              tenantSlug,
            pickupDate: booking.pickupDate,
            returnDate: booking.returnDate,
            totalPrice: booking.totalAmount,
            status: booking.status,
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
            resumeHref:
              booking.status === "pending"
                ? buildResumeBookingHref({
                    carId: booking.carId,
                    tenantSlug:
                      carMap.get(booking.carId)?.domainSlug ||
                      booking.domainSlug ||
                      tenantSlug,
                    pickupDate: booking.pickupDate,
                    returnDate: booking.returnDate,
                    pickupLocation: booking.pickupLocation,
                    returnLocation: booking.returnLocation,
                    pickupLocationValue: booking.pickupLocationValue,
                    returnLocationValue: booking.returnLocationValue,
                    pickupMethod: booking.pickupMethod,
                    returnMethod: booking.returnMethod,
                    customerName: booking.customerName,
                    customerPhone: booking.customerPhone,
                    addons: booking.addons,
                  })
                : undefined,
          }))
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

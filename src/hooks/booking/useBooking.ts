"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRentFlowRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowRealtimeRefresh";
import { useRentFlowSiteMode } from "@/src/hooks/useRentFlowSiteMode";
import { getErrorMessage, getErrorStatus } from "@/src/lib/api-error";
import { navigateBookingFlow } from "@/src/lib/booking-flow-navigation";
import { addonsApi } from "@/src/services/addons/addons.service";
import type { StorefrontAddon } from "@/src/services/addons/addons.types";
import { availabilityApi } from "@/src/services/availability/availability.service";
import { branchesApi } from "@/src/services/branches/branches.service";
import { OTHER_OPTION } from "@/src/constants/booking.constants";
import { parseDateTime, diffDaysCeil } from "@/src/utils/booking/booking.date";
import {
  buildChatHref,
  buildChatMessage,
  copyChatMessage,
} from "@/src/utils/booking/booking.format";
import {
  calcAddonsTotal,
  getSelectedAddonTitles,
} from "@/src/utils/booking/booking.pricing";
import { bookingApi } from "@/src/services/booking/booking.service";
import { getCarById } from "@/src/services/cars/cars.service";
import type { Car } from "@/src/services/cars/cars.types";
import { usersApi } from "@/src/services/users/users.service";
import useBookingValidation from "./useBookingValidation";
import { safeParseAddonIds } from "@/src/utils/payment/payment.helpers";

function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDateForInput(value?: string | null) {
  if (!value) return "";
  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function combineDateAndTime(date: string, time: string) {
  if (!date) return "";
  return `${date} ${time || "10:00"}`;
}

function clampDateToToday(value?: string | null) {
  const normalized = normalizeDateForInput(value);
  if (!normalized) return "";
  const today = getTodayLocalDate();
  return normalized < today ? today : normalized;
}

function resolveBranchPrefill(method: string | null, location: string) {
  if (!location) {
    return {
      branchValue: "",
      otherValue: "",
      freeTextValue: "",
    };
  }

  if (method === "branch") {
    return {
      branchValue: location,
      otherValue: "",
      freeTextValue: location,
    };
  }

  return {
    branchValue: OTHER_OPTION,
    otherValue: location,
    freeTextValue: location,
  };
}

function buildAddonPayload(
  selectedAddonIds: string[],
  addonOptions: StorefrontAddon[]
) {
  const selectedIds = new Set(selectedAddonIds);
  return addonOptions
    .filter((addon) => selectedIds.has(addon.id))
    .map((addon) => ({
      id: addon.id,
      key: addon.id,
      name: addon.name,
      title: addon.name,
      price: addon.price,
      pricing: addon.pricing,
    }));
}

export default function useBooking() {
  const params = useSearchParams();
  const router = useRouter();
  const siteMode = useRentFlowSiteMode();

  const carId = params.get("carId") || "";
  const tenantSlugFromUrl = params.get("tenant") || "";
  const prefillFullName = params.get("fullName") || "";
  const prefillPhone = params.get("phone") || "";
  const prefillPickupMethod = params.get("pickupMethod");
  const prefillReturnMethod = params.get("returnMethod");
  const prefillPickupLocation =
    params.get("pickupLocation") || params.get("pickupPoint") || "";
  const prefillReturnLocation =
    params.get("returnLocation") || params.get("returnPoint") || "";
  const prefillAddonsRaw = params.get("addons");
  const initialPickupDate = React.useMemo(
    () => clampDateToToday(params.get("pickupDate")),
    [params]
  );
  const initialReturnDate = React.useMemo(() => {
    const normalized = clampDateToToday(params.get("returnDate"));
    if (!normalized) return "";
    return normalized < initialPickupDate ? initialPickupDate : normalized;
  }, [initialPickupDate, params]);

  const initialPickupPrefill = React.useMemo(
    () => resolveBranchPrefill(prefillPickupMethod, prefillPickupLocation),
    [prefillPickupLocation, prefillPickupMethod]
  );
  const initialReturnPrefill = React.useMemo(
    () => resolveBranchPrefill(prefillReturnMethod, prefillReturnLocation),
    [prefillReturnLocation, prefillReturnMethod]
  );

  const [car, setCar] = React.useState<Car | null>(null);
  const [branchOptions, setBranchOptions] = React.useState<string[]>([]);
  const [addonOptions, setAddonOptions] = React.useState<StorefrontAddon[]>([]);

  const [fullName, setFullName] = React.useState(prefillFullName);
  const [phone, setPhone] = React.useState(prefillPhone);

  const [pickupBranch, setPickupBranch] = React.useState<string>(
    initialPickupPrefill.branchValue
  );
  const [returnBranch, setReturnBranch] = React.useState<string>(
    initialReturnPrefill.branchValue
  );
  const [pickupOther, setPickupOther] = React.useState(initialPickupPrefill.otherValue);
  const [returnOther, setReturnOther] = React.useState(initialReturnPrefill.otherValue);

  const [pickupFreeText, setPickupFreeText] = React.useState(
    initialPickupPrefill.freeTextValue
  );
  const [returnFreeText, setReturnFreeText] = React.useState(
    initialReturnPrefill.freeTextValue
  );

  const [pickupDate, setPickupDate] = React.useState(initialPickupDate);
  const [pickupTime, setPickupTime] = React.useState(params.get("pickupTime") || "10:00");
  const [returnDate, setReturnDate] = React.useState(initialReturnDate);
  const [returnTime, setReturnTime] = React.useState(params.get("returnTime") || "10:00");
  const merchantBranchesEnabled = branchOptions.length > 0;

  const [selectedAddonIds, setSelectedAddonIds] = React.useState<string[]>(
    () => safeParseAddonIds(prefillAddonsRaw)
  );

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [carReloadTick, setCarReloadTick] = React.useState(0);
  const [branchReloadTick, setBranchReloadTick] = React.useState(0);
  const [addonReloadTick, setAddonReloadTick] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [checkingAuth, setCheckingAuth] = React.useState(true);
  const [pricing, setPricing] = React.useState<{
    discountPct: number;
    subTotal: number;
    discount: number;
    total: number;
    extraCharge: number;
  } | null>(null);

  const fieldSX = React.useMemo(
    () => ({
      "& .MuiOutlinedInput-root": { borderRadius: "14px" },
    }),
    []
  );

  React.useEffect(() => {
    if (pickupDate && !returnDate) setReturnDate(pickupDate);
  }, [pickupDate, returnDate]);

  React.useEffect(() => {
    const today = getTodayLocalDate();

    if (pickupDate && pickupDate < today) {
      setPickupDate(today);
      return;
    }

    if (returnDate && returnDate < (pickupDate || today)) {
      setReturnDate(pickupDate || today);
    }
  }, [pickupDate, returnDate]);

  React.useEffect(() => {
    if (pickupTime && !returnTime) setReturnTime(pickupTime);
  }, [pickupTime, returnTime]);

  const startDT = React.useMemo(
    () => parseDateTime(pickupDate, pickupTime),
    [pickupDate, pickupTime]
  );

  const endDT = React.useMemo(
    () => parseDateTime(returnDate, returnTime),
    [returnDate, returnTime]
  );

  const timeInvalid = React.useMemo(() => {
    if (!startDT || !endDT) return false;
    return endDT.getTime() < startDT.getTime();
  }, [startDT, endDT]);

  const days = React.useMemo(() => {
    if (!startDT || !endDT) return 0;
    if (endDT.getTime() < startDT.getTime()) return 0;
    return diffDaysCeil(startDT, endDT);
  }, [startDT, endDT]);

  const finalPickupPoint = React.useMemo(() => {
    if (!merchantBranchesEnabled) return pickupFreeText.trim();
    if (pickupBranch === OTHER_OPTION) return pickupOther.trim();
    return pickupBranch;
  }, [merchantBranchesEnabled, pickupBranch, pickupOther, pickupFreeText]);

  const finalReturnPoint = React.useMemo(() => {
    if (!merchantBranchesEnabled) return returnFreeText.trim();
    if (returnBranch === OTHER_OPTION) return returnOther.trim();
    return returnBranch;
  }, [merchantBranchesEnabled, returnBranch, returnOther, returnFreeText]);

  const addonsTotal = React.useMemo(
    () => calcAddonsTotal(addonOptions, selectedAddonIds, days),
    [addonOptions, selectedAddonIds, days]
  );

  const amount = pricing?.total ?? 0;
  const effectiveTenantSlug = React.useMemo(
    () => car?.domainSlug || tenantSlugFromUrl || undefined,
    [car?.domainSlug, tenantSlugFromUrl]
  );

  useRentFlowRealtimeRefresh({
    events: [
      "booking.created",
      "booking.updated",
      "booking.cancelled",
      "car.changed",
      "car.status.changed",
      "availability.changed",
      "tenant.updated",
    ],
    onRefresh: React.useCallback(() => {
      setCarReloadTick((current) => current + 1);
    }, []),
    tenantSlug: effectiveTenantSlug,
    marketplace: siteMode === "marketplace" && !effectiveTenantSlug,
    enabled: Boolean(carId),
  });

  useRentFlowRealtimeRefresh({
    events: ["branch.changed", "tenant.updated"],
    onRefresh: React.useCallback(() => {
      setBranchReloadTick((current) => current + 1);
    }, []),
    tenantSlug: effectiveTenantSlug,
    enabled: Boolean(effectiveTenantSlug),
  });

  useRentFlowRealtimeRefresh({
    events: ["addon.changed", "tenant.updated"],
    onRefresh: React.useCallback(() => {
      setAddonReloadTick((current) => current + 1);
    }, []),
    tenantSlug: effectiveTenantSlug,
    enabled: siteMode === "storefront" || Boolean(effectiveTenantSlug),
  });

  const [isCheckingAvailability, setIsCheckingAvailability] =
    React.useState(false);
  const [isDateAvailable, setIsDateAvailable] = React.useState<boolean | null>(
    null
  );
  const [unavailableDates, setUnavailableDates] = React.useState<string[]>([]);

  const isCarAvailable = React.useMemo(() => {
    if (!car?.isAvailable) return false;
    if (isDateAvailable === false) return false;
    return true;
  }, [car?.isAvailable, isDateAvailable]);
  const bookingMode = car?.bookingMode === "payment" ? "payment" : "chat";
  const chatThresholdTHB = Math.max(car?.chatThresholdTHB ?? 0, 0);
  const forceChatBooking = bookingMode === "chat";
  const hasChatChannel = Boolean(
    car?.lineOfficialAccount?.chatUrl || car?.lineOfficialAccount?.shareUrl
  );

  const availabilityMessage = React.useMemo(() => {
    if (car && car.isAvailable === false) {
      return "รถคันนี้มีการจองแล้ว ไม่สามารถกดจองได้ในตอนนี้";
    }

    if (isDateAvailable === false) {
      return "รถคันนี้ถูกจองแล้วในช่วงวันที่คุณเลือก กรุณาเปลี่ยนวันรับหรือคืนรถ";
    }

    return null;
  }, [car, isDateAvailable]);

  const { locationOk, canSubmit } = useBookingValidation({
    carExists: !!car,
    carAvailable: isCarAvailable,
    merchantBranchesEnabled,
    fullName,
    phone,
    pickupDate,
    returnDate,
    pickupTime,
    returnTime,
    pickupBranch,
    pickupOther,
    returnBranch,
    returnOther,
    pickupFreeText,
    returnFreeText,
    timeInvalid,
  });

  React.useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      const tasks = await Promise.allSettled([
        carId
          ? getCarById(carId, {
              marketplace: siteMode === "marketplace",
              tenantSlug: tenantSlugFromUrl || undefined,
            })
          : Promise.resolve(null),
        usersApi.getMe(),
      ]);

      if (cancelled) return;

      const [carResult, profileResult] = tasks;

      if (carResult.status === "fulfilled") {
        setCar(carResult.value);
      }

      if (profileResult.status === "fulfilled") {
        const user = profileResult.value.data;
        const displayName =
          user.name ||
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.username ||
          "";
        setFullName((prev) => prev || displayName);
        setPhone((prev) => prev || user.phone || "");
        setCheckingAuth(false);
        return;
      }

      if (getErrorStatus(profileResult.reason) === 401) {
        const redirectQuery = params.toString();
        const redirectPath = redirectQuery ? `/booking?${redirectQuery}` : "/booking";

        router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`);
        return;
      }

      setCheckingAuth(false);
    }

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, [carId, carReloadTick, params, router, siteMode, tenantSlugFromUrl]);

  React.useEffect(() => {
    let cancelled = false;

    async function loadBranches() {
      if (!effectiveTenantSlug) {
        setBranchOptions([]);
        return;
      }

      try {
        const res = await branchesApi.getBranches({
          tenantSlug: effectiveTenantSlug,
        });
        if (cancelled) return;

        const options = Array.from(
          new Set(
            (res.data ?? [])
              .map((branch) => branch.name?.trim())
              .filter((value): value is string => Boolean(value))
          )
        );

        if (!options.length) {
          setBranchOptions([]);
          return;
        }

        setBranchOptions(options);
      } catch {
        if (!cancelled) {
          setBranchOptions([]);
        }
      }
    }

    loadBranches();

    return () => {
      cancelled = true;
    };
  }, [branchReloadTick, effectiveTenantSlug]);

  React.useEffect(() => {
    if (!merchantBranchesEnabled) {
      if (!pickupFreeText.trim() && pickupBranch && pickupBranch !== OTHER_OPTION) {
        setPickupFreeText(pickupBranch);
      }
      if (!returnFreeText.trim() && returnBranch && returnBranch !== OTHER_OPTION) {
        setReturnFreeText(returnBranch);
      }
      return;
    }

    setPickupBranch((prev) => {
      if (prev === OTHER_OPTION) return prev;
      if (prev && branchOptions.includes(prev)) return prev;
      if (prev && !branchOptions.includes(prev)) {
        setPickupOther(prev);
        return OTHER_OPTION;
      }
      return branchOptions[0] || "";
    });
    setReturnBranch((prev) => {
      if (prev === OTHER_OPTION) return prev;
      if (prev && branchOptions.includes(prev)) return prev;
      if (prev && !branchOptions.includes(prev)) {
        setReturnOther(prev);
        return OTHER_OPTION;
      }
      return branchOptions[0] || "";
    });
  }, [
    branchOptions,
    merchantBranchesEnabled,
    pickupBranch,
    pickupFreeText,
    returnBranch,
    returnFreeText,
  ]);

  React.useEffect(() => {
    let cancelled = false;

    async function loadAddons() {
      if (siteMode === "marketplace" && !effectiveTenantSlug) {
        setAddonOptions([]);
        return;
      }

      try {
        const res = await addonsApi.getAddons(
          effectiveTenantSlug ? { tenantSlug: effectiveTenantSlug } : undefined
        );

        if (cancelled) return;

        const items = res.data?.items ?? [];
        setAddonOptions(items);
        setSelectedAddonIds((prev) => {
          const validIds = new Set(items.map((item) => item.id));
          return prev.filter((id) => validIds.has(id));
        });
      } catch {
        if (!cancelled) {
          setAddonOptions([]);
          setSelectedAddonIds([]);
        }
      }
    }

    loadAddons();

    return () => {
      cancelled = true;
    };
  }, [addonReloadTick, effectiveTenantSlug, siteMode]);

  React.useEffect(() => {
    let cancelled = false;

    async function previewPrice() {
      if (!car || !pickupDate || !returnDate || timeInvalid) {
        setPricing(null);
        return;
      }

      try {
        const selectedAddonPayload = buildAddonPayload(
          selectedAddonIds,
          addonOptions
        );
        const res = await bookingApi.previewPrice({
          carId: car.id,
          pickupDate: combineDateAndTime(pickupDate, pickupTime),
          returnDate: combineDateAndTime(returnDate, returnTime),
          pickupLocation: finalPickupPoint || undefined,
          returnLocation: finalReturnPoint || undefined,
          addons: selectedAddonPayload,
        }, {
          tenantSlug: effectiveTenantSlug,
        });

        if (cancelled) return;

        const data = res.data;
        const discountPct =
          data.subtotal > 0
            ? Math.round((data.discount / data.subtotal) * 100)
            : 0;

        setPricing({
          discountPct,
          subTotal: data.subtotal,
          discount: data.discount,
          total: data.totalAmount,
          extraCharge: data.extraCharge,
        });
      } catch {
        if (!cancelled) {
          setPricing(null);
        }
      }
    }

    previewPrice();

    return () => {
      cancelled = true;
    };
  }, [
    car,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    finalPickupPoint,
    finalReturnPoint,
    selectedAddonIds,
    addonOptions,
    effectiveTenantSlug,
    timeInvalid,
  ]);

  React.useEffect(() => {
    let cancelled = false;

    async function loadUnavailableDates() {
      if (!car?.id) {
        setUnavailableDates([]);
        return;
      }

      try {
        const res = await availabilityApi.getUnavailableDates(car.id, {
          tenantSlug: effectiveTenantSlug,
        });

        if (cancelled) return;

        setUnavailableDates(Array.isArray(res.data) ? res.data : []);
      } catch {
        if (!cancelled) {
          setUnavailableDates([]);
        }
      }
    }

    loadUnavailableDates();

    return () => {
      cancelled = true;
    };
  }, [car?.id, carReloadTick, effectiveTenantSlug]);

  React.useEffect(() => {
    let cancelled = false;

    async function checkAvailability() {
      if (!car?.id) {
        setIsDateAvailable(null);
        setIsCheckingAvailability(false);
        return;
      }

      if (car.isAvailable === false) {
        setIsDateAvailable(false);
        setIsCheckingAvailability(false);
        return;
      }

      if (!pickupDate || !returnDate || timeInvalid) {
        setIsDateAvailable(null);
        setIsCheckingAvailability(false);
        return;
      }

      try {
        setIsCheckingAvailability(true);
        const res = await availabilityApi.check(
          {
            carId: car.id,
            pickupDate,
            returnDate,
          },
          {
            tenantSlug: effectiveTenantSlug,
          }
        );

        if (cancelled) return;
        setIsDateAvailable(Boolean(res.data?.available));
      } catch {
        if (cancelled) return;
        setIsDateAvailable(null);
      } finally {
        if (!cancelled) {
          setIsCheckingAvailability(false);
        }
      }
    }

    checkAvailability();

    return () => {
      cancelled = true;
    };
  }, [
    car?.id,
    car?.isAvailable,
    effectiveTenantSlug,
    pickupDate,
    returnDate,
    timeInvalid,
  ]);

  const showChatBooking =
    (forceChatBooking || (chatThresholdTHB > 0 && amount >= chatThresholdTHB)) &&
    isCarAvailable;
  const selectedAddonTitles = React.useMemo(
    () => getSelectedAddonTitles(addonOptions, selectedAddonIds),
    [addonOptions, selectedAddonIds]
  );

  const chatMessage = React.useMemo(() => {
    return buildChatMessage({
      carName: car?.name,
      carId,
      finalPickupPoint,
      pickupDate,
      pickupTime,
      finalReturnPoint,
      returnDate,
      returnTime,
      days,
      addonTitles: selectedAddonTitles,
      amount,
      fullName,
      phone,
    });
  }, [
    car?.name,
    carId,
    finalPickupPoint,
    pickupDate,
    pickupTime,
    finalReturnPoint,
    returnDate,
    returnTime,
    days,
    selectedAddonTitles,
    amount,
    fullName,
    phone,
  ]);

  const chatHref = React.useMemo(() => {
    const channelUrl = car?.lineOfficialAccount?.chatUrl || car?.lineOfficialAccount?.shareUrl;
    if (!channelUrl) return "";
    return buildChatHref(channelUrl, chatMessage);
  }, [car?.lineOfficialAccount?.chatUrl, car?.lineOfficialAccount?.shareUrl, chatMessage]);

  const handleAddonChange = React.useCallback(
    (addonId: string, checked: boolean) => {
      setSelectedAddonIds((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(addonId);
        } else {
          next.delete(addonId);
        }
        return Array.from(next);
      });
    },
    []
  );

  const onSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!car) {
        setError("ไม่พบรถที่เลือก กรุณากลับไปเลือกใหม่");
        return;
      }

      if (!startDT || !endDT) {
        setError("กรุณาเลือกวันและเวลาให้ครบ");
        return;
      }

      if (endDT.getTime() < startDT.getTime()) {
        setError("วัน/เวลาคืนรถต้องไม่ก่อนวัน/เวลารับรถ");
        return;
      }

      if (!locationOk) {
        setError("กรุณากรอกสถานที่ให้ถูกต้อง (กรณีเลือก “อื่นๆ” ต้องระบุสถานที่)");
        return;
      }

      if (!car.isAvailable || isDateAvailable === false) {
        setError("รถคันนี้มีการจองแล้ว กรุณาเลือกรถหรือช่วงวันใหม่");
        return;
      }

      if (!canSubmit) return;

      setLoading(true);
      const pendingChatWindow =
        forceChatBooking && typeof window !== "undefined" && hasChatChannel
          ? window.open("about:blank", "_blank")
          : null;
      if (pendingChatWindow) {
        pendingChatWindow.opener = null;
      }

      try {
        const availabilityRes = await availabilityApi.check(
          {
            carId: car.id,
            pickupDate: combineDateAndTime(pickupDate, pickupTime),
            returnDate: combineDateAndTime(returnDate, returnTime),
          },
          {
            tenantSlug: effectiveTenantSlug,
          }
        );

        if (!availabilityRes.data?.available) {
          if (pendingChatWindow) {
            pendingChatWindow.close();
          }
          setError("รถคันนี้มีการจองแล้ว กรุณาเลือกรถหรือช่วงวันใหม่");
          return;
        }

        const res = await bookingApi.createBooking({
          carId: car.id,
          pickupDate: combineDateAndTime(pickupDate, pickupTime),
          returnDate: combineDateAndTime(returnDate, returnTime),
          pickupLocation: finalPickupPoint,
          returnLocation: finalReturnPoint,
          pickupMethod:
            merchantBranchesEnabled && pickupBranch !== OTHER_OPTION && pickupBranch.trim()
              ? "branch"
              : "custom",
          returnMethod:
            merchantBranchesEnabled && returnBranch !== OTHER_OPTION && returnBranch.trim()
              ? "branch"
              : "custom",
          customerName: fullName.trim(),
          customerEmail: "no-email@rentflow.local",
          customerPhone: phone.trim(),
          note: selectedAddonTitles.length
            ? `บริการเสริมที่เลือก: ${selectedAddonTitles.join(", ")}`
            : undefined,
          addons: buildAddonPayload(selectedAddonIds, addonOptions),
        }, {
          tenantSlug: effectiveTenantSlug,
        });

        const booking = res.data;
        const bookingChatMessage = buildChatMessage({
          bookingCode: booking.bookingCode,
          shopName: car.shopName,
          carName: car.name,
          carId: car.id,
          finalPickupPoint,
          pickupDate,
          pickupTime,
          finalReturnPoint,
          returnDate,
          returnTime,
          days: booking.totalDays || days,
          addonTitles: selectedAddonTitles,
          subtotal: booking.subtotal,
          discount: booking.discount,
          extraCharge: booking.extraCharge,
          amount: booking.totalAmount,
          fullName: fullName.trim(),
          phone: phone.trim(),
        });
        const commonQuery =
          `bookingId=${encodeURIComponent(booking.bookingCode)}` +
          `&bookingRef=${encodeURIComponent(booking.id)}` +
          `&amount=${encodeURIComponent(String(booking.totalAmount))}` +
          `&carId=${encodeURIComponent(booking.carId)}` +
          `&carName=${encodeURIComponent(car.name)}` +
          `&days=${encodeURIComponent(String(booking.totalDays))}` +
          `&pickupDate=${encodeURIComponent(pickupDate)}` +
          `&returnDate=${encodeURIComponent(returnDate)}` +
          `&pickupTime=${encodeURIComponent(pickupTime)}` +
          `&returnTime=${encodeURIComponent(returnTime)}` +
          `&pickupPoint=${encodeURIComponent(finalPickupPoint)}` +
          `&returnPoint=${encodeURIComponent(finalReturnPoint)}` +
          `&customerName=${encodeURIComponent(fullName.trim())}` +
          `&customerPhone=${encodeURIComponent(phone.trim())}` +
          `&subtotal=${encodeURIComponent(String(booking.subtotal))}` +
          `&discount=${encodeURIComponent(String(booking.discount))}` +
          `&extraCharge=${encodeURIComponent(String(booking.extraCharge))}` +
          (car.shopName ? `&shopName=${encodeURIComponent(car.shopName)}` : "") +
          (effectiveTenantSlug ? `&tenant=${encodeURIComponent(effectiveTenantSlug)}` : "") +
          `&addons=${encodeURIComponent(JSON.stringify(selectedAddonIds))}`;

        if (forceChatBooking) {
          await copyChatMessage(bookingChatMessage);
          const channelUrl =
            car.lineOfficialAccount?.chatUrl || car.lineOfficialAccount?.shareUrl || "";
          const nextChatHref = buildChatHref(channelUrl, bookingChatMessage);
          if (nextChatHref) {
            if (pendingChatWindow) {
              pendingChatWindow.location.href = nextChatHref;
            } else if (typeof window !== "undefined") {
              window.open(nextChatHref, "_blank", "noopener,noreferrer");
            }
          } else if (pendingChatWindow) {
            pendingChatWindow.close();
          }

          navigateBookingFlow(
            router,
            `/booking/success?${commonQuery}&bookingMode=chat`,
            "replace"
          );
          return;
        }

        navigateBookingFlow(
          router,
          `/payment?${commonQuery}`,
          "replace"
        );
      } catch (err: unknown) {
        if (pendingChatWindow) {
          pendingChatWindow.close();
        }
        setError(getErrorMessage(err, "ไม่สามารถสร้างรายการจองได้"));
      } finally {
        setLoading(false);
      }
    },
    [
      car,
      startDT,
      endDT,
      locationOk,
      canSubmit,
      isDateAvailable,
      merchantBranchesEnabled,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      days,
      selectedAddonIds,
      addonOptions,
      fullName,
      phone,
      pickupBranch,
      returnBranch,
      selectedAddonTitles,
      effectiveTenantSlug,
      finalPickupPoint,
      finalReturnPoint,
      forceChatBooking,
      hasChatChannel,
      router,
    ]
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    merchantBranchesEnabled,
    branchOptions,
    carId,
    car,
    fullName,
    setFullName,
    phone,
    setPhone,
    pickupBranch,
    setPickupBranch,
    returnBranch,
    setReturnBranch,
    pickupOther,
    setPickupOther,
    returnOther,
    setReturnOther,
    pickupFreeText,
    setPickupFreeText,
    returnFreeText,
    setReturnFreeText,
    pickupDate,
    setPickupDate,
    pickupTime,
    setPickupTime,
    returnDate,
    setReturnDate,
    returnTime,
    setReturnTime,
    unavailableDates,
    addonOptions,
    selectedAddonIds,
    handleAddonChange,
    error,
    setError,
    loading,
    ready: ready && !checkingAuth,
    fieldSX,
    startDT,
    endDT,
    timeInvalid,
    days,
    pricing,
    addonsTotal,
    amount,
    finalPickupPoint,
    finalReturnPoint,
    locationOk,
    canSubmit,
    carAvailable: isCarAvailable,
    checkingAvailability: isCheckingAvailability,
    availabilityMessage,
    showChatBooking,
    forceChatBooking,
    hasChatChannel,
    chatHref,
    onSubmit,
  };
}

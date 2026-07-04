"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRentFlowCarRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowCarRealtimeRefresh";
import usePageReady from "@/src/hooks/usePageReady";
import { useRentFlowCarSiteMode } from "@/src/hooks/useRentFlowCarSiteMode";
import { getErrorMessage } from "@/src/lib/api-error";
import { navigateBookingFlow } from "@/src/lib/booking-flow-navigation";
import {
  buildPromptPayPayload,
  buildPromptPayQrDataUrl,
  canBuildPromptPayPayload,
} from "@/src/lib/promptpay-qr";
import { addonsApi } from "@/src/services/addons/addons.service";
import type { StorefrontAddon } from "@/src/services/addons/addons.types";
import { getCarById } from "@/src/services/cars/cars.service";
import type { Car } from "@/src/services/cars/cars.types";
import { paymentsApi } from "@/src/services/payments/payments.service";
import { tenantApi } from "@/src/services/tenant/tenant.service";
import type { TenantProfile } from "@/src/services/tenant/tenant.types";
import { usersApi } from "@/src/services/users/users.service";
import {
  safeParseAddonIds,
  calcAddonsTotal,
  getCarSubTotal,
} from "@/src/utils/payment/payment.helpers";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("ไม่สามารถอ่านไฟล์สลิปได้"));
    };
    reader.onerror = () => reject(new Error("ไม่สามารถอ่านไฟล์สลิปได้"));
    reader.readAsDataURL(file);
  });
}

async function getPaymentCar(carId: string, tenantSlug?: string) {
  if (!carId) return null;

  try {
    const scopedCar = await getCarById(
      carId,
      tenantSlug ? { tenantSlug } : undefined
    );
    if (scopedCar) return scopedCar;
  } catch {
    // Fall through to marketplace lookup. Payment links can be opened without
    // the original tenant context, especially from saved/pending bookings.
  }

  return getCarById(carId, { marketplace: true });
}

export default function usePaymentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const ready = usePageReady({ disableDuringFlowTransition: true });
  const siteMode = useRentFlowCarSiteMode();

  const bookingId = params.get("bookingId") || "BK-XXXX";
  const bookingRef = params.get("bookingRef") || "";
  const carId = params.get("carId") || "";
  const tenantSlug = params.get("tenant") || undefined;
  const days = Number(params.get("days") || "0") || 0;

  const pickupDate = params.get("pickupDate") || "";
  const returnDate = params.get("returnDate") || "";
  const pickupPoint = params.get("pickupPoint") || "";
  const returnPoint = params.get("returnPoint") || "";
  const pickupTime = params.get("pickupTime") || "";
  const returnTime = params.get("returnTime") || "";
  const carName = params.get("carName") || "";
  const shopName = params.get("shopName") || "";
  const customerName = params.get("customerName") || "";
  const customerPhone = params.get("customerPhone") || "";
  const subtotal = Number(params.get("subtotal") || "0") || 0;
  const discount = Number(params.get("discount") || "0") || 0;
  const extraCharge = Number(params.get("extraCharge") || "0") || 0;
  const amountFromQuery = Number(params.get("amount") || "0") || 0;

  const addonsRaw = params.get("addons");

  const addonIds = React.useMemo(
    () => safeParseAddonIds(addonsRaw),
    [addonsRaw]
  );

  const [car, setCar] = React.useState<Car | undefined>(undefined);
  const [tenantProfile, setTenantProfile] = React.useState<TenantProfile | null>(null);
  const [promptPayQrDataUrl, setPromptPayQrDataUrl] = React.useState("");
  const [addonOptions, setAddonOptions] = React.useState<StorefrontAddon[]>([]);
  const [reloadTick, setReloadTick] = React.useState(0);

  const addonsTotal = React.useMemo(
    () => calcAddonsTotal(addonOptions, addonIds, days),
    [addonOptions, addonIds, days]
  );

  const carSubTotal = React.useMemo(
    () => subtotal || getCarSubTotal(car, days),
    [car, days, subtotal]
  );

  const carNet = React.useMemo(
    () => Math.max(0, carSubTotal - discount),
    [carSubTotal, discount]
  );

  const amount = React.useMemo(
    () => amountFromQuery || Math.max(0, carNet + addonsTotal + extraCharge),
    [addonsTotal, amountFromQuery, carNet, extraCharge]
  );

  const effectiveTenantSlug = tenantSlug || car?.domainSlug || undefined;

  const carDiscount = React.useMemo(() => {
    if (carSubTotal <= 0) return 0;
    return discount;
  }, [carSubTotal, discount]);

  const discountPct = React.useMemo(() => {
    if (carSubTotal <= 0) return 0;
    return Math.round((carDiscount / carSubTotal) * 100);
  }, [carSubTotal, carDiscount]);

  const [fullName, setFullName] = React.useState(customerName);
  const [phone, setPhone] = React.useState(customerPhone);
  const [slipFile, setSlipFile] = React.useState<File | null>(null);
  const [done, setDone] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const hasPromptPaySettings = React.useMemo(
    () =>
      canBuildPromptPayPayload(
        tenantProfile?.promptPayType,
        tenantProfile?.promptPayId
      ),
    [tenantProfile?.promptPayId, tenantProfile?.promptPayType]
  );
  const hasBankTransferSettings = React.useMemo(
    () =>
      Boolean(
        tenantProfile?.bankName?.trim() &&
          tenantProfile?.bankAccountName?.trim() &&
          tenantProfile?.bankAccountNumber?.trim()
      ),
    [
      tenantProfile?.bankAccountName,
      tenantProfile?.bankAccountNumber,
      tenantProfile?.bankName,
    ]
  );
  const hasPaymentDestination = hasPromptPaySettings || hasBankTransferSettings;

  const canPay =
    fullName.trim().length >= 2 &&
    phone.trim().length >= 9 &&
    hasPaymentDestination &&
    !!slipFile &&
    !loading;

  useRentFlowCarRealtimeRefresh({
    events: [
      "booking.updated",
      "payment.updated",
      "car.changed",
      "car.status.changed",
      "addon.changed",
      "tenant.updated",
    ],
    onRefresh: React.useCallback(() => {
      setReloadTick((current) => current + 1);
    }, []),
    enabled: Boolean(carId || bookingId),
    tenantSlug,
  });

  React.useEffect(() => {
    if (tenantSlug || !car?.domainSlug) return;

    let cancelled = false;

    tenantApi
      .resolveTenant({ tenantSlug: car.domainSlug })
      .then((res) => {
        if (!cancelled && res.data) {
          setTenantProfile(res.data);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [car?.domainSlug, tenantSlug]);

  React.useEffect(() => {
    let cancelled = false;

    async function loadData() {
      const shouldLoadAddons = siteMode === "storefront" || Boolean(tenantSlug);
      const tasks = await Promise.allSettled([
        getPaymentCar(carId, tenantSlug),
        usersApi.getMe(),
        shouldLoadAddons
          ? addonsApi.getAddons(tenantSlug ? { tenantSlug } : undefined)
          : Promise.resolve(null),
        tenantApi.resolveTenant(tenantSlug ? { tenantSlug } : undefined),
      ]);

      if (cancelled) return;

      const [carResult, profileResult, addonsResult, tenantResult] = tasks;

      if (carResult.status === "fulfilled" && carResult.value) {
        setCar(carResult.value);
      }

      if (profileResult.status === "fulfilled") {
        const user = profileResult.value.data;
        setFullName((prev) => prev || user.name || "");
        setPhone((prev) => prev || user.phone || "");
      }

      if (addonsResult.status === "fulfilled" && addonsResult.value) {
        setAddonOptions(addonsResult.value.data?.items ?? []);
      }

      if (tenantResult.status === "fulfilled" && tenantResult.value?.data) {
        setTenantProfile(tenantResult.value.data);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [carId, reloadTick, siteMode, tenantSlug]);

  React.useEffect(() => {
    let cancelled = false;
    const payload = buildPromptPayPayload({
      amount,
      promptPayId: tenantProfile?.promptPayId,
      promptPayType: tenantProfile?.promptPayType,
    });

    if (!payload) {
      setPromptPayQrDataUrl("");
      return;
    }

    buildPromptPayQrDataUrl(payload)
      .then((dataUrl) => {
        if (!cancelled) setPromptPayQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setPromptPayQrDataUrl("");
      });

    return () => {
      cancelled = true;
    };
  }, [amount, tenantProfile?.promptPayId, tenantProfile?.promptPayType]);

  const handleConfirm = React.useCallback(async () => {
    if (!canPay) return;

    setLoading(true);
    setError(null);
    try {
      const slipImage = slipFile ? await readFileAsDataUrl(slipFile) : undefined;
      await paymentsApi.createPayment({
        bookingId: bookingRef || bookingId,
        method: hasPromptPaySettings ? "promptpay" : "bank_transfer",
        ...(slipImage ? { slipImage } : {}),
      }, {
        tenantSlug: effectiveTenantSlug,
      });
      setDone(true);
      setTimeout(() => {
        const nextParams = new URLSearchParams();

        nextParams.set("bookingId", bookingId);
        if (bookingRef) {
          nextParams.set("bookingRef", bookingRef);
        }
        nextParams.set("bookingMode", "payment");
        nextParams.set("amount", String(amount || 0));
        nextParams.set("carName", car?.name || carName);
        nextParams.set("customerName", fullName.trim());
        nextParams.set("customerPhone", phone.trim());
        nextParams.set("pickupDate", pickupTime ? `${pickupDate} ${pickupTime}` : pickupDate);
        nextParams.set("returnDate", returnTime ? `${returnDate} ${returnTime}` : returnDate);
        nextParams.set("pickupPoint", pickupPoint);
        nextParams.set("returnPoint", returnPoint);

        if (shopName || car?.shopName) {
          nextParams.set("shopName", shopName || car?.shopName || "");
        }

        if (effectiveTenantSlug) {
          nextParams.set("tenant", effectiveTenantSlug);
        }

        navigateBookingFlow(
          router,
          `/booking/success?${nextParams.toString()}`,
          "replace"
        );
      }, 260);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "ไม่สามารถยืนยันการชำระเงินได้"));
    } finally {
      setLoading(false);
    }
  }, [
    amount,
    bookingId,
    bookingRef,
    canPay,
    car?.name,
    car?.shopName,
    carName,
    fullName,
    hasPromptPaySettings,
    phone,
    pickupDate,
    pickupPoint,
    pickupTime,
    returnDate,
    returnPoint,
    returnTime,
    router,
    shopName,
    slipFile,
    effectiveTenantSlug,
  ]);

  const roundedFieldSX = React.useMemo(
    () => ({
      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
    }),
    []
  );

  return {
    ready,
    bookingId,
    bookingRef,
    carId,
    tenantSlug,
    days,
    pickupDate,
    returnDate,
    pickupPoint,
    returnPoint,
    pickupTime,
    returnTime,
    carName,
    shopName,
    amount,
    addonIds,
    addonOptions,
    addonsTotal,
    car,
    tenantProfile,
    promptPayQrDataUrl,
    hasPromptPaySettings,
    hasBankTransferSettings,
    carSubTotal,
    carNet,
    carDiscount,
    discountPct,
    extraCharge,
    fullName,
    setFullName,
    phone,
    setPhone,
    slipFile,
    setSlipFile,
    done,
    loading,
    error,
    canPay,
    handleConfirm,
    roundedFieldSX,
  };
}

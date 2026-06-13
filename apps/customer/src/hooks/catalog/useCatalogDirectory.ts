"use client";

import * as React from "react";
import { getErrorMessage } from "@/src/lib/api-error";
import { useRentFlowRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowRealtimeRefresh";
import { useRentFlowSiteMode } from "@/src/hooks/useRentFlowSiteMode";
import {
  buildCarClasses,
  buildCarTypes,
  buildLocationOptions,
} from "@/src/lib/rentflow-catalog";
import { branchesApi } from "@/src/services/branches/branches.service";
import type { Branch } from "@/src/services/branches/branches.types";
import { getCars } from "@/src/services/cars/cars.service";
import type { Car } from "@/src/services/cars/cars.types";
import type { RentFlowRealtimeEvent } from "@/src/services/realtime/realtime.types";

export function useCatalogDirectory(tenantSlug?: string, initialHost?: string) {
  const siteMode = useRentFlowSiteMode(initialHost);
  const [cars, setCars] = React.useState<Car[]>([]);
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reloadTick, setReloadTick] = React.useState(0);

  const refreshFromRealtime = React.useCallback((event?: RentFlowRealtimeEvent) => {
    if (event?.type === "car.status.changed") {
      const carId = String(event.data?.carId || event.entityId || "");
      if (carId) {
        setCars((current) =>
          current.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  status:
                    typeof event.data?.status === "string"
                      ? event.data.status
                      : car.status,
                  isAvailable:
                    typeof event.data?.isAvailable === "boolean"
                      ? event.data.isAvailable
                      : car.isAvailable,
                  availableUnits:
                    typeof event.data?.availableUnits === "number"
                      ? event.data.availableUnits
                      : car.availableUnits,
                }
              : car
          )
        );
      }
      return;
    }
    setReloadTick((current) => current + 1);
  }, []);

  useRentFlowRealtimeRefresh({
    events: [
      "booking.created",
      "booking.updated",
      "booking.cancelled",
      "car.changed",
      "car.status.changed",
      "branch.changed",
      "availability.changed",
      "tenant.updated",
    ],
    onRefresh: refreshFromRealtime,
    tenantSlug: tenantSlug || undefined,
    marketplace: siteMode === "marketplace" && !tenantSlug,
  });

  React.useEffect(() => {
    let cancelled = false;

    async function loadDirectory() {
      setLoading(true);
      setError(null);
      const start = Date.now();

      const [carsResult, branchesResult] = await Promise.allSettled([
        getCars(undefined, {
          marketplace: siteMode === "marketplace" && !tenantSlug,
          tenantSlug: tenantSlug || undefined,
        }),
        branchesApi.getBranches({
          marketplace: siteMode === "marketplace" && !tenantSlug,
          tenantSlug: tenantSlug || undefined,
        }),
      ]);

      if (cancelled) return;

      const messages: string[] = [];

      if (carsResult.status === "fulfilled") {
        setCars(carsResult.value.items);
      } else {
        setCars([]);
        messages.push(getErrorMessage(carsResult.reason, "โหลดข้อมูลรถไม่สำเร็จ"));
      }

      if (branchesResult.status === "fulfilled") {
        setBranches(branchesResult.value.data);
      } else {
        setBranches([]);
        messages.push(
          getErrorMessage(branchesResult.reason, "โหลดข้อมูลสาขาไม่สำเร็จ")
        );
      }

      setError(messages.length ? messages.join(" • ") : null);
      const elapsed = Date.now() - start;
      const delay = Math.max(500 - elapsed, 0);
      await new Promise((resolve) => window.setTimeout(resolve, delay));
      if (cancelled) return;
      setLoading(false);
    }

    loadDirectory();

    return () => {
      cancelled = true;
    };
  }, [reloadTick, siteMode, tenantSlug]);

  return {
    siteMode,
    cars,
    branches,
    carTypes: React.useMemo(() => buildCarTypes(cars), [cars]),
    locations: React.useMemo(() => buildLocationOptions(branches), [branches]),
    classes: React.useMemo(() => buildCarClasses(cars), [cars]),
    loading,
    error,
  };
}

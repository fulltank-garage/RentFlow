"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useRentFlowRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowRealtimeRefresh";
import { normCarId } from "@/src/utils/car-detail/carDetail.format";
import usePageReady from "@/src/hooks/usePageReady";
import { useRentFlowSiteMode } from "@/src/hooks/useRentFlowSiteMode";
import { getCarById } from "@/src/services/cars/cars.service";
import type { Car } from "@/src/services/cars/cars.types";
import type { RentFlowRealtimeEvent } from "@/src/services/realtime/realtime.types";

export default function useCarDetail(carId: string) {
  const ready = usePageReady();
  const searchParams = useSearchParams();
  const siteMode = useRentFlowSiteMode();
  const tenantSlug = searchParams.get("tenant") || undefined;

  const id = React.useMemo(() => normCarId(carId), [carId]);
  const [detail, setDetail] = React.useState<Car | null>(null);
  const [reloadTick, setReloadTick] = React.useState(0);

  const refreshFromRealtime = React.useCallback(
    (event: RentFlowRealtimeEvent) => {
      const eventCarId = String(event.data?.carId || event.entityId || "");
      if (!eventCarId || eventCarId === id) {
        if (event.type === "car.status.changed") {
          setDetail((current) =>
            current
              ? {
                  ...current,
                  status:
                    typeof event.data?.status === "string"
                      ? event.data.status
                      : current.status,
                  isAvailable:
                    typeof event.data?.isAvailable === "boolean"
                      ? event.data.isAvailable
                      : current.isAvailable,
                  availableUnits:
                    typeof event.data?.availableUnits === "number"
                      ? event.data.availableUnits
                      : current.availableUnits,
                }
              : current
          );
          return;
        }
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
      "car.changed",
      "car.status.changed",
      "availability.changed",
      "tenant.updated",
    ],
    onRefresh: refreshFromRealtime,
    tenantSlug,
    marketplace: siteMode === "marketplace" && !tenantSlug,
  });

  React.useEffect(() => {
    let cancelled = false;

    async function loadCar() {
      if (!id) {
        setDetail(null);
        return;
      }

      try {
        const car = await getCarById(id, {
          marketplace: siteMode === "marketplace",
          tenantSlug,
        });
        if (!cancelled) {
          setDetail(car);
        }
      } catch {
        if (!cancelled) {
          setDetail(null);
        }
      }
    }

    loadCar();

    return () => {
      cancelled = true;
    };
  }, [id, reloadTick, siteMode, tenantSlug]);

  return {
    ready,
    id,
    detail,
  };
}

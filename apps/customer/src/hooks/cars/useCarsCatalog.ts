"use client";

import * as React from "react";
import { getErrorMessage } from "@/src/lib/api-error";
import { useRentFlowRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowRealtimeRefresh";
import { useRentFlowSiteMode } from "@/src/hooks/useRentFlowSiteMode";
import { getCars } from "@/src/services/cars/cars.service";
import type { Car } from "@/src/services/cars/cars.types";
import type { RentFlowRealtimeEvent } from "@/src/services/realtime/realtime.types";

type Params = {
    q: string;
    type: string;
    sort: "price_asc" | "price_desc";
    location: string;
    pickupDate: string;
    returnDate: string;
    tenantSlug?: string;
};

export function useCarsCatalog(params: Params) {
  const { q, type, sort, location, pickupDate, returnDate, tenantSlug } = params;
  const siteMode = useRentFlowSiteMode();
  const [cars, setCars] = React.useState<Car[]>([]);
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
        tenantSlug,
        marketplace: siteMode === "marketplace" && !tenantSlug,
    });

    React.useEffect(() => {
        let cancelled = false;

        async function loadCars() {
            try {
                setLoading(true);
                setError(null);

                const start = Date.now();

                const res = await getCars({
                    q,
                    type,
                    sort,
                    location,
                    pickupDate,
                    returnDate,
                }, {
                    marketplace: siteMode === "marketplace" && !tenantSlug,
                    tenantSlug: tenantSlug || undefined,
                });
                const elapsed = Date.now() - start;
                const delay = Math.max(500 - elapsed, 0);

                await new Promise((r) => setTimeout(r, delay));

                if (cancelled) return;

                setCars(res.items);
            } catch (err: unknown) {
                if (cancelled) return;

                setError(getErrorMessage(err, "โหลดข้อมูลไม่สำเร็จ"));
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadCars();

        return () => {
            cancelled = true;
        };
    }, [
        location,
        pickupDate,
        q,
        reloadTick,
        returnDate,
        siteMode,
        sort,
        tenantSlug,
        type,
    ]);

    return {
        cars,
        loading,
        error,
    };
}

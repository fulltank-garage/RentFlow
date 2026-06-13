"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortKey, CarType } from "@/src/services/cars/cars.types";
import {
  clampPickupDateToToday,
  clampReturnDateToPickup,
} from "@/src/lib/rentflow-dates";

export function useCarsFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialQ = searchParams.get("q") ?? "";
  const initialType = searchParams.get("type") ?? "all";
  const initialLocation = searchParams.get("location") ?? "";
  const initialPickupDate = clampPickupDateToToday(searchParams.get("pickupDate"));
  const initialReturnDate = clampReturnDateToPickup(
    searchParams.get("returnDate"),
    initialPickupDate
  );

  const [q, setQ] = React.useState(initialQ);
  const [type, setType] = React.useState<CarType | "all">(
    initialType === "All" ? "all" : (initialType as CarType | "all")
  );
  const [sort, setSort] = React.useState<SortKey>("price_asc");
  const [location, setLocation] = React.useState(initialLocation);
  const [pickupDate, setPickupDate] = React.useState(initialPickupDate);
  const [returnDate, setReturnDate] = React.useState(initialReturnDate);

  React.useEffect(() => {
    const nextQ = searchParams.get("q") ?? "";
    const nextType = searchParams.get("type") ?? "all";
    const nextLocation = searchParams.get("location") ?? "";
    const nextPickupDate = clampPickupDateToToday(searchParams.get("pickupDate"));
    const nextReturnDate = clampReturnDateToPickup(
      searchParams.get("returnDate"),
      nextPickupDate
    );

    setQ(nextQ);
    setType(nextType === "All" ? "all" : (nextType as CarType | "all"));
    setLocation(nextLocation);
    setPickupDate(nextPickupDate);
    setReturnDate(nextReturnDate);
  }, [searchParams]);

  const updateUrl = React.useCallback(
    (next: {
      q?: string;
      type?: CarType | "all";
      location?: string;
      pickupDate?: string;
      returnDate?: string;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      const nextQ = next.q ?? q;
      const nextType = next.type ?? type;
      const nextLocation = next.location ?? location;
      const nextPickupDate = clampPickupDateToToday(next.pickupDate ?? pickupDate);
      const nextReturnDate = clampReturnDateToPickup(
        next.returnDate ?? returnDate,
        nextPickupDate
      );

      if (nextQ.trim()) params.set("q", nextQ.trim());
      else params.delete("q");

      if (nextType && nextType !== "all") params.set("type", nextType);
      else params.delete("type");

      if (nextLocation) params.set("location", nextLocation);
      else params.delete("location");

      if (nextPickupDate) params.set("pickupDate", nextPickupDate);
      else params.delete("pickupDate");

      if (nextReturnDate) params.set("returnDate", nextReturnDate);
      else params.delete("returnDate");

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, q, type, location, pickupDate, returnDate, router, pathname]
  );

  const resetFilters = React.useCallback(() => {
    setQ("");
    setType("all");
    setSort("price_asc");
    setLocation("");
    setPickupDate("");
    setReturnDate("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("type");
    params.delete("location");
    params.delete("pickupDate");
    params.delete("returnDate");

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  return {
    q,
    setQ,
    type,
    setType,
    sort,
    setSort,
    location,
    setLocation,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    updateUrl,
    resetFilters,
  };
}

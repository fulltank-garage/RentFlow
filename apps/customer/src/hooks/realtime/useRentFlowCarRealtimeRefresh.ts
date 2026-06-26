"use client";

import * as React from "react";
import { subscribeRentFlowCarRealtime } from "@/src/services/realtime/realtime.service";
import type {
  RentFlowCarRealtimeEvent,
  RentFlowCarRealtimeEventType,
} from "@/src/services/realtime/realtime.types";

type Options = {
  events: RentFlowCarRealtimeEventType[];
  onRefresh: (event: RentFlowCarRealtimeEvent) => void;
  tenantSlug?: string;
  marketplace?: boolean;
  enabled?: boolean;
  fallbackIntervalMs?: number;
};

export function useRentFlowCarRealtimeRefresh({
  events,
  onRefresh,
  tenantSlug,
  marketplace,
  enabled = true,
  fallbackIntervalMs = 15000,
}: Options) {
  const eventKey = events.join("|");
  const onRefreshRef = React.useRef(onRefresh);
  const lastEventAtRef = React.useRef(0);
  const [socketReady, setSocketReady] = React.useState(false);

  React.useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  React.useEffect(() => {
    if (!enabled) return;

    const allowedEvents = new Set(eventKey.split("|").filter(Boolean));
    return subscribeRentFlowCarRealtime({
      app: "storefront",
      tenantSlug,
      marketplace,
      onEvent(event) {
        if (allowedEvents.has(event.type as RentFlowCarRealtimeEventType)) {
          lastEventAtRef.current = Date.now();
          onRefreshRef.current(event);
        }
      },
      onStatus(status) {
        setSocketReady(status === "open");
      },
    });
  }, [enabled, eventKey, marketplace, tenantSlug]);

  React.useEffect(() => {
    if (!enabled || socketReady || fallbackIntervalMs <= 0) return;

    const timer = window.setInterval(() => {
      if (Date.now() - lastEventAtRef.current < fallbackIntervalMs) return;
      onRefreshRef.current({
        type: "availability.changed",
        createdAt: new Date().toISOString(),
        data: { fallback: true },
      });
    }, fallbackIntervalMs);

    return () => window.clearInterval(timer);
  }, [enabled, fallbackIntervalMs, socketReady]);
}

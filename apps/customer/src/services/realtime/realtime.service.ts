"use client";

import { getRentFlowApiBaseUrl } from "@/src/lib/runtime-api-url";
import {
  getRentFlowTenantHost,
  getRentFlowTenantSlug,
} from "@/src/lib/tenant";
import type { RentFlowRealtimeEvent } from "./realtime.types";

type SubscribeOptions = {
  app?: "storefront" | "partner" | "admin";
  tenantSlug?: string;
  marketplace?: boolean;
  onEvent: (event: RentFlowRealtimeEvent) => void;
  onError?: () => void;
  onStatus?: (status: "connecting" | "open" | "closed" | "error") => void;
};

function realtimeUrl(options: SubscribeOptions) {
  const base = new URL(getRentFlowApiBaseUrl());
  base.protocol = base.protocol === "https:" ? "wss:" : "ws:";
  base.pathname = "/ws/realtime";
  base.search = "";
  base.searchParams.set("app", options.app || "storefront");

  const tenantSlug = options.tenantSlug ?? getRentFlowTenantSlug();
  const host = getRentFlowTenantHost();
  if (tenantSlug) {
    base.searchParams.set("tenant", tenantSlug);
  }
  if (host) {
    base.searchParams.set("host", host);
  }
  if (options.marketplace) {
    base.searchParams.set("marketplace", "true");
  }

  return base.toString();
}

export function subscribeRentFlowRealtime(options: SubscribeOptions) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  let socket: WebSocket | null = null;
  let closed = false;
  let reconnectTimer: number | undefined;
  let attempts = 0;

  const connect = () => {
    if (closed) return;

    options.onStatus?.("connecting");
    socket = new WebSocket(realtimeUrl(options));
    socket.onmessage = (message) => {
      try {
        options.onEvent(JSON.parse(message.data) as RentFlowRealtimeEvent);
      } catch {
        // Ignore malformed realtime payloads and keep the socket alive.
      }
    };
    socket.onopen = () => {
      attempts = 0;
      options.onStatus?.("open");
    };
    socket.onerror = () => {
      options.onStatus?.("error");
      options.onError?.();
    };
    socket.onclose = () => {
      options.onStatus?.("closed");
      if (closed) return;
      attempts += 1;
      const delay = Math.min(1000 + attempts * 700, 5000);
      reconnectTimer = window.setTimeout(connect, delay);
    };
  };

  const connectTimer = window.setTimeout(connect, 180);

  return () => {
    closed = true;
    if (connectTimer) window.clearTimeout(connectTimer);
    if (reconnectTimer) window.clearTimeout(reconnectTimer);
    socket?.close();
  };
}

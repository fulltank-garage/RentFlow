"use client";

import type { PartnerRealtimeEvent } from "./realtime.types";

type SubscribeOptions = {
  onEvent: (event: PartnerRealtimeEvent) => void;
  onError?: () => void;
  onStatus?: (status: "connecting" | "open" | "closed" | "error") => void;
};

function partnerRealtimeUrl() {
  const apiOrigin =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:8080");
  const url = new URL(apiOrigin);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws/realtime";
  url.search = "";
  url.searchParams.set("app", "partner");
  return url.toString();
}

export function subscribePartnerRealtime(options: SubscribeOptions) {
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
    socket = new WebSocket(partnerRealtimeUrl());
    socket.onmessage = (message) => {
      try {
        options.onEvent(JSON.parse(message.data) as PartnerRealtimeEvent);
      } catch {
        // Keep realtime connection alive if a malformed message arrives.
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
      reconnectTimer = window.setTimeout(
        connect,
        Math.min(1000 + attempts * 700, 5000)
      );
    };
  };

  connect();

  return () => {
    closed = true;
    if (reconnectTimer) window.clearTimeout(reconnectTimer);
    socket?.close();
  };
}

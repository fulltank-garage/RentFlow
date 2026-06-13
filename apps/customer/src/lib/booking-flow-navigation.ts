"use client";

import {
  deleteClientCookie,
  readClientCookie,
  writeClientCookie,
} from "@/src/lib/client-cookie";

const BOOKING_FLOW_TRANSITION_KEY = "rentflow-booking-flow-transition";
const BOOKING_FLOW_TRANSITION_MAX_AGE = 4000;
const BOOKING_FLOW_TRANSITION_CLASS = "rf-booking-flow-transition";

type BookingFlowTransitionPayload = {
  at: number;
};

type RouterLike = {
  push: (href: string) => void;
  replace: (href: string) => void;
};

type NavigationMode = "push" | "replace";

type ViewTransitionDocument = Document & {
  startViewTransition?: (
    callback: () => void
  ) => {
    finished?: Promise<unknown>;
  };
};

function readTransitionPayload(): BookingFlowTransitionPayload | null {
  if (typeof window === "undefined") return null;

  const raw = readClientCookie(BOOKING_FLOW_TRANSITION_KEY);
  if (!raw) return null;

  try {
    const payload = JSON.parse(raw) as BookingFlowTransitionPayload;
    if (typeof payload?.at !== "number") return null;
    return payload;
  } catch {
    return null;
  }
}

export function markBookingFlowTransition() {
  if (typeof window === "undefined") return;

  const payload: BookingFlowTransitionPayload = {
    at: Date.now(),
  };

  writeClientCookie(
    BOOKING_FLOW_TRANSITION_KEY,
    JSON.stringify(payload),
    { maxAge: 8, sameSite: "Strict" }
  );
}

export function hasRecentBookingFlowTransition() {
  const payload = readTransitionPayload();
  if (!payload) return false;

  return Date.now() - payload.at <= BOOKING_FLOW_TRANSITION_MAX_AGE;
}

export function clearBookingFlowTransition() {
  if (typeof window === "undefined") return;
  deleteClientCookie(BOOKING_FLOW_TRANSITION_KEY);
}

export function supportsBookingFlowViewTransition() {
  if (typeof document === "undefined") return false;
  return typeof (document as ViewTransitionDocument).startViewTransition === "function";
}

export function navigateBookingFlow(
  router: RouterLike,
  href: string,
  mode: NavigationMode = "replace"
) {
  if (typeof window === "undefined") {
    router[mode](href);
    return;
  }

  markBookingFlowTransition();

  const navigate = () => router[mode](href);
  const html = document.documentElement;
  const viewTransitionDocument = document as ViewTransitionDocument;
  const cleanup = () => {
    html.classList.remove(BOOKING_FLOW_TRANSITION_CLASS);
    window.setTimeout(() => {
      clearBookingFlowTransition();
    }, 900);
  };

  if (typeof viewTransitionDocument.startViewTransition !== "function") {
    html.classList.add(BOOKING_FLOW_TRANSITION_CLASS);
    navigate();
    window.setTimeout(() => {
      cleanup();
    }, 900);
    return;
  }

  html.classList.add(BOOKING_FLOW_TRANSITION_CLASS);
  const transition = viewTransitionDocument.startViewTransition(() => {
    navigate();
  });

  transition.finished?.finally(() => {
    cleanup();
  });

  window.setTimeout(() => {
    cleanup();
  }, 1200);
}

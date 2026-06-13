"use client";

import * as React from "react";
import { Box } from "@mui/material";
import {
  clearBookingFlowTransition,
  hasRecentBookingFlowTransition,
  supportsBookingFlowViewTransition,
} from "@/src/lib/booking-flow-navigation";

export default function BookingFlowScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const shouldAnimate = React.useMemo(
    () => hasRecentBookingFlowTransition() && !supportsBookingFlowViewTransition(),
    []
  );
  const [entered, setEntered] = React.useState(!shouldAnimate);

  React.useEffect(() => {
    if (!shouldAnimate) return;

    const frame = window.requestAnimationFrame(() => {
      setEntered(true);
    });
    const cleanupTimer = window.setTimeout(() => {
      clearBookingFlowTransition();
    }, 900);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(cleanupTimer);
    };
  }, [shouldAnimate]);

  return (
    <Box
      sx={{
        opacity: entered ? 1 : 0,
        filter: entered ? "blur(0px)" : "blur(4px)",
        transform: entered
          ? "translate3d(0, 0, 0)"
          : "translate3d(72px, 0, 0)",
        transformOrigin: "center center",
        transition: shouldAnimate
          ? "transform 760ms cubic-bezier(0.16,1,0.3,1), opacity 560ms cubic-bezier(0.22,1,0.36,1), filter 560ms cubic-bezier(0.22,1,0.36,1)"
          : "none",
        willChange: shouldAnimate ? "transform, opacity, filter" : "auto",
      }}
    >
      {children}
    </Box>
  );
}

"use client";

import * as React from "react";
import { hasRecentBookingFlowTransition } from "@/src/lib/booking-flow-navigation";

type Options = {
  minDelay?: number;
  disableDuringFlowTransition?: boolean;
};

export default function usePageReady(options?: Options) {
  const minDelay = options?.minDelay ?? 500;
  const skipDelay = React.useMemo(
    () =>
      Boolean(options?.disableDuringFlowTransition) &&
      hasRecentBookingFlowTransition(),
    [options?.disableDuringFlowTransition]
  );
  const [ready, setReady] = React.useState(skipDelay || minDelay <= 0);

  React.useEffect(() => {
    if (skipDelay || minDelay <= 0) {
      setReady(true);
      return;
    }

    const timer = setTimeout(() => {
      setReady(true);
    }, minDelay);

    return () => clearTimeout(timer);
  }, [minDelay, skipDelay]);

  return ready;
}

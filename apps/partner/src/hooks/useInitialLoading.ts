"use client";

import * as React from "react";

export function useInitialLoading(initialLoading = true) {
  const [loading, setLoading] = React.useState(initialLoading);
  const hasLoadedRef = React.useRef(!initialLoading);

  const beginLoading = React.useCallback(() => {
    if (!hasLoadedRef.current) {
      setLoading(true);
    }
  }, []);

  const finishLoading = React.useCallback(() => {
    hasLoadedRef.current = true;
    setLoading(false);
  }, []);

  return { loading, beginLoading, finishLoading };
}

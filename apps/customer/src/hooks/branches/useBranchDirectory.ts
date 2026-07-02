"use client";

import * as React from "react";
import { getErrorMessage } from "@/src/lib/api-error";
import { useRentFlowCarRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowCarRealtimeRefresh";
import { useRentFlowCarSiteMode } from "@/src/hooks/useRentFlowCarSiteMode";
import { branchesApi } from "@/src/services/branches/branches.service";
import type { Branch } from "@/src/services/branches/branches.types";

export function useBranchDirectory() {
  const siteMode = useRentFlowCarSiteMode();
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reloadTick, setReloadTick] = React.useState(0);
  const hasLoadedBranchesRef = React.useRef(false);

  useRentFlowCarRealtimeRefresh({
    events: ["branch.changed", "tenant.updated"],
    onRefresh: React.useCallback(() => {
      setReloadTick((current) => current + 1);
    }, []),
    marketplace: siteMode === "marketplace",
  });

  React.useEffect(() => {
    let cancelled = false;

    async function loadBranches() {
      const isInitialLoad = !hasLoadedBranchesRef.current;
      const start = Date.now();

      try {
        if (isInitialLoad) {
          setLoading(true);
          setError(null);
        }

        const res = await branchesApi.getBranches({
          marketplace: siteMode === "marketplace",
        });
        if (!cancelled) {
          setBranches(res.data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          if (isInitialLoad) {
            setBranches([]);
          }
          setError(getErrorMessage(err, "โหลดข้อมูลสาขาไม่สำเร็จ"));
        }
      } finally {
        if (!cancelled && isInitialLoad) {
          const elapsed = Date.now() - start;
          const delay = Math.max(500 - elapsed, 0);
          await new Promise((resolve) => window.setTimeout(resolve, delay));
        }

        if (!cancelled) {
          hasLoadedBranchesRef.current = true;
          setLoading(false);
        }
      }
    }

    loadBranches();

    return () => {
      cancelled = true;
    };
  }, [reloadTick, siteMode]);

  return {
    branches,
    loading,
    error,
  };
}

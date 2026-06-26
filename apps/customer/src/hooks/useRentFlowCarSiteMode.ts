"use client";

import * as React from "react";

import {
  getRentFlowCarSiteMode,
  type RentFlowCarSiteMode,
} from "@/src/lib/tenant";

export function useRentFlowCarSiteMode(initialHost?: string) {
  return useRentFlowCarSiteModeStatus(initialHost).siteMode;
}

export function useRentFlowCarSiteModeStatus(initialHost?: string) {
  const [state, setState] = React.useState<{
    siteMode: RentFlowCarSiteMode;
    ready: boolean;
  }>(() => ({
    siteMode: initialHost ? getRentFlowCarSiteMode(initialHost) : "marketplace",
    ready: Boolean(initialHost),
  }));

  React.useEffect(() => {
    setState({
      siteMode: getRentFlowCarSiteMode(),
      ready: true,
    });
  }, []);

  return state;
}

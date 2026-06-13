"use client";

import * as React from "react";

import {
  getRentFlowSiteMode,
  type RentFlowSiteMode,
} from "@/src/lib/tenant";

export function useRentFlowSiteMode(initialHost?: string) {
  return useRentFlowSiteModeStatus(initialHost).siteMode;
}

export function useRentFlowSiteModeStatus(initialHost?: string) {
  const [state, setState] = React.useState<{
    siteMode: RentFlowSiteMode;
    ready: boolean;
  }>(() => ({
    siteMode: initialHost ? getRentFlowSiteMode(initialHost) : "marketplace",
    ready: Boolean(initialHost),
  }));

  React.useEffect(() => {
    setState({
      siteMode: getRentFlowSiteMode(),
      ready: true,
    });
  }, []);

  return state;
}

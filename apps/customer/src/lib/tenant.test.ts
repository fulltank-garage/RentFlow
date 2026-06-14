import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  getRentFlowSiteMode,
  getRentFlowTenantSlug,
  isRentFlowMarketplaceHost,
} from "./tenant";

describe("tenant host detection", () => {
  it("treats configured Railway app hosts as marketplace hosts", () => {
    const previousHosts = process.env.NEXT_PUBLIC_RENTFLOW_MARKETPLACE_HOSTS;
    process.env.NEXT_PUBLIC_RENTFLOW_MARKETPLACE_HOSTS =
      "rentflow-production-45c8.up.railway.app";

    try {
      const host = "rentflow-production-45c8.up.railway.app";

      assert.equal(isRentFlowMarketplaceHost(host), true);
      assert.equal(getRentFlowSiteMode(host), "marketplace");
      assert.equal(getRentFlowTenantSlug(host), "");
    } finally {
      if (previousHosts === undefined) {
        delete process.env.NEXT_PUBLIC_RENTFLOW_MARKETPLACE_HOSTS;
      } else {
        process.env.NEXT_PUBLIC_RENTFLOW_MARKETPLACE_HOSTS = previousHosts;
      }
    }
  });
});

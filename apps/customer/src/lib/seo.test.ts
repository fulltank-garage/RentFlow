import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  buildRentFlowCarJsonLd,
  buildRentFlowCarMetadata,
  getRentFlowCarCanonicalUrl,
} from "./seo.ts";

describe("RentFlowCar SEO helpers", () => {
  it("builds canonical URLs from a request host and path", () => {
    assert.equal(
      getRentFlowCarCanonicalUrl({
        host: "demo.rentflowcar.xyz",
        pathname: "/cars",
      }),
      "https://demo.rentflowcar.xyz/cars"
    );
  });

  it("builds marketplace metadata with Open Graph and Twitter fields", () => {
    const metadata = buildRentFlowCarMetadata({
      host: "rentflowcar.xyz",
      pathname: "/",
      tenant: null,
    });

    assert.equal(metadata.metadataBase?.toString(), "https://rentflowcar.xyz/");
    assert.equal(metadata.alternates?.canonical, "https://rentflowcar.xyz/");
    assert.equal(metadata.openGraph?.type, "website");
    assert.equal(metadata.twitter?.card, "summary_large_image");
  });

  it("uses tenant shop details for storefront metadata and structured data", () => {
    const tenant = {
      shopName: "Demo Car Rental",
      logoUrl: "https://cdn.example.com/logo.png",
      contactPhone: "0812345678",
    };

    const metadata = buildRentFlowCarMetadata({
      host: "demo.rentflowcar.xyz",
      pathname: "/",
      tenant,
    });
    const jsonLd = buildRentFlowCarJsonLd({
      host: "demo.rentflowcar.xyz",
      tenant,
    });

    assert.match(String(metadata.title), /Demo Car Rental/);
    assert.equal(metadata.openGraph?.siteName, "Demo Car Rental");
    assert.equal(jsonLd[0]["@type"], "LocalBusiness");
    assert.equal(jsonLd[0].telephone, "0812345678");
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  buildRentFlowCarClassMetadata,
  buildRentFlowCarPageMetadata,
  buildRentFlowCarCarMetadata,
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

  it("builds focused metadata for static customer pages", () => {
    const metadata = buildRentFlowCarPageMetadata({
      host: "rentflowcar.xyz",
      pathname: "/cars",
      title: "รถเช่าทั้งหมด",
      description: "ค้นหาและเปรียบเทียบรถเช่าที่พร้อมให้จอง",
    });

    assert.equal(metadata.alternates?.canonical, "https://rentflowcar.xyz/cars");
    assert.equal(String(metadata.title), "RentFlowCar - รถเช่าทั้งหมด");
    assert.equal(metadata.openGraph?.url, "https://rentflowcar.xyz/cars");
  });

  it("builds product metadata and JSON-LD for car detail pages", () => {
    const car = {
      id: "car-1",
      name: "Toyota Yaris",
      brand: "Toyota",
      model: "Yaris",
      year: 2024,
      type: "Sedan",
      seats: 5,
      transmission: "Auto",
      fuel: "Gasoline",
      pricePerDay: 1200,
      imageUrl: "https://cdn.example.com/yaris.jpg",
      isAvailable: true,
      createdAt: "",
      updatedAt: "",
      shopName: "Demo Car Rental",
    };

    const metadata = buildRentFlowCarCarMetadata({
      host: "rentflowcar.xyz",
      car,
    });
    const jsonLd = buildRentFlowCarJsonLd({
      host: "rentflowcar.xyz",
      car,
    });

    assert.match(String(metadata.title), /Toyota Yaris/);
    assert.equal(metadata.alternates?.canonical, "https://rentflowcar.xyz/cars/car-1");
    assert.equal(jsonLd[0]["@type"], "Product");
    assert.equal(jsonLd[0].offers.price, 1200);
  });

  it("builds category metadata from class slugs", () => {
    const metadata = buildRentFlowCarClassMetadata({
      host: "rentflowcar.xyz",
      slug: "suv",
    });

    assert.match(String(metadata.title), /SUV/);
    assert.equal(metadata.alternates?.canonical, "https://rentflowcar.xyz/classes/suv");
  });
});

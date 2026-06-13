"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Box, Container, Typography, Chip, Alert } from "@mui/material";
import CarsFilterBar from "@/src/components/cars/CarsFilterBar";
import CarGrid from "@/src/components/cars/CarGrid";
import CarsPageSkeleton from "@/src/components/cars/CarsPageSkeleton";
import { useCatalogDirectory } from "@/src/hooks/catalog/useCatalogDirectory";
import { useCarsFilters } from "@/src/hooks/cars/useCarsFilters";
import { useCarsCatalog } from "@/src/hooks/cars/useCarsCatalog";
import {
  clampPickupDateToToday,
  clampReturnDateToPickup,
} from "@/src/lib/rentflow-dates";

function formatShopHeading(tenantSlug?: string, fallbackName?: string) {
  const candidate = fallbackName?.trim();
  if (candidate) {
    return candidate;
  }

  const slug = tenantSlug?.trim();
  if (!slug) {
    return "";
  }

  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function CarsPage() {
  const searchParams = useSearchParams();
  const tenantSlug = searchParams.get("tenant")?.trim() || "";
  const shopNameFromQuery = searchParams.get("shopName")?.trim() || "";

  const {
    q,
    setQ,
    type,
    setType,
    sort,
    setSort,
    location,
    setLocation,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    updateUrl,
    resetFilters,
  } = useCarsFilters();

  const { cars, loading, error } = useCarsCatalog({
    q,
    type,
    sort,
    location,
    pickupDate,
    returnDate,
    tenantSlug,
  });
  const {
    siteMode,
    cars: directoryCars,
    carTypes,
    locations,
    loading: directoryLoading,
    error: directoryError,
  } = useCatalogDirectory(tenantSlug || undefined);
  const isMarketplace = siteMode === "marketplace";
  const isTenantCarsPage = Boolean(tenantSlug);
  const scopedShopName = React.useMemo(
    () =>
      formatShopHeading(
        tenantSlug,
        cars.find((car) => car.shopName)?.shopName ||
          directoryCars.find((car) => car.shopName)?.shopName ||
          shopNameFromQuery
      ),
    [cars, directoryCars, shopNameFromQuery, tenantSlug]
  );

  const pageError = [error, directoryError].filter(Boolean).join(" • ");

  if (loading && cars.length === 0) {
    return <CarsPageSkeleton showShop={isMarketplace && !isTenantCarsPage} />;
  }

  return (
    <Box className="apple-page">
    <Container maxWidth="lg" className="apple-section">
      <Box className="apple-section-intro max-w-3xl">
        <Box className="flex flex-col gap-3">
          <Typography
            className="apple-heading apple-page-title"
          >
            {isTenantCarsPage ? "รถทั้งหมดของ" : "รถทั้งหมด"}
          </Typography>
          {isTenantCarsPage && scopedShopName ? (
            <Typography
              className="apple-tenant-title text-center font-black tracking-[-0.05em] text-[var(--rf-apple-ink)]"
            >
              {scopedShopName}
            </Typography>
          ) : null}
          <Typography className="apple-subtitle text-lg">
            {isTenantCarsPage
              ? "เลือกรถของร้านนี้ได้ในหน้าเดียว พร้อมรายละเอียดครบถ้วน"
              : "เลือกจากรถหลากหลายประเภท ทั้งรถเก๋ง รถเอสยูวี รถตู้ และอื่น ๆ พร้อมรายละเอียดครบถ้วน"}
          </Typography>
        </Box>

        <Chip
          size="small"
          label={`${cars.length} รายการ`}
          variant="outlined"
          className="apple-pill w-min! text-[var(--rf-apple-muted)]!"
        />
      </Box>

      <CarsFilterBar
        q={q}
        type={type}
        sort={sort}
        location={location}
        pickupDate={pickupDate}
        returnDate={returnDate}
        carTypes={carTypes}
        locations={locations}
        onQChange={(value) => {
          setQ(value);
          updateUrl({ q: value });
        }}
        onTypeChange={(value) => {
          setType(value);
          updateUrl({ type: value });
        }}
        onSortChange={setSort}
        onLocationChange={(value) => {
          setLocation(value);
          updateUrl({ location: value });
        }}
        onPickupDateChange={(value) => {
          const nextPickupDate = clampPickupDateToToday(value);
          const nextReturnDate = clampReturnDateToPickup(returnDate, nextPickupDate);
          setPickupDate(nextPickupDate);
          setReturnDate(nextReturnDate);
          updateUrl({ pickupDate: nextPickupDate, returnDate: nextReturnDate });
        }}
        onReturnDateChange={(value) => {
          const nextReturnDate = clampReturnDateToPickup(value, pickupDate);
          setReturnDate(nextReturnDate);
          updateUrl({ returnDate: nextReturnDate });
        }}
        onReset={resetFilters}
      />

      {pageError ? (
        <Alert severity="error" className="mt-6 rounded-xl!">
          {pageError}
        </Alert>
      ) : null}

      {directoryLoading && !carTypes.length && !locations.length ? (
        <Chip
          size="small"
          label="กำลังโหลดตัวกรอง"
          variant="outlined"
          className="apple-pill mt-6! text-[var(--rf-apple-muted)]!"
        />
      ) : null}

      <CarGrid
        cars={cars}
        showShop={isMarketplace && !isTenantCarsPage}
        loading={loading}
      />
    </Container>
    </Box>
  );
}

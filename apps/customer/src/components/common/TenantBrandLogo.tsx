"use client";

import * as React from "react";
import Image from "next/image";
import { Box } from "@mui/material";
import { useRentFlowCarSiteModeStatus } from "@/src/hooks/useRentFlowCarSiteMode";
import { tenantApi } from "@/src/services/tenant/tenant.service";
import type { TenantProfile } from "@/src/services/tenant/tenant.types";

type TenantBrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export default function TenantBrandLogo({
  className = "relative h-16 w-48 sm:w-56",
  imageClassName = "object-contain",
  priority = false,
}: TenantBrandLogoProps) {
  const { siteMode } = useRentFlowCarSiteModeStatus();
  const [tenantProfile, setTenantProfile] =
    React.useState<TenantProfile | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    if (siteMode !== "storefront") {
      setTenantProfile(null);
      return;
    }

    tenantApi
      .resolveTenant()
      .then((res) => {
        if (!cancelled) setTenantProfile(res.data);
      })
      .catch(() => {
        if (!cancelled) setTenantProfile(null);
      });

    return () => {
      cancelled = true;
    };
  }, [siteMode]);

  const logoSrc =
    siteMode === "storefront" && tenantProfile?.logoUrl
      ? tenantProfile.logoUrl
      : "/RentFlowCar.png";
  const logoAlt =
    siteMode === "storefront" && tenantProfile?.shopName
      ? `${tenantProfile.shopName} Logo`
      : "RentFlowCar Logo";

  return (
    <Box className={className}>
      <Image
        src={logoSrc}
        alt={logoAlt}
        fill
        className={imageClassName}
        priority={priority}
      />
    </Box>
  );
}

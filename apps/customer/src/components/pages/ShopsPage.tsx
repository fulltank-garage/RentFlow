"use client";

import * as React from "react";
import { Box } from "@mui/material";

import ShopRecommendationsSection from "@/src/components/shops/ShopRecommendationsSection";
import ShopsPageSkeleton from "@/src/components/shops/ShopsPageSkeleton";
import { useCatalogDirectory } from "@/src/hooks/catalog/useCatalogDirectory";
import { buildShopSummariesFromTenants } from "@/src/lib/shop-directory";
import { tenantApi } from "@/src/services/tenant/tenant.service";
import type { TenantProfile } from "@/src/services/tenant/tenant.types";

export default function ShopsPage() {
  const { cars, loading, carsError } = useCatalogDirectory();
  const [minimumLoading, setMinimumLoading] = React.useState(true);
  const [tenants, setTenants] = React.useState<TenantProfile[]>([]);
  const [tenantsLoading, setTenantsLoading] = React.useState(true);
  const [tenantsError, setTenantsError] = React.useState<string | null>(null);
  const shops = React.useMemo(
    () => buildShopSummariesFromTenants(tenants, cars),
    [cars, tenants]
  );

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setMinimumLoading(false);
    }, 500);

    return () => window.clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    setTenantsLoading(true);
    setTenantsError(null);

    tenantApi
      .listTenants()
      .then((res) => {
        if (!cancelled) setTenants(res.data.items);
      })
      .catch(() => {
        if (!cancelled) {
          setTenants([]);
          setTenantsError("โหลดข้อมูลร้านไม่สำเร็จ");
        }
      })
      .finally(() => {
        if (!cancelled) setTenantsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || tenantsLoading || minimumLoading) {
    return <ShopsPageSkeleton />;
  }

  return (
    <Box className="apple-page">
      <ShopRecommendationsSection
        shops={shops}
        title="ร้านทั้งหมด"
        subtitle="เลือกร้านเช่ารถที่เหมาะกับการเดินทางของคุณ"
        showDivider={false}
        layout="page"
        dataError={tenantsError}
        supportingError={carsError}
      />
    </Box>
  );
}

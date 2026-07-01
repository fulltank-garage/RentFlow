"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import { formatTHB } from "@/src/constants/money";
import { getRentFlowCarRootDomain } from "@/src/lib/tenant";
import { getCarTypeLabel } from "@/src/lib/rentflow-catalog";
import type { ShopSummary } from "@/src/lib/shop-directory";
import DataLoadErrorCard from "@/src/components/common/DataLoadErrorCard";

type Props = {
  shops: ShopSummary[];
  title?: string;
  subtitle?: string;
  limit?: number;
  showDivider?: boolean;
  layout?: "section" | "page";
  dataError?: string | null;
  supportingError?: string | null;
};

function getShopHref(shop: ShopSummary) {
  const tenantSlug = shop.domainSlug || shop.key;
  if (tenantSlug) {
    const params = new URLSearchParams({
      tenant: tenantSlug,
      shopName: shop.name,
    });
    return `/cars?${params.toString()}`;
  }

  return "/cars";
}

export default function ShopRecommendationsSection({
  shops,
  title = "ร้านแนะนำ",
  subtitle = "เลือกร้านที่ถูกใจ แล้วดูรถพร้อมจองได้เลย",
  limit,
  showDivider = true,
  layout = "section",
  dataError,
  supportingError,
}: Props) {
  const rootDomain = getRentFlowCarRootDomain();
  const visibleShops = React.useMemo(
    () => (limit ? shops.slice(0, limit) : shops),
    [limit, shops]
  );
  const isPageLayout = layout === "page";
  const [failedLogoIds, setFailedLogoIds] = React.useState<Set<string>>(
    () => new Set()
  );

  const handleLogoError = React.useCallback((shopKey: string) => {
    setFailedLogoIds((current) => {
      const next = new Set(current);
      next.add(shopKey);
      return next;
    });
  }, []);

  return (
    <Container maxWidth="lg" className={isPageLayout ? "apple-section" : "apple-section"}>
      <Box className="apple-section-intro max-w-3xl">
        <Box className="flex flex-col gap-3">
          <Typography
            className={`apple-heading ${isPageLayout ? "apple-page-title" : "apple-section-title"}`}
          >
            {title}
          </Typography>
          <Typography className="apple-subtitle text-lg">
            {subtitle}
          </Typography>
        </Box>

        <Chip
          size="small"
          label={`${visibleShops.length} ${isPageLayout ? "รายการ" : "ร้าน"}`}
          variant={isPageLayout ? "outlined" : "filled"}
          className="apple-pill w-min! text-[var(--rf-apple-muted)]!"
        />
      </Box>

      <Box className="apple-shelf apple-shelf-wide mt-10 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {dataError ? (
          <DataLoadErrorCard
            title="โหลดรายการร้านไม่ได้"
            message={dataError}
            className="sm:col-span-2 lg:col-span-3"
          />
        ) : (
          <>
            {supportingError ? (
              <DataLoadErrorCard
                title="โหลดข้อมูลรถของร้านไม่ได้"
                message={supportingError}
                helperText="ยังแสดงรายการร้านได้ แต่จำนวนรถและราคาเริ่มต้นอาจไม่ครบถ้วน"
                compact
              />
            ) : null}
            {visibleShops.length ? (
              visibleShops.map((shop) => (
            <Card
              key={shop.key}
              elevation={0}
              sx={{ boxShadow: "none" }}
              className="apple-card group"
            >
              <Box className="relative h-52 w-full overflow-hidden bg-[var(--rf-apple-surface-soft)] sm:h-56">
                {shop.logoUrl && !failedLogoIds.has(shop.key) ? (
                  <Box
                    component="img"
                    src={shop.logoUrl}
                    alt={shop.name}
                    loading="lazy"
                    decoding="async"
                    onError={() => handleLogoError(shop.key)}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.18,0.9,0.22,1)] group-hover:scale-[1.012]"
                  />
                ) : (
                  <Box className="grid h-full place-items-center px-6 text-center text-sm font-semibold text-[var(--rf-apple-muted)]">
                    {shop.name}
                  </Box>
                )}
                <Box className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
                <Box className="absolute bottom-4 left-4 right-4">
                  <Typography className="apple-card-title-lg truncate font-black tracking-[-0.04em] text-white">
                    {shop.name}
                  </Typography>
                  {shop.domainSlug ? (
                    <Typography className="truncate text-sm text-white/80">
                      {shop.domainSlug}.{rootDomain}
                    </Typography>
                  ) : null}
                </Box>
              </Box>

              <CardContent className="p-4! sm:p-5!">
                <Box className="flex flex-wrap gap-2">
                  {shop.carTypes.slice(0, 3).map((type) => (
                    <Chip
                      key={`${shop.key}-${type}`}
                      size="small"
                      label={getCarTypeLabel(type)}
                      className="h-7! rounded-full! bg-[var(--rf-apple-surface-soft)]! text-[var(--rf-apple-muted)]!"
                    />
                  ))}
                </Box>

                <Box className="mt-4 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
                  <Box className="flex items-end justify-between gap-3">
                    <Box className="grid gap-1">
                      <Typography className="text-xs text-[var(--rf-apple-muted)]">
                        รถพร้อมให้เลือก
                      </Typography>
                      <Typography className="apple-card-title font-bold text-[var(--rf-apple-ink)]">
                        {shop.carCount} คัน
                      </Typography>
                    </Box>
                    <Box className="grid gap-1 text-right">
                      <Typography className="text-xs text-[var(--rf-apple-muted)]">
                        เริ่มต้น
                      </Typography>
                      <Typography className="apple-card-title font-bold text-[var(--rf-apple-ink)]">
                        {formatTHB(shop.startingPrice)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box className="mt-5">
                  <Button
                    component={Link}
                    href={getShopHref(shop)}
                    variant="contained"
                    fullWidth
                    className="rounded-full! font-semibold!"
                    sx={{ minHeight: 40 }}
                  >
                    ดูร้านนี้
                  </Button>
                </Box>
              </CardContent>
            </Card>
              ))
            ) : (
              <Box className="flex min-h-48 items-center justify-center rounded-[30px] border border-dashed border-black/10 bg-white px-8 py-12 text-center sm:col-span-2 lg:col-span-3">
                <Typography className="text-base font-semibold text-[var(--rf-apple-muted)] md:text-lg">
                  {isPageLayout
                    ? "ยังไม่มีร้านที่พร้อมแสดงในตอนนี้"
                    : "ยังไม่มีร้านแนะนำในตอนนี้"}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {showDivider ? <Divider className="mt-14! border-black/10!" /> : null}
    </Container>
  );
}

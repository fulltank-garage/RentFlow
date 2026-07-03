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
  Skeleton,
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
  hasAvailableCars?: boolean;
  loading?: boolean;
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

function getDailyRecommendationSeed() {
  const now = new Date();
  return [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function hashRecommendationKey(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function rotateShopsDaily(shops: ShopSummary[]) {
  const seed = getDailyRecommendationSeed();

  return shops
    .map((shop, index) => ({
      shop,
      index,
      score: hashRecommendationKey(`${seed}:${shop.domainSlug || shop.key}`),
    }))
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map(({ shop }) => shop);
}

function ShopRecommendationSkeletonCard() {
  return (
    <Card
      elevation={0}
      sx={{ boxShadow: "none" }}
      className="apple-card apple-card-no-hover shop-recommendation-card"
    >
      <Box className="relative h-52 w-full overflow-hidden bg-(--rf-apple-surface-soft) sm:h-56">
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ width: "100%", height: "100%", borderRadius: 0 }}
        />
        <Box className="absolute bottom-4 left-4 right-4 space-y-2.5">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "58%",
              height: 32,
              borderRadius: "8px",
              transform: "none",
              bgcolor: "rgba(255,255,255,0.55)",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "46%",
              height: 18,
              borderRadius: "8px",
              transform: "none",
              bgcolor: "rgba(255,255,255,0.42)",
            }}
          />
        </Box>
      </Box>

      <CardContent className="p-4! sm:p-5!">
        <Box className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={`home-shop-chip-skeleton-${index}`}
              variant="rounded"
              animation="wave"
              sx={{ width: 68, height: 28, borderRadius: "999px" }}
            />
          ))}
        </Box>

        <Box className="mt-4 rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
          <Box className="flex items-end justify-between gap-3">
            <Box className="grid gap-1">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ width: 86, height: 18, borderRadius: "6px", transform: "none" }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ width: 58, height: 24, borderRadius: "8px", transform: "none" }}
              />
            </Box>
            <Box className="grid gap-1 text-right">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ width: 58, height: 18, borderRadius: "6px", transform: "none" }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ width: 92, height: 24, borderRadius: "8px", transform: "none" }}
              />
            </Box>
          </Box>
        </Box>

        <Box className="mt-5">
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ width: "100%", height: 40, borderRadius: "999px" }}
          />
        </Box>
      </CardContent>
    </Card>
  );
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
  hasAvailableCars = false,
  loading = false,
}: Props) {
  const rootDomain = getRentFlowCarRootDomain();
  const shelfRef = React.useRef<HTMLDivElement | null>(null);
  const shopCardRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const [activeShopIndex, setActiveShopIndex] = React.useState(0);
  const isPageLayout = layout === "page";
  const visibleShops = React.useMemo(
    () => {
      const readyShops = shops.filter((shop) => shop.carCount > 0);
      const orderedShops = isPageLayout
        ? readyShops
        : rotateShopsDaily(readyShops);

      return limit ? orderedShops.slice(0, limit) : orderedShops;
    },
    [isPageLayout, limit, shops]
  );
  const isShowingSkeleton = loading && !visibleShops.length;
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

  const updateActiveShopIndex = React.useCallback(() => {
    const shelf = shelfRef.current;
    if (!shelf || visibleShops.length <= 1) return;

    const shelfLeft = shelf.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    shopCardRefs.current.forEach((card, index) => {
      if (!card) return;

      const distance = Math.abs(card.getBoundingClientRect().left - shelfLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveShopIndex(closestIndex);
  }, [visibleShops.length]);

  React.useEffect(() => {
    shopCardRefs.current = shopCardRefs.current.slice(0, visibleShops.length);
    setActiveShopIndex(0);
  }, [visibleShops.length]);

  const scrollToShop = React.useCallback((index: number) => {
    shopCardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
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
          className="apple-pill w-min! text-(--rf-apple-muted)!"
          sx={{
            "& .MuiChip-label": {
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Box>

      <Box
        ref={shelfRef}
        className={
          isPageLayout
            ? "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "apple-shelf apple-shelf-wide mt-10 sm:grid sm:grid-cols-2 lg:grid-cols-3"
        }
        onScroll={updateActiveShopIndex}
        sx={
          isPageLayout
            ? undefined
            : {
                "@media (max-width: 767px)": {
                  paddingRight: "16vw",
                },
                "@media (max-width: 767px) and (min-width: 390px)": {
                  "& > .shop-recommendation-card": {
                    flexBasis: "min(80vw, 22rem)",
                  },
                },
                "@media (max-width: 389px)": {
                  "& > .shop-recommendation-card": {
                    flexBasis: "min(78vw, 19.5rem)",
                  },
                },
              }
        }
      >
        {dataError ? (
          <DataLoadErrorCard
            title="โหลดรายการร้านไม่ได้"
            message={dataError}
            className="sm:col-span-2 lg:col-span-3"
          />
        ) : isShowingSkeleton ? (
          Array.from({ length: 6 }).map((_, index) => (
            <ShopRecommendationSkeletonCard key={`home-shop-skeleton-${index}`} />
          ))
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
              visibleShops.map((shop, index) => (
            <Card
              key={shop.key}
              ref={(node) => {
                shopCardRefs.current[index] = node;
              }}
              elevation={0}
              sx={{ boxShadow: "none" }}
              className="apple-card shop-recommendation-card group"
            >
              <Box className="relative h-52 w-full overflow-hidden bg-(--rf-apple-surface-soft) sm:h-56">
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
                  <Box className="grid h-full place-items-center px-6 text-center text-sm font-semibold text-(--rf-apple-muted)">
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
                      className="h-7! rounded-full! bg-(--rf-apple-surface-soft)! text-(--rf-apple-muted)!"
                    />
                  ))}
                </Box>

                <Box className="mt-4 rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                  <Box className="flex items-end justify-between gap-3">
                    <Box className="grid gap-1">
                      <Typography className="text-xs text-(--rf-apple-muted)">
                        รถพร้อมให้เลือก
                      </Typography>
                      <Typography className="apple-card-title font-bold text-(--rf-apple-ink)">
                        {shop.carCount} คัน
                      </Typography>
                    </Box>
                    <Box className="grid gap-1 text-right">
                      <Typography className="text-xs text-(--rf-apple-muted)">
                        เริ่มต้น
                      </Typography>
                      <Typography className="apple-card-title font-bold text-(--rf-apple-ink)">
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
              <Box className="flex min-h-40 flex-col items-center justify-center rounded-[30px] border border-black/10 bg-white px-8 py-10 text-center sm:col-span-2 lg:col-span-3">
                <Typography className="text-base font-semibold text-(--rf-apple-ink) md:text-lg">
                  {hasAvailableCars
                    ? "ไม่พบร้านที่ตรงกับเงื่อนไข"
                    : "ยังไม่มีร้านที่พร้อมแสดงในตอนนี้"}
                </Typography>
                <Typography className="mt-1 text-sm text-(--rf-apple-muted)">
                  {hasAvailableCars
                    ? "ลองเปลี่ยนคำค้นหา หรือเลือกประเภทอื่น"
                    : "เมื่อมีรถพร้อมให้เช่า ร้านจะแสดงในหน้านี้"}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {!isPageLayout && !dataError && visibleShops.length > 1 ? (
        <Box className="mt-3 flex items-center justify-center gap-1.5 sm:hidden">
          {visibleShops.map((shop, index) => {
            const active = index === activeShopIndex;

            return (
              <Box
                key={`shop-dot-${shop.key}`}
                component="button"
                type="button"
                aria-label={`ไปยังร้านที่ ${index + 1} จาก ${visibleShops.length}`}
                aria-current={active ? "true" : undefined}
                onClick={() => scrollToShop(index)}
                className="h-1.5 rounded-full border-0 p-0 transition-[background-color,width,opacity] duration-300"
                sx={{
                  width: active ? 18 : 6,
                  backgroundColor: active
                    ? "var(--secondary-navy)"
                    : "rgba(1, 18, 44, 0.18)",
                  opacity: 1,
                }}
              />
            );
          })}
        </Box>
      ) : null}

      {showDivider ? <Divider className="mt-14! border-black/10!" /> : null}
    </Container>
  );
}

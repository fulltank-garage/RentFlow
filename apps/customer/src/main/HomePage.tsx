"use client";

import * as React from "react";
import { Box } from "@mui/material";
import { useSearchParams } from "next/navigation";

import HeroSection from "@/src/components/home/HeroSection";
import CarsSection from "@/src/components/home/CarsSection";
import CarClassSection from "@/src/components/home/CarClassSection";
import BenefitsCTASection from "@/src/components/home/BenefitsCTASection";
import ReviewsSection from "@/src/components/home/ReviewsSection";
import StorefrontBlocksSection from "@/src/components/home/StorefrontBlocksSection";
import type { BuilderImagePayload } from "@/src/components/home/StorefrontBlocksSection";
import ShopRecommendationsSection from "@/src/components/shops/ShopRecommendationsSection";
import { formatTHB } from "@/src/constants/money";
import { useCatalogDirectory } from "@/src/hooks/catalog/useCatalogDirectory";
import { buildShopSummariesFromTenants } from "@/src/lib/shop-directory";
import type { CarType } from "@/src/services/cars/cars.types";
import { platformApi } from "@/src/services/platform/platform.service";
import type { PlatformPublicSettings } from "@/src/services/platform/platform.types";
import { tenantApi } from "@/src/services/tenant/tenant.service";
import type { TenantProfile } from "@/src/services/tenant/tenant.types";
import { storefrontApi } from "@/src/services/storefront/storefront.service";
import type {
  StorefrontBlock,
  StorefrontPage,
  StorefrontTheme,
} from "@/src/services/storefront/storefront.types";

type HomePageProps = {
  initialHost?: string;
  initialTenantProfile?: TenantProfile | null;
};

export default function HomePage({
  initialHost,
  initialTenantProfile = null,
}: HomePageProps) {
  const searchParams = useSearchParams();
  const builderMode = searchParams.get("rfBuilder") === "1";
  const [location, setLocation] = React.useState("");
  const [type, setType] = React.useState<CarType | "All">("All");
  const [pickupDate, setPickupDate] = React.useState("");
  const [returnDate, setReturnDate] = React.useState("");
  const {
    siteMode,
    cars,
    carTypes,
    locations,
    classes,
    loading,
    carsError,
    branchesError,
  } =
    useCatalogDirectory(undefined, initialHost);
  const [tenantProfile, setTenantProfile] =
    React.useState<TenantProfile | null>(initialTenantProfile);
  const [marketplaceTenants, setMarketplaceTenants] = React.useState<
    TenantProfile[]
  >([]);
  const [marketplaceTenantsLoading, setMarketplaceTenantsLoading] =
    React.useState(false);
  const [marketplaceTenantsError, setMarketplaceTenantsError] =
    React.useState<string | null>(null);
  const [platformSettings, setPlatformSettings] =
    React.useState<PlatformPublicSettings | null>(null);
  const [storefrontPage, setStorefrontPage] =
    React.useState<StorefrontPage | null>(null);
  const [builderDraft, setBuilderDraft] = React.useState<{
    blocks: StorefrontBlock[];
    theme?: StorefrontTheme;
    isPublished?: boolean;
  } | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    if (siteMode === "marketplace") {
      setTenantProfile(null);
      return;
    }

    tenantApi
      .resolveTenant()
      .then((res) => {
        if (!cancelled) setTenantProfile(res.data);
      })
      .catch(() => {
        if (!cancelled) setTenantProfile(initialTenantProfile);
      });

    return () => {
      cancelled = true;
    };
  }, [initialTenantProfile, siteMode]);

  React.useEffect(() => {
    let cancelled = false;

    if (siteMode !== "marketplace") {
      setMarketplaceTenants([]);
      setMarketplaceTenantsLoading(false);
      setMarketplaceTenantsError(null);
      return;
    }

    setMarketplaceTenantsLoading(true);
    setMarketplaceTenantsError(null);
    tenantApi
      .listTenants()
      .then((res) => {
        if (!cancelled) {
          setMarketplaceTenants(res.data.items);
          setMarketplaceTenantsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMarketplaceTenants([]);
          setMarketplaceTenantsLoading(false);
          setMarketplaceTenantsError("โหลดข้อมูลร้านไม่สำเร็จ");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [siteMode]);

  React.useEffect(() => {
    let cancelled = false;

    if (siteMode !== "marketplace") {
      setPlatformSettings(null);
      return;
    }

    platformApi
      .getPublicSettings()
      .then((settings) => {
        if (!cancelled) setPlatformSettings(settings);
      })
      .catch(() => {
        if (!cancelled) setPlatformSettings(null);
      });

    return () => {
      cancelled = true;
    };
  }, [siteMode]);

  React.useEffect(() => {
    if (!builderMode) return;

    const notifyReady = () => {
      window.parent?.postMessage({ type: "rentflow:builder:ready" }, "*");
    };
    const sendHeight = () => {
      const bodyHeight = document.body.scrollHeight;
      const documentHeight = document.documentElement.scrollHeight;
      window.parent?.postMessage(
        {
          type: "rentflow:builder:height",
          height: Math.max(bodyHeight, documentHeight),
        },
        "*"
      );
    };

    function handleBuilderMessage(event: MessageEvent) {
      const data = event.data as
        | {
            type?: string;
            blocks?: StorefrontBlock[];
            theme?: StorefrontTheme;
            isPublished?: boolean;
          }
        | undefined;

      if (data?.type !== "rentflow:builder:draft") return;

      setBuilderDraft({
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
        theme: data.theme,
        isPublished: data.isPublished,
      });
      window.requestAnimationFrame(sendHeight);
    }

    window.addEventListener("message", handleBuilderMessage);
    window.addEventListener("resize", sendHeight);
    notifyReady();
    sendHeight();
    const readyTimer = window.setTimeout(notifyReady, 250);
    const heightTimer = window.setTimeout(sendHeight, 350);
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.documentElement);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("message", handleBuilderMessage);
      window.removeEventListener("resize", sendHeight);
      window.clearTimeout(readyTimer);
      window.clearTimeout(heightTimer);
      observer.disconnect();
    };
  }, [builderMode]);

  React.useEffect(() => {
    let cancelled = false;

    storefrontApi
      .getHomePage({ marketplace: siteMode === "marketplace" })
      .then((page) => {
        if (!cancelled) setStorefrontPage(page);
      })
      .catch(() => {
        if (!cancelled) setStorefrontPage(null);
      });

    return () => {
      cancelled = true;
    };
  }, [siteMode]);

  const recommendedCars = React.useMemo(() => {
    return cars.slice(0, 6);
  }, [cars]);
  const recommendedShops = React.useMemo(() => {
    return buildShopSummariesFromTenants(marketplaceTenants, cars).slice(0, 12);
  }, [cars, marketplaceTenants]);
  const heroImages = React.useMemo(() => {
    if (siteMode === "storefront") {
      const images = tenantProfile?.promoImageUrls?.length
        ? tenantProfile.promoImageUrls
        : tenantProfile?.promoImageUrl
          ? [tenantProfile.promoImageUrl]
          : [];

      return images.filter(Boolean);
    }

    return platformSettings?.promoImageUrl ? [platformSettings.promoImageUrl] : [];
  }, [platformSettings, siteMode, tenantProfile]);

  const storefrontBlocks = React.useMemo(() => {
    if (builderMode && builderDraft) return builderDraft.blocks;
    if (storefrontPage?.isPublished === false) return [];
    if (storefrontPage?.id) return storefrontPage.blocks || [];
    return [];
  }, [builderDraft, builderMode, storefrontPage]);

  const storefrontTheme =
    builderMode && builderDraft
      ? builderDraft.theme
      : storefrontPage?.id
        ? storefrontPage.theme
        : undefined;

  const sendBuilderMessage = React.useCallback((message: Record<string, unknown>) => {
    if (!builderMode) return;
    window.parent?.postMessage(message, "*");
  }, [builderMode]);

  const updateBuilderBlock = React.useCallback(
    (index: number, patch: Partial<StorefrontBlock>) => {
      setBuilderDraft((current) =>
        current
          ? {
              ...current,
              blocks: current.blocks.map((block, blockIndex) =>
                blockIndex === index ? { ...block, ...patch } : block
              ),
            }
          : current
      );
      sendBuilderMessage({
        type: "rentflow:builder:update-block",
        index,
        patch,
      });
    },
    [sendBuilderMessage]
  );

  const handleBuilderAction = React.useCallback(
    (action: "add" | "delete" | "move-up" | "move-down", index?: number) => {
      setBuilderDraft((current) => {
        if (!current) return current;
        if (action === "delete" && typeof index === "number") {
          return {
            ...current,
            blocks: current.blocks.filter((_, blockIndex) => blockIndex !== index),
          };
        }
        if (
          (action === "move-up" || action === "move-down") &&
          typeof index === "number"
        ) {
          const targetIndex = action === "move-up" ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= current.blocks.length) return current;
          const nextBlocks = [...current.blocks];
          const [moved] = nextBlocks.splice(index, 1);
          nextBlocks.splice(targetIndex, 0, moved);
          return { ...current, blocks: nextBlocks };
        }
        return current;
      });

      sendBuilderMessage({
        type: `rentflow:builder:${action}`,
        index,
      });
    },
    [sendBuilderMessage]
  );

  const handleBuilderImageUpload = React.useCallback(
    (index: number, image: BuilderImagePayload) => {
      sendBuilderMessage({
        type: "rentflow:builder:upload-image",
        index,
        image,
      });
    },
    [sendBuilderMessage]
  );

  return (
    <Box className="apple-page">
      <HeroSection
        heroImages={heroImages}
        location={location}
        setLocation={setLocation}
        type={type}
        setType={setType}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        carTypes={carTypes}
        locations={locations}
        catalogLoading={loading}
        carTypesError={carsError}
        locationsError={branchesError}
      />

      <StorefrontBlocksSection
        blocks={storefrontBlocks}
        theme={storefrontTheme}
        builderMode={builderMode}
        onBuilderPatch={updateBuilderBlock}
        onBuilderAction={handleBuilderAction}
        onBuilderImageUpload={handleBuilderImageUpload}
      />

      {siteMode === "marketplace" ? (
        <>
          <ShopRecommendationsSection
            shops={recommendedShops}
            limit={12}
            dataError={marketplaceTenantsError}
            supportingError={carsError}
            hasAvailableCars={cars.length > 0}
            loading={marketplaceTenantsLoading || loading}
          />
        </>
      ) : (
        <>
          <CarsSection
            cars={recommendedCars}
            formatTHB={formatTHB}
            loading={loading}
            error={carsError}
          />
          <CarClassSection
            classes={classes}
            loading={loading}
            error={carsError}
          />
        </>
      )}

      <ReviewsSection />

      <BenefitsCTASection />
    </Box>
  );
}

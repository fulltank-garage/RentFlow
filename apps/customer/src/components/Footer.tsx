"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Container, Typography, Stack, Divider } from "@mui/material";

import { NAV } from "@/src/constants/navigation";
import { useRentFlowCarSiteMode } from "@/src/hooks/useRentFlowCarSiteMode";
import { tenantApi } from "@/src/services/tenant/tenant.service";
import type { TenantProfile } from "@/src/services/tenant/tenant.types";

const BRAND = {
  name: "RentFlowCar",
  tagline:
    "ระบบเช่ารถออนไลน์ จองง่าย ราคารวมชัดเจน ไม่มีค่าใช้จ่ายแอบแฝง พร้อมบริการช่วยเหลือ 24/7",
};

const CONTACT = {
  phone: "099-999-9999",
};

const SOCIAL = {
  facebook: "https://facebook.com",
};

type FooterProps = {
  initialHost?: string;
  initialTenantProfile?: TenantProfile | null;
};

function FooterBrandLogo({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    const fallbackText = name.trim().slice(0, 1).toUpperCase() || "R";

    return (
      <Box className="grid h-full w-full place-items-center rounded-md bg-(--rf-apple-ink) text-xs font-bold leading-none text-white">
        {fallbackText}
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="h-full w-full object-contain"
    />
  );
}

function FooterLinkIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      aria-hidden="true"
      className="h-5 w-5 shrink-0 object-contain"
    />
  );
}

export default function Footer({
  initialHost,
  initialTenantProfile = null,
}: FooterProps) {
  const year = new Date().getFullYear();
  const siteMode = useRentFlowCarSiteMode(initialHost);
  const [tenantProfile, setTenantProfile] =
    React.useState<TenantProfile | null>(initialTenantProfile);

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

  const brandName =
    siteMode === "storefront" && tenantProfile?.shopName
      ? tenantProfile.shopName
      : BRAND.name;
  const brandLogoSrc =
    siteMode === "storefront" && tenantProfile?.logoUrl
      ? tenantProfile.logoUrl
      : siteMode === "storefront"
        ? ""
        : "/RentFlowCar.png";
  const brandTagline =
    siteMode === "storefront" && tenantProfile?.shopName
      ? `จองรถกับ ${tenantProfile.shopName} ได้ง่าย พร้อมดูข้อมูลรถและสาขาของร้านในที่เดียว`
      : BRAND.tagline;

  const contactTitle =
    siteMode === "marketplace"
      ? "สนใจเช่าแพลตฟอร์ม"
      : tenantProfile?.shopName
        ? `ติดต่อ ${tenantProfile.shopName}`
        : "ติดต่อ";
  const contactText =
    siteMode === "marketplace"
      ? "ถ้าสนใจเช่าแพลตฟอร์มให้บริการเช่ารถยนต์ออนไลน์ สามารถติดต่อทีม RentFlowCar ได้ที่นี่"
      : "ติดต่อร้านเพื่อสอบถามข้อมูลรถ สาขา และเงื่อนไขการเช่าเพิ่มเติม";
  const contactPhone =
    siteMode === "storefront" ? tenantProfile?.contactPhone || "" : CONTACT.phone;
  const facebookPageUrl =
    siteMode === "storefront"
      ? tenantProfile?.facebookPageUrl || ""
      : SOCIAL.facebook;
  const telHref = contactPhone.replace(/[^\d+]/g, "");
  const navItems = React.useMemo(
    () =>
      siteMode === "marketplace"
        ? NAV
        : NAV.filter((item) => item.href !== "/shops"),
    [siteMode]
  );

  return (
    <Box
      component="footer"
      className="border-t border-black/10 bg-(--rf-apple-surface-soft)"
      aria-label="Site footer"
    >
      <Container
        maxWidth="lg"
        className="py-10 md:py-12"
        sx={{
          "@media (min-width: 1200px)": {
            maxWidth: "1360px",
            paddingLeft: "24px",
            paddingRight: "24px",
          },
        }}
      >
        <Box className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-10">
          {/* Brand */}
          <Box className="col-span-2 space-y-3 text-center md:col-span-1 md:text-left">
            <Stack
              direction="column"
              spacing={1.25}
              alignItems="center"
              className="mx-auto w-fit md:mx-0"
            >
              <Box
                className={`relative h-12 shrink-0 overflow-hidden rounded-md ${
                  siteMode === "marketplace" ? "w-36 sm:w-40" : "w-12"
                }`}
              >
                <FooterBrandLogo src={brandLogoSrc} name={brandName} />
              </Box>

              <Typography className="apple-card-title text-center font-bold tracking-[-0.03em] text-(--rf-apple-ink)">
                {brandName}
              </Typography>
            </Stack>

            <Typography className="apple-body-sm mx-auto max-w-sm text-(--rf-apple-muted) md:mx-0 md:hidden">
              {brandTagline}
            </Typography>
          </Box>

          {/* Links */}
          <Box component="nav" aria-label="Footer navigation" className="min-w-0">
            <Typography className="font-semibold! text-(--rf-apple-ink)">
              เมนู
            </Typography>

            <Stack spacing={1} className="mt-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="apple-body-sm w-fit text-(--rf-apple-muted) outline-none transition hover:text-(--rf-apple-ink) focus-visible:rounded focus-visible:ring-2 focus-visible:ring-black/20"
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Contact / Social */}
          <Box component="address" className="min-w-0 not-italic">
            <Typography className="font-semibold! text-(--rf-apple-ink)">
              {contactTitle}
            </Typography>

            <Stack spacing={1.5} className="mt-3">
              <Typography className="apple-body-sm text-(--rf-apple-muted)">
                {contactText}
              </Typography>

              {contactPhone ? (
                <a
                  href={`tel:${telHref}`}
                  className="apple-body-sm text-(--rf-apple-muted) hover:text-(--rf-apple-ink) focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                >
                  โทร: {contactPhone}
                </a>
              ) : null}

              {facebookPageUrl ? (
                <a
                  href={facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-body-sm inline-flex w-fit items-center gap-2 text-(--rf-apple-muted) hover:text-(--rf-apple-ink) focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                >
                  <FooterLinkIcon src="/facebook.svg" alt="Facebook" />
                  <span>Facebook</span>
                </a>
              ) : null}

            </Stack>
          </Box>
        </Box>

        <Divider className="my-6! border-black/10!" />

        <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Typography className="apple-label-text text-(--rf-apple-muted)">
            © {year} {brandName} • แพลตฟอร์มให้บริการเช่ารถยนต์ออนไลน์
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            className="text-sm"
          >
            <Link
              href="/terms"
              className="text-(--rf-apple-muted) hover:text-(--rf-apple-ink)"
            >
              เงื่อนไขการใช้งาน
            </Link>
            <Link
              href="/privacy"
              className="text-(--rf-apple-muted) hover:text-(--rf-apple-ink)"
            >
              นโยบายความเป็นส่วนตัว
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

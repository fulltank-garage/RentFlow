"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Container, Typography, Chip, Button } from "@mui/material";
import FeaturesPageSkeleton from "@/src/components/feature/FeaturesPageSkeleton";
import {
  HERO_BADGES,
  FEATURES,
  HOW_IT_WORKS,
  TRUST_POINTS,
} from "@/src/constants/features";
import usePageReady from "@/src/hooks/usePageReady";
import { useRentFlowSiteModeStatus } from "@/src/hooks/useRentFlowSiteMode";
import { tenantApi } from "@/src/services/tenant/tenant.service";
import type { TenantProfile } from "@/src/services/tenant/tenant.types";

type FeaturesPageProps = {
  initialHost?: string;
  initialTenantProfile?: TenantProfile | null;
};

export default function FeaturesPage({
  initialHost,
  initialTenantProfile = null,
}: FeaturesPageProps) {
  const ready = usePageReady();
  const { siteMode, ready: siteReady } = useRentFlowSiteModeStatus(initialHost);
  const [tenantProfile, setTenantProfile] =
    React.useState<TenantProfile | null>(initialTenantProfile);
  const isStorefront = siteMode === "storefront";
  const shopName = tenantProfile?.shopName?.trim() || "ร้านนี้";

  React.useEffect(() => {
    if (siteMode !== "storefront") {
      setTenantProfile(null);
      return;
    }

    let cancelled = false;
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

  const pageCopy = React.useMemo(() => {
    if (isStorefront) {
      return {
        title: `ทำไมต้องเลือก ${shopName}`,
        subtitle: `บริการเช่ารถของ ${shopName} ที่รวมข้อมูลรถ สาขา ราคา และขั้นตอนจองไว้ให้ตรวจสอบง่ายในที่เดียว`,
        featuresTitle: `จุดเด่นของ ${shopName}`,
        featuresDesc: "ดูข้อมูลสำคัญของร้านและรถก่อนตัดสินใจจองได้อย่างชัดเจน",
        stepsDesc:
          "ตั้งแต่เลือกรถของร้านจนถึงติดตามสถานะการจอง เราจัดขั้นตอนให้เข้าใจง่าย",
        trustDesc:
          `สิ่งที่ลูกค้าอยากรู้ก่อนจองกับ ${shopName} เรารวมไว้ให้ตรวจสอบได้สะดวก`,
        ctaTitle: `พร้อมจองรถกับ ${shopName}?`,
        ctaDesc:
          "ไปที่หน้า “รถทั้งหมด” เพื่อเลือกรถของร้านนี้ แล้วดำเนินการจองต่อได้ทันที",
      };
    }

    return {
      title: "ทำไมต้อง RentFlow",
      subtitle:
        "แพลตฟอร์มเช่ารถที่เน้นความชัดเจน โปร่งใส และประสบการณ์ใช้งานที่ลื่นไหล",
      featuresTitle: "จุดเด่นของระบบ",
      featuresDesc: "ออกแบบให้ผู้ใช้เข้าใจง่าย เห็นข้อมูลสำคัญก่อนตัดสินใจ",
      stepsDesc:
        "ตั้งแต่ค้นหารถจนถึงชำระเงิน — เราทำให้ทุกขั้นตอนชัดเจนและง่ายดาย",
      trustDesc: "สิ่งที่ผู้ใช้มักอยากรู้ก่อนจอง — เราใส่ไว้ให้ครบ",
      ctaTitle: "พร้อมเริ่มจอง?",
      ctaDesc: "ไปที่หน้า “รถทั้งหมด” เพื่อเลือกคันที่ใช่ แล้วกด “จองเลย”",
    };
  }, [isStorefront, shopName]);

  if (!ready || !siteReady) {
    return <FeaturesPageSkeleton />;
  }

  return (
    <Box className="apple-page">
    <Container maxWidth="lg" className="apple-section">
      <Box className="apple-section-intro max-w-3xl">
        <Box className="flex flex-col gap-3">
          <Typography
            className="apple-heading apple-page-title"
          >
            {pageCopy.title}
          </Typography>
          <Typography className="apple-subtitle text-lg">
            {pageCopy.subtitle}
          </Typography>
        </Box>
      </Box>

      <Box className="mt-8 flex flex-wrap justify-center gap-2">
        {HERO_BADGES.map((b) => (
          <Chip
            key={b}
            label={b}
            className="apple-pill text-[var(--rf-apple-muted)]!"
            variant="outlined"
          />
        ))}
      </Box>

      <Box className="mt-8">
        <Box className="flex items-end justify-between gap-3">
          <Box>
            <Typography className="apple-card-title-lg font-black tracking-[-0.05em] text-[var(--rf-apple-ink)]">
              {pageCopy.featuresTitle}
            </Typography>
            <Typography className="mt-1 text-sm text-[var(--rf-apple-muted)]">
              {pageCopy.featuresDesc}
            </Typography>
          </Box>
        </Box>

        <Box className="apple-shelf apple-shelf-wide mt-4 md:grid md:grid-cols-2">
          {FEATURES.map((f) => (
            <Box
              key={f.title}
              className="apple-card p-5"
            >
              <Box className="min-w-0">
                <Typography className="text-base font-bold text-[var(--rf-apple-ink)]">
                  {f.title}
                </Typography>
                <Typography className="mt-1 text-sm leading-relaxed text-[var(--rf-apple-muted)]">
                  {f.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box className="mt-10">
        <Typography className="apple-card-title-lg font-black tracking-[-0.05em] text-[var(--rf-apple-ink)]">
          ขั้นตอนการจอง
        </Typography>
        <Typography className="mt-1 text-sm text-[var(--rf-apple-muted)]">
          {pageCopy.stepsDesc}
        </Typography>

        <Box className="apple-shelf apple-shelf-wide mt-4 md:grid md:grid-cols-2">
          {HOW_IT_WORKS.map((s) => (
            <Box
              key={s.step}
              className="apple-card p-5"
            >
              <Box className="flex items-start gap-3">
                <Box className="grid h-9 w-9 place-items-center rounded-full bg-[var(--rf-apple-ink)] text-white">
                  <Typography className="text-sm font-bold">{s.step}</Typography>
                </Box>
                <Box>
                  <Typography className="text-sm font-semibold text-[var(--rf-apple-ink)]">
                    {s.title}
                  </Typography>
                  <Typography className="mt-1 text-sm text-[var(--rf-apple-muted)]">
                    {s.desc}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box className="mt-10">
        <Typography className="apple-card-title-lg font-black tracking-[-0.05em] text-[var(--rf-apple-ink)]">
          ความน่าเชื่อถือ & ความปลอดภัย
        </Typography>
        <Typography className="mt-1 text-sm text-[var(--rf-apple-muted)]">
          {pageCopy.trustDesc}
        </Typography>

        <Box className="apple-shelf apple-shelf-wide mt-4 md:grid md:grid-cols-2">
          {TRUST_POINTS.map((t) => (
            <Box
              key={t.title}
              className="apple-card p-5"
            >
              <Typography className="text-base font-bold text-[var(--rf-apple-ink)]">
                {t.title}
              </Typography>
              <Typography className="mt-1 text-sm text-[var(--rf-apple-muted)]">
                {t.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box className="apple-card mt-10 p-5">
        <Typography className="text-base font-bold text-[var(--rf-apple-ink)]">
          {pageCopy.ctaTitle}
        </Typography>
        <Typography className="mt-1 text-sm text-[var(--rf-apple-muted)]">
          {pageCopy.ctaDesc}
        </Typography>

        <Box className="mt-4 flex flex-wrap gap-2">
          <Button
            component={Link}
            href="/cars"
            variant="contained"
            className="rounded-full! font-semibold!"
          >
            เลือกรถตอนนี้
          </Button>
          <Button
            component={Link}
            href="/contact"
            variant="outlined"
            className="rounded-full!"
          >
            ติดต่อทีมงาน
          </Button>
        </Box>
      </Box>
    </Container>
    </Box>
  );
}

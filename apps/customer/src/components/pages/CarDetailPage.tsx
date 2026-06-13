"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Box, Container, Typography, Button } from "@mui/material";
import CarDetailHero from "@/src/components/car-detail/CarDetailHero";
import CarDetailSummaryCard from "@/src/components/car-detail/CarDetailSummaryCard";
import CarDetailOverview from "@/src/components/car-detail/CarDetailOverview";
import CarDetailIncludedSection from "@/src/components/car-detail/CarDetailIncludedSection";
import CarDetailTermsSection from "@/src/components/car-detail/CarDetailTermsSection";
import CarDetailSpecsCard from "@/src/components/car-detail/CarDetailSpecsCard";
import CarDetailPageSkeleton from "@/src/components/car-detail/CarDetailPageSkeleton";
import useCarDetail from "@/src/hooks/car-detail/useCarDetail";

export default function CarDetailPage({ carId }: { carId: string }) {
  const router = useRouter();
  const { ready, id, detail } = useCarDetail(carId);

  if (!ready) {
    return <CarDetailPageSkeleton />;
  }

  if (!detail) {
    return (
      <Box className="apple-page">
        <Container maxWidth="lg" className="apple-section">
          <Button
            onClick={() => router.push("/cars")}
            variant="outlined"
            className="mb-4! rounded-full! border-slate-300! text-slate-900!"
            sx={{ textTransform: "none" }}
          >
            กลับหน้าแรก
          </Button>

          <Box className="apple-card apple-card-no-hover p-10 text-center">
            <Typography className="text-lg font-bold text-slate-900">
              ไม่พบรถที่คุณเลือก
            </Typography>
            <Typography className="mt-1 text-sm text-slate-600">
              รหัส:{" "}
              <span className="font-semibold text-slate-900">{id || "-"}</span>
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <Box className="apple-section-intro max-w-3xl">
          <Typography className="apple-heading apple-page-title">
            รายละเอียดรถ
          </Typography>
          <Typography className="apple-subtitle text-lg">
            ตรวจสอบรูปจริงของรถ สเปก ราคา และเงื่อนไขก่อนจอง
          </Typography>
        </Box>

        <Box className="mt-8 grid gap-5 lg:grid-cols-12 lg:gap-6">
          <CarDetailHero
            image={detail.images?.[0] || detail.imageUrl || detail.image}
            name={detail.name}
            isAvailable={detail.isAvailable}
            status={detail.status}
          />
          <CarDetailSummaryCard detail={detail} />
        </Box>

        <Box className="mt-8 grid gap-6 lg:grid-cols-12">
          <Box className="lg:col-span-8 space-y-6">
            <CarDetailOverview detail={detail} />
            <CarDetailIncludedSection />
            <CarDetailTermsSection />
          </Box>

          <Box className="lg:col-span-4 space-y-6">
            <CarDetailSpecsCard detail={detail} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

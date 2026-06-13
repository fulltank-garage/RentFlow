"use client";

import {
  Alert,
  Box,
  Container,
  Typography,
} from "@mui/material";
import ClassPageSkeleton from "@/src/components/classes/ClassPageSkeleton";
import CarCard from "@/src/components/cars/CarCard";
import { useCatalogDirectory } from "@/src/hooks/catalog/useCatalogDirectory";
import { getCarClassBySlug } from "@/src/lib/rentflow-catalog";

export default function ClassPage({ slug }: { slug: string }) {
  const { cars: allCars, loading, error } = useCatalogDirectory();
  const { meta, cars } = getCarClassBySlug(allCars, slug);

  if (loading) {
    return <ClassPageSkeleton />;
  }

  if (!meta) {
    return (
      <Box className="apple-page flex items-center justify-center">
        <Typography>ไม่พบประเภทรถนี้</Typography>
      </Box>
    );
  }

  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <Box className="mx-auto max-w-3xl text-center">
          <Box className="flex flex-col gap-3">
            <Typography
              className="apple-heading apple-page-title"
            >
              รถ{meta.title}
            </Typography>
            <Typography className="apple-subtitle text-lg">
              มีรถประเภทนี้ {cars.length} คัน
            </Typography>
          </Box>
        </Box>

        {error ? (
          <Alert severity="warning" className="mt-6 rounded-2xl!">
            {error}
          </Alert>
        ) : null}

        <Box className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cars.length ? (
            cars.map((car) => <CarCard key={car.id} car={car} />)
          ) : (
            <Box className="rounded-[30px] border border-dashed border-black/10 bg-white p-12 text-center text-sm font-semibold text-[var(--rf-apple-muted)] md:col-span-2 lg:col-span-3">
              ยังไม่มีรถประเภทนี้
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

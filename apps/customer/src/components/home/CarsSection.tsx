"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Skeleton,
} from "@mui/material";

import type { Car } from "@/src/services/cars/cars.types";
import { getCarTypeLabel } from "@/src/lib/rentflow-catalog";
import DataLoadErrorCard from "@/src/components/common/DataLoadErrorCard";
import MobileScrollHintShelf from "@/src/components/common/MobileScrollHintShelf";

type Props = {
  cars: Car[];
  formatTHB: (n: number) => string;
  loading?: boolean;
  error?: string | null;
};

function CarRecommendationSkeletonCard() {
  return (
    <Card
      elevation={0}
      sx={{ boxShadow: "none" }}
      className="apple-card apple-card-no-hover"
    >
      <Box className="relative h-52 w-full overflow-hidden bg-(--rf-apple-surface-soft) sm:h-56">
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ width: "100%", height: "100%", borderRadius: 0 }}
        />
      </Box>

      <CardContent className="p-5 sm:p-6">
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "68%",
            height: 28,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            mt: 0.5,
            width: "88%",
            height: 22,
            borderRadius: "8px",
            transform: "none",
          }}
        />

        <Box className="mt-5 rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
          <Box className="flex items-end gap-2">
            <Skeleton
              variant="text"
              animation="wave"
              sx={{ width: 74, height: 20, borderRadius: "8px", transform: "none" }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{ width: 104, height: 32, borderRadius: "8px", transform: "none" }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{ width: 28, height: 20, borderRadius: "8px", transform: "none" }}
            />
          </Box>
        </Box>
      </CardContent>

      <CardActions
        sx={{
          p: { xs: "0px 20px 20px", sm: "0px 16px 16px" },
          "& .MuiSkeleton-root": {
            flex: "1 1 0",
            minWidth: 0,
          },
        }}
        className="flex-row gap-2"
      >
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ height: 40, borderRadius: "999px" }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ height: 40, borderRadius: "999px" }}
        />
      </CardActions>
    </Card>
  );
}

export default function CarsSection({
  cars,
  formatTHB,
  loading = false,
  error,
}: Props) {
  const shelfItemCount = error ? 0 : loading && !cars.length ? 6 : cars.length;

  return (
    <Container maxWidth="lg" className="apple-section">
      <Box className="apple-section-intro">
        <Box>
          <Typography
            className="apple-heading apple-section-title"
          >
            รถแนะนำ
          </Typography>
          <Typography className="apple-subtitle mt-2 text-lg">
            เลือกคันที่ใช่ แล้วกดจองได้เลย
          </Typography>
        </Box>

        <Chip
          label={`${cars.length} คัน`}
          className="apple-pill w-min! text-(--rf-apple-muted)!"
        />
      </Box>

      <MobileScrollHintShelf
        itemCount={shelfItemCount}
        className="apple-shelf apple-shelf-wide mt-10 md:grid md:grid-cols-2 lg:grid-cols-3"
      >
        {error ? (
          <DataLoadErrorCard
            title="โหลดรายการรถแนะนำไม่ได้"
            message={error}
            className="md:col-span-2 lg:col-span-3"
          />
        ) : loading && !cars.length ? (
          Array.from({ length: 6 }).map((_, index) => (
            <CarRecommendationSkeletonCard key={`home-car-skeleton-${index}`} />
          ))
        ) : cars.length ? (
          cars.map((c) => (
            <Card
              key={c.id}
              elevation={0}
              sx={{ boxShadow: "none" }}
              className="apple-card group"
            >
              <Box className="relative h-52 w-full overflow-hidden bg-(--rf-apple-surface-soft) sm:h-56">
                <Box
                  component="img"
                  src={c.imageUrl || c.image || "/RentFlowCar.png"}
                  alt={c.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.18,0.9,0.22,1)] group-hover:scale-[1.012]"
                />
              </Box>

              <CardContent className="p-5 sm:p-6">
                <Box className="flex items-start justify-between gap-3">
                  <Box>
                    <Typography className="apple-card-title font-bold tracking-[-0.03em] text-(--rf-apple-ink)">
                      {c.name}
                    </Typography>
                    <Typography className="mt-1 text-sm text-(--rf-apple-muted)">
                      {getCarTypeLabel(c.type)} • {c.seats} ที่นั่ง • {c.transmission} • {c.fuel}
                    </Typography>
                  </Box>
                </Box>

                <Box className="mt-5 rounded-[22px] bg-(--rf-apple-surface-soft) p-4">
                  <Box className="flex items-end gap-2">
                    <Typography className="text-sm text-(--rf-apple-muted)">
                      ราคาเริ่มต้น
                    </Typography>

                    <Typography className="apple-price-text font-extrabold tracking-[-0.04em] text-(--rf-apple-ink)">
                      {formatTHB(c.pricePerDay)}
                    </Typography>

                    <Typography className="text-sm text-(--rf-apple-muted)">
                      /วัน
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions
                sx={{
                  p: { xs: "0px 20px 20px", sm: "0px 16px 16px" },
                  "& .MuiButton-root": {
                    flex: "1 1 0",
                    minWidth: 0,
                    px: { xs: 1, sm: 2 },
                    whiteSpace: "nowrap",
                  },
                }}
                className="flex-row gap-2"
              >
                <Button
                  component={Link}
                  href={`/cars/${c.id}`}
                  variant="outlined"
                  fullWidth
                  className="rounded-full!"
                >
                  ดูรายละเอียด
                </Button>

                <Button
                  component={Link}
                  href={`/booking?carId=${c.id}&bookingMode=${
                    c.bookingMode === "payment" ? "payment" : "chat"
                  }`}
                  variant="contained"
                  fullWidth
                  className="rounded-full! font-semibold!"
                >
                  จองเลย
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Box className="flex min-h-48 items-center justify-center rounded-[30px] border border-black/10 bg-white px-8 py-12 text-center md:col-span-2 md:px-12 lg:col-span-3">
            <Typography className="text-base font-semibold text-(--rf-apple-muted) md:text-lg">
              ยังไม่มีรถแนะนำในตอนนี้
            </Typography>
          </Box>
        )}
      </MobileScrollHintShelf>
      <Divider className="mt-14! border-black/10!" />
    </Container>
  );
}

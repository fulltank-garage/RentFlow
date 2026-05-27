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
} from "@mui/material";

import type { Car } from "@/src/services/cars/cars.types";
import { getCarTypeLabel } from "@/src/lib/rentflow-catalog";

type Props = {
  cars: Car[];
  formatTHB: (n: number) => string;
};

export default function CarsSection({ cars, formatTHB }: Props) {
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
          className="apple-pill w-min! text-[var(--rf-apple-muted)]!"
        />
      </Box>

      <Box className="apple-shelf apple-shelf-wide mt-10 md:grid md:grid-cols-2 lg:grid-cols-3">
        {cars.length ? (
          cars.map((c) => (
            <Card
              key={c.id}
              elevation={0}
              sx={{ boxShadow: "none" }}
              className="apple-card group"
            >
              <Box className="relative h-52 w-full overflow-hidden bg-[var(--rf-apple-surface-soft)] sm:h-56">
                <Box
                  component="img"
                  src={c.imageUrl || c.image || "/RentFlow.png"}
                  alt={c.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.18,0.9,0.22,1)] group-hover:scale-[1.012]"
                />
              </Box>

              <CardContent className="p-5 sm:p-6">
                <Box className="flex items-start justify-between gap-3">
                  <Box>
                    <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
                      {c.name}
                    </Typography>
                    <Typography className="mt-1 text-sm text-[var(--rf-apple-muted)]">
                      {getCarTypeLabel(c.type)} • {c.seats} ที่นั่ง • {c.transmission} • {c.fuel}
                    </Typography>
                  </Box>
                </Box>

                <Box className="mt-5 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
                  <Box className="flex items-end gap-2">
                    <Typography className="text-sm text-[var(--rf-apple-muted)]">
                      ราคาเริ่มต้น
                    </Typography>

                    <Typography className="apple-price-text font-extrabold tracking-[-0.04em] text-[var(--rf-apple-ink)]">
                      {formatTHB(c.pricePerDay)}
                    </Typography>

                    <Typography className="text-sm text-[var(--rf-apple-muted)]">
                      /วัน
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions
                sx={{ p: { xs: "0px 20px 20px", sm: "0px 16px 16px" } }}
                className="flex-col gap-2 sm:flex-row"
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
          <Box className="flex min-h-48 items-center justify-center rounded-[30px] border border-dashed border-black/10 bg-white px-8 py-12 text-center md:col-span-2 md:px-12 lg:col-span-3">
            <Typography className="text-base font-semibold text-[var(--rf-apple-muted)] md:text-lg">
              ยังไม่มีรถแนะนำในตอนนี้
            </Typography>
          </Box>
        )}
      </Box>
      <Divider className="mt-14! border-black/10!" />
    </Container>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Skeleton,
} from "@mui/material";

import {
  getCarTypeImage,
  type CatalogCarClass,
} from "@/src/lib/rentflow-catalog";

export default function CarClassSection({
  classes,
  loading = false,
}: {
  classes: CatalogCarClass[];
  loading?: boolean;
}) {
  return (
    <Box>
      <Container maxWidth="lg" className="apple-section pt-0!">
        <Box className="apple-section-intro max-w-3xl">
          <Box>
            <Typography
              className="apple-heading apple-section-title"
            >
              เลือกตามประเภทรถ
            </Typography>
            <Typography className="apple-subtitle mt-2 text-lg">
              กดการ์ดเพื่อดูรถตามประเภทที่ต้องการ
            </Typography>
          </Box>
        </Box>

        <Box className="apple-card mt-10 p-4 sm:p-5 md:p-7">
          <Box className="apple-shelf apple-shelf-compact sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {loading && !classes.length ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Box
                key={`class-skeleton-${index}`}
                className="overflow-hidden rounded-[var(--rf-apple-card-radius-sm)]! bg-[var(--rf-apple-surface-soft)]!"
              >
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{ width: "100%", height: 144, borderRadius: 0 }}
                />

                <Box className="p-5">
                  <Box className="flex items-start justify-between gap-2">
                    <Box className="min-w-0 flex-1">
                      <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                          width: "68%",
                          height: 24,
                          borderRadius: "8px",
                          transform: "none",
                        }}
                      />
                      <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                          mt: 0.5,
                          width: "54%",
                          height: 16,
                          borderRadius: "8px",
                          transform: "none",
                        }}
                      />
                    </Box>

                    <Skeleton
                      variant="rounded"
                      animation="wave"
                      sx={{ width: 64, height: 24, borderRadius: "999px" }}
                    />
                  </Box>

                  <Box className="mt-2 grid gap-1.5">
                    <Skeleton
                      variant="text"
                      animation="wave"
                      sx={{
                        width: "100%",
                        height: 16,
                        borderRadius: "8px",
                        transform: "none",
                      }}
                    />
                    <Skeleton
                      variant="text"
                      animation="wave"
                      sx={{
                        width: "78%",
                        height: 16,
                        borderRadius: "8px",
                        transform: "none",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))
          ) : classes.length ? (
            classes.map((x) => {
              const classImage = getCarTypeImage(x.type);

              return (
                <Card
                  key={x.slug}
                  component={Link}
                  href={`/classes/${x.slug}`}
                  elevation={0}
                  sx={{ boxShadow: "none" }}
                  className="group cursor-pointer overflow-hidden rounded-[var(--rf-apple-card-radius-sm)]! border-0! bg-[var(--rf-apple-surface-soft)]! transition-transform duration-1000 ease-[cubic-bezier(0.18,0.9,0.22,1)] hover:scale-[1.006]"
                >
                  <Box className="relative h-44 w-full overflow-hidden bg-white sm:h-48">
                    <Box
                      component="img"
                      src={classImage}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-contain transition-transform duration-1000 ease-[cubic-bezier(0.18,0.9,0.22,1)] group-hover:scale-[1.012]"
                    />
                    <Box className="absolute left-5 top-5">
                      <Typography className="apple-card-title font-black tracking-[-0.04em] text-[var(--rf-apple-ink)]">
                        {x.title}
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent className="p-5">
                    <Typography className="text-xs text-[var(--rf-apple-muted)]">
                      รถประเภทนี้ {x.count} คัน
                    </Typography>

                    <Typography className="mt-2 text-xs leading-5 text-[var(--rf-apple-muted)]">
                      {x.desc}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Box className="flex min-h-40 items-center justify-center rounded-[26px] border border-dashed border-black/10 bg-[var(--rf-apple-surface-soft)] px-8 py-12 text-center sm:col-span-2 md:min-h-48 md:px-12 lg:col-span-4">
              <Typography className="text-base font-semibold text-[var(--rf-apple-muted)] md:text-lg">
                ยังไม่มีการจัดกลุ่มประเภทรถในตอนนี้
              </Typography>
            </Box>
          )}
          </Box>
        </Box>
        <Divider className="mt-14! border-black/10!" />
      </Container>
    </Box>
  );
}

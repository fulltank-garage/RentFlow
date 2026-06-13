"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Rating,
  Skeleton,
  Typography,
} from "@mui/material";
import AppSnackbar, {
  type AppSnackbarSeverity,
} from "@/src/components/common/AppSnackbar";
import { useRentFlowRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowRealtimeRefresh";
import { getErrorMessage } from "@/src/lib/api-error";
import { getRentFlowStorefrontHref } from "@/src/lib/tenant";
import { reviewsApi } from "@/src/services/reviews/reviews.service";
import type { Review } from "@/src/services/reviews/reviews.types";

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ReviewsPageSkeleton() {
  return (
    <Box className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <Card
          key={`review-skeleton-${index}`}
          elevation={0}
          className="apple-card apple-card-no-hover flex h-full flex-col"
        >
          <CardContent className="flex h-full min-h-[230px] flex-col p-4!">
            <Box className="flex items-start justify-between gap-4">
              <Box className="min-w-0 flex-1">
                <Skeleton variant="text" height={26} width="68%" sx={{ transform: "none", borderRadius: 2 }} />
                <Skeleton variant="text" height={20} width="52%" sx={{ mt: 1, transform: "none", borderRadius: 2 }} />
              </Box>
              <Skeleton variant="rounded" height={22} width={86} sx={{ borderRadius: 999 }} />
            </Box>
            <Skeleton variant="text" height={22} width="96%" sx={{ mt: 3, transform: "none", borderRadius: 2 }} />
            <Skeleton variant="text" height={22} width="78%" sx={{ mt: 1, transform: "none", borderRadius: 2 }} />
            <Box className="mt-auto flex justify-end pt-6">
              <Skeleton variant="rounded" height={38} width={116} sx={{ borderRadius: 999 }} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [reloadTick, setReloadTick] = React.useState(0);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AppSnackbarSeverity;
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const refreshReviews = React.useCallback(() => {
    setReloadTick((current) => current + 1);
  }, []);

  useRentFlowRealtimeRefresh({
    events: ["review.created", "tenant.updated"],
    onRefresh: refreshReviews,
    marketplace: true,
  });

  React.useEffect(() => {
    let cancelled = false;

    reviewsApi
      .getReviews({ marketplace: true })
      .then((res) => {
        if (!cancelled) setReviews(res.data.items);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSnackbar({
            open: true,
            message: getErrorMessage(error, "ไม่สามารถโหลดรีวิวได้"),
            severity: "error",
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadTick]);

  return (
    <Box className="apple-page">
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={(_, reason) => {
          if (reason !== "clickaway") {
            setSnackbar((prev) => ({ ...prev, open: false }));
          }
        }}
      />

      <Container maxWidth="lg" className="apple-section">
        <Box className="apple-section-intro max-w-3xl">
          <Typography className="apple-heading apple-page-title">
            รีวิวจากผู้ใช้งาน
          </Typography>
          <Typography className="apple-subtitle text-lg">
            เสียงจากลูกค้าที่ใช้บริการกับร้านต่าง ๆ
          </Typography>
        </Box>

        {loading ? (
          <ReviewsPageSkeleton />
        ) : reviews.length ? (
          <Box className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => {
              const shopHref = review.domainSlug
                ? getRentFlowStorefrontHref(review.domainSlug)
                : "";

              return (
                <Card key={review.id} elevation={0} className="apple-card flex h-full flex-col">
                  <CardContent className="flex h-full min-h-[230px] flex-col p-4!">
                    <Box className="flex flex-wrap items-start justify-between gap-4">
                      <Box className="min-w-0">
                        <Typography className="apple-card-title font-bold text-[var(--rf-apple-ink)]">
                          {review.firstName} {review.lastName}
                        </Typography>
                        <Typography
                          component="div"
                          className="apple-body-sm mt-1 text-[var(--rf-apple-muted)]"
                        >
                          {shopHref ? (
                            <Box
                              component={Link}
                              href={shopHref}
                              className="font-semibold text-[var(--rf-apple-blue)] no-underline hover:underline"
                            >
                              {review.shopName}
                            </Box>
                          ) : (
                            review.shopName || "RentFlow"
                          )}
                          {review.createdAt ? ` • ${formatReviewDate(review.createdAt)}` : ""}
                        </Typography>
                      </Box>

                      <Rating value={review.rating} readOnly />
                    </Box>

                    <Typography
                      className="apple-body mt-4 leading-7 text-[var(--rf-apple-muted)]"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {review.comment || "ให้คะแนนการใช้งาน"}
                    </Typography>

                    {shopHref ? (
                      <Box className="mt-auto flex justify-end pt-6">
                        <Button
                          component={Link}
                          href={shopHref}
                          variant="outlined"
                          className="rounded-full! font-semibold!"
                        >
                          ดูร้านนี้
                        </Button>
                      </Box>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        ) : (
          <Box className="apple-card apple-card-no-hover mt-10 flex min-h-80 items-center justify-center p-8 text-center">
            <Typography className="apple-body-sm text-[var(--rf-apple-muted)]">
              ยังไม่มีรีวิวในตอนนี้
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

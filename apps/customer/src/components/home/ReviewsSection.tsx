"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import AppSnackbar, {
  type AppSnackbarSeverity,
} from "@/src/components/common/AppSnackbar";
import { useRentFlowRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowRealtimeRefresh";
import { useRentFlowSiteMode } from "@/src/hooks/useRentFlowSiteMode";
import { getErrorMessage } from "@/src/lib/api-error";
import { getRentFlowStorefrontHref } from "@/src/lib/tenant";
import { reviewsApi } from "@/src/services/reviews/reviews.service";
import type { Review } from "@/src/services/reviews/reviews.types";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: AppSnackbarSeverity;
};

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ReviewsSection() {
  const siteMode = useRentFlowSiteMode();
  const isMarketplace = siteMode === "marketplace";
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [rating, setRating] = React.useState<number | null>(5);
  const [loadingReviews, setLoadingReviews] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [reloadTick, setReloadTick] = React.useState(0);
  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = React.useCallback(
    (message: string, severity: AppSnackbarSeverity = "info") => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  React.useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        const res = await reviewsApi.getReviews({
          marketplace: isMarketplace,
        });
        if (!cancelled) {
          setReviews(res.data.items);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          showSnackbar(getErrorMessage(err, "ไม่สามารถโหลดรีวิวได้"), "error");
        }
      } finally {
        if (!cancelled) {
          setLoadingReviews(false);
        }
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [isMarketplace, reloadTick, showSnackbar]);

  useRentFlowRealtimeRefresh({
    events: ["review.created", "tenant.updated"],
    onRefresh: React.useCallback(() => {
      setReloadTick((current) => current + 1);
    }, []),
    marketplace: isMarketplace,
  });

  const canSubmit =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    (rating ?? 0) > 0 &&
    !submitting;

  const closeSnackbar = React.useCallback(
    (_?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") return;
      setSnackbar((prev) => ({ ...prev, open: false }));
    },
    []
  );

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSubmit) return;

      setSubmitting(true);

      try {
        const res = await reviewsApi.createReview({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          rating: rating ?? 5,
          comment: comment.trim() || undefined,
        });

        setReviews((prev) => [res.data, ...prev]);
        setFirstName("");
        setLastName("");
        setComment("");
        setRating(5);
        showSnackbar("ขอบคุณสำหรับรีวิวของคุณ", "success");
      } catch (err: unknown) {
        showSnackbar(getErrorMessage(err, "ไม่สามารถส่งรีวิวได้"), "error");
      } finally {
        setSubmitting(false);
      }
    },
    [canSubmit, comment, firstName, lastName, rating, showSnackbar]
  );

  const marqueeReviews = React.useMemo(() => {
    const items = reviews.length ? reviews : [];
    return [...items, ...items];
  }, [reviews]);

  const firstReviewRow = React.useMemo(() => {
    return marqueeReviews.filter((_, index) => index % 3 === 0);
  }, [marqueeReviews]);

  const secondReviewRow = React.useMemo(() => {
    return marqueeReviews.filter((_, index) => index % 3 === 1);
  }, [marqueeReviews]);

  const thirdReviewRow = React.useMemo(() => {
    return marqueeReviews.filter((_, index) => index % 3 === 2);
  }, [marqueeReviews]);

  function renderReviewCard(review: Review, key: string) {
    const shopHref = review.domainSlug
      ? getRentFlowStorefrontHref(review.domainSlug)
      : "";
    const reviewDate = formatReviewDate(review.createdAt);

    return (
      <Card
        key={key}
        elevation={0}
        sx={{ boxShadow: "none" }}
        className="apple-card min-w-[280px] max-w-[280px] rounded-[26px]! border border-black/10 bg-white sm:min-w-[420px] sm:max-w-[420px]"
      >
        <CardContent className="p-4!">
          <Box className="flex flex-wrap items-start justify-between gap-3">
            <Box>
              <Typography className="text-sm font-semibold text-[var(--rf-apple-ink)]">
                {review.firstName} {review.lastName}
              </Typography>
              <Typography className="text-xs text-[var(--rf-apple-muted)]">
                {review.shopName ? (
                  <>
                    {shopHref ? (
                      <Box
                        component="a"
                        href={shopHref}
                        className="font-semibold text-[var(--rf-apple-blue)] transition hover:text-[var(--rf-apple-blue-hover)]"
                      >
                        {review.shopName}
                      </Box>
                    ) : (
                      <Box component="span" className="font-semibold text-[var(--rf-apple-muted)]">
                        {review.shopName}
                      </Box>
                    )}
                    {reviewDate ? ` • ${reviewDate}` : ""}
                  </>
                ) : (
                  reviewDate
                )}
              </Typography>
            </Box>
            <Rating value={review.rating} readOnly size="small" />
          </Box>
          <Typography className="mt-3 text-sm leading-6 text-[var(--rf-apple-muted)]">
            {review.comment || "ให้คะแนนการใช้งาน"}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  function renderReviewSkeletonCard(key: string) {
    return (
      <Card
        key={key}
        elevation={0}
        sx={{ boxShadow: "none" }}
        className="apple-card apple-card-no-hover min-w-[280px] max-w-[280px] rounded-[26px]! border border-black/10 bg-white sm:min-w-[420px] sm:max-w-[420px]"
      >
        <CardContent className="p-4!">
          <Box className="flex flex-wrap items-start justify-between gap-3">
            <Box className="min-w-0 flex-1">
              <Box className="h-[22px] w-32 rounded-lg bg-black/[0.08]" />
              <Box className="mt-2 h-[16px] w-40 rounded-lg bg-black/[0.08]" />
            </Box>
            <Box className="h-[22px] w-24 rounded-full bg-black/[0.08]" />
          </Box>
          <Box className="mt-4 h-[18px] w-full rounded-lg bg-black/[0.08]" />
          <Box className="mt-2 h-[18px] w-3/4 rounded-lg bg-black/[0.08]" />
        </CardContent>
      </Card>
    );
  }

  if (isMarketplace) {
    return (
      <Container maxWidth="lg" className="apple-section pt-0!">
        <AppSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={closeSnackbar}
        />

        <Box className="apple-section-intro max-w-3xl">
          <Box className="flex flex-col gap-4">
            <Typography
              className="apple-heading apple-section-title"
            >
              รีวิวจากผู้ใช้งาน
            </Typography>
            <Typography className="apple-subtitle text-lg">
              เสียงจากลูกค้าที่ใช้บริการกับร้านต่าง ๆ
            </Typography>
            <Box>
              <Button
                component={Link}
                href="/reviews"
                variant="contained"
                className="rounded-full! px-5! font-semibold!"
              >
                ดูรีวิวทั้งหมด
              </Button>
            </Box>
          </Box>
        </Box>

        <Box className="apple-card apple-card-no-hover mt-10 overflow-hidden rounded-[34px] bg-white p-4">
          {loadingReviews ? (
            <Box className="grid min-h-72 gap-3">
              <Box className="flex w-max gap-3">
                {Array.from({ length: 3 }).map((_, index) =>
                  renderReviewSkeletonCard(`market-review-skeleton-a-${index}`)
                )}
              </Box>
              <Box className="flex w-max gap-3 pl-12">
                {Array.from({ length: 3 }).map((_, index) =>
                  renderReviewSkeletonCard(`market-review-skeleton-b-${index}`)
                )}
              </Box>
              <Box className="flex w-max gap-3">
                {Array.from({ length: 3 }).map((_, index) =>
                  renderReviewSkeletonCard(`market-review-skeleton-c-${index}`)
                )}
              </Box>
            </Box>
          ) : reviews.length ? (
            <Box className="grid gap-3">
              <Box className="marquee-left flex w-max gap-3">
                {firstReviewRow.map((review, index) =>
                  renderReviewCard(review, `review-left-${review.id}-${index}`)
                )}
              </Box>
              <Box className="marquee-right flex w-max gap-3">
                {secondReviewRow.map((review, index) =>
                  renderReviewCard(review, `review-right-${review.id}-${index}`)
                )}
              </Box>
              <Box className="marquee-left flex w-max gap-3">
                {thirdReviewRow.map((review, index) =>
                  renderReviewCard(review, `review-bottom-${review.id}-${index}`)
                )}
              </Box>
            </Box>
          ) : (
            <Box className="flex min-h-72 flex-col items-center justify-center rounded-[26px] border border-dashed border-black/10 bg-[var(--rf-apple-surface-soft)] p-8 text-center">
              <Typography className="mt-4 text-sm font-semibold text-[var(--rf-apple-ink)]">
                ยังไม่มีรีวิว
              </Typography>
              <Typography className="mx-auto mt-1 max-w-md text-sm text-[var(--rf-apple-muted)]">
                เมื่อมีรีวิวจากผู้ใช้งาน รายการจะแสดงในส่วนนี้
              </Typography>
            </Box>
          )}
        </Box>

        <Divider className="mt-14! border-black/10!" />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="apple-section pt-0!">
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />

        <Box className="apple-section-intro max-w-3xl">
          <Box className="flex flex-col gap-4">
            <Typography
              className="apple-heading apple-section-title"
          >
            รีวิวจากผู้ใช้งาน
          </Typography>
          <Typography className="apple-subtitle text-lg">
            แบ่งปันประสบการณ์ของคุณได้ทันที
          </Typography>
        </Box>
      </Box>

      <Box className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card
          elevation={0}
          sx={{ boxShadow: "none" }}
          className="apple-card"
        >
          <CardContent className="p-5!">
            <Box>
              <Typography className="text-sm font-semibold text-[var(--rf-apple-ink)]">
                เขียนรีวิว
              </Typography>
              <Typography className="text-xs text-[var(--rf-apple-muted)]">
                ไม่ต้องเข้าสู่ระบบหรือมีรายการจอง
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              className="mt-5 grid gap-4"
            >
              <Box className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id="review-first-name"
                  name="firstName"
                  label="ชื่อจริง"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  fullWidth
                  size="small"
                  autoComplete="given-name"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "18px" } }}
                />
                <TextField
                  id="review-last-name"
                  name="lastName"
                  label="นามสกุล"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  fullWidth
                  size="small"
                  autoComplete="family-name"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "18px" } }}
                />
              </Box>

              <Box className="rounded-[22px] bg-[var(--rf-apple-surface-soft)] px-4 py-3">
                <Box className="flex flex-wrap items-center gap-3">
                  <Typography className="text-xs text-[var(--rf-apple-muted)]">
                    คะแนน
                  </Typography>
                  <Rating
                    value={rating}
                    precision={1}
                    onChange={(_, value) => setRating(value)}
                    size="small"
                  />
                </Box>
              </Box>

              <Box
                component="textarea"
                id="review-comment"
                name="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                aria-label="รีวิวของคุณ"
                placeholder="เล่าประสบการณ์ที่อยากแบ่งปัน"
                rows={4}
                className="min-h-32 w-full resize-y rounded-[18px] border border-black/15 bg-white px-4 py-3 text-sm leading-6 text-[var(--rf-apple-ink)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[var(--rf-apple-muted)] focus:border-[var(--rf-apple-blue)] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.12)]"
                sx={{
                  font: "inherit",
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit}
                className="rounded-full! font-semibold!"
                sx={{
                  minHeight: 44,
                }}
              >
                {submitting ? (
                  <Box className="flex items-center gap-2">
                    <CircularProgress size={16} color="inherit" />
                    <span>กำลังส่งรีวิว...</span>
                  </Box>
                ) : (
                  "ส่งรีวิว"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box className="apple-card apple-card-no-hover rounded-[30px] bg-white p-4">
          {loadingReviews ? (
            <Box className="grid min-h-72 gap-3">
              {Array.from({ length: 3 }).map((_, index) =>
                renderReviewSkeletonCard(`store-review-skeleton-${index}`)
              )}
            </Box>
          ) : reviews.length ? (
            <Box className="grid gap-3">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  elevation={0}
                  sx={{ boxShadow: "none" }}
                  className="apple-card rounded-[24px]! border border-black/10 bg-white"
                >
                  <CardContent className="p-4!">
                    <Box className="flex flex-wrap items-start justify-between gap-3">
                      <Box>
                        <Typography className="text-sm font-semibold text-[var(--rf-apple-ink)]">
                          {review.firstName} {review.lastName}
                        </Typography>
                        <Typography className="text-xs text-[var(--rf-apple-muted)]">
                          {formatReviewDate(review.createdAt)}
                        </Typography>
                      </Box>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography className="mt-3 text-sm leading-6 text-[var(--rf-apple-muted)]">
                      {review.comment || "ให้คะแนนการใช้งาน"}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box className="flex min-h-72 flex-col items-center justify-center rounded-[26px] border border-dashed border-black/10 bg-[var(--rf-apple-surface-soft)] p-8 text-center">
              <Typography className="mt-4 text-sm font-semibold text-[var(--rf-apple-ink)]">
                ยังไม่มีรีวิว
              </Typography>
              <Typography className="mx-auto mt-1 max-w-md text-sm text-[var(--rf-apple-muted)]">
                เมื่อมีรีวิวจากผู้ใช้งาน รายการจะแสดงในส่วนนี้
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Divider className="mt-14! border-black/10!" />
    </Container>
  );
}

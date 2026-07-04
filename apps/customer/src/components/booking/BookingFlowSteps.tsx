"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";

export type BookingFlowStepKey =
  | "car"
  | "booking"
  | "payment"
  | "success";

type BookingFlowMode = "payment" | "chat";

const PAYMENT_FLOW_STEPS: Array<{ key: BookingFlowStepKey; label: string }> = [
  { key: "car", label: "เลือกรถ" },
  { key: "booking", label: "กรอกรายละเอียด" },
  { key: "payment", label: "ชำระเงิน" },
  { key: "success", label: "จองสำเร็จ" },
];

const CHAT_FLOW_STEPS: Array<{ key: BookingFlowStepKey; label: string }> = [
  { key: "car", label: "เลือกรถ" },
  { key: "booking", label: "กรอกรายละเอียด" },
];

const CURRENT_COLOR = "var(--rf-booking-step-current)";
const COMPLETE_COLOR = "var(--rf-booking-step-complete)";
const PENDING_BORDER = "#ececec";
const PENDING_TEXT = "var(--rf-ink)";

function buildTrackColumns({
  stepCount,
  circleSize,
  connectorWidth,
}: {
  stepCount: number;
  circleSize: number;
  connectorWidth: number;
}) {
  return Array.from({ length: stepCount }, (_, index) =>
    index === stepCount - 1
      ? `${circleSize}px`
      : `${circleSize}px ${connectorWidth}px`
  ).join(" ");
}

export default function BookingFlowSteps({
  currentStep,
  mode = "payment",
  className = "",
}: {
  currentStep: BookingFlowStepKey;
  mode?: BookingFlowMode;
  className?: string;
}) {
  const steps = mode === "chat" ? CHAT_FLOW_STEPS : PAYMENT_FLOW_STEPS;
  const currentIndex = Math.max(
    0,
    currentStep === "success" && mode === "chat"
      ? steps.length - 1
      : steps.findIndex((step) => step.key === currentStep)
  );
  const mobileCircleSize = 42;
  const desktopCircleSize = 50;
  const mobileConnectorWidth = mode === "chat" ? 110 : 44;
  const desktopConnectorWidth = mode === "chat" ? 220 : 92;
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [activeScrollIndex, setActiveScrollIndex] = React.useState(0);
  const [canScroll, setCanScroll] = React.useState(false);

  const updateScrollHint = React.useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setCanScroll(maxScroll > 2);

    if (maxScroll <= 2) {
      setActiveScrollIndex(0);
      return;
    }

    const nextIndex = Math.round((scroller.scrollLeft / maxScroll) * (steps.length - 1));
    setActiveScrollIndex(Math.min(steps.length - 1, Math.max(0, nextIndex)));
  }, [steps.length]);

  React.useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    scroller.addEventListener("scroll", updateScrollHint, { passive: true });
    window.addEventListener("resize", updateScrollHint);
    updateScrollHint();

    return () => {
      scroller.removeEventListener("scroll", updateScrollHint);
      window.removeEventListener("resize", updateScrollHint);
    };
  }, [updateScrollHint]);

  return (
    <Box
      aria-label="ลำดับขั้นตอนการจอง"
      className={`relative left-1/2 w-screen -translate-x-1/2 ${className}`.trim()}
    >
      <Box
        ref={scrollRef}
        className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={updateScrollHint}
      >
        <Box className="mx-auto w-fit px-4">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: buildTrackColumns({
                  stepCount: steps.length,
                  circleSize: mobileCircleSize,
                  connectorWidth: mobileConnectorWidth,
                }),
                md: buildTrackColumns({
                  stepCount: steps.length,
                  circleSize: desktopCircleSize,
                  connectorWidth: desktopConnectorWidth,
                }),
              },
              gridTemplateRows: {
                xs: `${mobileCircleSize}px auto`,
                md: `${desktopCircleSize}px auto`,
              },
              alignItems: "center",
              justifyItems: "center",
              justifyContent: "center",
              rowGap: { xs: "10px", md: "12px" },
            }}
          >
            {steps.map((step, index) => {
              const stepLabel =
                mode === "chat" &&
                currentStep === "success" &&
                step.key === "booking"
                  ? "ส่งคำขอจองแล้ว"
                  : step.label;
              const isCompleted =
                index < currentIndex ||
                (currentStep === "success" && index === currentIndex);
              const isCurrent = index === currentIndex && !isCompleted;
              const circleColumn = index * 2 + 1;
              const connectorColumn = circleColumn + 1;

              const circleStyle = isCompleted
                ? {
                    backgroundColor: COMPLETE_COLOR,
                    borderColor: COMPLETE_COLOR,
                    color: "#fff",
                    boxShadow:
                      "0 10px 24px color-mix(in srgb, var(--rf-booking-step-complete) 16%, transparent)",
                  }
                : isCurrent
                  ? {
                      backgroundColor: CURRENT_COLOR,
                      borderColor: CURRENT_COLOR,
                      color: "#fff",
                      boxShadow:
                        "0 10px 24px color-mix(in srgb, var(--rf-booking-step-current) 18%, transparent)",
                    }
                  : {
                      backgroundColor: PENDING_BORDER,
                      borderColor: PENDING_BORDER,
                      color: PENDING_TEXT,
                      boxShadow: "none",
                    };

              const connectorStyle =
                index === currentIndex - 1 && currentStep !== "success"
                  ? {
                      background: `linear-gradient(90deg, ${COMPLETE_COLOR} 0%, ${COMPLETE_COLOR} 50%, ${CURRENT_COLOR} 50%, ${CURRENT_COLOR} 100%)`,
                    }
                  : currentIndex > index
                    ? { backgroundColor: COMPLETE_COLOR }
                    : { backgroundColor: PENDING_BORDER };

              return (
                <Box key={step.key} sx={{ display: "contents" }}>
                  <Box
                    className="relative z-1 flex items-center justify-center rounded-full border font-semibold leading-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    sx={{
                      ...circleStyle,
                      width: { xs: mobileCircleSize, md: desktopCircleSize },
                      height: { xs: mobileCircleSize, md: desktopCircleSize },
                      fontSize: { xs: "1.3rem", md: "1.55rem" },
                      gridColumn: circleColumn,
                      gridRow: 1,
                    }}
                  >
                    {index + 1}
                  </Box>

                  {index !== steps.length - 1 ? (
                    <Box
                      className="self-center transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      sx={{
                        gridColumn: connectorColumn,
                        gridRow: 1,
                        justifySelf: "stretch",
                        height: { xs: "8px", md: "10px" },
                        width: "calc(100% + 8px)",
                        ml: "-4px",
                        ...connectorStyle,
                      }}
                    />
                  ) : null}

                  <Typography
                    className="text-center font-semibold tracking-[-0.03em] text-(--rf-apple-ink)"
                    sx={{
                      gridColumn: circleColumn,
                      gridRow: 2,
                      justifySelf: "center",
                      width: {
                        xs: mobileCircleSize + 36,
                        md: "max-content",
                      },
                      maxWidth: { xs: mobileCircleSize + 36, md: 180 },
                      fontSize: { xs: 13, md: 17 },
                      lineHeight: 1.2,
                    }}
                  >
                    {stepLabel}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
      {canScroll ? (
        <Box aria-hidden className="mt-1 flex justify-center gap-1.5 md:hidden">
          {steps.map((step, index) => (
            <Box
              key={`booking-flow-scroll-dot-${step.key}`}
              className="h-1.5 rounded-full transition-all duration-300"
              sx={{
                width: index === activeScrollIndex ? 18 : 6,
                backgroundColor:
                  index === activeScrollIndex
                    ? "var(--secondary-navy)"
                    : "rgba(1,18,44,0.18)",
              }}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

"use client";

import { Box, Skeleton } from "@mui/material";

type BookingFlowStepsSkeletonMode = "payment" | "chat";

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

export default function BookingFlowStepsSkeleton({
  className = "",
  mode = "payment",
}: {
  className?: string;
  mode?: BookingFlowStepsSkeletonMode;
}) {
  const stepCount = mode === "chat" ? 2 : 4;
  const mobileCircleSize = 42;
  const desktopCircleSize = 50;
  const mobileConnectorWidth = mode === "chat" ? 110 : 44;
  const desktopConnectorWidth = mode === "chat" ? 220 : 92;

  return (
    <Box
      className={`relative left-1/2 w-screen -translate-x-1/2 ${className}`.trim()}
    >
      <Box className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Box className="mx-auto w-fit px-4">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: buildTrackColumns({
                  stepCount,
                  circleSize: mobileCircleSize,
                  connectorWidth: mobileConnectorWidth,
                }),
                md: buildTrackColumns({
                  stepCount,
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
          {Array.from({ length: stepCount }).map((_, index) => (
            <Box
              key={`booking-flow-step-skeleton-${index}`}
              sx={{ display: "contents" }}
            >
              <Skeleton
                variant="circular"
                animation="wave"
                sx={{
                  width: { xs: mobileCircleSize, md: desktopCircleSize },
                  height: { xs: mobileCircleSize, md: desktopCircleSize },
                  gridColumn: index * 2 + 1,
                  gridRow: 1,
                }}
              />
              {index !== stepCount - 1 ? (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{
                    gridColumn: index * 2 + 2,
                    gridRow: 1,
                    justifySelf: "stretch",
                    width: "calc(100% + 8px)",
                    ml: "-4px",
                    height: { xs: 8, md: 10 },
                    borderRadius: 0,
                  }}
                />
              ) : null}
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: { xs: mobileCircleSize + 36, md: 120 },
                  height: { xs: 18, md: 20 },
                  borderRadius: "8px",
                  transform: "none",
                  gridColumn: index * 2 + 1,
                  gridRow: 2,
                  justifySelf: "center",
                }}
              />
            </Box>
          ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

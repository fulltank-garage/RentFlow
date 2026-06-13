"use client";

import * as React from "react";
import { Box, Chip, Typography } from "@mui/material";
import StableImage from "@/src/components/common/StableImage";

type Props = {
  image?: string;
  name: string;
  isAvailable?: boolean;
  status?: string;
};

export default function CarDetailHero({ image, name, isAvailable = true, status }: Props) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const unavailableLabel = status === "rented" ? "ถูกเช่าแล้ว" : "ถูกจองแล้ว";

  return (
    <Box className="lg:col-span-7">
      <Box className="apple-card relative overflow-hidden">
        <StableImage
          className="aspect-[16/10] min-h-[260px]"
          src={image || "/RentFlow.png"}
          alt={name}
          priority
          sizes="(min-width: 1200px) 58vw, 100vw"
          imageClassName="object-contain"
          onLoadedChange={setImageLoaded}
        />

        <Box
          className={`pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 to-transparent transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {!isAvailable ? (
          <>
            <Box className="absolute left-5 top-5 z-[1]">
              <Chip
                label={unavailableLabel}
                className="apple-pill bg-white/94! font-bold! text-[var(--rf-apple-ink)]!"
              />
            </Box>
            <Box className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-6 py-5">
              <Typography className="text-base font-semibold text-white">
                รถคันนี้{unavailableLabel} ยังไม่สามารถกดจองได้ในตอนนี้
              </Typography>
            </Box>
          </>
        ) : null}
      </Box>
    </Box>
  );
}

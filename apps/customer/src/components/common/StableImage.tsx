"use client";

import * as React from "react";
import Image from "next/image";
import { Box } from "@mui/material";

type StableImageProps = {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  onLoadedChange?: (loaded: boolean) => void;
};

function isRentFlowCarApiImage(src: string) {
  return (
    /^https?:\/\//i.test(src) ||
    src.startsWith("/api/rentflow-asset/") ||
    src.startsWith("/cars/") ||
    src.startsWith("/tenants/")
  );
}

export default function StableImage({
  src,
  alt,
  fallbackSrc = "/RentFlowCar.png",
  priority = false,
  sizes = "100vw",
  className = "",
  imageClassName = "",
  onLoadedChange,
}: StableImageProps) {
  const [loaded, setLoaded] = React.useState(false);
  const [currentSrc, setCurrentSrc] = React.useState(src || fallbackSrc);

  React.useEffect(() => {
    setLoaded(false);
    setCurrentSrc(src || fallbackSrc);
  }, [fallbackSrc, src]);

  React.useEffect(() => {
    onLoadedChange?.(loaded);
  }, [loaded, onLoadedChange]);

  return (
    <Box className={`relative overflow-hidden ${className}`}>
      <Box className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,1),rgba(248,249,251,0.98)_48%,rgba(237,240,245,0.94))]" />
      <Box
        className={`absolute inset-0 bg-linear-to-b from-white/40 via-white/18 to-slate-100/22 transition-opacity duration-300 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />

      <Image
        src={currentSrc}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        unoptimized={isRentFlowCarApiImage(currentSrc)}
        sizes={sizes}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${imageClassName}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (currentSrc !== fallbackSrc) {
            setLoaded(false);
            setCurrentSrc(fallbackSrc);
            return;
          }
          setLoaded(true);
        }}
      />
    </Box>
  );
}

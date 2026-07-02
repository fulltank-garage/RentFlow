"use client";

import * as React from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type Props = {
  children: React.ReactNode;
  itemCount: number;
  className: string;
  sx?: SxProps<Theme>;
  dotClassName?: string;
};

export default function MobileScrollHintShelf({
  children,
  itemCount,
  className,
  sx,
  dotClassName = "mt-3",
}: Props) {
  const shelfRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [canScroll, setCanScroll] = React.useState(false);

  const updateActiveIndex = React.useCallback(() => {
    const shelf = shelfRef.current;
    if (!shelf || itemCount <= 1) return;

    const maxScroll = shelf.scrollWidth - shelf.clientWidth;
    setCanScroll(maxScroll > 2);

    if (maxScroll <= 2) {
      setActiveIndex(0);
      return;
    }

    const nextIndex = Math.round((shelf.scrollLeft / maxScroll) * (itemCount - 1));
    setActiveIndex(Math.min(itemCount - 1, Math.max(0, nextIndex)));
  }, [itemCount]);

  React.useEffect(() => {
    setActiveIndex(0);
    updateActiveIndex();
  }, [itemCount, updateActiveIndex]);

  React.useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;

    shelf.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);
    updateActiveIndex();

    return () => {
      shelf.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex]);

  return (
    <Box>
      <Box ref={shelfRef} className={className} onScroll={updateActiveIndex} sx={sx}>
        {children}
      </Box>

      {itemCount > 1 && canScroll ? (
        <Box
          aria-hidden
          className={`${dotClassName} flex justify-center gap-1.5 md:hidden`.trim()}
        >
          {Array.from({ length: itemCount }).map((_, index) => (
            <Box
              key={`mobile-scroll-dot-${index}`}
              className="h-1.5 rounded-full transition-all duration-300"
              sx={{
                width: index === activeIndex ? 18 : 6,
                backgroundColor:
                  index === activeIndex
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

"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export default function RouteLoadingOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const timersRef = React.useRef<number[]>([]);
  const hasMountedRef = React.useRef(false);

  const clearTimers = React.useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const queueTimer = React.useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  }, []);

  const startLoading = React.useCallback(() => {
    clearTimers();
    setVisible(true);
    setProgress(12);
    window.requestAnimationFrame(() => setProgress(38));
    queueTimer(() => setProgress(68), 180);
    queueTimer(() => setProgress(86), 650);
    queueTimer(() => {
      setProgress(100);
      queueTimer(() => setVisible(false), 250);
    }, 1400);
  }, [clearTimers, queueTimer]);

  React.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const previous = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";

      return () => {
        window.history.scrollRestoration = previous;
      };
    }
  }, []);

  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");

      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);

      if (url.origin !== current.origin) return;
      if (url.pathname === current.pathname && url.search === current.search) return;
      if (url.hash && url.pathname === current.pathname && url.search === current.search) {
        return;
      }

      startLoading();
    }

    window.addEventListener("popstate", startLoading);
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("popstate", startLoading);
      document.removeEventListener("click", handleClick, true);
      clearTimers();
    };
  }, [clearTimers, startLoading]);

  React.useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();

    const frameA = window.requestAnimationFrame(scrollToTop);
    const frameB = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToTop);
    });

    return () => {
      window.cancelAnimationFrame(frameA);
      window.cancelAnimationFrame(frameB);
    };
  }, [pathname, searchParams]);

  React.useEffect(() => {
    if (!visible) return;

    setProgress(100);
    const timer = window.setTimeout(() => setVisible(false), 280);

    return () => window.clearTimeout(timer);
  }, [pathname, searchParams, visible]);

  if (!visible) return null;

  return (
    <BoxOverlay>
      <div
        className="h-full rounded-full bg-slate-900 shadow-[0_0_20px_rgba(15,23,42,0.28)] transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </BoxOverlay>
  );
}

function BoxOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-9999 h-1 bg-slate-200/70">
      {children}
    </div>
  );
}

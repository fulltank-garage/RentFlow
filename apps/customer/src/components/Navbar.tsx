"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Avatar,
} from "@mui/material";

import { NAV } from "@/src/constants/navigation";
import { useRentFlowCarRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowCarRealtimeRefresh";
import { useRentFlowCarSiteModeStatus } from "@/src/hooks/useRentFlowCarSiteMode";
import {
  AUTH_SESSION_CHANGED_EVENT,
  clearCachedSessionUser,
  getCachedSessionUser,
  getSessionUser,
} from "@/src/services/auth/auth.service";
import type { Customer } from "@/src/services/auth/auth.types";
import { tenantApi } from "@/src/services/tenant/tenant.service";
import type { TenantProfile } from "@/src/services/tenant/tenant.types";

type User = {
  name: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
};

type AuthSkeletonVariant = "guest" | "profile";

const desktopLoginButtonSx = {
  px: {
    xs: "10px !important",
    md: "11px !important",
    lg: "12px !important",
  },
  py: {
    xs: "3px !important",
    md: "3px !important",
    lg: "4px !important",
  },
  minHeight: {
    xs: "30px !important",
    md: "32px !important",
    lg: "34px !important",
  },
  fontSize: {
    xs: "0.72rem !important",
    md: "0.74rem !important",
    lg: "0.78rem !important",
  },
  lineHeight: "1 !important",
} as const;

const desktopRegisterButtonSx = {
  px: {
    xs: "12px !important",
    md: "13px !important",
    lg: "14px !important",
  },
  py: {
    xs: "3px !important",
    md: "3px !important",
    lg: "4px !important",
  },
  minHeight: {
    xs: "30px !important",
    md: "32px !important",
    lg: "34px !important",
  },
  fontSize: {
    xs: "0.72rem !important",
    md: "0.74rem !important",
    lg: "0.78rem !important",
  },
  lineHeight: "1 !important",
} as const;

function MobileMenuGlyph({ open }: { open: boolean }) {
  return (
    <Box className="relative block h-4 w-5" aria-hidden="true">
      <Box
        className="absolute left-0 top-1 h-[1.5px] w-5 rounded-full bg-(--rf-apple-ink)/75"
        sx={{
          transform: open
            ? "translateY(3px) rotate(45deg)"
            : "translateY(0) rotate(0deg)",
          transition:
            "transform .42s cubic-bezier(0.22, 1, 0.36, 1), background-color .28s ease",
        }}
      />
      <Box
        className="absolute left-0 top-2.5 h-[1.5px] w-5 rounded-full bg-(--rf-apple-ink)/75"
        sx={{
          transform: open
            ? "translateY(-3px) rotate(-45deg)"
            : "translateY(0) rotate(0deg)",
          transition:
            "transform .42s cubic-bezier(0.22, 1, 0.36, 1), background-color .28s ease",
        }}
      />
    </Box>
  );
}

function getDisplayName(user: {
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return user.name || fullName || user.username || "ผู้ใช้งาน";
}

const useHydrationLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

function mapCustomerToNavbarUser(user: Customer | null): User | null {
  if (!user) return null;

  return {
    name: getDisplayName(user),
    email: user.email,
    username: user.username,
    avatarUrl: user.avatarUrl,
  };
}

function DesktopGuestButtonsSkeleton() {
  return (
    <>
      <Box
        sx={desktopLoginButtonSx}
        className="relative inline-flex items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white"
      >
        <span className="invisible whitespace-nowrap">เข้าสู่ระบบ</span>
        <Box className="absolute inset-0 animate-pulse rounded-full bg-black/4" />
      </Box>
      <Box
        sx={desktopRegisterButtonSx}
        className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-(--rf-apple-blue)"
      >
        <span className="invisible whitespace-nowrap font-semibold">
          สมัครสมาชิก
        </span>
        <Box className="absolute inset-0 animate-pulse rounded-full bg-white/14" />
      </Box>
    </>
  );
}

function DesktopProfileSkeleton() {
  return (
    <Box className="h-10! w-full max-w-[220px] rounded-full! px-0! py-0!">
      <Box className="flex h-full w-full items-center justify-end gap-2.5">
        <Box className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-black/8" />
        <Box className="min-w-0 flex-1 text-left">
          <Box className="h-3.5 w-[108px] animate-pulse rounded-full bg-black/8" />
          <Box className="mt-1.5 h-2.5 w-[72px] animate-pulse rounded-full bg-black/5.5" />
        </Box>
      </Box>
    </Box>
  );
}

function MobileGuestButtonsSkeleton() {
  return (
    <>
      <Box className="relative inline-flex min-h-11 w-full items-center justify-center overflow-hidden rounded-full border border-black/8 bg-white px-4 py-2.5">
        <span className="invisible whitespace-nowrap">เข้าสู่ระบบ</span>
        <Box className="absolute inset-0 animate-pulse rounded-full bg-black/4" />
      </Box>
      <Box className="relative inline-flex min-h-11 w-full items-center justify-center overflow-hidden rounded-full bg-(--rf-apple-blue) px-4 py-2.5">
        <span className="invisible whitespace-nowrap font-semibold">
          สมัครสมาชิก
        </span>
        <Box className="absolute inset-0 animate-pulse rounded-full bg-white/14" />
      </Box>
    </>
  );
}

function MobileProfileSkeleton() {
  return (
    <Box className="rounded-3xl border border-black/10 bg-white px-4 py-3">
      <Box className="flex items-center gap-3">
        <Box className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-black/8" />
        <Box className="min-w-0 flex-1">
          <Box className="h-[15px] w-[124px] animate-pulse rounded-full bg-black/8" />
          <Box className="mt-2 h-3 w-[164px] max-w-full animate-pulse rounded-full bg-black/5.5" />
        </Box>
      </Box>
      <Box className="mt-3 h-9 w-full animate-pulse rounded-full bg-black/5.5" />
    </Box>
  );
}

function BrandLogo({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className: string;
}) {
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    const fallbackText = alt.trim().slice(0, 1).toUpperCase() || "R";

    return (
      <Box
        className={`${className} grid place-items-center rounded-full bg-(--rf-apple-ink) text-[10px] font-bold leading-none text-white`}
        aria-label={alt}
      >
        {fallbackText}
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      sx={{ display: "block" }}
    />
  );
}

type NavbarProps = {
  initialHost?: string;
  initialTenantProfile?: TenantProfile | null;
};

export default function Navbar({
  initialHost,
  initialTenantProfile = null,
}: NavbarProps) {
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const blurActiveElement = React.useCallback(() => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  }, []);
  const closeDrawer = React.useCallback(() => {
    blurActiveElement();
    setOpen(false);
  }, [blurActiveElement]);
  const toggleDrawer = React.useCallback(() => {
    blurActiveElement();
    setOpen((current) => !current);
  }, [blurActiveElement]);
  React.useLayoutEffect(() => {
    if (!open) return;

    const preventPageScroll = (event: WheelEvent | TouchEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("#customer-mobile-menu")
      ) {
        return;
      }

      event.preventDefault();
    };

    window.addEventListener("wheel", preventPageScroll, { passive: false });
    window.addEventListener("touchmove", preventPageScroll, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", preventPageScroll);
      window.removeEventListener("touchmove", preventPageScroll);
    };
  }, [open]);
  const [user, setUser] = React.useState<User | null>(null);
  const [authResolved, setAuthResolved] = React.useState(false);
  const [authSkeletonVariant, setAuthSkeletonVariant] =
    React.useState<AuthSkeletonVariant>("guest");
  const [authShellReady, setAuthShellReady] = React.useState(false);
  const [tenantProfile, setTenantProfile] =
    React.useState<TenantProfile | null>(initialTenantProfile);
  const verifyingSessionRef = React.useRef(false);

  const { siteMode } = useRentFlowCarSiteModeStatus(initialHost);
  const brandName = tenantProfile?.shopName || "RentFlowCar";
  const brandLogoSrc =
    tenantProfile?.logoUrl || (siteMode === "storefront" ? "" : "/RentFlowCar.png");
  const navItems = React.useMemo(
    () =>
      siteMode === "marketplace"
        ? NAV
        : NAV.filter((item) => item.href !== "/shops"),
    [siteMode]
  );

  const reloadTenantProfile = React.useCallback(() => {
    if (siteMode !== "storefront") return;
    tenantApi
      .resolveTenant()
      .then((res) => {
        setTenantProfile(res.data);
      })
      .catch(() => {
        setTenantProfile(initialTenantProfile);
      });
  }, [initialTenantProfile, siteMode]);

  useRentFlowCarRealtimeRefresh({
    events: ["tenant.updated"],
    onRefresh: reloadTenantProfile,
    enabled: siteMode === "storefront",
  });

  const applyCachedSession = React.useCallback((resolved = true) => {
    const cachedUser = getCachedSessionUser();
    if (cachedUser) {
      setAuthSkeletonVariant("profile");
      if (resolved) {
        setUser(mapCustomerToNavbarUser(cachedUser));
      }
    } else {
      setUser(null);
      setAuthSkeletonVariant("guest");
    }
    setAuthResolved(resolved);
  }, []);

  const verifySession = React.useCallback(async () => {
    if (verifyingSessionRef.current) return;

    const cachedUser = getCachedSessionUser();
    if (!cachedUser) {
      setUser(null);
      setAuthSkeletonVariant("guest");
      setAuthResolved(true);
      setAuthShellReady(true);
      return;
    }

    setAuthSkeletonVariant("profile");
    setUser(null);
    setAuthResolved(false);
    setAuthShellReady(true);
    verifyingSessionRef.current = true;

    try {
      const verifiedUser = await getSessionUser();
      setUser(mapCustomerToNavbarUser(verifiedUser));
      setAuthSkeletonVariant(verifiedUser ? "profile" : "guest");
    } catch {
      clearCachedSessionUser();
      setUser(null);
      setAuthSkeletonVariant("guest");
    } finally {
      verifyingSessionRef.current = false;
      setAuthResolved(true);
    }
  }, []);

  useHydrationLayoutEffect(() => {
    applyCachedSession(false);
    setAuthShellReady(true);
  }, [applyCachedSession]);

  React.useEffect(() => {
    const handleSessionChanged = () => {
      void verifySession();
    };

    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChanged);
    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChanged);
    };
  }, [verifySession]);

  React.useEffect(() => {
    if (siteMode !== "storefront") {
      setTenantProfile(null);
      return;
    }

    reloadTenantProfile();
  }, [reloadTenantProfile, siteMode]);

  React.useEffect(() => {
    void verifySession();
  }, [pathname, verifySession]);

  React.useEffect(() => {
    closeDrawer();
  }, [closeDrawer, pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="bg-white/90! backdrop-blur-2xl!"
      sx={{
        color: "var(--rf-apple-ink)",
        top: 0,
        zIndex: (theme) => theme.zIndex.modal + 20,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          "@media (min-width: 1200px)": {
            maxWidth: "1360px",
            paddingLeft: "24px",
            paddingRight: "24px",
          },
        }}
      >
        <Toolbar
          className="min-h-[52px]! px-0! md:min-h-11!"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 3,
            position: "relative",
            "@media (min-width: 801px)": {
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)",
              alignItems: "center",
              gap: 2,
            },
          }}
        >
          <Box
            component={Link}
            href="/"
            className="flex min-w-0 items-center no-underline"
            sx={{
              "@media (max-width: 800px)": {
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              },
              "@media (min-width: 801px)": {
                justifySelf: "start",
              },
            }}
          >
            <Box className="relative h-8 w-[156px] shrink-0 overflow-hidden md:h-9 md:w-[178px]">
              <BrandLogo
                src={brandLogoSrc}
                alt={brandName}
                className="h-full w-full object-contain"
              />
            </Box>
          </Box>

          <Box
            className="items-center gap-1"
            sx={{
              display: "none",
              "@media (min-width: 801px)": {
                display: "flex",
                justifySelf: "center",
                justifyContent: "center",
              },
            }}
          >
              {navItems.map((n) => {
                const active = isActive(n.href);

                return (
                  <Button
                    key={n.href}
                    component={Link}
                    href={n.href}
                    disableElevation
                    className="apple-nav-link min-w-0! rounded-full! px-2.5! py-1! font-normal!"
                    sx={{
                      fontWeight: "400 !important",
                      minHeight: "30px !important",
                      lineHeight: 1.42859,
                      letterSpacing: "-0.016em",
                      color: active
                        ? "var(--rf-apple-ink)"
                        : "var(--rf-apple-muted)",
                      backgroundColor: active
                        ? "rgba(0,0,0,0.06)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: active
                          ? "rgba(0,0,0,0.07)"
                          : "rgba(0,0,0,0.045)",
                        color: "var(--rf-apple-ink)",
                      },
                      transition:
                        "background-color var(--rf-apple-hover-control-duration) var(--rf-apple-hover-ease), color var(--rf-apple-hover-control-duration) var(--rf-apple-hover-ease), opacity var(--rf-apple-hover-control-duration) var(--rf-apple-hover-ease), transform var(--rf-apple-hover-control-duration) var(--rf-apple-hover-ease)",
                    }}
                  >
                    {n.label}
                  </Button>
                );
              })}
          </Box>

          <Box
            className="items-center gap-2"
            sx={{
              display: "none",
              minWidth: 0,
              "@media (min-width: 801px)": {
                display: "flex",
                justifySelf: "end",
                justifyContent: "flex-end",
                maxWidth: 220,
                width: "100%",
              },
            }}
          >
              {!authShellReady ? (
                <Box className="h-10! w-full max-w-[220px] opacity-0">
                  <Box className="flex h-full w-full items-center justify-end gap-2" />
                </Box>
              ) : !authResolved ? (
                authSkeletonVariant === "profile" ? (
                  <DesktopProfileSkeleton />
                ) : (
                  <DesktopGuestButtonsSkeleton />
                )
              ) : !user ? (
                <>
                  <Button
                    component={Link}
                    href="/login"
                    variant="outlined"
                    className="apple-button-copy rounded-full!"
                    sx={desktopLoginButtonSx}
                  >
                    เข้าสู่ระบบ
                  </Button>

                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    className="apple-button-copy rounded-full! font-semibold!"
                    sx={desktopRegisterButtonSx}
                  >
                    สมัครสมาชิก
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/profile"
                    disableRipple
                    disableTouchRipple
                    className="h-10! w-full rounded-full! px-0! py-0!"
                    sx={{
                      backgroundColor: "transparent",
                      border: "0",
                      minWidth: 0,
                      maxWidth: 220,
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                      "&:focus": {
                        outline: "none",
                      },
                      "&:focus-visible": {
                        outline: "none",
                      },
                      transition:
                        "opacity var(--rf-apple-hover-control-duration) var(--rf-apple-hover-ease), transform var(--rf-apple-hover-control-duration) var(--rf-apple-hover-ease)",
                    }}
                  >
                    <Box className="flex w-full items-center justify-end gap-2.5">
                      <Avatar
                        src={user.avatarUrl || undefined}
                        className="h-8! w-8! bg-(--rf-apple-ink)! text-sm! text-white!"
                      >
                        {user.name[0].toUpperCase()}
                      </Avatar>

                      <Box className="min-w-0 flex-1 text-left">
                        <Typography className="apple-nav-link truncate font-semibold! leading-tight! text-(--rf-apple-ink)!">
                          {user.name}
                        </Typography>
                        <Typography className="apple-nav-caption mt-0.5! truncate font-medium! leading-none! text-(--rf-apple-muted)!">
                          {user.username || "บัญชีผู้ใช้"}
                        </Typography>
                      </Box>
                    </Box>
                  </Button>
                </>
              )}
          </Box>

          <Button
            ref={menuButtonRef}
            onClick={toggleDrawer}
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-controls="customer-mobile-menu"
            aria-expanded={open}
            disableElevation
            className="h-11! w-11! min-w-0! rounded-[14px]! p-0!"
            sx={{
              display: "inline-flex",
              border: "0",
              color: "var(--rf-apple-ink)",
              backgroundColor: "transparent",
              "@media (min-width: 801px)": {
                display: "none",
              },
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <MobileMenuGlyph open={open} />
          </Button>
        </Toolbar>
      </Container>

      {open ? (
        <Box
          id="customer-mobile-menu"
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            top: "52px",
            zIndex: (theme) => theme.zIndex.modal + 10,
            height: "calc(100dvh - 52px)",
            maxHeight: "calc(100dvh - 52px)",
            overflow: "hidden",
            backgroundColor: "var(--rf-apple-surface-soft)",
            animation:
              "rentflowMobileMenuIn .32s cubic-bezier(0.22, 1, 0.36, 1)",
            "@keyframes rentflowMobileMenuIn": {
              from: {
                opacity: 0,
                transform: "translateY(-10px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
            "@media (min-width: 801px)": {
              display: "none",
            },
          }}
        >
        <Box
          className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-(--rf-apple-surface-soft) text-(--rf-apple-ink)"
          sx={{ overscrollBehavior: "contain" }}
        >
          <List
            className="flex-1 overflow-y-auto px-4! py-4! md:px-5! md:py-5!"
            sx={{ overscrollBehavior: "contain" }}
          >
            {navItems.map((n) => {
              const active = isActive(n.href);

              return (
                <ListItemButton
                  key={n.href}
                  component={Link}
                  href={n.href}
                  onClick={closeDrawer}
                  className="mb-2! rounded-3xl!"
                  sx={{
                    px: 2.2,
                    py: 1.5,
                    backgroundColor: active
                      ? "rgba(0,0,0,0.055)"
                      : "transparent",
                    border: "0",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.045)",
                    },
                  }}
                >
                  <ListItemText
                    primary={n.label}
                    primaryTypographyProps={{
                      fontSize: "1.02rem",
                      fontWeight: active ? 700 : 500,
                      letterSpacing: "-0.02em",
                      color: active ? "rgb(15 23 42)" : "rgb(51 65 85)",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>

          <Box className="flex flex-col gap-3 border-t border-black/10 p-4 md:px-5 md:pb-6">
            {!authShellReady ? (
              <Box className="h-[91px] w-full opacity-0" />
            ) : !authResolved ? (
              authSkeletonVariant === "profile" ? (
                <MobileProfileSkeleton />
              ) : (
                <MobileGuestButtonsSkeleton />
              )
            ) : !user ? (
              <>
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  fullWidth
                  className="rounded-full! py-2.5!"
                  onClick={closeDrawer}
                >
                  เข้าสู่ระบบ
                </Button>

                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  fullWidth
                  className="rounded-full! py-2.5! font-semibold!"
                  onClick={closeDrawer}
                >
                  สมัครสมาชิก
                </Button>
              </>
            ) : (
              <>
                <Box className="rounded-3xl border border-black/10 bg-white px-4 py-3">
                  <Box
                    component={Link}
                    href="/profile"
                    onClick={closeDrawer}
                    className="block no-underline"
                    sx={{
                      display: "block",
                      transition:
                        "opacity var(--rf-apple-hover-control-duration) var(--rf-apple-hover-ease), transform var(--rf-apple-hover-control-duration) var(--rf-apple-hover-ease)",
                      "&:hover": {
                        backgroundColor: "transparent",
                        transform: "scale(1.006)",
                      },
                    }}
                  >
                    <Box className="flex items-center gap-3">
                      <Avatar
                        src={user.avatarUrl || undefined}
                        className="h-11! w-11! bg-(--rf-apple-ink)! text-white!"
                      >
                        {user.name[0].toUpperCase()}
                      </Avatar>
                      <Box className="min-w-0">
                        <Typography className="apple-nav-link truncate font-semibold! text-(--rf-apple-ink)!">
                          {user.name}
                        </Typography>
                        <Typography className="apple-body-sm text-(--rf-apple-muted)!">
                          {user.username || "ผู้ใช้งาน"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="mt-3 flex min-h-9 items-center justify-center rounded-full bg-(--rf-apple-surface-soft) px-4 text-center text-[0px] font-bold text-(--rf-apple-ink)">
                      <span className="text-sm">{"\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e1a\u0e31\u0e0d\u0e0a\u0e35"}</span>
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
        </Box>
      ) : null}
    </AppBar>
  );
}

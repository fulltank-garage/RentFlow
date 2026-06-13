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
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Avatar,
} from "@mui/material";

import { NAV } from "@/src/constants/navigation";
import { useRentFlowRealtimeRefresh } from "@/src/hooks/realtime/useRentFlowRealtimeRefresh";
import { useRentFlowSiteModeStatus } from "@/src/hooks/useRentFlowSiteMode";
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
        className="absolute left-0 top-[4px] h-[1.5px] w-5 rounded-full bg-[var(--rf-apple-ink)]/75"
        sx={{
          transform: open
            ? "translateY(3px) rotate(45deg)"
            : "translateY(0) rotate(0deg)",
          transition:
            "transform .42s cubic-bezier(0.22, 1, 0.36, 1), background-color .28s ease",
        }}
      />
      <Box
        className="absolute left-0 top-[10px] h-[1.5px] w-5 rounded-full bg-[var(--rf-apple-ink)]/75"
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
        className="relative inline-flex items-center justify-center overflow-hidden rounded-full border border-black/[0.1] bg-white"
      >
        <span className="invisible whitespace-nowrap">เข้าสู่ระบบ</span>
        <Box className="absolute inset-0 animate-pulse rounded-full bg-black/[0.04]" />
      </Box>
      <Box
        sx={desktopRegisterButtonSx}
        className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--rf-apple-blue)]"
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
        <Box className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-black/[0.08]" />
        <Box className="min-w-0 flex-1 text-left">
          <Box className="h-[14px] w-[108px] animate-pulse rounded-full bg-black/[0.08]" />
          <Box className="mt-1.5 h-[10px] w-[72px] animate-pulse rounded-full bg-black/[0.055]" />
        </Box>
      </Box>
    </Box>
  );
}

function MobileGuestButtonsSkeleton() {
  return (
    <>
      <Box className="relative inline-flex min-h-[44px] w-full items-center justify-center overflow-hidden rounded-full border border-black/[0.08] bg-white px-4 py-2.5">
        <span className="invisible whitespace-nowrap">เข้าสู่ระบบ</span>
        <Box className="absolute inset-0 animate-pulse rounded-full bg-black/[0.04]" />
      </Box>
      <Box className="relative inline-flex min-h-[44px] w-full items-center justify-center overflow-hidden rounded-full bg-[var(--rf-apple-blue)] px-4 py-2.5">
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
    <>
      <Box className="rounded-[24px] border border-black/10 bg-white px-4 py-3">
        <Box className="flex items-center gap-3">
          <Box className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-black/[0.08]" />
          <Box className="min-w-0 flex-1">
            <Box className="h-[15px] w-[124px] animate-pulse rounded-full bg-black/[0.08]" />
            <Box className="mt-2 h-[12px] w-[164px] max-w-full animate-pulse rounded-full bg-black/[0.055]" />
          </Box>
        </Box>
      </Box>
      <Box className="h-[44px] w-full animate-pulse rounded-full border border-black/[0.08] bg-white" />
    </>
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
        className={`${className} grid place-items-center rounded-full bg-[var(--rf-apple-ink)] text-[10px] font-bold leading-none text-white`}
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
  const closeDrawer = React.useCallback(() => setOpen(false), []);
  const toggleDrawer = React.useCallback(() => {
    setOpen((current) => !current);
  }, []);
  const [user, setUser] = React.useState<User | null>(null);
  const [authResolved, setAuthResolved] = React.useState(false);
  const [authSkeletonVariant, setAuthSkeletonVariant] =
    React.useState<AuthSkeletonVariant>("guest");
  const [authShellReady, setAuthShellReady] = React.useState(false);
  const [tenantProfile, setTenantProfile] =
    React.useState<TenantProfile | null>(initialTenantProfile);
  const verifyingSessionRef = React.useRef(false);

  const { siteMode } = useRentFlowSiteModeStatus(initialHost);
  const brandName = tenantProfile?.shopName || "RentFlow";
  const brandCaption =
    siteMode === "storefront" && tenantProfile ? "หน้าร้านเช่ารถ" : "Smart Car Rental";
  const brandLogoSrc =
    tenantProfile?.logoUrl || (siteMode === "storefront" ? "" : "/RentFlow.png");
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

  useRentFlowRealtimeRefresh({
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

  React.useEffect(() => {
    if (!open) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [open]);

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
      <Container maxWidth="lg">
        <Toolbar
          className="min-h-[52px]! px-0! md:min-h-11!"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 3,
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
            className="flex min-w-0 items-center gap-2 no-underline md:gap-2.5"
            sx={{
              "@media (min-width: 801px)": {
                justifySelf: "start",
              },
            }}
          >
            <Box className="relative h-5 w-5 shrink-0 overflow-hidden">
              <BrandLogo
                src={brandLogoSrc}
                alt={brandName}
                className="h-full w-full object-contain"
              />
            </Box>

            <Box className="flex min-w-0 flex-col">
              <Typography className="apple-nav-brand truncate font-semibold! tracking-[-0.01em] text-[var(--rf-apple-ink)]! leading-none!">
                {brandName}
              </Typography>
              <Typography className="apple-nav-caption mt-0.5! truncate font-medium! leading-none! text-[var(--rf-apple-muted)]!">
                {brandCaption}
              </Typography>
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
                    className="apple-nav-link min-w-0! rounded-full! px-3.5! py-1.5! !font-normal"
                    sx={{
                      fontWeight: "400 !important",
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
                        "background-color .32s ease, color .32s ease, opacity .32s ease, transform .86s cubic-bezier(0.18,0.9,0.22,1)",
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
                        "opacity .32s ease, transform .86s cubic-bezier(0.18,0.9,0.22,1)",
                    }}
                  >
                    <Box className="flex w-full items-center justify-end gap-2.5">
                      <Avatar
                        src={user.avatarUrl || undefined}
                        className="h-8! w-8! bg-[var(--rf-apple-ink)]! text-sm! text-white!"
                      >
                        {user.name[0].toUpperCase()}
                      </Avatar>

                      <Box className="min-w-0 flex-1 text-left">
                        <Typography className="apple-nav-link truncate font-semibold! leading-tight! text-[var(--rf-apple-ink)]!">
                          {user.name}
                        </Typography>
                        <Typography className="apple-nav-caption mt-0.5! truncate font-medium! leading-none! text-[var(--rf-apple-muted)]!">
                          {user.username || "บัญชีผู้ใช้"}
                        </Typography>
                      </Box>
                    </Box>
                  </Button>
                </>
              )}
          </Box>

          <Button
            onClick={toggleDrawer}
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
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

      <Drawer
        anchor="top"
        open={open}
        onClose={closeDrawer}
        transitionDuration={{ enter: 420, exit: 320 }}
        ModalProps={{ keepMounted: true }}
        sx={{
          "@media (min-width: 801px)": {
            display: "none",
          },
        }}
        PaperProps={{
          sx: {
            width: "100vw",
            maxWidth: "100vw",
            height: "100dvh",
            maxHeight: "100dvh",
            overflow: "hidden",
            backgroundColor: "var(--rf-apple-surface-soft)",
            borderBottomLeftRadius: "28px",
            borderBottomRightRadius: "28px",
          },
        }}
      >
        <Box className="flex h-full min-h-dvh w-full flex-col overflow-hidden bg-[var(--rf-apple-surface-soft)] text-[var(--rf-apple-ink)]">
          <Container maxWidth="lg" className="w-full!">
          <Box>
            <Box className="flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <Box className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                  <Box className="relative h-6 w-6 overflow-hidden">
                    <BrandLogo
                      src={brandLogoSrc}
                      alt={brandName}
                      className="h-full w-full object-contain"
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography className="apple-nav-brand font-semibold! tracking-[-0.01em] text-[var(--rf-apple-ink)]! leading-none!">
                    {brandName}
                  </Typography>
                  <Typography className="apple-nav-caption mt-1! font-medium! leading-none! text-[var(--rf-apple-muted)]!">
                    {brandCaption}
                  </Typography>
                </Box>
              </Box>

              <Button
                onClick={closeDrawer}
                aria-label="ปิดเมนู"
                disableElevation
                className="h-11! w-11! min-w-0! rounded-[14px]! p-0!"
                sx={{
                  border: "0",
                  color: "var(--rf-apple-ink)",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <MobileMenuGlyph open />
              </Button>
            </Box>
          </Box>
          </Container>

          <List
            className="flex-1 px-4! py-4! md:px-5! md:py-5!"
          >
            {navItems.map((n) => {
              const active = isActive(n.href);

              return (
                <ListItemButton
                  key={n.href}
                  component={Link}
                  href={n.href}
                  onClick={closeDrawer}
                  className="mb-2! rounded-[24px]!"
                  sx={{
                    px: 2.2,
                    py: 1.5,
                    backgroundColor: active
                      ? "rgba(0,0,0,0.055)"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(0,0,0,0.08)"
                      : "1px solid transparent",
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
                <Box className="rounded-[24px] border border-black/10 bg-white px-4 py-3">
                  <Box
                    component={Link}
                    href="/profile"
                    onClick={closeDrawer}
                    sx={{
                      display: "block",
                      transition:
                        "opacity .32s ease, transform .86s cubic-bezier(0.18,0.9,0.22,1)",
                      "&:hover": {
                        backgroundColor: "transparent",
                        transform: "scale(1.006)",
                      },
                    }}
                  >
                    <Box className="flex items-center gap-3">
                      <Avatar
                        src={user.avatarUrl || undefined}
                        className="h-11! w-11! bg-[var(--rf-apple-ink)]! text-white!"
                      >
                        {user.name[0].toUpperCase()}
                      </Avatar>
                      <Box className="min-w-0">
                        <Typography className="apple-nav-link truncate font-semibold! text-[var(--rf-apple-ink)]!">
                          {user.name}
                        </Typography>
                        <Typography className="apple-body-sm text-[var(--rf-apple-muted)]!">
                          {user.username || "ผู้ใช้งาน"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Button
                  component={Link}
                  href="/profile"
                  variant="outlined"
                  fullWidth
                  className="rounded-full! py-2.5!"
                  onClick={closeDrawer}
                >
                  จัดการบัญชี
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}

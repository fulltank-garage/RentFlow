"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import InsertChartRoundedIcon from "@mui/icons-material/InsertChartRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import LineAxisRoundedIcon from "@mui/icons-material/LineAxisRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { readStoreProfile, type PartnerStoreProfile } from "@/src/lib/partner-store";
import { PARTNER_NAV } from "./partnerNav";
import type { PartnerNavGroup, PartnerNavIcon } from "./partnerNav";

type Props = {
  mobileOpen: boolean;
  onMobileClose: () => void;
  drawerWidth?: number;
};

const GROUP_LABEL: Record<PartnerNavGroup, string> = {
  Operations: "จัดการร้าน",
  Sales: "การจองและลูกค้า",
  Finance: "การเงิน",
  Analytics: "จัดการยอดขาย",
  Settings: "เครื่องมือร้าน",
};

const GROUPS: PartnerNavGroup[] = [
  "Operations",
  "Sales",
  "Finance",
  "Analytics",
  "Settings",
];

const MENU_ICON: Record<PartnerNavIcon, SvgIconComponent> = {
  dashboard: LineAxisRoundedIcon,
  store: StorefrontRoundedIcon,
  builder: EditRoundedIcon,
  car: DirectionsCarFilledRoundedIcon,
  location: LocationOnRoundedIcon,
  bookings: CalendarMonthRoundedIcon,
  customers: GroupsRoundedIcon,
  payments: CreditCardRoundedIcon,
  calendar: InventoryRoundedIcon,
  promotions: ConfirmationNumberRoundedIcon,
  addons: AddBoxRoundedIcon,
  reports: InsertChartRoundedIcon,
  line: HomeWorkRoundedIcon,
  ai: AutoAwesomeRoundedIcon,
  support: HelpRoundedIcon,
};

function PartnerMenuIcon({ name }: { name: PartnerNavIcon }) {
  const Icon = MENU_ICON[name];
  return <Icon aria-hidden fontSize="inherit" />;
}

export default function PartnerSidebar({
  mobileOpen,
  onMobileClose,
  drawerWidth = 296,
}: Props) {
  const pathname = usePathname();
  const [storeProfile, setStoreProfile] =
    React.useState<PartnerStoreProfile | null>(null);

  React.useEffect(() => {
    const syncStoreProfile = () => setStoreProfile(readStoreProfile());

    syncStoreProfile();
    window.addEventListener("storage", syncStoreProfile);
    window.addEventListener("rentflow-store-profile-updated", syncStoreProfile);

    return () => {
      window.removeEventListener("storage", syncStoreProfile);
      window.removeEventListener(
        "rentflow-store-profile-updated",
        syncStoreProfile
      );
    };
  }, []);

  const content = (
    <Box
      className="partner-shell h-full border-0"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          flex: "0 0 auto",
          height: 72,
          minHeight: 72,
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 3 },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" className="min-w-0">
          <Box
            className="grid h-[42px] w-[42px] shrink-0 place-items-center overflow-hidden rounded-[18px] text-sm font-black tracking-[-0.05em] text-white shadow-[var(--rf-partner-shadow-soft)]"
            sx={{
              background: "var(--rf-partner-green-dark)",
            }}
          >
            {storeProfile?.logoUrl ? (
              <Box
                component="img"
                src={storeProfile.logoUrl}
                alt={storeProfile.shopName}
                className="h-full w-full object-cover"
              />
            ) : (
              "RF"
            )}
          </Box>
          <Box className="min-w-0">
            <Typography className="truncate text-[1.02rem] font-extrabold tracking-[-0.03em] text-[var(--rf-partner-sidebar-text)]">
              {storeProfile?.shopName || "ศูนย์จัดการร้าน"}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box
        className="partner-scrollbar px-3 py-3"
        sx={{
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          overscrollBehaviorY: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {GROUPS.map((group, index) => {
          const items = PARTNER_NAV.filter((x) => x.group === group);
          if (!items.length) return null;

          return (
            <Box
              key={group}
              sx={{
                mb: 1.25,
                ...(index !== 0 && { borderTop: 0 }),
              }}
            >
              <Typography
                className="px-2 pb-2 pt-3 text-[13px] tracking-[-0.035em] text-[var(--rf-partner-sidebar-muted)]"
                sx={{ fontWeight: "900 !important" }}
              >
                {GROUP_LABEL[group]}
              </Typography>

              <List
                dense={false}
                disablePadding
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.75,
                }}
              >
                {items.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname?.startsWith(item.href + "/");

                  return (
                    <ListItemButton
                      key={item.href}
                      component={Link}
                      href={item.href}
                      onClick={onMobileClose}
                      className="mx-1 rounded-[22px]"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        borderRadius: "22px",
                        minHeight: { xs: 52, md: 48 },
                        px: 2.25,
                        py: 1.35,
                        bgcolor: active ? "var(--rf-partner-sidebar-active) !important" : "transparent",
                        color: active
                          ? "var(--rf-partner-ink)"
                          : "var(--rf-partner-sidebar-text)",
                        border: 0,
                        boxShadow: "none",
                        "&.Mui-selected": {
                          backgroundColor: "var(--rf-partner-sidebar-active) !important",
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor: "var(--rf-partner-sidebar-active) !important",
                        },
                        "&.Mui-selected.Mui-focusVisible": {
                          backgroundColor: "var(--rf-partner-sidebar-active) !important",
                        },
                        "&:hover": {
                          backgroundColor: active
                            ? "var(--rf-partner-sidebar-active) !important"
                            : "var(--rf-partner-sidebar-hover)",
                          border: 0,
                          boxShadow: "none",
                        },
                        transition:
                          "background-color 180ms ease, box-shadow 180ms ease",
                      }}
                      selected={active}
                    >
                      <Stack direction="row" spacing={1.35} alignItems="center" className="min-w-0">
                        <Box
                          className="grid h-8 w-8 shrink-0 place-items-center"
                          sx={{
                            color: active
                              ? "var(--accent-gold)"
                              : "var(--rf-partner-sidebar-muted)",
                            fontSize: { xs: 27, md: 25 },
                          }}
                        >
                          <PartnerMenuIcon name={item.icon} />
                        </Box>
                        <ListItemText
                          sx={{ my: 0, minWidth: 0 }}
                          primary={
                            <Typography
                              sx={{
                                fontSize: { xs: 16.5, md: 15.2 },
                                fontWeight: active
                                  ? "800 !important"
                                  : "500 !important",
                                lineHeight: 1.3,
                                letterSpacing: "-0.02em",
                                color: active
                                  ? "var(--rf-partner-ink)"
                                  : "var(--rf-partner-sidebar-text)",
                              }}
                            >
                              {item.label}
                            </Typography>
                          }
                        />
                      </Stack>
                      {item.badge ? (
                        <Box className="rounded-full bg-[var(--rf-partner-gold)] px-2 py-0.5 text-[0.68rem] font-bold leading-tight text-[var(--rf-partner-blue-deep)]">
                          {item.badge}
                        </Box>
                      ) : null}
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  const paperSx = {
    width: drawerWidth,
    height: "100dvh",
    borderRight: 0,
    bgcolor: "var(--rf-partner-sidebar-top)",
    boxShadow: "none",
    overflow: "hidden",
    overscrollBehavior: "contain",
  } as const;

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            ...paperSx,
          },
        }}
      >
        {content}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            ...paperSx,
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}

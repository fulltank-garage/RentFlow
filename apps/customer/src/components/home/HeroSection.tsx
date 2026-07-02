"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
} from "@mui/material";

import { Herotextfield } from "@/src/components/hero/Herotextfield";
import DataLoadErrorCard from "@/src/components/common/DataLoadErrorCard";
import { rentFlowSelectMenuProps } from "@/src/components/common/selectMenuProps";
import {
  getCarTypeLabel,
  type LocationOption,
} from "@/src/lib/rentflow-catalog";
import {
  clampPickupDateToToday,
  clampReturnDateToPickup,
  getMinReturnDate,
  getTodayLocalDate,
} from "@/src/lib/rentflow-dates";
import type { CarType } from "@/src/services/cars/cars.types";

type Props = {
  heroImages: readonly string[];

  location: string;
  setLocation: (v: string) => void;

  type: CarType | "All";
  setType: (v: CarType | "All") => void;

  pickupDate: string;
  setPickupDate: (v: string) => void;

  returnDate: string;
  setReturnDate: (v: string) => void;

  carTypes: readonly CarType[];
  locations: readonly LocationOption[];
  catalogLoading?: boolean;
  carTypesError?: string | null;
  locationsError?: string | null;
};

type DatePickerInput = HTMLInputElement & {
  showPicker?: () => void;
};

export default function HeroSection({
  heroImages,
  location,
  setLocation,
  type,
  setType,
  pickupDate,
  setPickupDate,
  returnDate,
  setReturnDate,
  carTypes,
  locations,
  catalogLoading = false,
  carTypesError,
  locationsError,
}: Props) {
  const router = useRouter();
  const today = getTodayLocalDate();
  const minReturnDate = getMinReturnDate(pickupDate);
  const [heroIndex, setHeroIndex] = React.useState(0);
  const [highlightAnnouncement, setHighlightAnnouncement] = React.useState(true);
  const [loadedHeroImages, setLoadedHeroImages] = React.useState<string[]>([]);

  const openDatePicker = (event: React.MouseEvent<HTMLInputElement>) => {
    const input = event.currentTarget as DatePickerInput;
    input.focus();

    try {
      input.showPicker?.();
    } catch {
      // Some browsers only allow the native picker from direct user activation.
    }
  };

  React.useEffect(() => {
    if (!heroImages.length) return;

    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 3500);

    return () => clearInterval(t);
  }, [heroImages.length]);

  React.useEffect(() => {
    if (!heroImages.length) return;

    const activeSrc = heroImages[heroIndex];
    const nextSrc = heroImages[(heroIndex + 1) % heroImages.length];

    [activeSrc, nextSrc].filter(Boolean).forEach((src) => {
      if (loadedHeroImages.includes(src)) return;
      const image = new window.Image();
      image.src = src;
      image.onload = () => {
        setLoadedHeroImages((current) =>
          current.includes(src) ? current : [...current, src]
        );
      };
    });
  }, [heroImages, heroIndex, loadedHeroImages]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setHighlightAnnouncement(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    const nextPickupDate = clampPickupDateToToday(pickupDate);
    const nextReturnDate = clampReturnDateToPickup(returnDate, nextPickupDate);

    if (location) params.set("location", location);
    if (nextPickupDate) params.set("pickupDate", nextPickupDate);
    if (nextReturnDate) params.set("returnDate", nextReturnDate);
    if (type && type !== "All") params.set("type", type);

    router.push(`/cars?${params.toString()}`);
  };

  const activeHeroLoaded = heroImages[heroIndex]
    ? loadedHeroImages.includes(heroImages[heroIndex])
    : false;

  return (
    <Box component="section" className="bg-[var(--rf-apple-bg)]">
      <Box
        sx={{
          backgroundColor: highlightAnnouncement
            ? "var(--rf-apple-blue)"
            : "#ececef",
          transition:
            "background-color var(--rf-apple-hover-card-duration) var(--rf-apple-hover-ease)",
        }}
      >
        <Container maxWidth="lg">
          <Box className="flex min-h-11 items-center justify-center px-2 py-2 text-center sm:px-3 sm:py-1">
            <Typography
              component="div"
              className="apple-announcement-text max-w-4xl tracking-[-0.016em]"
              sx={{
                color: highlightAnnouncement ? "white" : "var(--rf-apple-ink)",
                transition:
                  "color var(--rf-apple-hover-card-duration) var(--rf-apple-hover-ease)",
              }}
            >
              <Box
                component="span"
                className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full px-2 py-1 sm:px-3"
                sx={{
                  "& a": {
                    display: "inline",
                    padding: 0,
                    color: highlightAnnouncement
                      ? "inherit"
                      : "var(--rf-apple-blue)",
                    backgroundColor: "transparent",
                    textDecorationLine: "none",
                    textDecorationThickness: "1.5px",
                    textUnderlineOffset: "2px",
                    fontWeight: 400,
                    boxShadow: "none",
                    transition:
                      "opacity var(--rf-apple-hover-control-duration) var(--rf-apple-hover-ease), color var(--rf-apple-hover-control-duration) var(--rf-apple-hover-ease), text-decoration-color var(--rf-apple-hover-control-duration) var(--rf-apple-hover-ease)",
                  },
                  "& a:hover": {
                    opacity: 0.88,
                    textDecorationLine: "underline",
                  },
                }}
              >
                <Box
                  component={Link}
                  href="/cars"
                  className="shrink-0"
                >
                  เลือกดูรถเช่าออนไลน์
                </Box>
                <Box component="span">
                  พร้อมช่วยเลือกและจองรถได้ง่ายขึ้น
                </Box>
              </Box>
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" className="apple-section pt-[56px]!">
        <Box className="apple-section-intro max-w-4xl md:max-w-none">
          <Typography
            className="apple-heading apple-display-title"
            sx={{
              whiteSpace: "normal",
              lineHeight: { xs: 1.04, md: 1.06 },
              fontSize: {
                xs: "clamp(1.55rem, 7vw, 2.15rem) !important",
                sm: "clamp(2rem, 5.4vw, 3rem) !important",
                md: "clamp(2.55rem, 2.05rem + 1.55vw, 3.55rem)",
                lg: "clamp(3rem, 2.55rem + 1.2vw, 4.05rem)",
              },
            }}
          >
            <Box component="span" sx={{ display: "block", whiteSpace: "nowrap" }}>
              รถที่ใช่ สำหรับทุกการเดินทาง
            </Box>
            <Box component="span" sx={{ display: "block", whiteSpace: "nowrap" }}>
              พร้อมออกเดินทาง ในไม่กี่คลิก
            </Box>
          </Typography>
          <Box
            className="apple-subtitle apple-hero-subtitle mx-auto mt-4 flex max-w-4xl flex-col items-center justify-center text-center"
            sx={{
              textAlign: "center",
              textWrap: "balance",
              width: "100%",
            }}
          >
            <Box component="span" sx={{ display: "block", width: "100%", textAlign: "center" }}>
              เลือกรถ เช็กราคา และจองได้ในหน้าเดียว
            </Box>
            <Box component="span" sx={{ display: "block", width: "100%", textAlign: "center" }}>
              พร้อมประสบการณ์ที่เรียบง่ายเหมือนเลือกผลิตภัณฑ์ที่คุณชอบ
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 1 }}
            className="mt-7 flex-nowrap justify-center"
            useFlexGap
            sx={{
              width: "100%",
              overflow: "hidden",
              "& .MuiChip-root": {
                flex: "0 1 auto",
                minWidth: 0,
              },
              "& .MuiChip-label": {
                overflow: "hidden",
                px: { xs: 0.85, sm: 1.05 },
                textOverflow: "clip",
                whiteSpace: "nowrap",
              },
            }}
          >
            {["ราคาชัดเจน", "เลือกรับรถได้หลายสาขา", "พร้อมเดินทาง"].map(
              (label) => (
                <Chip
                  key={label}
                  label={label}
                  className="apple-pill h-9! text-[var(--rf-apple-muted)]!"
                  sx={{
                    fontSize: {
                      xs: "clamp(0.68rem, 2.55vw, 0.78rem) !important",
                      sm: "var(--rf-type-label) !important",
                    },
                  }}
                />
              )
            )}
          </Stack>
        </Box>

        <Box className="mt-10 grid gap-5">
          <Box className="apple-card relative aspect-[16/9] min-h-0 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,1),rgba(248,249,251,0.98)_48%,rgba(229,232,238,0.94))]">
            {heroImages.length ? (
              <Box
                key={heroImages[heroIndex]}
                className="absolute inset-0 scale-100 opacity-100 transition-all duration-700"
                sx={{
                  backgroundImage: `url(${heroImages[heroIndex]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ) : (
              <>
                <Box className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,1),rgba(248,249,251,0.98)_48%,rgba(229,232,238,0.94))]" />
                <Box className="absolute inset-0 bg-linear-to-b from-white/34 via-white/12 to-slate-200/20" />
              </>
            )}
            <Box
              className={`absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
                heroImages.length && activeHeroLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </Box>

          <Box id="search" className="scroll-mt-28">
            <Card elevation={0} className="apple-card h-full">
              <CardContent className="p-5! sm:p-6! md:p-8! lg:p-10!">
                <Box className="grid gap-7">
                  <Box className="max-w-3xl">
                    <Typography
                      className="apple-heading apple-auth-title"
                    >
                      ค้นหารถเช่า
                    </Typography>
                    <Typography className="apple-subtitle mt-2 text-sm">
                      เลือกช่วงเวลา สาขา และประเภทรถที่ต้องการ
                    </Typography>
                  </Box>

                  <Box className="grid gap-4">
                    {locationsError ? (
                      <DataLoadErrorCard
                        title="โหลดรายการสาขาในช่องค้นหาไม่ได้"
                        message={locationsError}
                        helperText="ช่องสาขาจะแสดงเฉพาะตัวเลือกทั้งหมดจนกว่าจะโหลดข้อมูลสำเร็จ"
                        compact
                      />
                    ) : null}

                    {carTypesError ? (
                      <DataLoadErrorCard
                        title="โหลดรายการประเภทรถในช่องค้นหาไม่ได้"
                        message={carTypesError}
                        helperText="ช่องประเภทรถจะแสดงเฉพาะตัวเลือกทั้งหมดจนกว่าจะโหลดข้อมูลสำเร็จ"
                        compact
                      />
                    ) : null}

                    {catalogLoading && !locations.length && !carTypes.length ? (
                      <Box className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-[1.1fr_0.95fr_0.95fr_0.9fr_auto] xl:items-stretch">
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          className="col-span-2 xl:col-span-1"
                          sx={{ height: 56, borderRadius: "18px" }}
                        />
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          sx={{ height: 56, borderRadius: "18px" }}
                        />
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          sx={{ height: 56, borderRadius: "18px" }}
                        />
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          className="col-span-2 xl:col-span-1"
                          sx={{ height: 56, borderRadius: "18px" }}
                        />
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          className="col-span-2 xl:col-span-1"
                          sx={{ height: 48, minWidth: "180px", borderRadius: "999px" }}
                        />
                      </Box>
                    ) : (
                    <Box className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-[1.1fr_0.95fr_0.95fr_0.9fr_auto] xl:items-stretch">
                      <TextField
                        select
                        id="home-search-pickup-branch"
                        name="pickupBranch"
                        label="สาขารับรถ"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        fullWidth
                        InputLabelProps={{ htmlFor: undefined, shrink: true }}
                        SelectProps={{
                          displayEmpty: true,
                          MenuProps: rentFlowSelectMenuProps,
                          renderValue: (selected) =>
                            selected ? (
                              locations.find((loc) => loc.value === selected)?.label ||
                              String(selected)
                            ) : (
                              <Box component="span" className="text-[var(--rf-apple-muted)]">
                                กรุณาเลือกสาขา
                              </Box>
                            ),
                        }}
                        className="col-span-2 xl:col-span-1"
                        sx={Herotextfield}
                      >
                        <MenuItem value="">กรุณาเลือกสาขา</MenuItem>
                        {locations.map((loc) => (
                          <MenuItem key={loc.value} value={loc.value}>
                            {loc.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        type="date"
                        id="home-search-pickup-date"
                        name="pickupDate"
                        label="วันรับรถ"
                        value={pickupDate}
                        onChange={(e) => {
                          const nextPickupDate = clampPickupDateToToday(e.target.value);
                          const nextReturnDate = clampReturnDateToPickup(
                            returnDate,
                            nextPickupDate
                          );
                          setPickupDate(nextPickupDate);
                          setReturnDate(nextReturnDate);
                        }}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: today,
                          onClick: openDatePicker,
                          style: { cursor: "pointer" },
                        }}
                        sx={Herotextfield}
                      />

                      <TextField
                        type="date"
                        id="home-search-return-date"
                        name="returnDate"
                        label="วันคืนรถ"
                        value={returnDate}
                        onChange={(e) =>
                          setReturnDate(clampReturnDateToPickup(e.target.value, pickupDate))
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: minReturnDate,
                          onClick: openDatePicker,
                          style: { cursor: "pointer" },
                        }}
                        sx={Herotextfield}
                      />
                      <TextField
                        select
                        id="home-search-car-type"
                        name="carType"
                        label="ประเภทรถ"
                        value={type}
                        onChange={(e) => setType(e.target.value as CarType | "All")}
                        fullWidth
                        InputLabelProps={{ htmlFor: undefined }}
                        SelectProps={{ MenuProps: rentFlowSelectMenuProps }}
                        className="col-span-2 xl:col-span-1"
                        sx={Herotextfield}
                      >
                        <MenuItem value="All">ทั้งหมด</MenuItem>
                        {carTypes.map((t) => (
                          <MenuItem key={t} value={t}>
                            {getCarTypeLabel(t)}
                          </MenuItem>
                        ))}
                      </TextField>

                      <Button
                        size="large"
                        variant="contained"
                        className="col-span-2 min-h-12! w-full rounded-full! px-8! text-base! xl:col-span-1 xl:w-auto"
                        sx={{
                          minWidth: "180px !important",
                          whiteSpace: "nowrap",
                        }}
                        onClick={handleSearch}
                      >
                        ค้นหารถว่าง
                      </Button>
                    </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

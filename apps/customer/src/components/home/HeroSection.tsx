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
  Stack,
} from "@mui/material";

import { Herotextfield } from "@/src/components/hero/Herotextfield";
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

  q: string;
  setQ: (v: string) => void;

  carTypes: readonly CarType[];
  locations: readonly LocationOption[];
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
  q,
  setQ,
  carTypes,
  locations,
}: Props) {
  const router = useRouter();
  const today = getTodayLocalDate();
  const minReturnDate = getMinReturnDate(pickupDate);
  const [heroIndex, setHeroIndex] = React.useState(0);
  const [highlightAnnouncement, setHighlightAnnouncement] = React.useState(true);
  const [loadedHeroImages, setLoadedHeroImages] = React.useState<string[]>([]);

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
    if (q.trim()) params.set("q", q.trim());
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
          transition: "background-color .7s ease",
        }}
      >
        <Container maxWidth="lg">
          <Box className="flex min-h-11 items-center justify-center px-2 py-2 text-center sm:px-3 sm:py-1">
            <Typography
              component="div"
              className="apple-announcement-text max-w-4xl tracking-[-0.016em]"
              sx={{
                color: highlightAnnouncement ? "white" : "var(--rf-apple-ink)",
                transition: "color .7s ease",
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
                      "opacity .3s ease, color .7s ease, text-decoration-color .7s ease",
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
                  แล้วรับความช่วยเหลือจากทีมงาน พร้อมบริการจองที่ง่ายขึ้นและตัวเลือกรถอีกมากมาย
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
              whiteSpace: { xs: "normal", md: "normal" },
              lineHeight: { xs: 1.08, md: 1.06 },
              fontSize: {
                md: "clamp(2.55rem, 2.05rem + 1.55vw, 3.55rem)",
                lg: "clamp(3rem, 2.55rem + 1.2vw, 4.05rem)",
              },
            }}
          >
            <Box component="span" sx={{ display: "block" }}>
              รถที่ใช่ สำหรับทุกการเดินทาง
            </Box>
            <Box component="span" sx={{ display: "block" }}>
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
            spacing={1}
            className="mt-7 flex-wrap justify-center"
            useFlexGap
          >
            {["ราคาชัดเจน", "เลือกรับรถได้หลายสาขา", "พร้อมเดินทาง"].map(
              (label) => (
                <Chip
                  key={label}
                  label={label}
                  className="apple-pill h-9! px-2! text-[var(--rf-apple-muted)]!"
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
                      เลือกช่วงเวลา สาขา และรุ่นที่ต้องการ
                    </Typography>
                  </Box>

                  <Box className="grid gap-4">
                    <Box className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.08fr_1fr_1fr]">
                      <TextField
                        select
                        id="home-search-pickup-branch"
                        name="pickupBranch"
                        label="สาขารับรถ"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        fullWidth
                        InputLabelProps={{ htmlFor: undefined }}
                        SelectProps={{ MenuProps: rentFlowSelectMenuProps }}
                        sx={Herotextfield}
                      >
                        <MenuItem value="">ทุกสาขา</MenuItem>
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
                        inputProps={{ min: today }}
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
                        inputProps={{ min: minReturnDate }}
                        sx={Herotextfield}
                      />
                    </Box>

                    <Box className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr_auto] lg:items-stretch">
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
                        sx={Herotextfield}
                      >
                        <MenuItem value="All">ทั้งหมด</MenuItem>
                        {carTypes.map((t) => (
                          <MenuItem key={t} value={t}>
                            {getCarTypeLabel(t)}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        id="home-search-car-model"
                        name="carModel"
                        label="ค้นหาชื่อรุ่น"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="เช่น Yaris, Cross..."
                        fullWidth
                        sx={Herotextfield}
                      />

                      <Button
                        size="large"
                        variant="contained"
                        className="min-h-12! rounded-full! px-10! text-base! max-lg:w-full lg:min-w-[190px]"
                        onClick={handleSearch}
                      >
                        ค้นหารถว่าง
                      </Button>
                    </Box>
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

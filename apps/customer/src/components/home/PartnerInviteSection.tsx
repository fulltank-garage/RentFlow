"use client";

import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import { Box, Button, Container, Typography } from "@mui/material";

const PARTNER_POINTS = [
  {
    icon: <StorefrontRoundedIcon />,
    title: "มีหน้าร้านออนไลน์ของตัวเอง",
    desc: "แสดงโลโก้ ชื่อร้าน สาขา รถ และช่องทางติดต่อให้ลูกค้าเห็นครบ",
  },
  {
    icon: <DashboardCustomizeRoundedIcon />,
    title: "จัดการรถและการจองง่ายขึ้น",
    desc: "ดูรายการจอง เพิ่มรถ ตั้งค่าร้าน และตรวจสอบสถานะได้จากหลังบ้านเดียว",
  },
  {
    icon: <PaymentsRoundedIcon />,
    title: "รองรับหลักฐานชำระเงิน",
    desc: "ให้ลูกค้าแนบสลิป แล้วร้านตรวจสอบรายการชำระเงินได้เร็วขึ้น",
  },
];

const START_STEPS = [
  {
    title: "1. ส่งข้อมูลร้าน",
    desc: "แจ้งชื่อร้าน สาขา รถที่ให้เช่า และช่องทางติดต่อที่ต้องการแสดง",
  },
  {
    title: "2. ตั้งค่าหน้าร้าน",
    desc: "ทีมงานช่วยจัดหน้าร้านออนไลน์ให้พร้อมใช้งาน หรือร้านแก้ไขเองจากหลังบ้านได้",
  },
  {
    title: "3. เริ่มรับจอง",
    desc: "ลูกค้าดูรถ เลือกวันรับ-คืน และติดต่อจองผ่านช่องทางที่ร้านเลือกไว้",
  },
];

export default function PartnerInviteSection() {
  return (
    <Container maxWidth="lg" className="apple-section pt-0!">
      <Box className="apple-card overflow-hidden!">
        <Box className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <Box className="p-5 sm:p-7 lg:p-8">
            <Typography className="apple-heading text-3xl font-black tracking-[-0.05em] text-(--rf-apple-ink) sm:text-4xl lg:text-5xl">
              เปิดหน้าร้านเช่ารถออนไลน์ โดยไม่ต้องทำระบบเอง
            </Typography>
            <Typography className="mt-4 max-w-2xl text-base leading-7 text-(--rf-apple-muted) sm:text-lg">
              RentFlowCar ช่วยให้ร้านเช่ารถมีหน้าร้านออนไลน์สำหรับแสดงรถ
              สาขา ราคา และช่องทางรับจอง โดยร้านไม่ต้องเริ่มสร้างเว็บไซต์หรือระบบหลังบ้านเองตั้งแต่ศูนย์
            </Typography>

            <Box className="mt-7 grid gap-3">
              {START_STEPS.map((step) => (
                <Box
                  key={step.title}
                  className="rounded-[24px] bg-(--rf-apple-surface-soft) px-5 py-4"
                >
                  <Typography className="text-base font-black tracking-[-0.03em] text-(--rf-apple-ink)">
                    {step.title}
                  </Typography>
                  <Typography className="mt-1 text-sm leading-6 text-(--rf-apple-muted)">
                    {step.desc}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box className="mt-5 rounded-[24px] border border-black/10 bg-white px-5 py-4">
              <Typography className="text-base font-black tracking-[-0.03em] text-(--rf-apple-ink)">
                เหมาะกับร้านที่อยากรับจองออนไลน์ แต่ยังอยากให้ลูกค้าคุยกับร้านได้เหมือนเดิม
              </Typography>
              <Typography className="mt-2 text-sm leading-6 text-(--rf-apple-muted)">
                ร้านเลือกได้ว่าจะให้ลูกค้าจองผ่านการชำระเงิน หรือจองผ่านแชท Facebook Page ของร้าน
                เพื่อให้เข้ากับวิธีทำงานจริงของร้านมากที่สุด
              </Typography>
            </Box>

            <Box className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                component={Link}
                href="https://www.facebook.com/BAAWORK"
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                className="rounded-full! px-6! font-semibold!"
              >
                ติดต่อเพื่อเข้าร่วมแพลตฟอร์ม
              </Button>
              <Button
                component={Link}
                href="/features"
                variant="outlined"
                size="large"
                className="rounded-full! px-6! font-semibold!"
              >
                ดูระบบที่ร้านจะได้ใช้
              </Button>
            </Box>
          </Box>

          <Box
            className="border-t border-black/10 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8"
            sx={{
              backgroundColor:
                "color-mix(in srgb, var(--rf-apple-blue) 5%, white)",
            }}
          >
            <Box className="mb-5 flex items-center justify-between gap-4">
              <Box>
                <Typography className="text-sm font-bold text-(--rf-apple-muted)">
                  ตัวอย่างหลังบ้านร้าน
                </Typography>
                <Typography className="mt-1 text-2xl font-black tracking-[-0.04em] text-(--rf-apple-ink)">
                  จัดการร้านได้ในที่เดียว
                </Typography>
              </Box>
              <Box className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] bg-white text-(--rf-apple-blue)">
                <DashboardCustomizeRoundedIcon className="text-3xl!" />
              </Box>
            </Box>

            <Box className="grid gap-3">
              {PARTNER_POINTS.map((point, index) => (
                <Box
                  key={point.title}
                  className="flex gap-3 rounded-[24px] bg-white p-4"
                >
                  <Box
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
                    sx={{
                      backgroundColor:
                        index === 1
                          ? "color-mix(in srgb, var(--secondary-navy) 9%, white)"
                          : "color-mix(in srgb, var(--rf-apple-blue) 12%, white)",
                      color:
                        index === 1
                          ? "var(--secondary-navy)"
                          : "var(--rf-apple-blue)",
                    }}
                  >
                    {point.icon}
                  </Box>
                  <Box className="min-w-0">
                    <Typography className="font-black tracking-[-0.03em] text-(--rf-apple-ink)">
                      {point.title}
                    </Typography>
                    <Typography className="mt-1 text-sm leading-6 text-(--rf-apple-muted)">
                      {point.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

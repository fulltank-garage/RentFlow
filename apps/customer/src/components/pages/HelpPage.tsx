"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Button, Chip, Container, Typography } from "@mui/material";
import HelpPageSkeleton from "@/src/components/help/HelpPageSkeleton";

const QUICK_GUIDES = [
  {
    title: "ค้นหารถที่เหมาะกับทริป",
    description:
      "เลือกสาขารับรถ วันรับ-คืนรถ และประเภทรถก่อน ระบบจะแสดงรถที่ตรงเงื่อนไขให้เปรียบเทียบง่ายขึ้น",
  },
  {
    title: "ตรวจรายละเอียดก่อนจอง",
    description:
      "ดูจำนวนที่นั่ง ระบบเกียร์ เชื้อเพลิง ราคาเริ่มต้น และร้านให้เช่าก่อนกดจอง เพื่อให้ตรงกับแผนเดินทาง",
  },
  {
    title: "กรอกข้อมูลการจองให้ครบ",
    description:
      "ระบุจุดรับ-คืนรถ เวลาเดินทาง ข้อมูลผู้จอง และตรวจยอดรวมอีกครั้งก่อนส่งคำขอจอง",
  },
];

const FAQ_ITEMS = [
  {
    question: "ต้องเตรียมอะไรบ้างก่อนจองรถ?",
    answer:
      "เตรียมวันรับรถ วันคืนรถ สาขาที่สะดวก จำนวนผู้โดยสาร และงบประมาณคร่าว ๆ เพื่อช่วยให้เลือกรถได้เร็วขึ้น",
  },
  {
    question: "หลังจองแล้วดูสถานะได้ที่ไหน?",
    answer:
      "เข้าเมนูรายการจองของฉันเพื่อดูสถานะล่าสุด รายละเอียดรถ วันรับ-คืนรถ และข้อมูลการชำระเงินของรายการนั้น",
  },
  {
    question: "ถ้าต้องเปลี่ยนวันหรือสาขารับรถควรทำอย่างไร?",
    answer:
      "เตรียมรหัสการจอง วันรับ-คืนรถเดิม และรายละเอียดที่ต้องการเปลี่ยน แล้วติดต่อร้านหรือทีมงานผ่านหน้าติดต่อเรา",
  },
  {
    question: "ทำไมบางคันถึงจองไม่ได้?",
    answer:
      "รถอาจไม่พร้อมให้บริการในช่วงวันที่เลือก จำนวนรถคงเหลือไม่พอ หรือร้านปิดรับจองชั่วคราว ลองเปลี่ยนวัน สาขา หรือประเภทรถอีกครั้ง",
  },
  {
    question: "ต้องติดต่อทีมงานเมื่อไหร่?",
    answer:
      "ติดต่อเมื่อมีปัญหาที่แก้เองไม่ได้ เช่น เปลี่ยนข้อมูลหลังจอง ยืนยันเวลารับรถ สอบถามเงื่อนไขร้าน หรือพบข้อมูลการจองไม่ถูกต้อง",
  },
  {
    question: "ควรแนบข้อมูลอะไรเมื่อติดต่อ?",
    answer:
      "แนบรหัสการจอง ชื่อผู้จอง เบอร์โทร วันรับ-คืนรถ สาขาที่เกี่ยวข้อง และรายละเอียดปัญหา เพื่อให้ทีมงานตรวจสอบได้เร็ว",
  },
];

const SELF_SERVICE_LINKS = [
  { label: "ค้นหารถ", href: "/cars" },
  { label: "รายการจองของฉัน", href: "/my-bookings" },
  { label: "ติดต่อเรา", href: "/contact" },
];

export default function HelpPage() {
  const [minimumLoading, setMinimumLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setMinimumLoading(false);
    }, 500);

    return () => window.clearTimeout(timer);
  }, []);

  if (minimumLoading) {
    return <HelpPageSkeleton />;
  }

  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section">
        <Box className="apple-section-intro max-w-3xl">
          <Box className="flex flex-col gap-3">
            <Typography className="apple-heading apple-page-title">
              ศูนย์ช่วยเหลือ
            </Typography>
            <Typography className="apple-subtitle text-lg">
              รวมคำแนะนำการค้นหา จอง และจัดการรถเช่าเบื้องต้น ก่อนติดต่อทีมงาน
            </Typography>
          </Box>
        </Box>

        <Box className="mt-8 flex flex-wrap justify-center gap-3">
          <Chip
            label="คู่มือใช้งาน"
            variant="outlined"
            className="apple-pill text-(--rf-apple-muted)!"
          />
          <Chip
            label="คำถามที่พบบ่อย"
            variant="outlined"
            className="apple-pill text-(--rf-apple-muted)!"
          />
          <Chip
            label="แก้ปัญหาเบื้องต้น"
            variant="outlined"
            className="apple-pill text-(--rf-apple-muted)!"
          />
        </Box>

        <Box className="mt-10">
          <Typography className="apple-card-title-lg font-black text-(--rf-apple-ink)">
            เริ่มจากตรงนี้
          </Typography>
          <Typography className="apple-body-sm mt-1 max-w-3xl text-(--rf-apple-muted)">
            ขั้นตอนหลักที่ช่วยให้ค้นหาและจองรถได้เร็วขึ้นโดยไม่ต้องรอทีมงานตอบกลับ
          </Typography>

          <Box className="mt-5 grid gap-4 md:grid-cols-3">
            {QUICK_GUIDES.map((item, index) => (
              <Box
                key={item.title}
                className="apple-card flex h-full flex-col p-5"
              >
                <Box className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-(--rf-apple-ink) text-sm font-black text-white">
                  {index + 1}
                </Box>
                <Typography className="apple-card-title font-bold text-(--rf-apple-ink)">
                  {item.title}
                </Typography>
                <Typography className="apple-body-sm mt-2 text-(--rf-apple-muted)">
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="mt-10">
          <Typography className="apple-card-title-lg font-black text-(--rf-apple-ink)">
            คำถามที่พบบ่อย
          </Typography>
          <Typography className="apple-body-sm mt-1 max-w-3xl text-(--rf-apple-muted)">
            คำตอบสั้น ๆ สำหรับเรื่องที่ผู้เช่ารถมักต้องการรู้ก่อนและหลังส่งคำขอจอง
          </Typography>

          <Box className="mt-5 grid gap-4 md:grid-cols-2">
            {FAQ_ITEMS.map((item) => (
              <Box key={item.question} className="apple-card p-5">
                <Typography className="apple-card-title font-bold text-(--rf-apple-ink)">
                  {item.question}
                </Typography>
                <Typography className="apple-body-sm mt-2 text-(--rf-apple-muted)">
                  {item.answer}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="apple-card mt-10 p-5">
          <Box className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Box>
              <Typography className="apple-card-title font-bold text-(--rf-apple-ink)">
                ยังต้องให้ทีมงานช่วยดูต่อ?
              </Typography>
              <Typography className="apple-body-sm mt-1 max-w-2xl text-(--rf-apple-muted)">
                ถ้าลองเช็กข้อมูลแล้วยังไม่ชัดเจน ให้ไปที่หน้าติดต่อเราเพื่อดูช่องทางติดต่อและเตรียมข้อมูลให้ครบก่อนส่งเรื่อง
              </Typography>
            </Box>

            <Box className="flex flex-wrap gap-2">
              {SELF_SERVICE_LINKS.map((item, index) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  variant={index === SELF_SERVICE_LINKS.length - 1 ? "contained" : "outlined"}
                  className="rounded-full! font-semibold!"
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

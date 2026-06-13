"use client";

import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import PrivacyTableOfContents from "@/src/components/privacy/PrivacyTableOfContents";
import PrivacyContent from "@/src/components/privacy/PrivacyContent";
import PrivacyPageSkeleton from "@/src/components/privacy/PrivacyPageSkeleton";
import usePageReady from "@/src/hooks/usePageReady";

const sections = [
  { id: "overview", title: "1) ภาพรวม" },
  { id: "collect", title: "2) ข้อมูลที่เราเก็บ" },
  { id: "use", title: "3) วัตถุประสงค์การใช้ข้อมูล" },
  { id: "share", title: "4) การเปิดเผยข้อมูล" },
  { id: "cookies", title: "5) คุกกี้และการติดตาม" },
  { id: "security", title: "6) ความปลอดภัย" },
  { id: "rights", title: "7) สิทธิของเจ้าของข้อมูล" },
  { id: "retain", title: "8) ระยะเวลาการเก็บรักษา" },
  { id: "contact", title: "9) ติดต่อเรา" },
];

export default function PrivacyPage() {
  const ready = usePageReady();
  const updatedAt = "22 กุมภาพันธ์ 2569";

  if (!ready) {
    return <PrivacyPageSkeleton />;
  }

  return (
    <Box className="apple-page">
      <Box aria-hidden className="pointer-events-none fixed inset-0" />

      <Container maxWidth="lg" className="apple-section relative">
        <Box className="apple-section-intro max-w-3xl">
          <Box className="flex flex-col gap-4">
            <Typography
              className="apple-heading apple-section-title"
            >
              นโยบายความเป็นส่วนตัว
            </Typography>
            <Typography className="apple-subtitle text-lg">
              แนวทางการดูแล การใช้ และการคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้งาน RentFlow
            </Typography>
          </Box>

          <Box className="mt-6 flex flex-wrap justify-center gap-3">
            <Chip
              size="small"
              label={`อัปเดตล่าสุด: ${updatedAt}`}
              className="apple-pill text-[var(--rf-apple-muted)]!"
            />
            <Chip
              size="small"
              label="ครอบคลุมการใช้งานบัญชี การจอง และข้อมูลการติดต่อ"
              className="apple-pill text-[var(--rf-apple-muted)]!"
            />
          </Box>
        </Box>

        <Card
          elevation={0}
          className="apple-card mt-10"
        >
          <CardContent className="p-5! md:p-7!">
            <Box className="apple-card apple-card-no-hover rounded-[26px] bg-[var(--rf-apple-surface-soft)] p-4! md:p-5!">
              <Typography className="text-sm font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
                สรุปสั้น ๆ
              </Typography>
              <Typography className="mt-2 text-sm leading-6 text-[var(--rf-apple-muted)]">
                เราเก็บและใช้ข้อมูลเท่าที่จำเป็นต่อการให้บริการ การยืนยันตัวตน การจอง
                การติดต่อช่วยเหลือ และการดูแลความปลอดภัยของระบบ
              </Typography>
            </Box>

            <Divider className="my-6! border-black/10!" />

            <PrivacyTableOfContents sections={sections} />

            <Divider className="my-6! border-black/10!" />

            <PrivacyContent />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

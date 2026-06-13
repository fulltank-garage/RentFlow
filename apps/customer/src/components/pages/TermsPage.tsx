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
import TermsTableOfContents from "@/src/components/terms/TermsTableOfContents";
import TermsContent from "@/src/components/terms/TermsContent";
import TermsPageSkeleton from "@/src/components/terms/TermsPageSkeleton";
import usePageReady from "@/src/hooks/usePageReady";

const sections = [
  { id: "intro", title: "1) ข้อตกลงเบื้องต้น" },
  { id: "account", title: "2) บัญชีผู้ใช้" },
  { id: "booking", title: "3) การจองและการชำระเงิน" },
  { id: "cancel", title: "4) การยกเลิก / คืนเงิน" },
  { id: "use", title: "5) การใช้งานที่เหมาะสม" },
  { id: "liability", title: "6) ข้อจำกัดความรับผิด" },
  { id: "changes", title: "7) การเปลี่ยนแปลงเงื่อนไข" },
  { id: "contact", title: "8) ติดต่อเรา" },
];

export default function TermsPage() {
  const ready = usePageReady();
  const updatedAt = "22 กุมภาพันธ์ 2569";

  if (!ready) {
    return <TermsPageSkeleton />;
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
              เงื่อนไขการใช้งาน
            </Typography>
            <Typography className="apple-subtitle text-lg">
              ข้อกำหนดสำหรับการใช้บริการ RentFlow โปรดอ่านก่อนเริ่มใช้งาน
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
              label="มีผลกับการใช้งานเว็บไซต์และการจองทั้งหมด"
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
                การใช้งานบริการต่อไปหมายถึงคุณยอมรับเงื่อนไขเหล่านี้ รวมถึงข้อกำหนดด้านการจอง
                การชำระเงิน การยกเลิก และการใช้งานบัญชีผู้ใช้
              </Typography>
            </Box>

            <Divider className="my-6! border-black/10!" />

            <TermsTableOfContents sections={sections} />

            <Divider className="my-6! border-black/10!" />

            <TermsContent />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

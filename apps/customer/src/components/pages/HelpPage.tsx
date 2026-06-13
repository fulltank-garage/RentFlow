"use client";

import Link from "next/link";
import {
  Alert,
  Box,
  Container,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import ContactInfoCard from "@/src/components/contact/ContactInfoCard";
import HelpPageSkeleton from "@/src/components/help/HelpPageSkeleton";
import { useBranchDirectory } from "@/src/hooks/branches/useBranchDirectory";

export default function HelpPage() {
  const { branches, loading, error } = useBranchDirectory();
  const activeBranches = branches.filter((branch) => branch.isActive).length;
  const phoneReadyCount = branches.filter((branch) => branch.phone).length;

  if (loading) {
    return <HelpPageSkeleton />;
  }

  return (
    <Box className="apple-page">
    <Container maxWidth="lg" className="apple-section">
      <Box className="apple-section-intro max-w-3xl">
        <Box className="flex flex-col gap-3">
          <Typography
            className="apple-heading apple-page-title"
          >
            ศูนย์ช่วยเหลือ
          </Typography>
          <Typography className="apple-subtitle text-lg">
            ตรวจสอบสถานะการจอง ติดต่อสาขา หรือส่งรายละเอียดให้ทีมงานช่วยดูแล
          </Typography>
        </Box>
      </Box>

      <Box className="mt-8 flex flex-wrap justify-center gap-3">
        <Chip
          label={`${activeBranches} สาขาพร้อมให้บริการ`}
          variant="outlined"
          className="apple-pill text-[var(--rf-apple-muted)]!"
        />
        <Chip
          label={`${phoneReadyCount} เบอร์โทรสำหรับติดต่อ`}
          variant="outlined"
          className="apple-pill text-[var(--rf-apple-muted)]!"
        />
      </Box>

      {error ? (
        <Alert severity="warning" className="mt-6 rounded-2xl!">
          {error}
        </Alert>
      ) : null}

      <Box className="apple-shelf mt-6 md:grid md:grid-cols-3">
        <Box className="apple-card p-5">
          <Typography className="text-sm font-semibold text-[var(--rf-apple-ink)]">
            1. ตรวจสอบสถานะการจอง
          </Typography>
          <Typography className="mt-2 text-sm text-[var(--rf-apple-muted)]">
            เริ่มจากหน้ารายการจองเพื่อดูสถานะล่าสุดและรหัสการจองของคุณ
          </Typography>
        </Box>

        <Box className="apple-card p-5">
          <Typography className="text-sm font-semibold text-[var(--rf-apple-ink)]">
            2. ติดต่อสาขาที่เกี่ยวข้อง
          </Typography>
          <Typography className="mt-2 text-sm text-[var(--rf-apple-muted)]">
            เลือกสาขาที่รับหรือคืนรถ เพื่อให้ทีมงานช่วยเหลือได้ตรงจุด
          </Typography>
        </Box>

        <Box className="apple-card p-5">
          <Typography className="text-sm font-semibold text-[var(--rf-apple-ink)]">
            3. เตรียมรายละเอียดให้พร้อม
          </Typography>
          <Typography className="mt-2 text-sm text-[var(--rf-apple-muted)]">
            แจ้งรหัสการจอง วันรับ-คืนรถ และรายละเอียดปัญหาที่พบ
          </Typography>
        </Box>
      </Box>

      <Box className="mt-6">
        <ContactInfoCard
          branches={branches}
          title="สาขาและช่องทางช่วยเหลือ"
          description="เลือกช่องทางที่สะดวกสำหรับติดต่อทีมงาน"
        />
      </Box>

      <Box className="apple-card mt-10 p-5">
        <Typography className="text-base font-bold text-[var(--rf-apple-ink)]">
          ต้องการความช่วยเหลือเพิ่มเติม?
        </Typography>
        <Typography className="mt-1 text-sm text-[var(--rf-apple-muted)]">
          ไปที่หน้าติดต่อเราเพื่อดูช่องทางการติดต่อและข้อมูลสาขา
        </Typography>

        <Box className="mt-4 flex flex-wrap gap-2">
          <Button
            component={Link}
            href="/my-bookings"
            variant="outlined"
            className="rounded-full!"
          >
            ดูรายการจอง
          </Button>
          <Button
            component={Link}
            href="/contact"
            variant="contained"
            className="rounded-full! font-semibold!"
          >
            ติดต่อเรา
          </Button>
        </Box>
      </Box>
    </Container>
    </Box>
  );
}

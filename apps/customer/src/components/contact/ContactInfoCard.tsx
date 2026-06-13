"use client";

import {
  Box,
  Typography,
  Chip,
} from "@mui/material";
import type { Branch } from "@/src/services/branches/branches.types";

function formatBranchHours(branch: Branch) {
  if (branch.openTime && branch.closeTime) {
    return `${branch.openTime} - ${branch.closeTime}`;
  }

  if (branch.openTime) return `เปิด ${branch.openTime}`;
  if (branch.closeTime) return `ปิด ${branch.closeTime}`;

  return "โปรดติดต่อสาขาเพื่อยืนยันเวลาเปิด-ปิด";
}

export default function ContactInfoCard({
  branches,
  title = "ช่องทางติดต่อ",
  description = "เลือกสาขาที่สะดวกสำหรับการรับบริการ",
}: {
  branches: Branch[];
  title?: string;
  description?: string;
}) {
  return (
    <Box>
      <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
        {title}
      </Typography>
      <Typography className="apple-body-sm mt-1 text-[var(--rf-apple-muted)]">
        {description}
      </Typography>

      {branches.length ? (
        <Box className="mt-5 space-y-4">
          {branches.map((branch) => (
            <Box
              key={branch.id}
              className="apple-card rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4"
            >
              <Box className="flex flex-wrap items-start justify-between gap-3">
                <Box>
                  <Typography className="apple-card-title font-semibold text-[var(--rf-apple-ink)]">
                    {branch.name}
                  </Typography>
                  {branch.shopName ? (
                    <Typography className="apple-label-text mt-1 text-[var(--rf-apple-muted)]">
                      ร้าน {branch.shopName}
                    </Typography>
                  ) : null}
                </Box>

                <Box className="flex flex-wrap gap-2">
                  {branch.name ? (
                    <Chip
                      size="small"
                      label={branch.name}
                      className="!border-0 !bg-slate-100 !text-slate-700"
                    />
                  ) : null}
                  <Chip
                    size="small"
                    label={branch.isActive ? "พร้อมให้บริการ" : "ปิดใช้งาน"}
                    className={
                      branch.isActive
                        ? "!border-0 !bg-green-500 !text-white"
                        : "!border-0 !bg-rose-500 !text-white"
                    }
                  />
                </Box>
              </Box>

              <Box className="mt-4 space-y-3">
                <Box>
                  <Typography className="apple-label-text font-semibold text-[var(--rf-apple-ink)]">
                    ที่อยู่
                  </Typography>
                  <Typography className="apple-body-sm text-[var(--rf-apple-muted)]">
                    {branch.address || "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography className="apple-label-text font-semibold text-[var(--rf-apple-ink)]">
                    โทรศัพท์
                  </Typography>
                  <Typography className="apple-body-sm text-[var(--rf-apple-muted)]">
                    {branch.phone || "ยังไม่มีเบอร์โทร"}
                  </Typography>
                </Box>

                <Box>
                  <Typography className="apple-label-text font-semibold text-[var(--rf-apple-ink)]">
                    เวลาเปิด-ปิด
                  </Typography>
                  <Typography className="apple-body-sm text-[var(--rf-apple-muted)]">
                    {formatBranchHours(branch)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box className="apple-body-sm mt-5 rounded-[18px] border border-dashed border-black/10 bg-[var(--rf-apple-surface-soft)] p-5 text-[var(--rf-apple-muted)]">
          ยังไม่พบสาขาให้ติดต่อในตอนนี้
        </Box>
      )}

      <Box className="apple-card mt-5 rounded-[18px] bg-[var(--rf-apple-surface-soft)] p-4">
        <Typography className="apple-label-text font-semibold text-[var(--rf-apple-ink)]">
          ทิป
        </Typography>
        <Typography className="apple-label-text mt-1 text-[var(--rf-apple-muted)]">
          หากติดต่อเรื่องการจอง แนะนำแนบรหัสการจอง วันรับ-คืนรถ
          และสาขาที่เกี่ยวข้อง จะช่วยให้ทีมงานดูแลได้เร็วขึ้น
        </Typography>
      </Box>
    </Box>
  );
}

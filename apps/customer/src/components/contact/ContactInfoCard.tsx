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
      <Typography className="apple-card-title font-bold tracking-[-0.03em] text-(--rf-apple-ink)">
        {title}
      </Typography>
      <Typography className="apple-body-sm mt-1 text-(--rf-apple-muted)">
        {description}
      </Typography>

      {branches.length ? (
        <Box className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {branches.map((branch) => (
            <Box
              key={branch.id}
              className="apple-card relative flex h-full flex-col rounded-[18px] bg-(--rf-apple-surface-soft) p-4"
            >
              <Chip
                size="small"
                label={branch.isActive ? "พร้อมให้บริการ" : "ปิดให้บริการ"}
                className={`absolute right-4 top-4! z-1 h-6! rounded-full! px-0.5! text-[11px]! font-bold! shadow-none! [&_.MuiChip-label]:px-2! ${
                  branch.isActive
                    ? "border-0! bg-green-500! text-(--white)!"
                    : "border-0! bg-rose-500! text-(--primary-navy)!"
                }`}
              />

              <Box className="flex items-start">
                <Box className="min-w-0 pr-32">
                  <Typography className="apple-card-title font-semibold text-(--rf-apple-ink)">
                    {branch.shopName || branch.name}
                  </Typography>
                  {branch.name && branch.shopName ? (
                    <Typography className="apple-label-text mt-1 text-(--rf-apple-muted)">
                      สาขา {branch.name}
                    </Typography>
                  ) : null}
                </Box>

              </Box>

              <Box className="mt-4 flex flex-1 flex-col gap-3 border-t border-(--rf-apple-border) pt-4">
                <Box>
                  <Typography className="apple-label-text font-semibold text-(--rf-apple-ink)">
                    ที่อยู่
                  </Typography>
                  <Typography className="apple-body-sm text-(--rf-apple-muted)">
                    {branch.address || "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography className="apple-label-text font-semibold text-(--rf-apple-ink)">
                    โทรศัพท์
                  </Typography>
                  <Typography className="apple-body-sm text-(--rf-apple-muted)">
                    {branch.phone || "ยังไม่มีเบอร์โทร"}
                  </Typography>
                </Box>

                <Box>
                  <Typography className="apple-label-text font-semibold text-(--rf-apple-ink)">
                    เวลาเปิด-ปิด
                  </Typography>
                  <Typography className="apple-body-sm text-(--rf-apple-muted)">
                    {formatBranchHours(branch)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box className="apple-body-sm mt-5 rounded-[18px] border border-black/10 bg-(--rf-apple-surface-soft) p-5 text-(--rf-apple-muted)">
          ยังไม่พบสาขาให้ติดต่อในตอนนี้
        </Box>
      )}
    </Box>
  );
}

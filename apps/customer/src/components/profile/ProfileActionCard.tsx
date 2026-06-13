"use client";

import * as React from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  clearCachedSessionUser,
  logout as logoutRequest,
} from "@/src/services/auth/auth.service";

export default function ProfileActionCard({
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
}: {
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();

  const handleLogout = React.useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // ปล่อยให้กลับหน้าหลักได้แม้คำขอออกจากระบบไม่สำเร็จ
    }

    clearCachedSessionUser();
    router.push("/");
    router.refresh();
  }, [router]);

  return (
    <Box className="apple-card p-5 md:p-6">
      <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
        จัดการบัญชี
      </Typography>

      <Box className="mt-5 grid gap-3">
        {!isEditing ? (
          <Button
            fullWidth
            variant="contained"
            className="rounded-full! py-2.5! font-semibold!"
            onClick={onStartEdit}
          >
            แก้ไขข้อมูล
          </Button>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              className="rounded-full! py-2.5! font-semibold!"
              onClick={onSave}
            >
              บันทึกข้อมูล
            </Button>

            <Button
              fullWidth
              variant="outlined"
              className="rounded-full! py-2.5!"
              onClick={onCancel}
            >
              ยกเลิก
            </Button>
          </>
        )}

        <Button
          fullWidth
          variant="outlined"
          className="rounded-full! py-2.5!"
          onClick={() => router.push("/")}
        >
          กลับหน้าหลัก
        </Button>
      </Box>

      <Divider className="my-4! border-black/10!" />

      <Box className="space-y-3">
        <Box className="flex items-center justify-between">
          <Typography className="text-sm text-[var(--rf-apple-muted)]">บัญชี</Typography>
          <Typography className="text-sm font-semibold text-[var(--rf-apple-ink)]">
            ใช้งานได้
          </Typography>
        </Box>
      </Box>

      <Divider className="my-4! border-black/10!" />

      <Button
        fullWidth
        variant="contained"
        className="rounded-full! bg-rose-500! py-2.5! font-semibold! text-white! hover:bg-rose-600!"
        sx={{
          backgroundColor: "rgb(244 63 94) !important",
          color: "#fff !important",
          boxShadow: "none !important",
          "&:hover": {
            backgroundColor: "rgb(225 29 72) !important",
            boxShadow: "none !important",
          },
        }}
        onClick={handleLogout}
      >
        ออกจากระบบ
      </Button>
    </Box>
  );
}

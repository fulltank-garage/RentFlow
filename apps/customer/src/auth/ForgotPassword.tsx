"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AppSnackbar, {
  type AppSnackbarSeverity,
} from "@/src/components/common/AppSnackbar";
import PasswordVisibilityAdornment from "@/src/components/common/PasswordVisibilityAdornment";
import ForgotPasswordCardSkeleton from "@/src/components/auth/ForgotPasswordCardSkeleton";
import { getErrorMessage } from "@/src/lib/api-error";
import usePageReady from "@/src/hooks/usePageReady";
import { resetPasswordWithUsername } from "@/src/services/auth/auth.service";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: AppSnackbarSeverity;
};

const fieldSX = {
  "& .MuiOutlinedInput-root": { borderRadius: "18px" },
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const ready = usePageReady();
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const canSubmit =
    username.trim().length >= 3 &&
    phone.trim().length >= 9 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  const closeSnackbar = React.useCallback(
    (_?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") return;
      setSnackbar((prev) => ({ ...prev, open: false }));
    },
    []
  );

  const showSnackbar = React.useCallback(
    (message: string, severity: AppSnackbarSeverity = "info") => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!canSubmit || loading) return;

      setLoading(true);

      try {
        await resetPasswordWithUsername(
          {
            username: username.trim(),
            phone: phone.trim(),
            newPassword,
          },
          "ไม่สามารถเปลี่ยนรหัสผ่านได้"
        );

        showSnackbar(
          "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว กำลังพาไปหน้าเข้าสู่ระบบ...",
          "success"
        );

        window.setTimeout(() => {
          router.push("/login");
        }, 450);
      } catch (err: unknown) {
        showSnackbar(getErrorMessage(err, "ไม่สามารถเปลี่ยนรหัสผ่านได้"), "error");
        setLoading(false);
      }
    },
    [canSubmit, loading, newPassword, phone, router, showSnackbar, username]
  );

  if (!ready) {
    return <ForgotPasswordCardSkeleton />;
  }

  return (
    <Box className="apple-page">
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />

      <Container maxWidth="sm" className="apple-section relative">
        <Card
          elevation={0}
          className="apple-card w-full"
          sx={{ backdropFilter: "blur(6px)" }}
        >
          <CardContent className="p-5! sm:p-6! md:p-8!">
            <Stack className="mb-6 items-center text-center">
              <Box className="mb-4 flex items-center justify-center">
                <Box className="relative h-16 w-48 sm:w-56">
                  <Image
                    src="/RentFlowCar.png"
                    alt="RentFlowCar Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </Box>
              </Box>
            </Stack>

            <Stack spacing={1} className="mb-4 items-center text-center">
              <Typography
                className="apple-heading apple-auth-title"
              >
                ลืมรหัสผ่าน
              </Typography>

              <Typography className="apple-subtitle text-sm">
                กรอกชื่อผู้ใช้ เบอร์โทรศัพท์ และตั้งรหัสผ่านใหม่พร้อมยืนยันรหัสผ่าน
              </Typography>
            </Stack>

            <Divider className="my-5! border-black/10!" />

            <Box component="form" onSubmit={handleSubmit} className="grid gap-4">
              <TextField
                id="forgot-password-username"
                name="username"
                label="ชื่อผู้ใช้"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                fullWidth
                sx={fieldSX}
              />

              <TextField
                id="forgot-password-phone"
                name="phone"
                label="เบอร์โทรศัพท์"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                type="tel"
                fullWidth
                sx={fieldSX}
                helperText="ใช้เบอร์ที่บันทึกไว้ในบัญชี"
              />

              <TextField
                id="forgot-password-new-password"
                name="newPassword"
                label="รหัสผ่านใหม่"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                fullWidth
                sx={fieldSX}
                helperText="อย่างน้อย 8 ตัวอักษร"
                InputProps={{
                  endAdornment: (
                    <PasswordVisibilityAdornment
                      visible={showNewPassword}
                      onToggle={() => setShowNewPassword((prev) => !prev)}
                    />
                  ),
                }}
              />

              <TextField
                id="forgot-password-confirm-password"
                name="confirmPassword"
                label="ยืนยันรหัสผ่านใหม่"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                fullWidth
                error={!!confirmPassword && newPassword !== confirmPassword}
                helperText={
                  confirmPassword && newPassword !== confirmPassword
                    ? "รหัสผ่านไม่ตรงกัน"
                    : " "
                }
                sx={fieldSX}
                InputProps={{
                  endAdornment: (
                    <PasswordVisibilityAdornment
                      visible={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword((prev) => !prev)}
                    />
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!canSubmit || loading}
                className="rounded-full! font-semibold!"
                sx={{
                  minHeight: 52,
                }}
              >
                {loading ? (
                  <Box className="flex items-center gap-2">
                    <CircularProgress size={18} thickness={5} color="inherit" />
                    <span>กำลังดำเนินการ...</span>
                  </Box>
                ) : (
                  "เปลี่ยนรหัสผ่าน"
                )}
              </Button>

              <Box className="flex items-center justify-center gap-1.5 text-sm text-(--rf-apple-muted)">
                <span>กลับไปที่หน้า</span>
                <Link
                  href="/login"
                  className="font-semibold text-(--rf-apple-blue)"
                  style={{
                    textDecorationLine: "underline",
                    textDecorationThickness: "1.5px",
                    textUnderlineOffset: "2px",
                  }}
                >
                  เข้าสู่ระบบ
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { authService } from "@/src/services/auth/auth.service";
import { RentFlowCarApiError } from "@/src/services/core/api-client.service";
import { tenantService } from "@/src/services/tenant/tenant.service";
import { writeStoreProfile } from "@/src/lib/partner-store";

const loginFieldSX = {
  "& .MuiOutlinedInput-root": {
    minHeight: "3.35rem",
    alignItems: "center",
  },
  "& .MuiOutlinedInput-input": {
    height: "auto",
    paddingTop: "0.95rem !important",
    paddingBottom: "0.95rem !important",
    lineHeight: "1.35",
  },
  "& .MuiInputLabel-root:not(.MuiInputLabel-shrink)": {
    transform: "translate(18px, 15px) scale(1)",
  },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px white inset",
    WebkitTextFillColor: "inherit",
    caretColor: "inherit",
    transition: "background-color 9999s ease-out 0s",
  },
};

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const usernameOk = username.length === 0 ? true : username.trim().length >= 3;
  const pwOk = password.length === 0 ? true : password.length >= 6;
  const canSubmit = username.trim().length >= 3 && password.length >= 6 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง");
      return;
    }

    try {
      setLoading(true);

      await authService.login({
        username: username.trim(),
        password,
      });

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/partner/dashboard";
      const safeNext = next.startsWith("/partner") ? next : "/partner/dashboard";

      try {
        const tenant = await tenantService.getMyTenant({ force: true });
        writeStoreProfile({
          tenantId: tenant.id,
          shopName: tenant.shopName,
          domainSlug: tenant.domainSlug,
          storefrontDomain: tenant.publicDomain,
          ownerEmail: tenant.ownerEmail,
          status: tenant.status,
          plan: tenant.plan,
          logoUrl: tenant.logoUrl,
          promoImageUrl: tenant.promoImageUrl,
          createdAt: tenant.createdAt,
          updatedAt: tenant.updatedAt,
        });
        router.replace(safeNext);
      } catch (tenantError) {
        if (
          tenantError instanceof RentFlowCarApiError &&
          tenantError.status === 404
        ) {
          router.replace("/partner/store-setup");
          return;
        }
        throw tenantError;
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--rf-partner-bg)] px-4 py-8 md:px-6"
      sx={{
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.86) 46%, rgba(255,255,255,0.62) 100%), url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2200&q=85')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Box className="relative z-10 mx-auto grid w-full max-w-5xl items-center justify-center gap-5 lg:grid-cols-2">
        <Card elevation={0} className="partner-card order-2 flex w-full rounded-[34px]! bg-white/82! lg:order-1 lg:aspect-square">
          <CardContent className="flex w-full flex-col gap-6 p-6! md:p-8!">
            <Box className="partner-page-header">
              <Typography className="partner-page-title partner-login-title">
                จัดการร้าน รถ{" "}
                <span className="whitespace-nowrap">และการจองในที่เดียว</span>
              </Typography>
              <Typography className="partner-page-subtitle">
                หลังบ้านสำหรับดูแลร้าน รถ การจอง และการชำระเงินในที่เดียว
              </Typography>
            </Box>

            <Divider className="border-white/70!" />

            <Stack spacing={1.35}>
              {[
                "ตั้งค่าร้านและโดเมน",
                "จัดการรถ สาขา และการจอง",
                "ใช้งานง่ายทุกขนาดหน้าจอ",
              ].map((item) => (
                <Box
                  key={item}
                  className="rounded-[22px] border border-white/60 bg-white/46 p-4 backdrop-blur-[2px] md:p-4"
                >
                  <Typography className="text-sm font-medium leading-7 text-slate-600">
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          className="partner-card order-1 flex w-full overflow-hidden rounded-[34px]! border-slate-200! bg-white! shadow-[0_28px_80px_rgba(15,23,42,0.16)]! lg:order-2 lg:aspect-square"
        >
          <CardContent className="grid w-full content-start gap-4 p-6! pb-7! md:p-8! md:pb-9!">
            <Box className="mx-auto grid h-16 w-48 place-items-center md:h-20 md:w-56">
              <Image
                src="/RentFlowCar.png"
                alt="RentFlowCar"
                width={220}
                height={112}
                priority
                className="h-full w-full object-contain"
              />
            </Box>

            <Stack spacing={1.5} className="items-center text-center">
              <Typography className="partner-section-title">
                เข้าสู่ระบบศูนย์จัดการร้าน
              </Typography>
              <Typography className="partner-section-subtitle">
                ใช้บัญชีร้านของคุณเพื่อเข้าสู่ระบบ
              </Typography>
            </Stack>

            <Divider className="border-white/70!" />

            <Box className="min-h-[54px]">
              {error ? (
                <Alert
                  severity="error"
                  className="rounded-[22px]! py-1!"
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              ) : null}
            </Box>

            <Box component="form" onSubmit={handleSubmit} className="grid gap-4">
              <TextField
                label="ชื่อผู้ใช้"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                sx={loginFieldSX}
                autoComplete="username"
                error={!usernameOk}
                helperText={!usernameOk ? "ชื่อผู้ใช้อย่างน้อย 3 ตัวอักษร" : undefined}
              />

              <TextField
                label="รหัสผ่าน"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={loginFieldSX}
                autoComplete="current-password"
                error={!pwOk}
                helperText={!pwOk ? "อย่างน้อย 6 ตัวอักษร" : undefined}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => setShowPw((v) => !v)}
                        className="min-h-0! px-0! py-0! text-sm! font-semibold! text-slate-500!"
                        sx={{
                          minWidth: 0,
                          backgroundColor: "transparent !important",
                          "&:hover": {
                            backgroundColor: "transparent !important",
                          },
                        }}
                      >
                        {showPw ? "ซ่อน" : "แสดง"}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit}
                className="rounded-full! font-semibold!"
              >
                {loading ? (
                  <Stack direction="row" className="items-center gap-2">
                    <CircularProgress size={18} color="inherit" />
                    <span>กำลังเข้าสู่ระบบ...</span>
                  </Stack>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

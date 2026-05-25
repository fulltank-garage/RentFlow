"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAdminRealtimeRefresh } from "@/src/hooks/realtime/useAdminRealtimeRefresh";
import { partnersService } from "@/src/services/partners/partners.service";
import type {
  CreatePartnerPayload,
  PlatformTenant,
  PlatformTenantStatus,
} from "@/src/services/partners/partners.types";
import { AdminListRowsSkeleton } from "@/src/components/admin/AdminLoadingSkeletons";

const initialForm: CreatePartnerPayload = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  shopName: "",
  domainSlug: "",
  plan: "starter",
  status: "pending",
};

const planLabels: Record<string, string> = {
  starter: "เริ่มต้น",
  growth: "เติบโต",
  enterprise: "องค์กร",
};

const statusLabels: Record<PlatformTenantStatus, string> = {
  active: "ใช้งานอยู่",
  pending: "รอตรวจสอบ",
  suspended: "ระงับชั่วคราว",
  rejected: "ไม่อนุมัติ",
};

function validateUsername(value: string) {
  const username = value.trim().toLowerCase();
  if (!username) return "กรุณากรอกชื่อผู้ใช้";
  if (username.length < 3 || username.length > 32) {
    return "ชื่อผู้ใช้ต้องมีความยาว 3-32 ตัวอักษร";
  }
  if (username.includes("@")) return "ชื่อผู้ใช้ต้องไม่อยู่ในรูปแบบอีเมล";
  if (!/^[a-z0-9._-]+$/.test(username)) {
    return "ใช้ได้เฉพาะ a-z, 0-9, จุด, ขีดกลาง และขีดล่าง";
  }
  return "";
}

function validateDomainSlug(value: string) {
  const slug = value.trim().toLowerCase();
  if (!slug) return "กรุณากรอกชื่อโดเมนร้าน";
  if (slug.length < 3 || slug.length > 32) {
    return "ชื่อโดเมนต้องมีความยาว 3-32 ตัวอักษร";
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return "ใช้ได้เฉพาะ a-z, 0-9 และขีดกลาง โดยไม่ขึ้นต้นหรือปิดท้ายด้วยขีดกลาง";
  }
  return "";
}

function validatePhone(value?: string) {
  const phone = value?.trim() || "";
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 10) {
    return "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก";
  }
  return "";
}

function statusChipClass(status: PlatformTenantStatus) {
  if (status === "active") return "admin-chip-green";
  if (status === "pending") return "admin-chip-orange";
  return "admin-chip-rose";
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function PartnersPage() {
  const [partners, setPartners] = React.useState<PlatformTenant[]>([]);
  const [form, setForm] = React.useState<CreatePartnerPayload>(initialForm);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [snackOpen, setSnackOpen] = React.useState(false);
  const formErrors = React.useMemo(
    () => ({
      username: validateUsername(form.username),
      password:
        form.password.length === 0
          ? "กรุณากรอกรหัสผ่าน"
          : form.password.length < 8
            ? "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
            : "",
      firstName:
        form.firstName.trim().length < 2 ? "กรุณากรอกชื่อจริงอย่างน้อย 2 ตัวอักษร" : "",
      lastName:
        form.lastName.trim().length < 2 ? "กรุณากรอกนามสกุลอย่างน้อย 2 ตัวอักษร" : "",
      phone: validatePhone(form.phone),
      shopName: form.shopName.trim() ? "" : "กรุณากรอกชื่อร้าน",
      domainSlug: validateDomainSlug(form.domainSlug),
    }),
    [form]
  );
  const canCreate = React.useMemo(
    () => Object.values(formErrors).every((message) => !message),
    [formErrors]
  );

  const loadPartners = React.useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      const response = await partnersService.listPartners();
      setPartners(response.items);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลเจ้าของร้านได้"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPartners();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadPartners]);

  useAdminRealtimeRefresh({
    events: [
      "tenant.updated",
      "booking.created",
      "booking.updated",
      "payment.created",
      "payment.updated",
      "member.changed",
    ],
    onRefresh: loadPartners,
  });

  function updateForm<K extends keyof CreatePartnerPayload>(
    key: K,
    value: CreatePartnerPayload[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function createPartner(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canCreate) {
      setError("กรุณาตรวจสอบข้อมูลในฟอร์มให้ถูกต้องก่อนสร้างเจ้าของร้าน");
      return;
    }
    setSubmitting(true);
    try {
      setError("");
      await partnersService.createPartner({
        ...form,
        username: form.username.trim().toLowerCase(),
        domainSlug: form.domainSlug.trim().toLowerCase(),
      });
      setForm(initialForm);
      setSnackOpen(true);
      await loadPartners();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถสร้างเจ้าของร้านได้"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box className="admin-page">
      <Box className="admin-page-header">
        <Typography className="admin-page-title">เจ้าของร้าน</Typography>
        <Typography className="admin-page-subtitle">
          เพิ่มบัญชีเจ้าของร้าน สร้างหน้าร้าน และกำหนด subdomain ให้พร้อมใช้งานจากระบบกลาง
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Card elevation={0} className="admin-card rounded-[2rem]!">
        <CardContent className="p-5! md:p-7!">
          <Stack spacing={3}>
            <Box>
              <Typography className="admin-section-title">
                เพิ่มเจ้าของร้านใหม่
              </Typography>
              <Typography className="admin-section-subtitle mt-1">
                ระบบจะสร้างบัญชีเข้าสู่ระบบ Partner พร้อมร้านและโดเมนของร้านให้ทันที
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={createPartner}
              className="grid gap-4 lg:grid-cols-2"
              autoComplete="off"
              noValidate
            >
              <TextField
                required
                id="partner-owner-username"
                name="partnerOwnerUsername"
                label="ชื่อผู้ใช้"
                value={form.username}
                onChange={(event) => updateForm("username", event.target.value)}
                autoComplete="off"
                error={Boolean(form.username && formErrors.username)}
                helperText={form.username ? formErrors.username || "ใช้สำหรับเข้าสู่ระบบ Partner" : "ใช้สำหรับเข้าสู่ระบบ Partner"}
              />
              <TextField
                required
                id="partner-owner-password"
                name="partnerOwnerPassword"
                type="password"
                label="รหัสผ่าน"
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
                autoComplete="new-password"
                error={Boolean(form.password && formErrors.password)}
                helperText={form.password ? formErrors.password || "อย่างน้อย 8 ตัวอักษร" : "อย่างน้อย 8 ตัวอักษร"}
              />
              <TextField
                required
                id="partner-owner-first-name"
                name="partnerOwnerFirstName"
                label="ชื่อจริง"
                value={form.firstName}
                onChange={(event) =>
                  updateForm("firstName", event.target.value)
                }
                autoComplete="off"
                error={Boolean(form.firstName && formErrors.firstName)}
                helperText={form.firstName ? formErrors.firstName || " " : " "}
              />
              <TextField
                required
                id="partner-owner-last-name"
                name="partnerOwnerLastName"
                label="นามสกุลจริง"
                value={form.lastName}
                onChange={(event) => updateForm("lastName", event.target.value)}
                autoComplete="off"
                error={Boolean(form.lastName && formErrors.lastName)}
                helperText={form.lastName ? formErrors.lastName || " " : " "}
              />
              <TextField
                id="partner-owner-phone"
                name="partnerOwnerPhone"
                label="เบอร์โทร"
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value)}
                autoComplete="off"
                inputMode="numeric"
                error={Boolean(form.phone && formErrors.phone)}
                helperText={form.phone ? formErrors.phone || " " : " "}
              />
              <TextField
                required
                id="partner-shop-name"
                name="partnerShopName"
                label="ชื่อร้าน"
                value={form.shopName}
                onChange={(event) => updateForm("shopName", event.target.value)}
                autoComplete="off"
                error={Boolean(form.shopName && formErrors.shopName)}
                helperText={form.shopName ? formErrors.shopName || " " : " "}
              />
              <TextField
                required
                id="partner-shop-domain"
                name="partnerShopDomain"
                label="ชื่อโดเมนร้าน"
                value={form.domainSlug}
                onChange={(event) =>
                  updateForm("domainSlug", event.target.value)
                }
                autoComplete="off"
                error={Boolean(form.domainSlug && formErrors.domainSlug)}
                helperText={
                  form.domainSlug
                    ? formErrors.domainSlug || "ตัวอย่าง carflow จะได้ carflow.rentflow.com"
                    : "ตัวอย่าง carflow จะได้ carflow.rentflow.com"
                }
              />
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  select
                  label="แพ็กเกจ"
                  value={form.plan}
                  onChange={(event) => updateForm("plan", event.target.value)}
                  className="w-full"
                >
                  <MenuItem value="starter">เริ่มต้น</MenuItem>
                  <MenuItem value="growth">เติบโต</MenuItem>
                  <MenuItem value="enterprise">องค์กร</MenuItem>
                </TextField>
                <TextField
                  select
                  label="สถานะเริ่มต้น"
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value as PlatformTenantStatus
                    )
                  }
                  className="w-full"
                >
                  <MenuItem value="pending">รอตรวจสอบ</MenuItem>
                  <MenuItem value="active">ใช้งานอยู่</MenuItem>
                  <MenuItem value="suspended">ระงับชั่วคราว</MenuItem>
                </TextField>
              </Stack>

              <Box className="lg:col-span-2">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || !canCreate}
                  className="w-full md:w-auto md:min-w-56"
                >
                  {submitting ? "กำลังสร้าง..." : "สร้างเจ้าของร้าน"}
                </Button>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={0} className="admin-card rounded-[2rem]!">
        <CardContent className="p-0!">
          {loading ? (
            <Box className="p-5">
              <AdminListRowsSkeleton rows={5} />
            </Box>
          ) : partners.length === 0 ? (
            <Box className="admin-empty m-5">
              <Typography>ยังไม่มีเจ้าของร้านในระบบ</Typography>
            </Box>
          ) : (
            partners.map((partner, index) => (
              <Box key={partner.id} className={index === 0 ? "p-5" : "px-5 pb-5"}>
                <Box className="admin-surface-soft grid gap-4 rounded-[26px] p-4 lg:grid-cols-[1.2fr_0.8fr_auto] lg:items-center">
                  <Box>
                    <Typography className="text-lg font-extrabold text-slate-950">
                      {partner.ownerName || partner.ownerEmail}
                    </Typography>
                    <Typography className="mt-1 text-sm text-slate-500">
                      {partner.ownerEmail} • {partner.shopName}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography className="text-xs font-semibold text-slate-400">
                      หน้าร้าน
                    </Typography>
                    <Typography className="mt-1 text-sm font-semibold text-slate-900">
                      {partner.publicDomain}
                    </Typography>
                    <Typography className="mt-1 text-xs text-slate-500">
                      {planLabels[partner.plan] || partner.plan} • สร้างเมื่อ{" "}
                      {formatDate(partner.createdAt)}
                    </Typography>
                  </Box>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ xs: "stretch", sm: "center" }}
                  >
                    <Chip
                      label={statusLabels[partner.status] || partner.status}
                      className={`admin-chip ${statusChipClass(partner.status)}`}
                    />
                    <Button
                      href={`https://${partner.publicDomain}`}
                      target="_blank"
                      variant="outlined"
                    >
                      เปิดหน้าร้าน
                    </Button>
                  </Stack>
                </Box>
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackOpen(false)}>
          สร้างเจ้าของร้านสำเร็จ
        </Alert>
      </Snackbar>
    </Box>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { getErrorMessage, getErrorStatus } from "@/src/lib/api-error";
import usePageReady from "@/src/hooks/usePageReady";

import AppSnackbar, {
  type AppSnackbarSeverity,
} from "@/src/components/common/AppSnackbar";
import ProfileActionCard from "@/src/components/profile/ProfileActionCard";
import ProfilePageSkeleton from "@/src/components/profile/ProfilePageSkeleton";
import ProfileSectionCard from "@/src/components/profile/ProfileSectionCard";
import { ProfileField } from "@/src/components/profile/ProfileField";
import {
  clearCachedSessionUser,
  getCachedSessionUser,
} from "@/src/services/auth/auth.service";
import type { Customer } from "@/src/services/auth/auth.types";
import { usersApi } from "@/src/services/users/users.service";

type ProfileData = {
  avatarUrl: string;
  displayName: string;
  username: string;
  phone: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
};

type FieldKey = keyof ProfileData;

type FieldConfig = {
  label: string;
  key: FieldKey;
  type?: React.InputHTMLAttributes<unknown>["type"];
  editable?: boolean;
  placeholder?: string;
};

const ACCOUNT_FIELDS: FieldConfig[] = [
  {
    label: "ชื่อที่แสดง",
    key: "displayName",
    editable: true,
    placeholder: "กรอกชื่อที่แสดง",
  },
  {
    label: "ชื่อผู้ใช้",
    key: "username",
    editable: false,
  },
  {
    label: "เบอร์โทรศัพท์",
    key: "phone",
    editable: true,
    placeholder: "กรอกเบอร์โทรศัพท์",
  },
];

function formatDateTime(value: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getProfileDisplayName(user: {
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return user.name || fullName || user.username || "";
}

function mapUserToProfileData(user: Customer): ProfileData {
  return {
    avatarUrl: user.avatarUrl || "",
    displayName: getProfileDisplayName(user),
    username: user.username || "",
    phone: user.phone || "",
    provider: "RentFlow",
    createdAt: formatDateTime(user.createdAt || ""),
    updatedAt: formatDateTime(user.updatedAt || ""),
  };
}

function ProfileFieldsGrid({
  fields,
  profile,
  draft,
  isEditing,
  onDraftChange,
  columns = "md:grid-cols-2",
}: {
  fields: FieldConfig[];
  profile: ProfileData;
  draft: ProfileData;
  isEditing: boolean;
  onDraftChange: (key: keyof ProfileData, value: string) => void;
  columns?: string;
}) {
  return (
    <Box className={`grid gap-3 ${columns}`}>
      {fields.map((field) => {
        const currentValue = String(
          isEditing ? draft[field.key] ?? "" : profile[field.key] ?? ""
        );
        const mode = isEditing && field.editable !== false ? "edit" : "view";

        return (
          <ProfileField
            key={field.key}
            label={field.label}
            value={currentValue}
            mode={mode}
            type={field.type}
            disabled={field.editable === false}
            placeholder={field.placeholder}
            onChange={(value) => onDraftChange(field.key, value)}
          />
        );
      })}
    </Box>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const ready = usePageReady();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [passwordSaving, setPasswordSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AppSnackbarSeverity;
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [profile, setProfile] = React.useState<ProfileData | null>(null);
  const [draft, setDraft] = React.useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [avatarFileName, setAvatarFileName] = React.useState("");
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [passwordDraft, setPasswordDraft] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const showSnackbar = React.useCallback(
    (message: string, severity: AppSnackbarSeverity = "success") => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  const closeSnackbar = React.useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") return;
      setSnackbar((prev) => ({ ...prev, open: false }));
    },
    []
  );

  React.useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const cachedUser = getCachedSessionUser();
        if (cachedUser) {
          const cachedProfile = mapUserToProfileData(cachedUser);
          setProfile(cachedProfile);
          setDraft(cachedProfile);
          setError(null);
        }

        const res = await usersApi.getMe();
        if (cancelled) return;

        const nextProfile = mapUserToProfileData(res.data);

        setProfile(nextProfile);
        setDraft(nextProfile);
        setError(null);
      } catch (err: unknown) {
        if (cancelled) return;

        if (getErrorStatus(err) === 401) {
          const cachedUser = getCachedSessionUser();
          if (cachedUser) {
            clearCachedSessionUser();
          }

          router.replace("/login?redirect=/profile");
          return;
        }

        setError(getErrorMessage(err, "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้"));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleStartEdit = React.useCallback(() => {
    if (!profile) return;
    setDraft(profile);
    setAvatarFile(null);
    setAvatarFileName("");
    setIsEditing(true);
  }, [profile]);

  const handleCancel = React.useCallback(() => {
    if (!profile) return;
    setDraft(profile);
    setIsEditing(false);
    setAvatarFileName("");
    setAvatarFile(null);
    setError(null);
  }, [profile]);

  const handleAvatarFileChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("รูปโปรไฟล์ต้องมีขนาดไม่เกิน 5 เมกะไบต์");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setDraft((prev) =>
            prev ? { ...prev, avatarUrl: reader.result as string } : prev
          );
          setAvatarFile(file);
          setAvatarFileName(file.name);
          setError(null);
        }
      };
      reader.onerror = () => {
        setError("ไม่สามารถอ่านไฟล์รูปโปรไฟล์ได้");
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleSave = React.useCallback(async () => {
    if (!draft || !profile) return;

    setSaving(true);
    setError(null);

    try {
      const avatarChanged = draft.avatarUrl.trim() !== profile.avatarUrl.trim();
      const shouldClearAvatar =
        !avatarFile && Boolean(profile.avatarUrl) && !draft.avatarUrl.trim();
      const payload = {
        name: draft.displayName.trim(),
        phone: draft.phone.trim(),
        ...(avatarFile ? { avatarFile } : {}),
        ...(shouldClearAvatar ? { clearAvatar: true } : {}),
        ...(avatarChanged && !avatarFile && !shouldClearAvatar
          ? { avatarUrl: draft.avatarUrl.trim() }
          : {}),
      };

      const res = await usersApi.updateMe(payload);

      const nextProfile: ProfileData = {
        avatarUrl: res.data.avatarUrl || "",
        displayName: getProfileDisplayName(res.data),
        username: res.data.username || draft.username,
        phone: res.data.phone || "",
        provider: "RentFlow",
        createdAt: profile?.createdAt || "-",
        updatedAt: formatDateTime(res.data.updatedAt || ""),
      };

      setProfile(nextProfile);
      setDraft(nextProfile);
      setAvatarFileName("");
      setAvatarFile(null);
      setIsEditing(false);
      showSnackbar("บันทึกข้อมูลโปรไฟล์สำเร็จ", "success");
    } catch (err: unknown) {
      if (getErrorStatus(err) === 401) {
        clearCachedSessionUser();
        router.replace("/login?redirect=/profile");
        return;
      }

      setError(getErrorMessage(err, "ไม่สามารถบันทึกข้อมูลโปรไฟล์ได้"));
    } finally {
      setSaving(false);
    }
  }, [avatarFile, draft, profile, router, showSnackbar]);

  const handleDraftChange = React.useCallback(
    (key: keyof ProfileData, value: string) => {
      setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    []
  );

  const handlePasswordDraftChange = React.useCallback(
    (key: "currentPassword" | "newPassword" | "confirmPassword", value: string) => {
      setPasswordDraft((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleChangePassword = React.useCallback(async () => {
    setPasswordError(null);

    if (!passwordDraft.currentPassword.trim()) {
      setPasswordError("กรุณากรอกรหัสผ่านปัจจุบัน");
      return;
    }

    if (!passwordDraft.newPassword.trim()) {
      setPasswordError("กรุณากรอกรหัสผ่านใหม่");
      return;
    }

    if (passwordDraft.newPassword.length < 6) {
      setPasswordError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (passwordDraft.newPassword !== passwordDraft.confirmPassword) {
      setPasswordError("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setPasswordSaving(true);

    try {
      await usersApi.changePassword({
        currentPassword: passwordDraft.currentPassword,
        newPassword: passwordDraft.newPassword,
      });

      setPasswordDraft({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showSnackbar("เปลี่ยนรหัสผ่านสำเร็จ", "success");
    } catch (err: unknown) {
      setPasswordError(getErrorMessage(err, "ไม่สามารถเปลี่ยนรหัสผ่านได้"));
    } finally {
      setPasswordSaving(false);
    }
  }, [passwordDraft, showSnackbar]);

  if (!ready || loading || !profile || !draft) {
    return <ProfilePageSkeleton />;
  }

  return (
    <Box className="apple-page">
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />

      <Container maxWidth="lg" className="apple-section">
        <Box className="apple-section-intro mb-10 max-w-3xl md:mb-12">
          <Box className="flex flex-col gap-3">
          <Typography
            component="h1"
            className="apple-heading apple-page-title"
          >
            โปรไฟล์ของฉัน
          </Typography>
          <Typography
            className="apple-subtitle text-lg"
            sx={{
              textAlign: "center",
              textWrap: "balance",
            }}
          >
            จัดการข้อมูลบัญชีและรายละเอียดติดต่อของคุณในที่เดียว
          </Typography>
          </Box>
        </Box>

        <Box className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
          <Box className="grid gap-5">
            {error ? (
              <Alert severity="error" className="rounded-2xl!">
                {error}
              </Alert>
            ) : null}

            <ProfileSectionCard
              title="ข้อมูลบัญชี"
            >
              <Box className="rounded-[22px] bg-[var(--rf-apple-surface-soft)] px-4 py-4 md:px-5">
                <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Box className="flex min-w-0 items-center gap-4">
                    <Avatar
                      src={draft.avatarUrl || undefined}
                      className="h-16! w-16! bg-[var(--rf-apple-ink)]! text-xl! font-bold! text-white!"
                    >
                      {draft.displayName?.charAt(0) || "ผ"}
                    </Avatar>
                    <Box className="min-w-0">
                      <Typography className="apple-label-text mb-1 font-medium uppercase text-[var(--rf-apple-muted)]">
                        รูปโปรไฟล์
                      </Typography>
                      <Typography className="wrap-break-word text-base font-bold leading-7 text-[var(--rf-apple-ink)]">
                        {avatarFileName || (draft.avatarUrl ? "มีรูปโปรไฟล์แล้ว" : "ยังไม่มีรูปโปรไฟล์")}
                      </Typography>
                    </Box>
                  </Box>

                  {isEditing ? (
                    <Box className="flex flex-wrap gap-2">
                      <Button
                        component="label"
                        variant="outlined"
                        className="rounded-full! px-4! font-semibold!"
                      >
                        เลือกรูป
                        <input
                          hidden
                          id="profile-avatar-upload"
                          name="profileAvatar"
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          onChange={handleAvatarFileChange}
                        />
                      </Button>
                      {draft.avatarUrl ? (
                        <Button
                          variant="text"
                          color="error"
                          className="rounded-full! px-4! font-semibold!"
                          onClick={() => {
                            setDraft((prev) =>
                              prev ? { ...prev, avatarUrl: "" } : prev
                            );
                            setAvatarFileName("");
                            setAvatarFile(null);
                          }}
                        >
                          ลบรูป
                        </Button>
                      ) : null}
                    </Box>
                  ) : null}
                </Box>
              </Box>

              <ProfileFieldsGrid
                fields={ACCOUNT_FIELDS}
                profile={profile}
                draft={draft}
                isEditing={isEditing}
                onDraftChange={handleDraftChange}
                columns="grid-cols-1"
              />
            </ProfileSectionCard>

            <ProfileSectionCard title="เปลี่ยนรหัสผ่าน">
              <Typography className="apple-body-sm text-[var(--rf-apple-muted)]">
                อัปเดตรหัสผ่านของบัญชีนี้ได้จากส่วนนี้ทันที
              </Typography>

              {passwordError ? (
                <Alert severity="error" className="rounded-2xl!">
                  {passwordError}
                </Alert>
              ) : null}

              <Box className="grid gap-3">
                <ProfileField
                  label="รหัสผ่านปัจจุบัน"
                  value={passwordDraft.currentPassword}
                  mode="edit"
                  type="password"
                  placeholder="กรอกรหัสผ่านปัจจุบัน"
                  onChange={(value) =>
                    handlePasswordDraftChange("currentPassword", value)
                  }
                />
                <ProfileField
                  label="รหัสผ่านใหม่"
                  value={passwordDraft.newPassword}
                  mode="edit"
                  type="password"
                  placeholder="กรอกรหัสผ่านใหม่"
                  onChange={(value) =>
                    handlePasswordDraftChange("newPassword", value)
                  }
                />
                <ProfileField
                  label="ยืนยันรหัสผ่านใหม่"
                  value={passwordDraft.confirmPassword}
                  mode="edit"
                  type="password"
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  onChange={(value) =>
                    handlePasswordDraftChange("confirmPassword", value)
                  }
                />
              </Box>

              <Box className="flex justify-end">
                <Button
                  variant="contained"
                  className="rounded-full! px-5! font-semibold!"
                  onClick={handleChangePassword}
                  disabled={passwordSaving}
                >
                  {passwordSaving ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
                </Button>
              </Box>
            </ProfileSectionCard>
          </Box>

          <Box className="order-first space-y-5 lg:order-none">
            {saving ? (
              <Box className="apple-card flex items-center justify-center p-6">
                <CircularProgress size={22} />
              </Box>
            ) : null}

            <ProfileActionCard
              isEditing={isEditing}
              onStartEdit={handleStartEdit}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

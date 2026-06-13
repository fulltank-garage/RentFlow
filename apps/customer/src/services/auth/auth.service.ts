import api from "@/src/lib/axios";
import { getErrorMessage } from "@/src/lib/api-error";
import {
  deleteClientCookie,
  readClientCookie,
  writeClientCookie,
} from "@/src/lib/client-cookie";
import { normalizeAuthResponse, normalizeCustomer } from "./auth.mapper";
import type {
  AuthResponse,
  Customer,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
} from "./auth.types";

const AUTH_USER_STORAGE_KEY = "rf_session_user_v1";
const AUTH_TOKEN_STORAGE_KEY = "rf_session_token_v1";
export const AUTH_SESSION_CHANGED_EVENT = "rentflow:session-changed";

function canUseStorage() {
  return typeof window !== "undefined";
}

function sanitizeCustomer(user: Customer): Customer {
  return normalizeCustomer({
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })!;
}

function notifySessionChanged(user: Customer | null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_CHANGED_EVENT, {
      detail: { user },
    })
  );
}

export function getCachedSessionUser(): Customer | null {
  if (!canUseStorage()) return null;

  try {
    const raw = readClientCookie(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Customer | null;
    return parsed && parsed.id ? normalizeCustomer(parsed) || null : null;
  } catch {
    return null;
  }
}

export function getCachedSessionToken() {
  if (!canUseStorage()) return "";
  return readClientCookie(AUTH_TOKEN_STORAGE_KEY);
}

export function setCachedSessionToken(token: string | null | undefined) {
  if (!canUseStorage()) return;

  const trimmedToken = token?.trim();
  if (!trimmedToken) {
    deleteClientCookie(AUTH_TOKEN_STORAGE_KEY);
    return;
  }

  writeClientCookie(AUTH_TOKEN_STORAGE_KEY, trimmedToken, {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "Strict",
  });
}

export function setCachedSessionUser(user: Customer | null) {
  if (!canUseStorage()) return;

  try {
    if (!user) {
      deleteClientCookie(AUTH_USER_STORAGE_KEY);
      deleteClientCookie(AUTH_TOKEN_STORAGE_KEY);
      notifySessionChanged(null);
      return;
    }

    writeClientCookie(
      AUTH_USER_STORAGE_KEY,
      JSON.stringify(sanitizeCustomer(user)),
      { maxAge: 60 * 60 * 24 * 7, sameSite: "Strict" }
    );
    notifySessionChanged(sanitizeCustomer(user));
  } catch {
    // no-op
  }
}

export function clearCachedSessionUser() {
  setCachedSessionUser(null);
}

export async function loginWithPassword(
  payload: LoginPayload,
  fallbackMessage = "เข้าสู่ระบบไม่สำเร็จ"
): Promise<AuthResponse> {
  try {
    const res = await api.post("/auth/login", payload);
    const normalized = normalizeAuthResponse(res.data);
    setCachedSessionToken(normalized.data?.sessionToken);
    setCachedSessionUser(normalized.data?.user ?? null);
    return normalized;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, fallbackMessage));
  }
}

export async function registerWithPassword(
  payload: RegisterPayload,
  fallbackMessage = "สมัครสมาชิกไม่สำเร็จ"
): Promise<AuthResponse> {
  try {
    const name = `${payload.firstName} ${payload.lastName}`.trim();
    const res = await api.post("/auth/register", {
      ...payload,
      name,
    });
    const normalized = normalizeAuthResponse(res.data);
    setCachedSessionToken(normalized.data?.sessionToken);
    setCachedSessionUser(normalized.data?.user ?? null);
    return normalized;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, fallbackMessage));
  }
}

export async function resetPasswordWithUsername(
  payload: ForgotPasswordPayload,
  fallbackMessage = "รีเซ็ตรหัสผ่านไม่สำเร็จ"
): Promise<AuthResponse> {
  try {
    const res = await api.post("/auth/forgot-password", payload);

    return normalizeAuthResponse(res.data);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, fallbackMessage));
  }
}

export async function logout(
  fallbackMessage = "ออกจากระบบไม่สำเร็จ"
): Promise<{ success?: boolean; message?: string }> {
  try {
    const res = await api.post("/auth/logout");
    clearCachedSessionUser();
    return res.data;
  } catch (error: unknown) {
    clearCachedSessionUser();
    throw new Error(getErrorMessage(error, fallbackMessage));
  }
}

export async function getMe(
  fallbackMessage = "ดึงข้อมูลผู้ใช้ไม่สำเร็จ"
): Promise<AuthResponse> {
  try {
    const res = await api.get("/auth/me");
    return normalizeAuthResponse(res.data);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, fallbackMessage));
  }
}

export async function getSessionUser(
  fallbackMessage = "ดึงข้อมูลผู้ใช้ไม่สำเร็จ"
): Promise<Customer | null> {
  const response = await getMe(fallbackMessage);
  const user = response.data?.user ?? null;
  setCachedSessionUser(user);
  return user;
}

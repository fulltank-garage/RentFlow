import { resolveRentFlowAssetUrl } from "@/src/lib/runtime-api-url";
import type { AuthResponse, Customer } from "./auth.types";

type LegacyAuthResponse = {
  success?: boolean;
  message?: string;
  sessionToken?: string;
  token?: string;
  user?: Customer;
  data?: Customer | { user?: Customer; sessionToken?: string; token?: string };
};

export function normalizeCustomer(
  user?: Customer | null
): Customer | undefined {
  if (!user) return undefined;

  return {
    ...user,
    avatarUrl: resolveRentFlowAssetUrl(user.avatarUrl),
  };
}

export function normalizeAuthResponse(
  raw: AuthResponse | LegacyAuthResponse | null
): AuthResponse {
  if (!raw) return {};

  const data = raw.data;

  if (data && "user" in data) {
    return {
      success: raw.success,
      message: raw.message,
      data: data.user
        ? {
            user: normalizeCustomer(data.user)!,
            sessionToken: data.sessionToken || data.token,
          }
        : undefined,
    };
  }

  if (data && "id" in data) {
    return {
      success: raw.success,
      message: raw.message,
      data: { user: normalizeCustomer(data)! },
    };
  }

  if ("user" in raw && raw.user) {
    return {
      success: raw.success,
      message: raw.message,
      data: {
        user: normalizeCustomer(raw.user)!,
        sessionToken: raw.sessionToken || raw.token,
      },
    };
  }

  return {
    success: raw.success,
    message: raw.message,
  };
}

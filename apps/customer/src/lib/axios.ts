import axios, { AxiosHeaders } from "axios";
import { getRentFlowTenantHeaders } from "@/src/lib/tenant";
import { getRentFlowApiBaseUrl } from "@/src/lib/runtime-api-url";
import { readClientCookie } from "@/src/lib/client-cookie";

const AUTH_TOKEN_STORAGE_KEY = "rf_session_token_v1";

const api = axios.create({
  baseURL:
    typeof window !== "undefined" ? "/api/rentflow" : getRentFlowApiBaseUrl(),
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-RentFlow-App": "storefront",
  },
});

api.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);
  config.baseURL =
    typeof window !== "undefined" ? "/api/rentflow" : getRentFlowApiBaseUrl();

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    headers.delete("Content-Type");
  }

  headers.set("X-RentFlow-App", "storefront");

  if (typeof window !== "undefined" && !headers.has("Authorization")) {
    const sessionToken = readClientCookie(AUTH_TOKEN_STORAGE_KEY);
    if (sessionToken) {
      headers.set("Authorization", `Bearer ${sessionToken}`);
    }
  }

  for (const [key, value] of Object.entries(getRentFlowTenantHeaders())) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }

  config.headers = headers;
  return config;
});

export default api;

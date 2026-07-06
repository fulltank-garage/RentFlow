import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const appRoot = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(appRoot, "../..");

function apiImageRemotePattern() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  try {
    const url = new URL(apiUrl);

    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/**",
    };
  } catch {
    return {
      protocol: "http" as const,
      hostname: "localhost",
      port: "8080",
      pathname: "/**",
    };
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    root: workspaceRoot,
  },
  images: {
    localPatterns: [
      {
        pathname: "/api/rentflow-asset/**",
      },
      {
        pathname: "/**",
        search: "",
      },
    ],
    remotePatterns: [
      apiImageRemotePattern(),
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**.localhost",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

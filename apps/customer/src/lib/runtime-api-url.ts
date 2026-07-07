function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getRentFlowCarApiBaseUrl() {
  return trimTrailingSlash(
    (typeof window === "undefined"
      ? process.env.RENTFLOW_API_INTERNAL_URL
      : undefined) ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8080"
  );
}

function isRentFlowCarApiAssetPath(pathname: string) {
  return (
    pathname.startsWith("/tenants/") ||
    pathname.startsWith("/cars/") ||
    pathname.startsWith("/users/") ||
    pathname === "/platform/settings/marketplace-promo-image"
  );
}

function toRentFlowCarAssetProxyUrl(pathname: string, search = "") {
  return `/api/rentflow-asset${pathname}${search}`;
}

export function resolveRentFlowCarAssetUrl(value?: string | null) {
  const rawValue = value?.trim() || "";
  if (
    !rawValue ||
    rawValue.startsWith("data:") ||
    rawValue.startsWith("blob:") ||
    rawValue.startsWith("//")
  ) {
    return rawValue;
  }

  if (/^https?:\/\//i.test(rawValue)) {
    try {
      const url = new URL(rawValue);
      const apiBaseUrl = new URL(getRentFlowCarApiBaseUrl());

      if (
        url.origin === apiBaseUrl.origin &&
        isRentFlowCarApiAssetPath(url.pathname)
      ) {
        return toRentFlowCarAssetProxyUrl(url.pathname, url.search);
      }
    } catch {
      return rawValue;
    }

    return rawValue;
  }

  const relativeUrl = new URL(
    rawValue.startsWith("/") ? rawValue : `/${rawValue}`,
    "http://rentflow.local"
  );

  if (isRentFlowCarApiAssetPath(relativeUrl.pathname)) {
    return toRentFlowCarAssetProxyUrl(relativeUrl.pathname, relativeUrl.search);
  }

  const apiBaseUrl = getRentFlowCarApiBaseUrl();
  if (!apiBaseUrl) {
    return rawValue;
  }

  return new URL(rawValue.startsWith("/") ? rawValue : `/${rawValue}`, apiBaseUrl).toString();
}

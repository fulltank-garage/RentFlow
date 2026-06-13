function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getRentFlowApiBaseUrl() {
  return trimTrailingSlash(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  );
}

function isRentFlowApiAssetPath(pathname: string) {
  return (
    pathname.startsWith("/tenants/") ||
    pathname.startsWith("/cars/") ||
    pathname.startsWith("/users/") ||
    pathname === "/platform/settings/marketplace-promo-image"
  );
}

function toRentFlowAssetProxyUrl(pathname: string, search = "") {
  return `/api/rentflow-asset${pathname}${search}`;
}

export function resolveRentFlowAssetUrl(value?: string | null) {
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
      const apiBaseUrl = new URL(getRentFlowApiBaseUrl());

      if (
        url.origin === apiBaseUrl.origin &&
        isRentFlowApiAssetPath(url.pathname)
      ) {
        return toRentFlowAssetProxyUrl(url.pathname, url.search);
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

  if (isRentFlowApiAssetPath(relativeUrl.pathname)) {
    return toRentFlowAssetProxyUrl(relativeUrl.pathname, relativeUrl.search);
  }

  const apiBaseUrl = getRentFlowApiBaseUrl();
  if (!apiBaseUrl) {
    return rawValue;
  }

  return new URL(rawValue.startsWith("/") ? rawValue : `/${rawValue}`, apiBaseUrl).toString();
}

const DEFAULT_ROOT_DOMAIN = "rentflowcar.xyz";
export type RentFlowCarSiteMode = "marketplace" | "storefront";
export type RentFlowCarRequestScope = {
  host?: string;
  tenantSlug?: string;
};

function normalizeHost(value?: string) {
  const rawValue = value?.trim().toLowerCase() || "";
  if (!rawValue) {
    return "";
  }

  try {
    const parsedUrl = rawValue.includes("://")
      ? new URL(rawValue)
      : new URL(`https://${rawValue}`);
    return parsedUrl.host.replace(/:\d+$/, "").replace(/\.$/, "");
  } catch {
    return rawValue.split("/")[0].replace(/:\d+$/, "").replace(/\.$/, "");
  }
}

export function getRentFlowCarRootDomain() {
  return normalizeHost(
    process.env.NEXT_PUBLIC_RENTFLOW_ROOT_DOMAIN || DEFAULT_ROOT_DOMAIN
  );
}

function getRentFlowCarRootLabel() {
  const rootDomain = getRentFlowCarRootDomain();
  return rootDomain.split(".")[0] || "rentflow";
}

function getRentFlowCarMarketplaceHosts() {
  return (process.env.NEXT_PUBLIC_RENTFLOW_MARKETPLACE_HOSTS || "")
    .split(",")
    .map((host) => normalizeHost(host))
    .filter(Boolean);
}

export function getRentFlowCarTenantHost() {
  if (typeof window !== "undefined") {
    return normalizeHost(window.location.host);
  }

  return normalizeHost(process.env.NEXT_PUBLIC_RENTFLOW_TENANT_HOST);
}

export function isRentFlowCarMarketplaceHost(host = getRentFlowCarTenantHost()) {
  const normalizedHost = normalizeHost(host);
  const rootDomain = getRentFlowCarRootDomain();
  const rootLabel = getRentFlowCarRootLabel();
  const fallbackTenant = process.env.NEXT_PUBLIC_RENTFLOW_TENANT || "";

  if (!normalizedHost) {
    return !fallbackTenant;
  }

  if (getRentFlowCarMarketplaceHosts().includes(normalizedHost)) {
    return true;
  }

  if (normalizedHost === rootDomain) {
    return true;
  }

  if (rootDomain && normalizedHost === `www.${rootDomain}`) {
    return true;
  }

  if (
    normalizedHost === "localhost" ||
    normalizedHost === "127.0.0.1" ||
    normalizedHost === "::1"
  ) {
    return !fallbackTenant;
  }

  if (normalizedHost.endsWith(".localhost")) {
    const labels = normalizedHost.replace(".localhost", "").split(".");
    return labels.length === 1 && labels[0] === rootLabel;
  }

  return false;
}

export function getRentFlowCarTenantSlug(host = getRentFlowCarTenantHost()) {
  const normalizedHost = normalizeHost(host);
  const rootDomain = getRentFlowCarRootDomain();

  if (!normalizedHost) {
    return process.env.NEXT_PUBLIC_RENTFLOW_TENANT || "";
  }

  if (isRentFlowCarMarketplaceHost(normalizedHost)) {
    return "";
  }

  if (
    normalizedHost === "localhost" ||
    normalizedHost === "127.0.0.1" ||
    normalizedHost === "::1"
  ) {
    return process.env.NEXT_PUBLIC_RENTFLOW_TENANT || "";
  }

  if (normalizedHost.endsWith(".localhost")) {
    const labels = normalizedHost.replace(".localhost", "").split(".");
    return labels[labels.length - 1] || "";
  }

  if (rootDomain && normalizedHost.endsWith(`.${rootDomain}`)) {
    const labels = normalizedHost.replace(`.${rootDomain}`, "").split(".");
    return labels[labels.length - 1] || "";
  }

  return process.env.NEXT_PUBLIC_RENTFLOW_TENANT || "";
}

export function getRentFlowCarSiteMode(host = getRentFlowCarTenantHost()): RentFlowCarSiteMode {
  return isRentFlowCarMarketplaceHost(host) ? "marketplace" : "storefront";
}

export function getRentFlowCarStorefrontHref(tenantSlug?: string) {
  const slug = tenantSlug?.trim().toLowerCase();
  if (!slug) {
    return "";
  }

  const rootDomain = getRentFlowCarRootDomain();

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol || "https:";
    const hostname = window.location.hostname.toLowerCase().replace(/\.$/, "");
    const port = window.location.port ? `:${window.location.port}` : "";

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.endsWith(".localhost")
    ) {
      return `${protocol}//${slug}.localhost${port}`;
    }

    if (
      rootDomain &&
      (hostname === rootDomain || hostname.endsWith(`.${rootDomain}`))
    ) {
      return `${protocol}//${slug}.${rootDomain}`;
    }
  }

  return `https://${slug}.${rootDomain}`;
}

export function getRentFlowCarTenantHeaders(scope?: RentFlowCarRequestScope) {
  const host = normalizeHost(scope?.host) || getRentFlowCarTenantHost();
  const slug =
    scope?.tenantSlug !== undefined
      ? scope.tenantSlug.trim().toLowerCase()
      : getRentFlowCarTenantSlug(host);

  return {
    ...(host ? { "X-RentFlowCar-Host": host } : {}),
    ...(slug ? { "X-RentFlowCar-Tenant": slug } : {}),
  };
}

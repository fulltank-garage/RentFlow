const DEFAULT_ROOT_DOMAIN = "rentflowcar.xyz";
export type RentFlowSiteMode = "marketplace" | "storefront";
export type RentFlowRequestScope = {
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

export function getRentFlowRootDomain() {
  return normalizeHost(
    process.env.NEXT_PUBLIC_RENTFLOW_ROOT_DOMAIN || DEFAULT_ROOT_DOMAIN
  );
}

function getRentFlowRootLabel() {
  const rootDomain = getRentFlowRootDomain();
  return rootDomain.split(".")[0] || "rentflow";
}

export function getRentFlowTenantHost() {
  if (typeof window !== "undefined") {
    return normalizeHost(window.location.host);
  }

  return normalizeHost(process.env.NEXT_PUBLIC_RENTFLOW_TENANT_HOST);
}

export function isRentFlowMarketplaceHost(host = getRentFlowTenantHost()) {
  const normalizedHost = normalizeHost(host);
  const rootDomain = getRentFlowRootDomain();
  const rootLabel = getRentFlowRootLabel();
  const fallbackTenant = process.env.NEXT_PUBLIC_RENTFLOW_TENANT || "";

  if (!normalizedHost) {
    return !fallbackTenant;
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

export function getRentFlowTenantSlug(host = getRentFlowTenantHost()) {
  const normalizedHost = normalizeHost(host);
  const rootDomain = getRentFlowRootDomain();

  if (!normalizedHost) {
    return process.env.NEXT_PUBLIC_RENTFLOW_TENANT || "";
  }

  if (isRentFlowMarketplaceHost(normalizedHost)) {
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

export function getRentFlowSiteMode(host = getRentFlowTenantHost()): RentFlowSiteMode {
  return isRentFlowMarketplaceHost(host) ? "marketplace" : "storefront";
}

export function getRentFlowStorefrontHref(tenantSlug?: string) {
  const slug = tenantSlug?.trim().toLowerCase();
  if (!slug) {
    return "";
  }

  const rootDomain = getRentFlowRootDomain();

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

export function getRentFlowTenantHeaders(scope?: RentFlowRequestScope) {
  const host = normalizeHost(scope?.host) || getRentFlowTenantHost();
  const slug =
    scope?.tenantSlug !== undefined
      ? scope.tenantSlug.trim().toLowerCase()
      : getRentFlowTenantSlug(host);

  return {
    ...(host ? { "X-RentFlow-Host": host } : {}),
    ...(slug ? { "X-RentFlow-Tenant": slug } : {}),
  };
}

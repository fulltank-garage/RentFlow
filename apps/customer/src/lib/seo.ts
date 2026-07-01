import type { Metadata } from "next";

const DEFAULT_HOST = "rentflowcar.xyz";
const DEFAULT_BRAND_NAME = "RentFlowCar";
const DEFAULT_TAGLINE = "เช่ารถง่าย แค่ปลายนิ้ว";
const DEFAULT_DESCRIPTION =
  "RentFlowCar แพลตฟอร์มเช่ารถออนไลน์ ค้นหารถ เปรียบเทียบตัวเลือก และจองรถกับร้านเช่ารถได้สะดวกในที่เดียว";
const DEFAULT_OG_IMAGE = "/RentFlow.png";

type SeoTenant = {
  shopName?: string;
  logoUrl?: string;
  contactPhone?: string;
};

export type RentFlowCarSeoInput = {
  host?: string;
  pathname?: string;
  tenant?: SeoTenant | null;
};

function normalizeHost(value?: string) {
  const rawValue = value?.trim().toLowerCase() || "";
  if (!rawValue) return "";

  try {
    const parsedUrl = rawValue.includes("://")
      ? new URL(rawValue)
      : new URL(`https://${rawValue}`);
    return parsedUrl.host.replace(/\.$/, "");
  } catch {
    return rawValue.split("/")[0].replace(/\.$/, "");
  }
}

function normalizePathname(pathname?: string) {
  const normalized = pathname?.trim() || "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function getRequestProtocol(host: string) {
  return host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]")
    ? "http"
    : "https";
}

function getRentFlowCarOrigin(host?: string) {
  const explicitOrigin =
    process.env.NEXT_PUBLIC_RENTFLOW_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL;

  if (explicitOrigin) {
    try {
      return new URL(explicitOrigin).origin;
    } catch {
      // Fall through to request host.
    }
  }

  const normalizedHost = normalizeHost(host) || DEFAULT_HOST;
  return `${getRequestProtocol(normalizedHost)}://${normalizedHost}`;
}

function absoluteUrl(pathOrUrl: string, origin: string) {
  try {
    return new URL(pathOrUrl, origin).toString();
  } catch {
    return new URL(DEFAULT_OG_IMAGE, origin).toString();
  }
}

export function getRentFlowCarCanonicalUrl({
  host,
  pathname,
}: RentFlowCarSeoInput) {
  return new URL(normalizePathname(pathname), getRentFlowCarOrigin(host))
    .toString();
}

export function buildRentFlowCarMetadata({
  host,
  pathname = "/",
  tenant,
}: RentFlowCarSeoInput): Metadata {
  const origin = getRentFlowCarOrigin(host);
  const canonical = getRentFlowCarCanonicalUrl({ host, pathname });
  const siteName = tenant?.shopName || DEFAULT_BRAND_NAME;
  const title = tenant?.shopName
    ? `${tenant.shopName} - ${DEFAULT_TAGLINE}`
    : `${DEFAULT_BRAND_NAME} - ${DEFAULT_TAGLINE}`;
  const description = tenant?.shopName
    ? `เช่ารถกับ ${tenant.shopName} ผ่าน RentFlowCar ดูรถว่าง เลือกวันเวลา และจองออนไลน์ได้สะดวก`
    : DEFAULT_DESCRIPTION;
  const imageUrl = absoluteUrl(tenant?.logoUrl || DEFAULT_OG_IMAGE, origin);

  return {
    metadataBase: new URL(origin),
    title,
    description,
    applicationName: DEFAULT_BRAND_NAME,
    alternates: {
      canonical,
    },
    keywords: [
      "เช่ารถ",
      "รถเช่า",
      "จองรถเช่า",
      "เช่ารถออนไลน์",
      "RentFlowCar",
      tenant?.shopName || "",
    ].filter(Boolean),
    openGraph: {
      type: "website",
      locale: "th_TH",
      url: canonical,
      siteName,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} - ${DEFAULT_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: "/tenant-icon",
      shortcut: "/tenant-icon",
      apple: "/tenant-icon",
    },
  };
}

export function buildRentFlowCarJsonLd({
  host,
  tenant,
}: RentFlowCarSeoInput) {
  const origin = getRentFlowCarOrigin(host);
  const url = getRentFlowCarCanonicalUrl({ host, pathname: "/" });

  if (tenant?.shopName) {
    return [
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: tenant.shopName,
        url,
        image: tenant.logoUrl ? absoluteUrl(tenant.logoUrl, origin) : undefined,
        logo: tenant.logoUrl ? absoluteUrl(tenant.logoUrl, origin) : undefined,
        telephone: tenant.contactPhone || undefined,
        serviceType: "Car rental",
        areaServed: "Thailand",
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: tenant.shopName,
        url,
        inLanguage: "th-TH",
      },
    ];
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: DEFAULT_BRAND_NAME,
      url,
      logo: absoluteUrl(DEFAULT_OG_IMAGE, origin),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: DEFAULT_BRAND_NAME,
      url,
      description: DEFAULT_DESCRIPTION,
      inLanguage: "th-TH",
      potentialAction: {
        "@type": "SearchAction",
        target: `${origin}/cars?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function getRentFlowCarSitemapBaseUrl() {
  return getRentFlowCarOrigin(DEFAULT_HOST);
}

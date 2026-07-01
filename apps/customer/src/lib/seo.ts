import type { Metadata } from "next";

const DEFAULT_HOST = "rentflowcar.xyz";
const DEFAULT_BRAND_NAME = "RentFlowCar";
const DEFAULT_TAGLINE = "เช่ารถง่าย แค่ปลายนิ้ว";
const DEFAULT_DESCRIPTION =
  "RentFlowCar แพลตฟอร์มเช่ารถออนไลน์ ค้นหารถ เปรียบเทียบตัวเลือก และจองรถกับร้านเช่ารถได้สะดวกในที่เดียว";
const DEFAULT_OG_IMAGE = "/opengraph-image";

type SeoTenant = {
  shopName?: string;
  logoUrl?: string;
  contactPhone?: string;
};

type SeoCar = {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  year?: number;
  type?: string;
  seats?: number;
  transmission?: string;
  fuel?: string;
  pricePerDay?: number;
  imageUrl?: string;
  image?: string;
  images?: string[];
  description?: string;
  isAvailable?: boolean;
  shopName?: string;
};

export type RentFlowCarSeoInput = {
  host?: string;
  pathname?: string;
  tenant?: SeoTenant | null;
  car?: SeoCar | null;
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

export function buildRentFlowCarPageMetadata({
  host,
  pathname,
  title,
  description,
  image,
}: RentFlowCarSeoInput & {
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const origin = getRentFlowCarOrigin(host);
  const canonical = getRentFlowCarCanonicalUrl({ host, pathname });
  const fullTitle = `${title} | ${DEFAULT_BRAND_NAME}`;
  const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE, origin);

  return {
    metadataBase: new URL(origin),
    title: fullTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "th_TH",
      url: canonical,
      siteName: DEFAULT_BRAND_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

function getClassDisplayName(slug: string) {
  const normalized = slug.trim().toLowerCase();
  const labels: Record<string, string> = {
    economy: "Economy",
    sedan: "Sedan",
    suv: "SUV",
    van: "Van",
  };

  return labels[normalized] || slug.replace(/[-_]+/g, " ").trim();
}

export function buildRentFlowCarClassMetadata({
  host,
  slug,
}: RentFlowCarSeoInput & { slug: string }): Metadata {
  const className = getClassDisplayName(slug);

  return buildRentFlowCarPageMetadata({
    host,
    pathname: `/classes/${encodeURIComponent(slug)}`,
    title: `เช่ารถ ${className}`,
    description: `ค้นหารถเช่าประเภท ${className} เปรียบเทียบตัวเลือก ราคา และจองผ่าน RentFlowCar ได้สะดวก`,
  });
}

export function buildRentFlowCarNoIndexMetadata(title: string): Metadata {
  return {
    title: `${title} | ${DEFAULT_BRAND_NAME}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export function buildRentFlowCarCarMetadata({
  host,
  car,
}: RentFlowCarSeoInput & { car: SeoCar }): Metadata {
  const carName = [car.year, car.brand, car.model]
    .filter(Boolean)
    .join(" ")
    .trim() || car.name;
  const title = `${carName} ให้เช่า${car.shopName ? ` จาก ${car.shopName}` : ""}`;
  const description =
    car.description ||
    `เช่า ${carName} ${car.seats ? `${car.seats} ที่นั่ง ` : ""}${car.pricePerDay ? `ราคาเริ่มต้น ${car.pricePerDay.toLocaleString("th-TH")} บาทต่อวัน ` : ""}จองออนไลน์ผ่าน RentFlowCar`;

  return buildRentFlowCarPageMetadata({
    host,
    pathname: `/cars/${encodeURIComponent(car.id)}`,
    title,
    description,
    image: car.imageUrl || car.image || car.images?.[0],
  });
}

export function buildRentFlowCarJsonLd({
  host,
  tenant,
  car,
}: RentFlowCarSeoInput) {
  const origin = getRentFlowCarOrigin(host);
  const url = getRentFlowCarCanonicalUrl({ host, pathname: "/" });

  if (car?.id) {
    const carUrl = getRentFlowCarCanonicalUrl({
      host,
      pathname: `/cars/${encodeURIComponent(car.id)}`,
    });
    const image = car.imageUrl || car.image || car.images?.[0];

    return [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: car.name,
        brand: car.brand
          ? {
              "@type": "Brand",
              name: car.brand,
            }
          : undefined,
        model: car.model || undefined,
        description:
          car.description ||
          `${car.name} รถเช่าสำหรับจองออนไลน์ผ่าน RentFlowCar`,
        image: image ? absoluteUrl(image, origin) : undefined,
        url: carUrl,
        category: car.type || "Car rental",
        offers: {
          "@type": "Offer",
          url: carUrl,
          priceCurrency: "THB",
          price: car.pricePerDay || undefined,
          availability:
            car.isAvailable === false
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
          seller: car.shopName
            ? {
                "@type": "LocalBusiness",
                name: car.shopName,
              }
            : {
                "@type": "Organization",
                name: DEFAULT_BRAND_NAME,
              },
        },
      },
    ];
  }

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

export function getRentFlowCarPublicRootDomain() {
  try {
    return new URL(getRentFlowCarOrigin(DEFAULT_HOST)).hostname;
  } catch {
    return DEFAULT_HOST;
  }
}

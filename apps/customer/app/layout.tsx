import type { Metadata } from "next";
import { Noto_Sans_Thai, Roboto } from "next/font/google";
import "./globals.css";

import Providers from "./providers";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import CookieBanner from "@/src/components/common/CookieBanner";
import FloatingAiChat from "@/src/components/ai/FloatingAiChat";
import {
  getInitialRentFlowCarTenantProfile,
  getRentFlowCarRequestHost,
} from "@/src/lib/server-tenant";
import {
  buildRentFlowCarJsonLd,
  buildRentFlowCarMetadata,
} from "@/src/lib/seo";

const notoThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-thai",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-english",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRentFlowCarRequestHost();
  const tenant = await getInitialRentFlowCarTenantProfile(host);
  return buildRentFlowCarMetadata({ host, tenant });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = await getRentFlowCarRequestHost();
  const initialTenantProfile = await getInitialRentFlowCarTenantProfile(host);
  const jsonLd = buildRentFlowCarJsonLd({
    host,
    tenant: initialTenantProfile,
  });

  return (
    <html
      lang="th"
      data-scroll-behavior="smooth"
      className={`${notoThai.variable} ${roboto.variable}`}
    >
      <body className="font-thai">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <Navbar
            initialHost={host}
            initialTenantProfile={initialTenantProfile}
          />
          {children}
          <Footer
            initialHost={host}
            initialTenantProfile={initialTenantProfile}
          />
          <CookieBanner />
          <FloatingAiChat />
        </Providers>
      </body>
    </html>
  );
}

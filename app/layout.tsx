import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

import Providers from "./providers";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import CookieBanner from "@/src/components/common/CookieBanner";
import FloatingAiChat from "@/src/components/ai/FloatingAiChat";
import {
  getInitialRentFlowTenantProfile,
  getRentFlowRequestHost,
} from "@/src/lib/server-tenant";

const notoThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-thai",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-latin",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRentFlowRequestHost();
  const tenant = await getInitialRentFlowTenantProfile(host);
  const title = tenant?.shopName
    ? `${tenant.shopName} - เช่ารถง่าย แค่ปลายนิ้ว`
    : "RentFlow - เช่ารถง่าย แค่ปลายนิ้ว";
  const icon = "/tenant-icon";

  return {
    title,
    description: tenant?.shopName
      ? `เช่ารถกับ ${tenant.shopName} ผ่าน RentFlow`
      : "เช่ารถง่าย แค่ปลายนิ้ว",
    icons: {
      icon,
      shortcut: icon,
      apple: icon,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = await getRentFlowRequestHost();
  const initialTenantProfile = await getInitialRentFlowTenantProfile(host);

  return (
    <html
      lang="th"
      data-scroll-behavior="smooth"
      className={`${notoThai.variable} ${notoSans.variable}`}
    >
      <body className="font-thai">
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

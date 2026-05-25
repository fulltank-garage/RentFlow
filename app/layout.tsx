import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

import Providers from "./providers";
import {
  PARTNER_STORE_KEY,
  getPartnerBrowserIconVersion,
  getPartnerBrowserTitle,
  parsePartnerStoreProfileCookie,
} from "@/src/lib/partner-browser-identity";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-thai",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const profile = parsePartnerStoreProfileCookie(
    cookieStore.get(PARTNER_STORE_KEY)?.value
  );
  const iconVersion = getPartnerBrowserIconVersion(profile);
  const iconHref = iconVersion
    ? `/partner-icon?rf_icon_v=${encodeURIComponent(iconVersion)}`
    : "/partner-icon";

  return {
    title: getPartnerBrowserTitle(profile),
    description:
      "หลังบ้านสำหรับเจ้าของร้านเช่ารถ จัดการร้าน รถ การจอง และลูกค้า",
    icons: {
      icon: iconHref,
      shortcut: iconHref,
      apple: iconHref,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body className="font-thai">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

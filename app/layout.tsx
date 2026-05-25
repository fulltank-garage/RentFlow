import type { Metadata } from "next";
import { Noto_Sans_Thai, Roboto } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const notoSansThai = Noto_Sans_Thai({
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

export const metadata: Metadata = {
  title: "RentFlow ศูนย์จัดการระบบ",
  description: "หลังบ้านสำหรับดูแลระบบกลาง ร้านเช่ารถ โดเมน แผน และความปลอดภัย",
  icons: {
    icon: "/RentFlow.svg",
    shortcut: "/RentFlow.svg",
    apple: "/RentFlow.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} ${roboto.variable}`}>
      <body className="font-thai">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

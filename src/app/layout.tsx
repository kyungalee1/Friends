import type { Metadata, Viewport } from "next";
import { Gowun_Dodum } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cute",
  display: "swap",
});

export const metadata: Metadata = {
  title: "공부 레이스 🐰🐢",
  description: "친구들과 함께하는 재미있는 시험공부 앱",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "공부 레이스",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFB5C5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${gowunDodum.variable} font-cute antialiased`}>
        <main className="mx-auto min-h-dvh max-w-md pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

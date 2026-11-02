import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOA — 둘만의 순간을 한 권에",
  description: "흩어진 사진이 한 권의 포토북이 됩니다. MOA 오픈 알림을 받아보세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fffbf8",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/prototype.css?v=moa-home-7" />
      </head>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

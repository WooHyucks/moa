import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOA — 우리 이야기, 한 권의 그림책이 되다",
  description:
    "두 사람의 사진과 이야기를 보내주세요. MOA가 세상에 하나뿐인 그림책으로 만들어요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/prototype.css?v=moa-consent-2" />
      </head>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

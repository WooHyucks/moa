import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "moa. — 우리의 이야기를 그림으로 남기다",
  description:
    "연인들의 실제 이야기를 AI가 세상에 하나뿐인 그림책으로 만들어주는 서비스. 첫 커플 디지털 그림책 무료 제작에 참여해 보세요.",
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
        <link rel="stylesheet" href="/prototype.css?v=moa-story-4" />
      </head>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

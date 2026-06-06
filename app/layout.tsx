import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 디자인 의뢰서 MVP",
  description: "AI 기반 디자인 의뢰서 작성 도구",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

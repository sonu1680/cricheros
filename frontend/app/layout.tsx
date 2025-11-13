import type React from "react";
import type { Metadata } from "next";
import "../style/global.css";

export const metadata: Metadata = {
  title: "IPL Points Calculator",
  description:
    "Analyze performance requirements to reach desired positions in the IPL",
  icons: "logo.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

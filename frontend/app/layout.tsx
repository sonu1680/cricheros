import type React from "react"
import type { Metadata } from "next"
import {  Poppins } from "next/font/google"
import "./globals.css"



const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "IPL Points Calculator",
  description: "Analyze performance requirements to reach desired positions in the IPL",
  icons:"logo.png"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  )
}

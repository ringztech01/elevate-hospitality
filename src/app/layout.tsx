import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Elevate — Hospitality. Design. Build. Operate.",
  description: "We take hospitality projects from first idea to last table turned.",
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <link rel="preload" href="/videos/hero.webm" as="video" type="video/webm" />
        <link rel="preconnect" href="https://elevateng.co" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

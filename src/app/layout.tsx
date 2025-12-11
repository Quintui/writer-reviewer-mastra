import type React from "react"
import type { Metadata } from "next"
import { Crimson_Text, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const _jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Inkwell — AI Writing Studio",
  description: "Where ideas become polished prose through iterative AI refinement",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

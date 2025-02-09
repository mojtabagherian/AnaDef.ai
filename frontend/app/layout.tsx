import "./globals.css"
import type { Metadata } from "next"
import ClientWrapper from "./components/ClientWrapper"
import type React from "react" // Added import for React

export const metadata: Metadata = {
  title: "AnaDef.ai Analytics",
  description: "Blockchain Analytics Dashboard",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100" suppressHydrationWarning>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}


'use client'

import { CustomSessionProvider } from "./session-provider"
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa">
      <body>
        <CustomSessionProvider>
          {children}
        </CustomSessionProvider>
      </body>
    </html>
  )
}

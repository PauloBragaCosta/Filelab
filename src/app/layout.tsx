// layout.js
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import { SessionProvider } from "next-auth/react";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // You can use fontSans here if needed
  return (
    <>
      <SessionProvider>
        <html lang="en" suppressHydrationWarning>
          <head />
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </body>
        </html>
      </SessionProvider>
    </>
  )
}

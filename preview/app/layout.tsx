import type { ReactNode } from "react"
import "./globals.css"
import { SessionBar } from "./SessionBar"

export const metadata = {
  title: "LP Preview",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionBar />
        {children}
      </body>
    </html>
  )
}

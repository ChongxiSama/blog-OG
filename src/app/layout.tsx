import type { Metadata } from 'next'
import './globals.css'
import ThemeRegistry from './ThemeRegistry'

export const metadata: Metadata = {
  title: 'OG test',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}

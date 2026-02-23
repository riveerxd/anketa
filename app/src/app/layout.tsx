import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kavova Anketa',
  description: 'Kolik salku kavy denne je jeste normalni?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className="antialiased">{children}</body>
    </html>
  )
}

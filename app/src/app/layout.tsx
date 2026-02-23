import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kávová Anketa',
  description: 'Kolik šálků kávy denně je ještě normální?',
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

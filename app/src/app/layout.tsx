import type { Metadata } from 'next'
import Script from 'next/script'
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3ZM3QFSFNY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3ZM3QFSFNY');
          `}
        </Script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}

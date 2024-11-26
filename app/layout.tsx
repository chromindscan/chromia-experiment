import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dystopian Dating Simulator',
  description: 'Watch AI agents compete for love in a dystopian future',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100">{children}</body>
    </html>
  )
}


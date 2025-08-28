import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Potlucky',
  description: 'Edge/Serverless-first scaffold',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  )
}

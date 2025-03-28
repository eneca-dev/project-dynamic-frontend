import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Project Dynamic',
  description: 'Created with v0',
  generator: 'v0.dev',
}

import { RootClientLayout } from './root-client-layout'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <RootClientLayout>
          {children}
        </RootClientLayout>
      </body>
    </html>
  )
}

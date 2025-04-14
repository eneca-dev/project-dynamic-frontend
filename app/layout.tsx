import type { Metadata } from 'next'
import './globals.css'
import Head from 'next/head'

export const metadata: Metadata = {
  title: 'Project Dynamic',
  description: 'Просмотр динамики прогресса проекта и секций',
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/faviconBig.ico' },
      { url: '/favicon-32x32.ico', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png' }
    ],
  }
}

import { RootClientLayout } from './root-client-layout'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/faviconBig.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.ico" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon-32x32.ico" type="image/x-icon" />
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>
      <body>
        <RootClientLayout>
          {children}
        </RootClientLayout>
      </body>
    </html>
  )
}

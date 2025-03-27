"use client"

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

// Создаем queryClient
const queryClient = new QueryClient()

export function RootClientLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
} 
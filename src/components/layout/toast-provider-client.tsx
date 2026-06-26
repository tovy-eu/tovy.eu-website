"use client"

import { ToastProvider } from "@/hooks/use-toast"
import { ReactNode } from "react"

export function ToastProviderClient({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}

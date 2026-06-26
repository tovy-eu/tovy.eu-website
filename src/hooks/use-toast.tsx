"use client"

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react"

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  action?: React.ReactElement
  open?: boolean
}

const ToastContext = createContext<{
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => { id: string; dismiss: () => void }
} | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idCounter = useRef(0)

  const toast = useCallback((props: Omit<Toast, "id">) => {
    const id = String(++idCounter.current)
    const timeout = setTimeout(() => {
      setToasts([])
    }, 3000)

    setToasts([{ id, ...props, open: true }])

    return {
      id,
      dismiss: () => {
        clearTimeout(timeout)
        setToasts([])
      },
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

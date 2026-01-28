import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import { useSearchParams } from "react-router-dom"
import { DEFAULT_DELAY, MIN_DELAY, MAX_DELAY } from "@/types"

interface DelayContextValue {
  delay: number
  setDelay: (delay: number) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  showElapsedTime: boolean
  setShowElapsedTime: (show: boolean) => void
}

const DelayContext = createContext<DelayContextValue | undefined>(undefined)

interface DelayProviderProps {
  children: ReactNode
}

export function DelayProvider({ children }: DelayProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse delay from URL or use default
  const urlDelay = parseInt(searchParams.get("delay") || String(DEFAULT_DELAY), 10)
  const initialDelay = Math.min(Math.max(isNaN(urlDelay) ? DEFAULT_DELAY : urlDelay, MIN_DELAY), MAX_DELAY)

  const [delay, setDelayState] = useState(initialDelay)
  const [isLoading, setIsLoading] = useState(false)
  const [showElapsedTime, setShowElapsedTime] = useState(false)

  const setDelay = useCallback(
    (newDelay: number) => {
      const validDelay = Math.min(Math.max(newDelay, MIN_DELAY), MAX_DELAY)
      setDelayState(validDelay)

      // Update URL
      setSearchParams(
        (prev) => {
          prev.set("delay", String(validDelay))
          return prev
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  const value = useMemo(
    () => ({
      delay,
      setDelay,
      isLoading,
      setIsLoading,
      showElapsedTime,
      setShowElapsedTime,
    }),
    [delay, setDelay, isLoading, showElapsedTime]
  )

  return <DelayContext.Provider value={value}>{children}</DelayContext.Provider>
}

export function useDelay() {
  const context = useContext(DelayContext)
  if (!context) {
    throw new Error("useDelay must be used within a DelayProvider")
  }
  return context
}

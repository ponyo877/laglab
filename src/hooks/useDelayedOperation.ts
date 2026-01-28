import { useState, useCallback } from "react"
import { simulateDelay } from "@/lib/delay"

interface UseDelayedOperationReturn<T> {
  execute: (operation: () => T | Promise<T>) => Promise<T>
  isLoading: boolean
}

export function useDelayedOperation<T>(delay: number): UseDelayedOperationReturn<T> {
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(
    async (operation: () => T | Promise<T>): Promise<T> => {
      setIsLoading(true)

      await simulateDelay(delay)
      const result = await operation()

      setIsLoading(false)
      return result
    },
    [delay]
  )

  return { execute, isLoading }
}

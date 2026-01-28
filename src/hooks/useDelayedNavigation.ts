import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useDelay } from "@/contexts/DelayContext"
import { useDelayedOperation } from "./useDelayedOperation"

export function useDelayedNavigation() {
  const navigate = useNavigate()
  const { delay, setIsLoading } = useDelay()
  const navigateOperation = useDelayedOperation<void>(delay)

  const delayedNavigate = useCallback(
    async (to: string) => {
      setIsLoading(true)
      await navigateOperation.execute(() => {
        navigate(to)
      })
      setIsLoading(false)
    },
    [navigate, navigateOperation, setIsLoading]
  )

  return {
    navigate: delayedNavigate,
    isNavigating: navigateOperation.isLoading,
  }
}

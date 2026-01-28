import { useState, useEffect, useRef } from "react"

export function useElapsedTime(isLoading: boolean): number {
  const [elapsed, setElapsed] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (isLoading) {
      // Start timing
      startTimeRef.current = Date.now()
      setElapsed(0)

      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current !== null) {
          setElapsed(Date.now() - startTimeRef.current)
        }
      }, 10) // Update every 10ms as per requirements
    } else {
      // Stop timing - calculate final elapsed time immediately
      if (startTimeRef.current !== null) {
        setElapsed(Date.now() - startTimeRef.current)
      }
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isLoading])

  return elapsed
}

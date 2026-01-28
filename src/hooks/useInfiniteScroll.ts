import { useState, useCallback, useRef, useEffect } from "react"
import { simulateDelay } from "@/lib/delay"

interface UseInfiniteScrollOptions {
  initialLoadCount: number
  loadMoreCount: number
  totalItems: number
  delay: number
}

interface UseInfiniteScrollReturn<T> {
  displayedItems: T[]
  loadedCount: number
  hasMore: boolean
  isLoadingMore: boolean
  sentinelRef: (node: HTMLElement | null) => void
  reset: () => void
}

export function useInfiniteScroll<T>(
  items: T[],
  options: UseInfiniteScrollOptions
): UseInfiniteScrollReturn<T> {
  const { initialLoadCount, loadMoreCount, totalItems, delay } = options

  const [loadedCount, setLoadedCount] = useState(initialLoadCount)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const observerRef = useRef<IntersectionObserver | null>(null)

  const displayedItems = items.slice(0, loadedCount)
  const hasMore = loadedCount < totalItems && loadedCount < items.length

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    await simulateDelay(delay)

    setLoadedCount((prev) => Math.min(prev + loadMoreCount, items.length, totalItems))
    setIsLoadingMore(false)
  }, [isLoadingMore, hasMore, delay, loadMoreCount, items.length, totalItems])

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      if (!node || !hasMore) return

      // Create new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
            loadMore()
          }
        },
        { threshold: 0.1, rootMargin: "100px" }
      )

      observerRef.current.observe(node)
    },
    [hasMore, isLoadingMore, loadMore]
  )

  const reset = useCallback(() => {
    setLoadedCount(initialLoadCount)
    setIsLoadingMore(false)
  }, [initialLoadCount])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return {
    displayedItems,
    loadedCount,
    hasMore,
    isLoadingMore,
    sentinelRef,
    reset,
  }
}

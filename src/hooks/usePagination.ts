import { useState, useMemo, useCallback } from "react"

interface UsePaginationProps<T> {
  items: T[]
  itemsPerPage: number
  initialPage?: number
}

interface UsePaginationReturn<T> {
  currentPage: number
  totalPages: number
  paginatedItems: T[]
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  isFirstPage: boolean
  isLastPage: boolean
  startIndex: number
  endIndex: number
  totalItems: number
}

export function usePagination<T>({
  items,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))
  const totalItems = items.length

  // Ensure current page is valid
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages))

  const startIndex = (validCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, endIndex)
  }, [items, startIndex, endIndex])

  const setPage = useCallback(
    (page: number) => {
      const newPage = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(newPage)
    },
    [totalPages]
  )

  const nextPage = useCallback(() => {
    setPage(validCurrentPage + 1)
  }, [validCurrentPage, setPage])

  const prevPage = useCallback(() => {
    setPage(validCurrentPage - 1)
  }, [validCurrentPage, setPage])

  return {
    currentPage: validCurrentPage,
    totalPages,
    paginatedItems,
    setPage,
    nextPage,
    prevPage,
    isFirstPage: validCurrentPage === 1,
    isLastPage: validCurrentPage === totalPages,
    startIndex: startIndex + 1, // 1-indexed for display
    endIndex,
    totalItems,
  }
}

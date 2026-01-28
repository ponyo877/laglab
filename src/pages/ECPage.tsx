import { useState, useMemo, useCallback, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { SearchBar } from "@/components/common/SearchBar"
import { ProductGrid } from "@/components/ec/ProductGrid"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useLanguage } from "@/contexts/LanguageContext"
import { useDelay } from "@/contexts/DelayContext"
import { usePagination } from "@/hooks/usePagination"
import { useDelayedOperation } from "@/hooks/useDelayedOperation"
import { useDelayedNavigation } from "@/hooks/useDelayedNavigation"
import { PRODUCTS } from "@/data/products"

const ITEMS_PER_PAGE = 20

export function ECPage() {
  const { lang, t } = useLanguage()
  const { delay, setIsLoading } = useDelay()
  const location = useLocation()
  const { navigate: delayedNavigate } = useDelayedNavigation()

  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("")
  const [cart, setCart] = useState<Set<number>>(new Set())
  const [loadingCartId, setLoadingCartId] = useState<number | null>(null)
  const [isGridLoading, setIsGridLoading] = useState(true)

  // Filter products based on applied search
  const filteredProducts = useMemo(() => {
    if (!appliedSearchQuery.trim()) return PRODUCTS

    const query = appliedSearchQuery.toLowerCase()
    return PRODUCTS.filter((product) => {
      const name = lang === "jp" ? product.name.ja : product.name.en
      return name.toLowerCase().includes(query)
    })
  }, [appliedSearchQuery, lang])

  // Pagination
  const pagination = usePagination({
    items: filteredProducts,
    itemsPerPage: ITEMS_PER_PAGE,
  })

  // Initial load operation
  const initialLoadOperation = useDelayedOperation<void>(delay)

  useEffect(() => {
    const performInitialLoad = async () => {
      setIsLoading(true)
      await initialLoadOperation.execute(() => {})
      setIsGridLoading(false)
      setIsLoading(false)
    }
    performInitialLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Search operation with delay
  const searchOperation = useDelayedOperation<void>(delay)

  const handleSearch = useCallback(async () => {
    setIsGridLoading(true)
    setIsLoading(true)
    await searchOperation.execute(() => {
      setAppliedSearchQuery(searchQuery)
    })
    setIsGridLoading(false)
    setIsLoading(false)
  }, [searchQuery, searchOperation, setIsLoading])

  // Page change with delay
  const pageChangeOperation = useDelayedOperation<void>(delay)

  const handlePageChange = useCallback(
    async (page: number) => {
      setIsGridLoading(true)
      setIsLoading(true)
      await pageChangeOperation.execute(() => {
        pagination.setPage(page)
      })
      setIsGridLoading(false)
      setIsLoading(false)
    },
    [pageChangeOperation, pagination, setIsLoading]
  )

  // Add to cart with delay
  const addToCartOperation = useDelayedOperation<void>(delay)

  const handleAddToCart = useCallback(
    async (productId: number) => {
      setLoadingCartId(productId)
      setIsLoading(true)
      await addToCartOperation.execute(() => {
        setCart((prev) => new Set([...prev, productId]))
      })
      setLoadingCartId(null)
      setIsLoading(false)
    },
    [addToCartOperation, setIsLoading]
  )

  // Refresh operation
  const refreshOperation = useDelayedOperation<void>(delay)

  const handleRefresh = useCallback(async () => {
    setIsGridLoading(true)
    setIsLoading(true)
    await refreshOperation.execute(() => {
      setSearchQuery("")
      setAppliedSearchQuery("")
      pagination.setPage(1)
    })
    setIsGridLoading(false)
    setIsLoading(false)
  }, [refreshOperation, setIsLoading, pagination])

  // View detail
  const handleViewDetail = useCallback(
    (productId: number) => {
      delayedNavigate(`/${lang}/ec/product/${productId}${location.search}`)
    },
    [delayedNavigate, lang, location.search]
  )

  // Generate pagination items
  const paginationItems = useMemo(() => {
    const items: (number | "ellipsis")[] = []
    const { currentPage, totalPages } = pagination

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      items.push(1)

      if (currentPage > 3) {
        items.push("ellipsis")
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        items.push(i)
      }

      if (currentPage < totalPages - 2) {
        items.push("ellipsis")
      }

      items.push(totalPages)
    }

    return items
  }, [pagination])

  return (
    <div className="space-y-4">
      <SearchBar
        placeholder={t("ec.searchPlaceholder")}
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        isLoading={searchOperation.isLoading}
        onRefresh={handleRefresh}
        isRefreshing={refreshOperation.isLoading}
      />

      {filteredProducts.length === 0 && !isGridLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          {t("ec.noProducts")}
        </div>
      ) : (
        <>
          <ProductGrid
            products={pagination.paginatedItems}
            isLoading={isGridLoading}
            onAddToCart={handleAddToCart}
            loadingCartId={loadingCartId}
            cartIds={cart}
            onViewDetail={handleViewDetail}
          />

          {pagination.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => !pagination.isFirstPage && handlePageChange(pagination.currentPage - 1)}
                    className={pagination.isFirstPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {paginationItems.map((item, index) =>
                  item === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <span className="px-4">...</span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        onClick={() => handlePageChange(item)}
                        isActive={item === pagination.currentPage}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => !pagination.isLastPage && handlePageChange(pagination.currentPage + 1)}
                    className={pagination.isLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}

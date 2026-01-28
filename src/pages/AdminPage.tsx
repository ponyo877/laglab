import { useState, useMemo, useCallback, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { toast } from "sonner"
import { SearchBar } from "@/components/common/SearchBar"
import { UserTable } from "@/components/admin/UserTable"
import { EditUserModal } from "@/components/admin/EditUserModal"
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
import { USERS } from "@/data/users"
import type { User } from "@/types"

const ITEMS_PER_PAGE = 20

export function AdminPage() {
  const { lang, t } = useLanguage()
  const { delay, setIsLoading } = useDelay()
  const location = useLocation()
  const { navigate: delayedNavigate } = useDelayedNavigation()

  // State
  const [users, setUsers] = useState<User[]>(USERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Filter users based on applied search
  const filteredUsers = useMemo(() => {
    if (!appliedSearchQuery.trim()) return users

    const query = appliedSearchQuery.toLowerCase()
    return users.filter((user) => {
      const name = lang === "jp" ? user.name.ja : user.name.en
      return (
        name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    })
  }, [users, appliedSearchQuery, lang])

  // Pagination
  const pagination = usePagination({
    items: filteredUsers,
    itemsPerPage: ITEMS_PER_PAGE,
  })

  // Initial load operation
  const initialLoadOperation = useDelayedOperation<void>(delay)

  useEffect(() => {
    const skipInitialLoad = location.state?.skipInitialLoad === true

    const performInitialLoad = async () => {
      if (!skipInitialLoad) {
        setIsLoading(true)
        await initialLoadOperation.execute(() => {})
      }
      setIsTableLoading(false)
      if (!skipInitialLoad) setIsLoading(false)

      if (location.state?.fromDelayedNavigation) {
        window.history.replaceState({}, document.title)
      }
    }
    performInitialLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Search operation with delay
  const searchOperation = useDelayedOperation<void>(delay)

  const handleSearch = useCallback(async () => {
    setIsTableLoading(true)
    setIsLoading(true)
    await searchOperation.execute(() => {
      setAppliedSearchQuery(searchQuery)
    })
    setIsTableLoading(false)
    setIsLoading(false)
  }, [searchQuery, searchOperation, setIsLoading])

  // Page change with delay
  const pageChangeOperation = useDelayedOperation<void>(delay)

  const handlePageChange = useCallback(
    async (page: number) => {
      setIsTableLoading(true)
      setIsLoading(true)
      await pageChangeOperation.execute(() => {
        pagination.setPage(page)
      })
      setIsTableLoading(false)
      setIsLoading(false)
    },
    [pageChangeOperation, pagination, setIsLoading]
  )

  // Edit user - modal opens immediately (no delay)
  const handleEditClick = useCallback((user: User) => {
    setEditingUser({ ...user })
    setIsModalOpen(true)
  }, [])

  // Save user with delay
  const saveOperation = useDelayedOperation<void>(delay)

  const handleSaveUser = useCallback(
    async (updatedUser: User) => {
      setIsSaving(true)
      setIsLoading(true)
      await saveOperation.execute(() => {
        setUsers((prev) =>
          prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        )
        setIsModalOpen(false)
        setEditingUser(null)
      })
      setIsSaving(false)
      setIsLoading(false)
      toast.success(t("admin.savedMessage"))
    },
    [saveOperation, setIsLoading, t]
  )

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingUser(null)
  }, [])

  // Refresh operation
  const refreshOperation = useDelayedOperation<void>(delay)

  const handleRefresh = useCallback(async () => {
    setIsTableLoading(true)
    setIsLoading(true)
    await refreshOperation.execute(() => {
      setSearchQuery("")
      setAppliedSearchQuery("")
      pagination.setPage(1)
    })
    setIsTableLoading(false)
    setIsLoading(false)
  }, [refreshOperation, setIsLoading, pagination])

  // View detail
  const handleViewDetail = useCallback(
    (userId: number) => {
      delayedNavigate(`/${lang}/admin/user/${userId}${location.search}`)
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
        placeholder={t("admin.searchPlaceholder")}
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        isLoading={searchOperation.isLoading}
        onRefresh={handleRefresh}
        isRefreshing={refreshOperation.isLoading}
      />

      <UserTable
        users={pagination.paginatedItems}
        isLoading={isTableLoading}
        onEdit={handleEditClick}
        onViewDetail={handleViewDetail}
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t("admin.showing", {
            start: pagination.startIndex,
            end: pagination.endIndex,
            total: pagination.totalItems,
          })}
        </span>

        {pagination.totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    !pagination.isFirstPage &&
                    handlePageChange(pagination.currentPage - 1)
                  }
                  className={
                    pagination.isFirstPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
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
                  onClick={() =>
                    !pagination.isLastPage &&
                    handlePageChange(pagination.currentPage + 1)
                  }
                  className={
                    pagination.isLastPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <EditUserModal
        user={editingUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        isSaving={isSaving}
      />
    </div>
  )
}

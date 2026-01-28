import { useState, useCallback, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { ArrowLeft, Mail, Shield, Activity } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserDetailSkeleton } from "@/components/admin/UserDetailSkeleton"
import { EditUserModal } from "@/components/admin/EditUserModal"
import { useLanguage } from "@/contexts/LanguageContext"
import { useDelay } from "@/contexts/DelayContext"
import { useDelayedOperation } from "@/hooks/useDelayedOperation"
import { useDelayedNavigation } from "@/hooks/useDelayedNavigation"
import { USERS } from "@/data/users"
import type { User } from "@/types"

interface UserDetailPageProps {
  id: string
}

export function UserDetailPage({ id }: UserDetailPageProps) {
  const { lang, t } = useLanguage()
  const { delay, setIsLoading } = useDelay()
  const location = useLocation()
  const { navigate, isNavigating } = useDelayedNavigation()

  const [isPageLoading, setIsPageLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Initial load
  const initialLoadOperation = useDelayedOperation<void>(delay)

  useEffect(() => {
    const performInitialLoad = async () => {
      setIsLoading(true)
      await initialLoadOperation.execute(() => {
        const foundUser = USERS.find((u) => u.id === parseInt(id, 10))
        setUser(foundUser || null)
      })
      setIsPageLoading(false)
      setIsLoading(false)
    }
    performInitialLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save user
  const saveOperation = useDelayedOperation<void>(delay)

  const handleSaveUser = useCallback(
    async (updatedUser: User) => {
      setIsSaving(true)
      setIsLoading(true)
      await saveOperation.execute(() => {
        setUser(updatedUser)
        setIsModalOpen(false)
        setEditingUser(null)
      })
      setIsSaving(false)
      setIsLoading(false)
      toast.success(t("admin.savedMessage"))
    },
    [saveOperation, setIsLoading, t]
  )

  const handleEditClick = useCallback(() => {
    if (user) {
      setEditingUser({ ...user })
      setIsModalOpen(true)
    }
  }, [user])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingUser(null)
  }, [])

  // Back navigation
  const handleBack = useCallback(() => {
    navigate(`/${lang}/admin${location.search}`)
  }, [navigate, lang, location.search])

  if (isPageLoading || isNavigating) {
    return <UserDetailSkeleton />
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>
        <div className="py-8 text-center text-muted-foreground">
          {t("common.notFound")}
        </div>
      </div>
    )
  }

  const name = lang === "jp" ? user.name.ja : user.name.en
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common.back")}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{name}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("admin.columns.id")}</p>
              <p className="font-medium">#{user.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("admin.columns.email")}</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("admin.columns.role")}</p>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {t(`admin.roles.${user.role}`)}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("admin.columns.status")}</p>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <Badge variant={user.status === "active" ? "default" : "outline"}>
                  {t(`admin.statuses.${user.status}`)}
                </Badge>
              </div>
            </div>
          </div>

          <Button onClick={handleEditClick}>{t("common.edit")}</Button>
        </CardContent>
      </Card>

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

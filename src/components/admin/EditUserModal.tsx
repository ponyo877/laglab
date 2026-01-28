import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/contexts/LanguageContext"
import type { User } from "@/types"

interface EditUserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (user: User) => Promise<void>
  isSaving: boolean
}

export function EditUserModal({
  user,
  isOpen,
  onClose,
  onSave,
  isSaving,
}: EditUserModalProps) {
  const { lang, t } = useLanguage()

  const [editedUser, setEditedUser] = useState<User | null>(null)

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user })
    }
  }, [user])

  if (!editedUser) return null

  const handleSave = async () => {
    if (editedUser) {
      await onSave(editedUser)
    }
  }

  const name = lang === "jp" ? editedUser.name.ja : editedUser.name.en

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("admin.editUser")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("admin.columns.name")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) =>
                setEditedUser({
                  ...editedUser,
                  name: {
                    ...editedUser.name,
                    [lang === "jp" ? "ja" : "en"]: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">{t("admin.columns.email")}</Label>
            <Input
              id="email"
              type="email"
              value={editedUser.email}
              onChange={(e) =>
                setEditedUser({ ...editedUser, email: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">{t("admin.columns.role")}</Label>
            <Select
              value={editedUser.role}
              onValueChange={(value: "admin" | "user") =>
                setEditedUser({ ...editedUser, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{t("admin.roles.admin")}</SelectItem>
                <SelectItem value="user">{t("admin.roles.user")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">{t("admin.columns.status")}</Label>
            <Select
              value={editedUser.status}
              onValueChange={(value: "active" | "inactive") =>
                setEditedUser({ ...editedUser, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  {t("admin.statuses.active")}
                </SelectItem>
                <SelectItem value="inactive">
                  {t("admin.statuses.inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("common.save")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

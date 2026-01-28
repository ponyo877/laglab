import { Edit } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserTableSkeleton } from "./UserTableSkeleton"
import { useLanguage } from "@/contexts/LanguageContext"
import type { User } from "@/types"

interface UserTableProps {
  users: User[]
  isLoading: boolean
  onEdit: (user: User) => void
  onViewDetail?: (userId: number) => void
}

export function UserTable({ users, isLoading, onEdit, onViewDetail }: UserTableProps) {
  const { lang, t } = useLanguage()

  if (isLoading) {
    return <UserTableSkeleton />
  }

  const handleRowClick = (user: User) => {
    if (onViewDetail) {
      onViewDetail(user.id)
    }
  }

  const handleEditClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation()
    onEdit(user)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">{t("admin.columns.id")}</TableHead>
            <TableHead>{t("admin.columns.name")}</TableHead>
            <TableHead className="w-48">{t("admin.columns.email")}</TableHead>
            <TableHead className="w-24">{t("admin.columns.role")}</TableHead>
            <TableHead className="w-24">{t("admin.columns.status")}</TableHead>
            <TableHead className="w-20">{t("admin.columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className={onViewDetail ? "cursor-pointer hover:bg-muted/50" : ""}
              onClick={() => handleRowClick(user)}
            >
              <TableCell className="font-mono">{user.id}</TableCell>
              <TableCell>
                {lang === "jp" ? user.name.ja : user.name.en}
              </TableCell>
              <TableCell className="font-mono text-sm">{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {t(`admin.roles.${user.role}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "active" ? "default" : "outline"}
                  className={
                    user.status === "active"
                      ? "bg-green-500 hover:bg-green-600"
                      : ""
                  }
                >
                  {t(`admin.statuses.${user.status}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleEditClick(e, user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

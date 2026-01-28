import { Heart, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Comment } from "@/types"

interface CommentCardProps {
  comment: Comment
  onLike: (commentId: number) => void
  isLiking: boolean
}

function formatRelativeTime(date: Date, lang: "jp" | "en"): string {
  const now = Date.now()
  const diff = now - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) {
    return lang === "jp" ? "たった今" : "just now"
  }
  if (minutes < 60) {
    return lang === "jp" ? `${minutes}分前` : `${minutes}m ago`
  }
  if (hours < 24) {
    return lang === "jp" ? `${hours}時間前` : `${hours}h ago`
  }
  return lang === "jp" ? `${days}日前` : `${days}d ago`
}

export function CommentCard({ comment, onLike, isLiking }: CommentCardProps) {
  const { lang } = useLanguage()

  const userName = lang === "jp" ? comment.user.name.ja : comment.user.name.en
  const content = lang === "jp" ? comment.content.ja : comment.content.en
  const relativeTime = formatRelativeTime(comment.createdAt, lang)

  return (
    <div className="flex gap-3 py-3 border-b last:border-b-0">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.user.avatar} alt={userName} />
        <AvatarFallback>{userName[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{userName}</span>
          <span className="text-muted-foreground">{comment.user.handle}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{relativeTime}</span>
        </div>
        <p className="mt-1 text-sm">{content}</p>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 mt-1 -ml-2 h-7"
          onClick={() => onLike(comment.id)}
          disabled={isLiking}
        >
          {isLiking ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Heart
              className={`h-3 w-3 ${
                comment.isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
          )}
          <span className="text-xs">{comment.likes}</span>
        </Button>
      </div>
    </div>
  )
}
